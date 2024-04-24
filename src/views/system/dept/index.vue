<template>
	<div class="system-dept-container layout-padding">
		<el-row :gutter="20" style="height: 100%; min-width: 1305px">
			<el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" class="pb30">
				<el-card shadow="hover" style="height: 100%; min-width: 310px">
					<div class="title">
						<div class="ml10">组织架构</div>
						<el-button size="large" type="primary" @click="onOpenAddDept('add')" v-auth="'api:org:add'">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增组织
						</el-button>
					</div>
					<div class="system-dept-left">
						<el-table
							:data="state.tableOrgData"
							v-loading="state.orgLoading"
							style="width: 100%"
							row-key="id"
							default-expand-all
							highlight-current-row
							@current-change="handleCurrentChange"
						>
							<el-table-column prop="name" label="部门名称" show-overflow-tooltip> </el-table-column>
							<el-table-column label="操作" show-overflow-tooltip width="120">
								<template #default="scope">
									<el-button
										size="small"
										v-if="scope.row.parentId !== '0'"
										text
										type="primary"
										@click.native="onOpenEditDept('edit', scope.row)"
										v-auth="'api:org:edit'"
										>修改</el-button
									>
									<el-button
										size="small"
										v-if="scope.row.parentId !== '0'"
										text
										type="primary"
										@click.native="onTabelRowDelOrg(scope.row.id)"
										v-auth="'api:org:del'"
										>删除</el-button
									>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18" class="pb30 flex" style="display: flex; flex-direction: column">
				<el-card shadow="never" class="search-box">
					<div class="content">
						<div class="search-box clearfix">
							<div class="fl mb30">
								<div class="search-name">岗位名称</div>
								<el-input v-model="state.name" placeholder="请输入岗位名称" size="large"></el-input>
							</div>
							<div class="fl mb30">
								<div class="search-name">状态</div>
								<el-select v-model="state.status" placeholder="请选择状态" size="large" clearable>
									<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</div>
							<div class="fr mb30">
								<el-button type="primary" size="large" @click="searchList" v-auth="'api:position:list'">
									<el-icon>
										<ele-Search />
									</el-icon>
									<span>查询</span>
								</el-button>
								<el-button type="info" size="large" @click="clearForm" v-auth="'api:position:list'">
									<el-icon>
										<ele-RefreshLeft />
									</el-icon>
									<span>重置</span>
								</el-button>
							</div>
						</div>
					</div>
				</el-card>

				<el-card shadow="never" class="mt20 layout-padding-auto">
					<div class="title">
						<div class="ml10">岗位列表</div>
						<el-button size="large" type="primary" @click="onOpenAddPost('add', state.orgId)" v-auth="'api:position:add'">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增岗位
						</el-button>
					</div>
					<el-table
						:data="state.tableData"
						v-loading="state.loading"
						style="width: 100%"
						row-key="id"
						default-expand-all
						:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
					>
						<el-table-column prop="name" label="岗位名称" show-overflow-tooltip> </el-table-column>
						<el-table-column prop="code" label="岗位编码" show-overflow-tooltip> </el-table-column>
						<el-table-column prop="ancestorsName" label="隶属部门" show-overflow-tooltip> </el-table-column>
						<el-table-column prop="status" label="状态" show-overflow-tooltip>
							<template #default="scope">
								<el-switch
									size="default"
									active-value="0"
									inactive-value="1"
									v-model="scope.row.status"
									:before-change="() => changeStatus(scope.row.id, scope.row.status)"
								/>
							</template>
						</el-table-column>
						<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
						<el-table-column label="操作" show-overflow-tooltip width="140">
							<template #default="scope">
								<el-button size="small" text type="primary" @click="onOpenEditPost('edit', '', scope.row)" v-auth="'api:position:edit'"
									>修改</el-button
								>
								<el-button size="small" text type="primary" @click="onPostTabelRowDel(scope.row.id)" v-auth="'api:position:del'">删除</el-button>
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
			</el-col>
		</el-row>
		<DeptDialog ref="deptDialogRef" @refreshOrg="getAllData" />
		<PostDialog ref="postDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemDept">
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getPositionList, changePositionStatus, getOrgTreeList, deleteOrg, deletePosition } from '@/api/system/dept';

