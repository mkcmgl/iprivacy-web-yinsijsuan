<template>
	<div class="system-role-container layout-padding">
		<el-card shadow="never" class="mt20 mb20">
			<el-table :data="state.tableData" v-loading="state.loading"  style="width: 100%">
				<el-table-column label="模型名称" show-overflow-tooltip>
					<template #default="scope">
						<el-button size="small" text type="primary" @click="toDetail(scope.row.modelId)" >{{
							scope.row.modelName
						}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="nodeName"  label="类型" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="提交时间" show-overflow-tooltip></el-table-column>
				<el-table-column  label="模型描述" show-overflow-tooltip><span>横向</span></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="toDeploy(scope.row.modelId)">部署</el-button>
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

		<!-- <RoleDialog ref="roleDialogRef" @refresh="getTableData()" />
		<AuthorizationDetail ref="AuthorizationDetailRef" /> -->
	</div>
</template>

<script setup lang="ts" name="modelManage">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs,computed } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getRoleList, changeRoleStatus, deleteRole } from '@/api/system/role';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';
import { getModelList} from '@/api/modelManage'
import { DataListObjectType, SysRoleState } from '@/types/views';
// 引入组件
// const RoleDialog = defineAsyncComponent(() => import('@/views/dataManage/dialog.vue'));
// const AuthorizationDetail = defineAsyncComponent(() => import('@/views/dataManage/AuthorizationDetail-dialog.vue'));
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
/*const isSystemAdmin = computed(() => {
    return userInfos.userInfos.roles.includes("systemAdmin")
});*/

// 初始化表格数据
const getTableData = () => {
	state.loading = true;
  getModelList({

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

//部署
const toDeploy = (id: string) => {
  console.log(`output->id`, id);
};

//详情
const toDetail = (id: string) => {
	console.log(`output->row`, id);
	router.push({ path: '/modelManage/detail',query: {
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
