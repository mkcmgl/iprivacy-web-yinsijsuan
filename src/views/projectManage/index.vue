<template>
	<div class="system-role-container layout-padding">
		<el-card shadow="never" class="search-box">
			<div class="content">
				<div class="search-box clearfix flex flex-1">
					<div class="search-flex flex-1">
						<div class="align-center">
							<div class="search-name-w70">项目名称</div>
							<el-input placeholder="请输入节点名称" v-model="state.name" size="large"></el-input>
						</div>
						<div class="align-center mg-l-20">
							<div class="search-name-w70">发起机构</div>
							<el-select v-model="state.enterpriseId" placeholder="请选择状态" size="large" clearable>
								<el-option
									v-for="item in projectModel"
									:key="item.organizeId"
									:label="item.organizeName"
									:value="item.organizeId"
								></el-option>
							</el-select>
						</div>
						<div class="align-center mg-l-20">
							<div class="search-name-w70">创建时间</div>
							<el-date-picker v-model="state.createTime" type="date" placeholder="请选择创建时间" />
							<!-- <el-date-picker
									v-model="value1"
									type="daterange"
									range-separator="到"
									start-placeholder="Start date"
									end-placeholder="End date"
									
								/> -->
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
				<el-button size="large" type="primary" @click="onOpenAddRole('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					创建项目
				</el-button>
				<!-- <el-button size="large" @click="onOpenDelete()">
					<el-icon>
						<ele-Delete />
					</el-icon>
					批量删除
				</el-button> -->
			</div>
			<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" @tab-change="handleChange">
				<el-tab-pane label="全部项目" name="first">
					<div>
						<el-table :data="state.tableData" v-loading="state.loading" @selection-change="handleSelectionChange" style="width: 100%">
							<!-- <el-table-column type="selection" width="55" /> -->
							<el-table-column label="项目名称" show-overflow-tooltip>
								<template #default="scope">
									<el-button size="small" text type="primary" @click="toDetail(scope.row)" v-auth="'api:role:update'">{{
										scope.row.name
									}}</el-button>
								</template>
							</el-table-column>
							<el-table-column prop="enterpriseName" label="发起机构" show-overflow-tooltip></el-table-column>
							<el-table-column label="协作机构数" show-overflow-tooltip>
								<template #default="scope">
									<el-button
										size="small"
										text
										type="primary"
										@click="onOpenAuthorizationDetail('use', scope.row)"
										v-auth="'api:role:update'"
										>{{ scope.row.partnerNum }}</el-button
									>
								</template>
							</el-table-column>
							<el-table-column label="任务数" show-overflow-tooltip>
								<template #default="scope">
									<el-button
										size="small"
										text
										type="primary"
										@click="onOpenAuthorizationDetail('auth', scope.row)"
										v-auth="'api:role:update'"
										>{{ scope.row.remark }}</el-button
									>
								</template>
							</el-table-column>
							<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />

							<el-table-column label="操作" width="100">
								<template #default="scope">
									<el-button size="small" text type="primary" @click="onOpenEditRole('edit', scope.row)" v-auth="'api:role:update'"
										>编辑</el-button
									>
									<el-button size="small" text type="primary" @click="onProjectDelete(scope.row)" v-auth="'api:role:delete'"
										>删除</el-button
									>
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
					</div>
				</el-tab-pane>
				<el-tab-pane label="我发起的" name="second">
					<div>
						<el-table :data="state.tableData" v-loading="state.loading" @selection-change="handleSelectionChange" style="width: 100%">
							<el-table-column type="selection" width="55" />
							<el-table-column label="序号" show-overflow-tooltip>
								<template #default="scope">
									<el-button size="small" text type="primary" @click="toDetail(scope.row)" v-auth="'api:role:update'">{{
										scope.row.name
									}}</el-button>
								</template>
							</el-table-column>
							<el-table-column prop="sort" label="项目名称" show-overflow-tooltip></el-table-column>
							<el-table-column prop="createTime" label="发起机构" show-overflow-tooltip></el-table-column>
							<el-table-column label="协作机构数" show-overflow-tooltip>
								<template #default="scope">
									<el-button
										size="small"
										text
										type="primary"
										@click="onOpenAuthorizationDetail('use', scope.row)"
										v-auth="'api:role:update'"
										>{{ scope.row.roleKey }}</el-button
									>
								</template>
							</el-table-column>
							<el-table-column label="任务数" show-overflow-tooltip>
								<template #default="scope">
									<el-button
										size="small"
										text
										type="primary"
										@click="onOpenAuthorizationDetail('auth', scope.row)"
										v-auth="'api:role:update'"
										>{{ scope.row.remark }}</el-button
									>
								</template>
							</el-table-column>
							<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />

							<el-table-column label="操作" width="100">
								<template #default="scope">
									<el-button size="small" text type="primary" @click="onOpenEditRole('edit', scope.row)" v-auth="'api:role:update'"
										>编辑</el-button
									>
									<el-button size="small" text type="primary" @click="onProjectDelete(scope.row)" v-auth="'api:role:delete'"
										>删除</el-button
									>
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
					</div>
				</el-tab-pane>
				<el-tab-pane label="我协作的" name="third">
					<div>
						<el-table :data="state.tableData" v-loading="state.loading" @selection-change="handleSelectionChange" style="width: 100%">
							<el-table-column type="selection" width="55" />
							<el-table-column label="序号" show-overflow-tooltip>
								<template #default="scope">
									<el-button size="small" text type="primary" @click="toDetail(scope.row)" v-auth="'api:role:update'">{{
										scope.row.name
									}}</el-button>
								</template>
							</el-table-column>
							<el-table-column prop="sort" label="项目名称" show-overflow-tooltip></el-table-column>
							<el-table-column prop="createTime" label="发起机构" show-overflow-tooltip></el-table-column>
							<el-table-column label="协作机构数" show-overflow-tooltip>
								<template #default="scope">
									<el-button
										size="small"
										text
										type="primary"
										@click="onOpenAuthorizationDetail('use', scope.row)"
										v-auth="'api:role:update'"
										>{{ scope.row.roleKey }}</el-button
									>
								</template>
							</el-table-column>
							<el-table-column label="任务数" show-overflow-tooltip>
								<template #default="scope">
									<el-button
										size="small"
										text
										type="primary"
										@click="onOpenAuthorizationDetail('auth', scope.row)"
										v-auth="'api:role:update'"
										>{{ scope.row.remark }}</el-button
									>
								</template>
							</el-table-column>
							<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />

							<el-table-column label="操作" width="100">
								<template #default="scope">
									<el-button size="small" text type="primary" @click="onOpenEditRole('edit', scope.row)" v-auth="'api:role:update'"
										>编辑</el-button
									>
									<el-button size="small" text type="primary" @click="onProjectDelete(scope.row)" v-auth="'api:role:delete'"
										>删除</el-button
									>
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
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-card>

		<add-project-dialog ref="roleDialogRef" @refresh="getTableData()" />
		<AuthorizationDetail ref="AuthorizationDetailRef" />
	</div>
