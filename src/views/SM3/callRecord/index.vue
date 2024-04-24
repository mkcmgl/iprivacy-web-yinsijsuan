<template>
	<div class="sm3-call-record-container layout-padding">
		<el-card shadow="never" class="search-box">
			<div class="content">
				<div class="search-box clearfix">
					<div class="fl mb30">
						<div class="search-name">调用账号</div>
						<el-input placeholder="请输入调用账号" v-model="state.name" size="large"></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">调用时间</div>
						<el-date-picker
							size="large"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							v-model="state.invokeTime"
							style="width: 300px"
							clearable
						>
						</el-date-picker>
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
			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
				<el-table-column prop="name" label="调用账号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="algorithm" label="算法" show-overflow-tooltip></el-table-column>
				<el-table-column prop="invokeTime" label="调用日期" show-overflow-tooltip></el-table-column>
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

<script setup lang="ts" name="SM3CallRecord">
import { reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getInvokeLogList } from '@/api/SM3AndSM4/callRecord';
import { formatDate } from '@/utils/formatTime';

// 定义变量内容
const state = reactive({
	name: '',
	invokeTime: [],
	pageSize: 5,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
});
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getInvokeLogList({
		algorithm: 'sm3',
		name: state.name,
		invokeStartTime: state.invokeTime && state.invokeTime[0] ? formatDate(state.invokeTime[0], 'YYYY-mm-dd') : '',
		invokeEndTime: state.invokeTime && state.invokeTime[1] ? formatDate(state.invokeTime[1], 'YYYY-mm-dd') : '',
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
	state.name = '';
	state.invokeTime = [];
	state.pageSize = 5;
	state.pageNum = 1;
	getTableData();
};

onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss"></style>
