<template>
	<div class="system-role-container layout-padding">
		<el-card shadow="never" class="search-box">
			<div class="content">
				<div class="search-box clearfix">
					<div class="fl mb30">
						<div class="search-name">角色名称</div>
						<el-input placeholder="请输入角色名称" v-model="state.roleName" size="large"></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">权限标识</div>
						<el-input placeholder="请输入权限标识" v-model="state.roleKey" size="large"></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">状态</div>
						<el-select v-model="state.status" placeholder="请选择状态" size="large" clearable>
							<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class="fr">
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
			<div class="mb30 tc" v-auth="'api:role:save'">
				<el-button size="large" type="primary" @click="onOpenAddRole('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增角色
				</el-button>
			</div>

			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
				<el-table-column prop="name" label="角色名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sort" label="排序" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roleKey" label="权限标识" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="角色状态" show-overflow-tooltip>
					<template #default="scope">
						<el-switch
							size="default"
							:active-value="0"
							:inactive-value="1"
							v-model="scope.row.status"
							:before-change="() => changeStatus(scope.row.id)"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="角色描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenEditRole('edit', scope.row)" v-auth="'api:role:update'">修改</el-button>
						<el-button size="small" text type="primary" @click="onRowDel(scope.row.id)" v-auth="'api:role:delete'">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" :background="false" @pagination="getTableData" />
		</el-card>

		<RoleDialog ref="roleDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getRoleList, changeRoleStatus, deleteRole } from '@/api/system/role';

// 引入组件
const RoleDialog = defineAsyncComponent(() => import('@/views/system/role/dialog.vue'));

// 定义变量内容
const roleDialogRef = ref();
const state = reactive<SysRoleState>({
	roleName: '',
	roleKey: '',
	status: '',
	pageSize: 5,
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
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getRoleList({
		roleName: state.roleName,
		roleKey: state.roleKey,
		status: state.status,
		pageSize: state.pageSize,
		pageNum: state.pageNum,
	})
		.then((res) => {
			state.tableData = [];
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
	state.roleName = '';
	state.roleKey = '';
	state.status = '';
	state.pageSize = 5;
	state.pageNum = 1;
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
	roleDialogRef.value.openDialog(type, row);
};
// 删除角色
const onRowDel = (id: string) => {
	ElMessageBox.confirm('删除后将无法恢复，是否确认删除？', '确定要删除这个角色吗？', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
		buttonSize: 'default',
	}).then(() => {
		deleteRole({ id }).then((res) => {
			if (res.resultCode === 0) {
				ElMessage.success('删除成功');
				getTableData();
			} else {
				ElMessage.warning(res.resultDesc);
			}
		});
	});
};
getTableData();
</script>

<style scoped lang="scss">
.system-role-container {
	.system-role-padding {
		padding: 15px;
	}
}
</style>
