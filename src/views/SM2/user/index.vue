<template>
	<div class="sm2-user-container layout-padding">
		<el-card shadow="never" class="search-box">
			<div class="content">
				<div class="search-box clearfix">
					<div class="fl mb30">
						<div class="search-name">账号</div>
						<el-input placeholder="请输入账号" v-model="state.account" size="large"></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">名称</div>
						<el-input placeholder="请输入名称" v-model="state.name" size="large"></el-input>
					</div>
					<div class="fr">
						<el-button type="primary" size="large" @click="searchList" v-auth="'api:cipher:user:list'">
							<el-icon>
								<ele-Search />
							</el-icon>
							<span>查询</span>
						</el-button>
						<el-button type="info" size="large" @click="clearForm" v-auth="'api:cipher:user:list'">
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
			<div class="mb30 tc">
				<el-button size="large" type="primary" @click="onOpenAddUser('add')" v-auth="'api:cipher:user:save'">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增用户
				</el-button>
			</div>

			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
				<el-table-column prop="account" label="账号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="certificate" label="是否获得证书" show-overflow-tooltip>
					<template #default="scope">{{ state.certificateMap[scope.row.certificate] }}</template>
				</el-table-column>
				<el-table-column prop="createTime" label="初次加入时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="blacklist" label="是否黑名单" show-overflow-tooltip>
					<template #default="scope">{{ state.blacklistMap[scope.row.blacklist] }}</template>
				</el-table-column>
				<el-table-column label="操作" width="160">
					<template #default="scope">
						<el-button
							size="small"
							text
							type="primary"
							@click="updateBlacklist(scope.row.id, 0)"
							v-if="scope.row.blacklist === 1"
							v-auth="'api:cipher:user:updateState'"
							>解除黑名单</el-button
						>
						<el-button
							size="small"
							text
							type="primary"
							@click="updateBlacklist(scope.row.id, 1)"
							v-if="scope.row.blacklist === 0"
							v-auth="'api:cipher:user:updateState'"
							>加入黑名单</el-button
						>
						<el-button
							size="small"
							text
							type="primary"
							@click="applyCertificate(scope.row.id)"
							v-if="scope.row.certificate === 0 && scope.row.blacklist === 0"
							v-auth="'api:cipher:user:apply'"
							>证书申请</el-button
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
		</el-card>

		<UserDialog ref="userDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="SM2User">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getUserList, updateBlacklistState, applyUserCertificate } from '@/api/SM2/user';

// 引入组件
const UserDialog = defineAsyncComponent(() => import('@/views/SM2/user/dialog.vue'));

// 定义变量内容
const userDialogRef = ref();
const state = reactive({
	account: '',
	name: '',
	pageSize: 5,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
	certificateMap: {
		0: '否',
		1: '是',
	},
	blacklistMap: {
		0: '否',
		1: '是',
	},
});
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getUserList({
		account: state.account,
		name: state.name,
		pageSize: state.pageSize,
		pageNum: state.pageNum,
	})
		.then((res) => {
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
	state.account = '';
	state.name = '';
	state.pageSize = 5;
	state.pageNum = 1;
	getTableData();
};

// 打开新增用户弹窗
const onOpenAddUser = (type: string) => {
	userDialogRef.value.openDialog(type);
};

const updateBlacklist = (id: string, type: number) => {
	updateBlacklistState({
		id,
		blacklist: type,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				getTableData();
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => console.error(err));
};

const applyCertificate = (id: string) => {
	applyUserCertificate({ id })
		.then((res) => {
			if (res.resultCode === 0) {
				getTableData();
				ElMessage.success('申请成功');
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => console.error(err));
};

onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss"></style>
