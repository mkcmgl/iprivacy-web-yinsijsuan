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
						<el-button type="primary" size="large" @click="searchList" v-auth="'api:cipher:identity:log:list'">
							<el-icon>
								<ele-Search />
							</el-icon>
							<span>查询</span>
						</el-button>
						<el-button type="info" size="large" @click="clearForm" v-auth="'api:cipher:identity:log:list'">
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
			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
				<el-table-column prop="typeName" label="类型名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="handle" label="标识" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="生成时间" show-overflow-tooltip></el-table-column>
			</el-table>
			<Pagination
				:total="state.total"
				v-model:page="state.pageNum"
				v-model:limit="state.pageSize"
				:background="false"
				@pagination="getTableData"
			/>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="blackList">
import { reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';
import { getIdentityLogList, getIdentityTypeAllList } from '@/api/SM9/logQuery';

const stores = useUserInfo();
const { systemParams } = storeToRefs(stores);

// 定义变量内容
const state = reactive({
	handle: '',
	identityTypeId: '',
	pageSize: 5,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
	identityTypeList: [] as Array<IdentityTypeListType>,
});
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getIdentityLogList({
		handleLike: state.handle,
		identityTypeId: state.identityTypeId,
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
	state.handle = '';
	state.identityTypeId = '';
	state.pageSize = 5;
	state.pageNum = 1;
	getTableData();
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

const addIdentificationType = () => {};

const addBlackList = (id: string) => {
	// state.loading = true;
};

onMounted(() => {
	getIdentityTypeList();
	getTableData();
});
</script>

<style scoped>
.search-name {
	width: 120px !important;
}
</style>
