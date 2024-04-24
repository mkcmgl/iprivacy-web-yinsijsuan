<template>
	<div class="system-user-container layout-padding">
		<el-card shadow="never" class="search-box">
			<div class="content">
				<div class="search-box clearfix">
					<div class="fl mb30">
						<div class="search-name">账号名称</div>
						<el-input placeholder="请输入账号名称" v-model="state.loginName" size="large" clearable></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">姓名</div>
						<el-input placeholder="请输入姓名" v-model="state.realName" size="large" clearable></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">部门</div>
						<el-cascader
							:options="state.deptData"
							:props="{ checkStrictly: true, expandTrigger: 'hover', emitPath: false, value: 'id', label: 'name', children: 'children' }"
							placeholder="请选择部门"
							v-model="state.orgId"
							clearable
						>
						</el-cascader>
					</div>
					<div class="fl mb30">
						<div class="search-name">角色</div>
						<el-select filterable placeholder="请选择角色" v-model="state.roleId" size="large" clearable>
							<el-option v-for="item in state.roleList" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</div>
					<div class="fl mb30">
						<div class="search-name">手机号码</div>
						<el-input placeholder="请输入手机号码" maxlength="11" v-model="state.phone" size="large" clearable></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">用户状态</div>
						<el-select placeholder="请选择用户状态" v-model="state.status" size="large" clearable>
							<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option
						></el-select>
					</div>
					<div class="fl">
						<div class="search-name">创建时间</div>
						<el-date-picker
							size="large"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							v-model="state.createTime"
							style="width: 300px"
							clearable
						>
						</el-date-picker>
					</div>
					<div class="fr">
						<el-button type="primary" size="large" @click="searchList" v-auth="'api:user:list'">
							<el-icon>
								<ele-Search />
							</el-icon>
							<span>查询</span>
						</el-button>
						<el-button type="info" size="large" @click="clearForm" v-auth="'api:user:list'">
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
			<div class="mb30 tc" v-auth="'api:user:add'">
				<el-button size="large" type="primary" @click="onOpenAddUser('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增用户
				</el-button>
			</div>
			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
				<el-table-column prop="loginName" label="账户名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="real_name" label="姓名" show-overflow-tooltip></el-table-column>
				<el-table-column prop="positions" label="部门（岗位）" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roles" label="角色" show-overflow-tooltip></el-table-column>
				<el-table-column prop="phone" label="手机号码" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="用户状态" show-overflow-tooltip>
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
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenEditUser('edit', scope.row.id)" v-auth="'api:user:edit'">修改</el-button>
						<el-button size="small" text type="primary" @click="onOpenChangePwd(scope.row.id)" v-auth="'api:user:edit'">修改密码</el-button>
						<el-button size="small" text type="primary" @click="onRowDel(scope.row.id)" v-auth="'api:user:delete'">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" :background="false" @pagination="getTableData" />
		</el-card>
		<UserDialog ref="userDialogRef" @refresh="getTableData()" />
		<ChangePwdDialog ref="changePwdDialogRef" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getUserList, changeUserStatus, deleteUser } from '@/api/system/user';
import { getOrgTreeList } from '@/api/system/dept';
import { getList } from '@/api/system/role';
import { formatDate } from '@/utils/formatTime';

// 引入组件
const UserDialog = defineAsyncComponent(() => import('@/views/system/user/dialog.vue'));
const ChangePwdDialog = defineAsyncComponent(() => import('@/components/changePwd/index.vue'));

// 定义变量内容
const userDialogRef = ref();
const changePwdDialogRef = ref();
const state = reactive<SysUserState>({
	deptData: [] as OrgTreeType[], // 部门数据
	loading: false,
	pageNum: 1,
	pageSize: 5,
	total: 0,
	loginName: '',
	realName: '',
	phone: '',
	status: '',
	roleId: '',
	orgId: '',
	createTime: [],
	tableData: [],
	roleList: [],
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
	getUserList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		loginName: state.loginName,
		realName: state.realName,
		phone: state.phone,
		status: state.status,
		roleId: state.roleId,
		orgId: state.orgId,
		createStartTime: state.createTime && state.createTime[0] ? formatDate(state.createTime[0], 'YYYY-mm-dd') : '',
		createEndTime: state.createTime && state.createTime[1] ? formatDate(state.createTime[1], 'YYYY-mm-dd') : '',
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

// 重置
const clearForm = () => {
	state.loginName = '';
	state.realName = '';
	state.phone = '';
	state.status = '';
	state.roleId = '';
	state.orgId = '';
	state.createTime = [];
	state.pageSize = 5;
	state.pageNum = 1;
	getTableData();
};

const getOrgTableData = () => {
	state.deptData = [];
	getOrgTreeList()
		.then((res) => {
			state.deptData = res.data;
		})
		.catch((err) => {
			console.log(err);
		});
};

const getRoleList = () => {
	getList({})
		.then((res) => {
			state.roleList = res.data;
		})
		.catch((err) => {
			console.log(err);
		});
};

// 打开新增用户弹窗
const onOpenAddUser = (type: string) => {
	userDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditUser = (type: string, id: string) => {
	userDialogRef.value.openDialog(type, id);
};
// 删除用户
const onRowDel = (id: string) => {
	ElMessageBox.confirm('删除后将无法恢复，是否确认删除', '确认要删除这个用户吗？', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			deleteUser({
				userId: id,
			})
				.then((res) => {
					if (res.resultCode === 0) {
						getTableData();
						ElMessage.success('删除成功');
					} else {
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch(() => {});
};
const changeStatus = (id: string, status: string) => {
	state.loading = true;
	return new Promise((resolve, reject) => {
		changeUserStatus({
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

// 打开修改密码弹窗
const onOpenChangePwd = (id: number) => {
	changePwdDialogRef.value.openDialog(id);
};

// 页面加载时
onMounted(() => {
	getTableData();
	getOrgTableData();
	getRoleList();
});
</script>

<style scoped lang="scss">
.system-user-container {
}
</style>
