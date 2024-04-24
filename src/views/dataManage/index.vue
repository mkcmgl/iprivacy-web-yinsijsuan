<template>
	<div class="system-role-container layout-padding">
		<el-card shadow="never" class="search-box">
			<div class="content">
				<div class="search-box clearfix flex flex-1">
					<div class="search-flex flex-1">
						<div class="align-center">
							<div class="search-name-w70">数据名称:</div>
							<el-input placeholder="请输入数据名称" v-model="state.roleName" size="large"></el-input>
						</div>
						<div class="align-center mg-l-20">
							<div class="search-name-w70">状态:</div>
							<el-select v-model="state.status" placeholder="请选择状态" size="large" clearable>
								<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</div>
						<div class="align-center mg-l-20">
							<div class="search-name-w70">节点名称:</div>
							<el-input placeholder="请输入节点名称" v-model="state.roleKey" size="large"></el-input>
						</div>
					</div>

					<div class="search-button">
						<el-button type="primary" size="large" @click="searchList" v-auth="'api:dataManage:list'">
							<el-icon>
								<ele-Search />
							</el-icon>
							<span>查询</span>
						</el-button>
						<el-button type="info" size="large" @click="clearForm" v-auth="'api:dataManage:list'">
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
			<div class="mb30">
				<el-button  v-auth="'api:dataManage:add'" size="large" type="primary" @click="onOpenAddData('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					添加数据
				</el-button>
				<el-button  v-auth="'api:dataManage:delete'" size="large" @click="onOpenDelete()">
					<el-icon>
						<ele-Delete />
					</el-icon>
					批量删除
				</el-button>
			</div>

			<el-table :data="state.tableData" v-loading="state.loading" @selection-change="handleSelectionChange" style="width: 100%">
				<el-table-column type="selection" width="55" />
				<el-table-column label="数据名称" show-overflow-tooltip>
					<template #default="scope">
						<el-button size="small" text type="primary" @click="toDetail(scope.row.id)" >{{
							scope.row.name
						}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="nodeName" v-if="isSystemAdmin" label="节点名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="使用详情" show-overflow-tooltip>
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenAuthorizationDetail('use', scope.row)" >{{
							scope.row.roleKey
						}}</el-button>
					</template>
				</el-table-column>
				<el-table-column label="授权详情" show-overflow-tooltip>
					<template #default="scope">
						<el-button
							size="small"
							text
							type="primary"
							@click="onOpenAuthorizationDetail('auth', scope.row)"
							>{{ scope.row.remark }}</el-button
						>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="status" label="状态" show-overflow-tooltip>
					<template #default="scope">
						<div class="align-center">
							<div class="round-green mg-r-2" />
							<div>{{ scope.row.status==0?"成功":"失败" }}</div>
						</div>
					</template>
				</el-table-column> -->

				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenEditData('edit', scope.row)" v-auth="'api:dataManage:edit'"
							>编辑</el-button
						>
						<el-button size="small" text type="primary" @click="onDataDel(scope.row.id)" v-auth="'api:dataManage:delete'">删除</el-button>
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

		<RoleDialog ref="roleDialogRef" @refresh="getTableData()" />
		<AuthorizationDetail ref="AuthorizationDetailRef" />
	</div>
</template>

<script setup lang="ts" name="dataManage">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs,computed } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getRoleList, changeRoleStatus, deleteRole } from '@/api/system/role';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';
import { getDataList,deleteData,deleteBatch} from '@/api/dataManage'
import { DataListObjectType, SysRoleState } from '@/types/views';
// 引入组件
const RoleDialog = defineAsyncComponent(() => import('@/views/dataManage/dialog.vue'));
const AuthorizationDetail = defineAsyncComponent(() => import('@/views/dataManage/AuthorizationDetail-dialog.vue'));
// 定义变量内容
const roleDialogRef = ref();
const AuthorizationDetailRef = ref();
const router = useRouter();
const userInfos=useUserInfo();
// const { userInfos } = storeToRefs(stores);
const state = reactive<SysRoleState>({
	roleName: '',
	roleKey: '',
	status: '',
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
});
const isSystemAdmin = computed(() => {
    return userInfos.userInfos.roles.includes("systemAdmin")
});

// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getDataList({

		pageSize: state.pageSize,
		pageNum: state.pageNum,
	})
		.then((res) => {
			console.log(`output->res`, res);
			state.tableData = [];
			state.loading = false;
			state.tableData = res.data.data;
			state.total = res.data.total;
		})
		.catch((err) => {
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
	state.roleName = '';
	state.roleKey = '';
	state.status = '';
	state.pageSize = 10;
	state.pageNum = 1;
	getTableData();
};

// 切换用户状态
// const changeStatus = (id: string) => {
//     state.loading = true;
//     return new Promise((resolve, reject) => {
//         changeRoleStatus({ id })
//             .then((res) => {
//                 if (res.resultCode === 0) {
//                     ElMessage.success('操作成功');
//                     getTableData();
//                 } else {
//                     state.loading = false;
//                     ElMessage.warning(res.resultDesc);
//                 }
//             })
//             .catch((err) => {
//                 state.loading = false;
//                 console.log(err);
//             });
//     });
// };
// 打开新增角色弹窗
const onOpenAddData = (type: string) => {
	roleDialogRef.value.openDialog(type);
};
// 打开修改数据弹窗
const onOpenEditData = (type: string, row: Object) => {
	roleDialogRef.value.openDialog(type, row);
};
const onOpenAuthorizationDetail = (type: string, row: Object) => {
	AuthorizationDetailRef.value.openDialog(type, row);
};
// 删除数据
const onDataDel = (id: string) => {
	console.log(`output->id`, id);
	ElMessageBox.confirm('删除后将无法恢复，请谨慎操作？', '确定要删除节点的数据集吗？', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
		buttonSize: 'default',
	}).then(() => {
		deleteData({ dataId:id }).then((res) => {
			console.log(`output->res`, res);
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
const dataIdList = ref<DataIdObject[]>([]);
type DataIdObject = { dataId: string }; 
const onOpenDelete = () => {
	dataIdList.value = [];
	if (selectData.value.length > 0) {
		ElMessageBox.confirm('删除后将无法恢复，请谨慎操作？', '确定要删除选中的节点数据集吗？', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
			buttonSize: 'default',
		}).then(() => {
			selectData.value.forEach((item: DataListObjectType) => {
				dataIdList.value.push({ dataId : item.id } as DataIdObject);
			});
			deleteBatch({ dataIdList: dataIdList.value }).then((res) => {
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


const toDetail = (id: string) => {
	console.log(`output->row`, id);
	router.push({ path: '/dataManage/detail',query: {
			id: id,
		},});
};
</script>

<style scoped lang="scss">
.system-role-container {
	.system-role-padding {
		padding: 15px;
	}
}
</style>
