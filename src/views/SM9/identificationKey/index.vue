<template>
	<div class="identification-type-container layout-padding">
		<el-card shadow="never" class="search-box">
			<div class="content">
				<div class="search-box clearfix">
					<div class="fl mb30">
						<div class="search-name">标识</div>
						<el-input placeholder="请输入标识" v-model="state.handle" size="large"></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">标识类型</div>
						<el-select-v2
							v-model="state.identityTypeId"
							filterable
							:options="state.identityTypeList"
							placeholder="请选择标识类型"
							size="large"
						/>
					</div>
					<div class="fr">
						<el-button type="primary" size="large" @click="searchList" v-auth="'api:cipher:certificate:type:page'">
							<el-icon>
								<ele-Search />
							</el-icon>
							<span>查询</span>
						</el-button>
						<el-button type="info" size="large" @click="clearForm" v-auth="'api:cipher:certificate:type:page'">
							<el-icon>
								<ele-RefreshLeft />
							</el-icon>
							<span>重置</span>
						</el-button>
					</div>
				</div>
			</div>
		</el-card>

		<el-card shadow="never" class="mt20">
			<el-form size="large" label-width="130px" label-position="left">
				<el-row>
					<el-col :span="9" :offset="0">
						<el-form-item label="系统参数">
							<el-input v-model="systemParams.systemParam" readonly></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="9" :offset="2">
						<el-form-item label="社会统一信用代码">
							<el-input v-model="systemParams.organizeCode" readonly></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>

		<el-card shadow="never" class="mt20 mb20">
			<div class="mb30 tc" v-auth="'api:cipher:identity:type:createSecret'">
				<el-button size="large" type="primary" @click="addIdentificationkey()">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					生成标识密钥
				</el-button>
			</div>
			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
				<el-table-column prop="typeName" label="类型名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="handle" label="标识" show-overflow-tooltip></el-table-column>
				<el-table-column prop="count" label="生成次数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="最后生成时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="blacklist" label="是否黑名单" show-overflow-tooltip>
					<template #default="scope">
						<div>{{ blacklistMap[scope.row.blacklist] }}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="addBlackList(scope.row.id)" v-auth="'api:cipher:identity:type:blacklist'"
							>加入黑名单</el-button
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
		<IdentificationKeyDialog ref="keyDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="identificationKey">
import { reactive, ref, defineAsyncComponent, onActivated } from 'vue';
import { ElMessage } from 'element-plus';
import { getIdentityTypeAllList, getIdentificationKeyList, updateIdentityKeyState } from '@/api/SM9/identificationKey';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';

const IdentificationKeyDialog = defineAsyncComponent(() => import('@/views/SM9/identificationKey/dialog.vue'));

const stores = useUserInfo();
const { systemParams } = storeToRefs(stores);
const keyDialogRef = ref();
// 定义变量内容
const state = reactive({
	handle: '',
	identityTypeId: '',
	pageSize: 5,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
	isShowDialog: false,
	identityTypeList: [] as Array<IdentityTypeListType>,
});

const blacklistMap = {
	0: '否',
	1: '是',
};

const getIdentityTypeList = () => {
	getIdentityTypeAllList()
		.then((res) => {
			if (res.resultCode === 0) {
				state.identityTypeList = [];
				res.data.forEach((item: { id?: string; name?: string }) => {
					state.identityTypeList.push({
						value: item.id,
						label: item.name,
					});
				});
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getIdentificationKeyList({
		handle: state.handle,
		identityTypeId: state.identityTypeId,
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		blacklist: 0,
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
	state.handle = '';
	state.identityTypeId = '';
	state.pageSize = 5;
	state.pageNum = 1;
	getTableData();
};

const addIdentificationkey = () => {
	keyDialogRef.value.openDialog();
};

const addBlackList = (id: string) => {
	state.loading = true;
	updateIdentityKeyState({
		id,
		blacklist: 1,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				ElMessage.success('加入成功');
				getTableData();
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

onActivated(() => {
	getIdentityTypeList();
	getTableData();
});
</script>

<style scoped lang="scss"></style>
