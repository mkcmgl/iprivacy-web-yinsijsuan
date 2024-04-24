<template>
	<div class="system-role-container layout-padding">
		<el-card shadow="never" class="search-box">
			<div class="content">
				<div class="search-box clearfix flex flex-1">
					<div class="search-flex flex-1">
						<div class="align-center">
							<div class="search-name-w70">节点名称</div>
							<el-input placeholder="请输入节点名称" v-model="state.nodeName" size="large"></el-input>
						</div>
						<div class="align-center mg-l-20">
							<div class="search-name-w70">在线状态</div>
							<el-select v-model="state.onlineStatus" placeholder="请选择状态" size="large" clearable>
								<el-option v-for="item in nodeModel" :key="item.id" :label="item.dictValue" :value="item.state"></el-option>
							</el-select>
						</div>
					</div>

					<div class="search-button">
						<el-button type="primary" size="large" @click="searchList" v-auth="'api:role:list'">
							<el-icon>
								<ele-Search />
							</el-icon>
							<span>查询</span>
						</el-button>
						<el-button type="info" size="large" @click="clearForm" v-auth="'api:role:list'">
							<el-icon>
								<ele-RefreshLeft />
							</el-icon>
							<span>重置</span>
						</el-button>
					</div>
				</div>
			</div>
		</el-card>

		<el-card shadow="never" class="mt20 mb20">
			<div class="mb30" v-auth="'api:role:save'">
				<el-button size="large" type="primary" @click="onOpenAddNode('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增节点
				</el-button>
				<el-button size="large" @click="onOpenDelete()">
					<el-icon>
						<ele-Delete />
					</el-icon>
					批量删除
				</el-button>
			</div>

			<el-table :data="state.tableData" v-loading="state.loading" @selection-change="handleSelectionChange" style="width: 100%">
				<el-table-column type="selection" width="55" />
				<el-table-column label="节点ID" prop="nodeId" show-overflow-tooltip>
					<template #default="scope">
						<el-button size="small" text type="primary" @click="toDetail(scope.row.nodeId)" v-auth="'api:role:update'">{{
							scope.row.nodeId
						}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="nodeName" label="节点名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nodeIp" label="节点IP/域名" show-overflow-tooltip>
					<!-- <template #default="scope">
						<span>{{ scope.row.nodeIp ? scope.row.nodeIp : scope.row.nodePort }}</span>
					</template> -->
				</el-table-column>
				<el-table-column label="端口" prop="nodePort" show-overflow-tooltip />

				<el-table-column label="激活状态" show-overflow-tooltip>
					<template #default="scope">
						<el-switch
							size="default"
							active-value="1"
							inactive-value="0"
							:disabled="scope.row.onlineStatus == 0"
							v-model="scope.row.activationStatus"
							:before-change="() => changeStatus(scope.row)"
						/>
						<!-- {{scope.row.activationStatus}} -->
					</template>
				</el-table-column>

				<el-table-column prop="onlineStatus" label="状态" show-overflow-tooltip>
					<template #default="scope">
						<div class="align-center">
							<div
								class="mg-r-2"
								:class="{
									'round-green': scope.row.onlineStatus == 1,
									'round-red': scope.row.onlineStatus == 0,
								}"
							/>
							<div>{{ scope.row.onlineStatus == 0 ? '离线' : '在线' }}</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenEditNode('edit', scope.row)" v-auth="'api:role:update'"
							>编辑</el-button
						>
						<el-button size="small" text type="primary" @click="onNodeDel(scope.row.nodeId)" v-auth="'api:role:delete'">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination
				:total="state.total"
				v-model:page="state.pageNum"
				v-model:limit="state.pageSize"
				:background="false"
				@pagination="getTableData"
			/>
		</el-card>

		<add-node-dialog ref="roleDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="nodeManage">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getNodeList, deleteNode, deleteBatch, updateActivation,nodeOnlineState } from '@/api/nodeManage';
import { useRouter } from 'vue-router';
import { NodeModelList, NodeState, SysNodeState } from '@/types/views';