</template>

<script setup lang="ts" name="projectManage">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getRoleList, changeRoleStatus, deleteRole } from '@/api/system/role';
import { useRouter } from 'vue-router';
import { NodeModelList, ProjectModel, ProjectModelList, ProjectState, ProjectStateType } from '@/types/views';
import type { TabsPaneContext, TabPaneName } from 'element-plus';
import { getProjectList, projectAuditList,projectDelete } from '@/api/projectManage';
// 引入组件
const AddProjectDialog = defineAsyncComponent(() => import('@/views/projectManage/addDialog.vue'));
const AuthorizationDetail = defineAsyncComponent(() => import('@/views/dataManage/AuthorizationDetail-dialog.vue'));
// 定义变量内容
const roleDialogRef = ref();
const AuthorizationDetailRef = ref();
const router = useRouter();
const value1 = ref('');
const state = reactive<ProjectState>({
	name: '',
	type: '',
	pageSize: 10,
	pageNum: 1,
	total: 0,
	createTime: '',
	enterpriseId: '',
	loading: false,
	tableData: [],
	createStartTime: '',
	description: '',
	partnerIds: [],
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
	getProjectAuditList();
});
const projectModel = ref<ProjectModelList>([]);
const getProjectAuditList = () => {
	projectAuditList().then((res: any) => {
		projectModel.value = res.data;
	});
};
const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
};

const handleChange = (name: TabPaneName) => {
	if (name == 'second') {
		state.type=name
		getTableData()
	} else if (name == 'third') {
		state.type=name
		getTableData()
	} else if (name == 'first') {
		state.type=''
		getTableData()
	}
};
const activeName = ref('first');
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getProjectList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		type:state.type,
	})
		.then((res: any) => {
			state.tableData = [];
			state.loading = false;
			state.tableData = res.data.data;
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
	state.name = '';
	state.type = '';
	state.pageSize = 10;
	state.pageNum = 1;
	state.createTime = '';
	getTableData();
};

// 切换用户状态
const changeStatus = (id: string) => {
	state.loading = true;
	return new Promise((resolve, reject) => {
		changeRoleStatus({ id })
			.then((res) => {
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
// 打开新增角色弹窗
const onOpenAddRole = (type: string) => {
	roleDialogRef.value.openDialog(type);
};
// 打开修改角色弹窗
const onOpenEditRole = (type: string, row: Object) => {
	console.log(`output->`,row)
	roleDialogRef.value.openDialog(type, row);
};
const onOpenAuthorizationDetail = (type: string, row: Object) => {
	AuthorizationDetailRef.value.openDialog(type, row);
};
// 删除角色
const onProjectDelete = (row: ProjectStateType) => {
	ElMessageBox.confirm('删除后将无法恢复，请谨慎操作？', `确定要删除${row.name}吗？`, {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
		buttonSize: 'default',
	}).then(() => {
		projectDelete({ projectId:row.id }).then((res) => {
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
const onOpenDelete = () => {
	console.log(`output->shanchu`);
	console.log(`output->selectData.value`, selectData.value);
};
const toDetail = (row: ProjectStateType) => {
	router.push({ path: '/projectManage/detail', query: {projectId:row.id} });
};
</script>

<style scoped lang="scss">
.system-role-container {
	.system-role-padding {
		padding: 15px;
	}
}
</style>
