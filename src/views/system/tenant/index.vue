<template>
	<div class="system-tenant-container layout-padding">
		<el-row :gutter="20" style="height: 100%">
			<el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" class="pb30">
				<el-card shadow="hover" style="height: 100%">
					<div class="title">
						<div class="ml10">租户管理</div>
						<el-button size="large" type="primary" @click="onOpenAddTenant('add')" v-auth="'api:tenant:save'">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新建租户
						</el-button>
					</div>
					<div class="system-dept-left">
						<el-table
							:data="state.tableTenantData"
							v-loading="state.tenantLoading"
							style="width: 100%"
							row-key="id"
							default-expand-all
							highlight-current-row
							@current-change="handleCurrentChange"
						>
							<el-table-column prop="tenantName" label="租户名称" show-overflow-tooltip> </el-table-column>
							<el-table-column label="操作" show-overflow-tooltip width="120">
								<template #default="scope">
									<el-button
										size="small"
										v-if="scope.row.parentId !== '0'"
										text
										type="primary"
										@click="onOpenAddTenant('add')"
										v-auth="'api:tenant:save'"
										>新增</el-button
									>
									<el-button
										size="small"
										v-if="scope.row.parentId !== '0'"
										text
										type="primary"
										@click="onOpenEditTenant('edit', scope.row.id)"
										v-auth="'api:tenant:update'"
										>修改</el-button
									>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18" class="pb30 flex" style="display: flex; flex-direction: column">
				<el-card class="box-card">
					<template #header>
						<div class="card-header">
							<span>租户信息</span>
						</div>
					</template>
					<el-row>
						<el-col :span="24">
							<el-form :model="state.form" label-width="150px">
								<el-form-item label="租户名称">
									<span>{{ state.form.tenantName }}</span>
								</el-form-item>
								<el-form-item label="租户域名">
									<span>{{ state.form.domain }}</span>
								</el-form-item>
								<el-form-item label="租户ID">
									<span>{{ state.form.userId }}</span>
								</el-form-item>
								<el-form-item label="租户状态">
									<span>{{ state.form.status == '1' ? '启用' : state.form.status == '0' ? '停用' : '' }}</span>
								</el-form-item>
								<el-form-item label="创建时间">
									<span>{{ state.form.createTime }}</span>
								</el-form-item>
								<el-form-item label="创建人">
									<span>{{ state.form.createdBy }}</span>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</el-card>

				<el-card shadow="never" class="mt30 layout-padding-auto">
					<template #header>
						<div class="card-header">
							<span>应用信息</span>
						</div>
					</template>
					<el-row>
						<el-col :span="24">
							<el-form :model="state.form" label-width="150px">
								<el-form-item label="应用名称">
									<span>{{ state.form.appName }}</span>
								</el-form-item>
								<el-form-item label="应用LOGO">
									<img v-if="state.form.appLogo" :src="state.form.appLogo" />
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</el-card>

				<el-card shadow="never" class="mt30 layout-padding-auto">
					<template #header>
						<div class="card-header">
							<span>区块链配置信息</span>
						</div>
					</template>
					<el-row>
						<el-col :span="24">
							<el-form :model="state.form" label-width="150px">
								<el-form-item label="区块链名称">
									<span>{{ state.form.chainName }}</span>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</el-card>

				<el-card shadow="never" class="mt30 layout-padding-auto">
					<template #header>
						<div class="card-header">
							<span>租户管理员信息</span>
						</div>
					</template>
					<el-row>
						<el-col :span="24">
							<el-form :model="state.form" label-width="150px">
								<el-form-item label="登录账号">
									<span>{{ state.form.loginName }}</span>
								</el-form-item>
								<el-form-item label="手机号">
									<span>{{ state.form.phone }}</span>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="systemTenant">
import { defineAsyncComponent, ref, reactive, onMounted, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { getTenantTreeList, getTenantDetail } from '@/api/system/tenant';

// 引入组件
const router = useRouter();

// 定义变量内容
const state = reactive<SysTenantState>({
	isOnceMore: false,
	loading: false,
	tenantLoading: false,
	id: '',
	tableTenantData: [],
	form: {
		tenantName: '',
		domain: '',
		userId: '',
		status: '',
		createTime: '',
		createdBy: '',
		appName: '',
		appLogo: '',
		chainName: '',
		loginName: '',
		phone: '',
	},
});

const getTenantTableData = () => {
	state.tenantLoading = true;
	state.tableTenantData = [];
	getTenantTreeList()
		.then((res) => {
			state.tenantLoading = false;
			state.tableTenantData = res.data;
			state.id = res.data.length > 0 ? res.data[0].id : '';
			getDetail();
			state.isOnceMore = true;
		})
		.catch((err) => {
			state.tenantLoading = false;
			console.log(err);
		});
};

const getDetail = () => {
	getTenantDetail({
		id: state.id,
	})
		.then((res) => {
			state.form = res.data;
		})
		.catch((err) => {
			console.log(err);
		});
};

const handleCurrentChange = (val: any) => {
	if (val != undefined || val != null) {
		state.id = val?.id;
		getDetail();
	}
};

// 打开新增菜单弹窗
const onOpenAddTenant = (type: string) => {
	router.push({
		path: '/system/tenant/add',
		query: {},
	});
};
// 打开编辑菜单弹窗
const onOpenEditTenant = (type: string, id: string) => {
	router.push({
		path: '/system/tenant/edit',
		query: {
			id: id,
		},
	});
};

// 页面加载时
onMounted(() => {
	getTenantTableData();
});
onActivated(() => {
	if (state.isOnceMore) {
		getTenantTableData();
	}
});
</script>
<style scoped lang="scss">
:deep(.search-box .el-card__body) {
	padding-bottom: 0px !important;
}
.system-dept-left {
	& :deep(.el-table thead) {
		display: none;
	}
}
.title {
	font-size: 18px;
	margin-bottom: 20px;

	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