// 引入组件
const AddNodeDialog = defineAsyncComponent(() => import('@/views/nodeManage/addNode.vue'));
// 定义变量内容
const roleDialogRef = ref();
const router = useRouter();
const state = reactive<SysNodeState>({
	nodeName: '',
	onlineStatus: '',
	pageSize: 10,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
});
const statusList = [
	{
		value: '0',
		label: '正常',
	},
	{
		value: '1',
		label: '停用',
	},
];

onMounted(() => {
	getTableData();
	getNodeOnlineState()
});
const nodeModel = ref(<NodeModelList>[]);
const getNodeOnlineState = () => { 
	nodeOnlineState({ code: "onlineStatus" }).then((res) => { 
		
		nodeModel.value = res.data;
	})
};
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getNodeList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		nodeName: state.nodeName,
		onlineStatus: state.onlineStatus,
	})
		.then((res: any) => {
			console.log(`output->`, res);
			state.tableData = [];
			state.loading = false;
			state.tableData = res.data.list;
			state.total = res.data.total;
		})
		.catch((err: any) => {
			state.loading = false;
			console.log(err);
		});
};

const searchList = () => {
	state.pageNum = 1;
	getTableData();
};

// 重置
const clearForm = () => {
	state.nodeName = '';
	state.onlineStatus = '';
	state.pageSize = 10;
	state.pageNum = 1;
	getTableData();
};

// 切换用户状态
const changeStatus = (row: NodeState) => {
	state.loading = true;
	console.log(`output->`, row);
	return new Promise((resolve, reject) => {
		updateActivation({ nodeId: row.nodeId, activationStatus: row.activationStatus == '0' ? '1' : '0' })
			.then((res) => {
				console.log(`output->res`, res);
				if (res.resultCode === 0) {
					ElMessage.success('操作成功');
					getTableData();
				} else {
					state.loading = false;
					ElMessage.warning(res.resultDesc);
				}
			})
			.catch((err) => {
				state.loading = false;
				console.log(err);
			});
	});
};
// 打开新增节点弹窗
const onOpenAddNode = (type: string) => {
	roleDialogRef.value.openDialog(type);
};
// 打开修改节点弹窗
const onOpenEditNode = (type: string, row: Object) => {
	roleDialogRef.value.openDialog(type, row);
};

// 删除节点
const onNodeDel = (nodeId: string) => {
	console.log(`output->id`, nodeId);
	ElMessageBox.confirm('删除后将无法恢复，请谨慎操作？', '确定要删除选中的节点数据集吗？', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
		buttonSize: 'default',
	}).then(() => {
		deleteNode({ nodeId }).then((res) => {
			if (res.resultCode === 0) {
				ElMessage.success('删除成功');
				getTableData();
			} else {
				ElMessage.warning(res.resultDesc);
			}
		});
	});
};
const selectData = ref(<any>[]);
const handleSelectionChange = (val: Array<any>) => {
	selectData.value = val;
	console.log(`output->selectData.value`, selectData.value);
};
const nodeInfoList = ref<NodeIdObject[]>([]);

type NodeIdObject = { nodeId: string }; 
const onOpenDelete = () => {
	nodeInfoList.value = [];
	if (selectData.value.length > 0) {
		ElMessageBox.confirm('删除后将无法恢复，请谨慎操作？', '确定要删除选中的节点数据集吗？', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
			buttonSize: 'default',
		}).then(() => {
			selectData.value.forEach((item: NodeState) => {
				nodeInfoList.value.push({ nodeId: item.nodeId });
			});
			deleteBatch({ nodeInfoList: nodeInfoList.value }).then((res) => {
				console.log(`output->res`, res);
				if (res.resultCode === 0) {
					ElMessage.success('删除成功');
					getTableData();
				} else {
					ElMessage.warning(res.resultDesc);
				}
			});
		});
	}
};
const toDetail = (nodeId: string) => {
	router.push({ path: '/nodeManage/detail', query: { nodeId } });
};
</script>

<style scoped lang="scss">
.system-role-container {
	.system-role-padding {
		padding: 15px;
	}
}
</style>