// 引入组件
const DeptDialog = defineAsyncComponent(() => import('@/views/system/dept/deptDialog.vue'));
const PostDialog = defineAsyncComponent(() => import('@/views/system/dept/postDialog.vue'));

// 定义变量内容
const deptDialogRef = ref();
const postDialogRef = ref();
const state = reactive<SysDeptState>({
	loading: false,
	orgLoading: false,
	name: '',
	status: '',
	orgId: '',
	pageSize: 5,
	pageNum: 1,
	total: 0,
	tableData: [],
	tableOrgData: [],
});
const statusList = [
	{
		value: '0',
		label: '启用',
	},
	{
		value: '1',
		label: '停用',
	},
];
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	state.tableData = [];
	getPositionList({
		name: state.name,
		status: state.status,
		orgId: state.orgId,
		pageSize: state.pageSize,
		pageNum: state.pageNum,
	})
		.then((res) => {
			state.loading = false;
			state.tableData = res.data.list;
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

const clearForm = () => {
	state.name = '';
	state.status = '';
	state.pageSize = 5;
	state.pageNum = 1;
	getTableData();
};
const changeStatus = (id: string, status: string) => {
	state.loading = true;
	return new Promise((resolve, reject) => {
		changePositionStatus({
			id,
			status: status === '1' ? '0' : '1',
		})
			.then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('操作成功');
					getTableData();
				} else {
					ElMessage.success(res.resultDesc);
					state.loading = false;
				}
			})
			.catch((err) => {
				state.loading = false;
				console.log(err);
			});
	});
};
const getOrgTableData = () => {
	state.orgLoading = true;
	state.tableOrgData = [];
	getOrgTreeList()
		.then((res) => {
			state.orgLoading = false;
			state.tableOrgData = res.data;
		})
		.catch((err) => {
			state.orgLoading = false;
			console.log(err);
		});
};
const handleCurrentChange = (val: RowPostType) => {
	state.orgId = val?.id;
	getTableData();
};

// 打开新增菜单弹窗
const onOpenAddDept = (type: string) => {
	deptDialogRef.value.openDialog(type);
};
// 打开编辑菜单弹窗
const onOpenEditDept = (type: string, row: OrgTreeType) => {
	deptDialogRef.value.openDialog(type, row);
};
// 打开新增岗位菜单
const onOpenAddPost = (type: string, orgId: string) => {
	postDialogRef.value.openDialog(type);
};
const onOpenEditPost = (type: string, orgId: string, row: object) => {
	postDialogRef.value.openDialog(type, orgId, row);
};
const onPostTabelRowDel = (id: string) => {
	ElMessageBox.confirm('删除后将无法恢复，是否确认删除？', '确定要删除这个岗位吗？', {
		confirmButtonText: '确定',
		cancelButtonText: '返回',
		type: 'warning',
	})
		.then(() => {
			deletePosition({ id })
				.then((res) => {
					if (res.resultCode === 0) {
						getTableData();
						ElMessage.success('删除成功');
					} else {
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => console.log(err));
		})
		.catch(() => {});
};
// 删除当前行
const onTabelRowDelOrg = (id: string) => {
	ElMessageBox.confirm('删除后该组织的下属组织也将删除，以及组织下的岗位也将删除，且无法恢复，确认删除？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '返回',
		type: 'warning',
	})
		.then(() => {
			deleteOrg({ id })
				.then((res) => {
					if (res.resultCode === 0) {
						getOrgTableData();
						ElMessage.success('删除成功');
					} else {
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => console.log(err));
		})
		.catch(() => {});
};
const getAllData = () => {
	getTableData();
	getOrgTableData();
};
// 页面加载时
onMounted(() => {
	getAllData();
});
</script>
<style scoped lang="scss">
:deep(.search-box .el-card__body) {
	padding: 30px 30px 0px 30px;
}
.system-dept-left {
	& :deep(.el-table thead) {
		display: none;
	}
}
.title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 18px;
	margin-bottom: 20px;
}
</style>
