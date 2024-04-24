<template>
	<div class="system-enterprise-container layout-padding">
		<el-card shadow="never" class="search-box">
			<div class="content">
				<div class="search-box clearfix">
					<div class="fl mb30">
						<div class="search-name">企业名称</div>
						<el-input placeholder="请输入企业名称" v-model="state.organizeName" size="large"></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">审核状态</div>
						<el-select v-model="state.auditState" placeholder="请选择" size="large" clearable>
							<el-option v-for="item in auditStateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class="fl mb30">
						<div class="search-name">状态</div>
						<el-select v-model="state.state" placeholder="请选择" size="large" clearable>
							<el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
					<div class="fr mb30">
						<el-button type="primary" size="large" @click="searchList" v-auth="'organize:admin:page'">
							<el-icon>
								<ele-Search />
							</el-icon>
							<span>查询</span>
						</el-button>
						<el-button type="info" size="large" @click="handleReset" v-auth="'organize:admin:page'">
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
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column prop="organizeName" label="企业名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
				<el-table-column prop="auditState" label="审核状态" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.auditState == 0 ? '待审核' : scope.row.auditState == 1 ? '已审核' : '驳回' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="state" label="启用状态" show-overflow-tooltip>
					<template #default="scope">
						<el-switch
							size="default"
							v-model="scope.row.state"
							active-value="1"
							inactive-value="0"
							@change="changeState($event, scope.row.organizeId)"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="updateTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onRowView(scope.row.organizeId)" v-auth="'organize:admin:detail'"
							>详情</el-button
						>
						<el-button
							v-if="scope.row.auditState == 0"
							size="small"
							text
							type="primary"
							@click="onAudit(scope.row.organizeId)"
							v-auth="'organize:admin:audit'"
							>审核</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<Pagination
				:total="state.tableData.total"
				v-model:page="state.pageNum"
				v-model:limit="state.pageSize"
				:background="false"
				@pagination="getTableData"
			/>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="systemEnterprise">
import { defineAsyncComponent, reactive, onMounted, ref, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getOrganizeList, changeOrganizeState } from '@/api/system/enterprise';

const router = useRouter();
// 定义变量内容
const state = reactive({
	isOnceMore: false,
	pageNum: 1,
	pageSize: 5,
	organizeName: null,
	auditState: null,
	state: '',
	tableData: {
		data: [],
		total: 0,
		loading: false,
	},
});
const auditStateOptions = [
	{
		value: 0,
		label: '待审核',
	},
	{
		value: 1,
		label: '已审核',
	},
	{
		value: 2,
		label: '驳回',
	},
];
const stateOptions = [
	{
		value: 0,
		label: '禁用',
	},
	{
		value: 1,
		label: '启用',
	},
];
const handleReset = () => {
	state.organizeName = null;
	state.auditState = null;
	state.state = '';
	state.pageSize = 5;
	state.pageNum = 1;
	getTableData();
};
// 初始化表格数据
const getTableData = () => {
	state.tableData.loading = true;
	state.tableData.data = [];
	getOrganizeList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		organizeName: state.organizeName,
		auditState: state.auditState,
		state: state.state,
	})
		.then((res) => {
			if (res.resultCode == 0) {
				state.tableData.total = res.data.total;
				state.tableData.data = res.data.data;
				state.tableData.loading = false;
			} else {
				ElMessage.error(res.resultDesc);
				state.tableData.loading = false;
			}
			state.isOnceMore = true;
		})
		.catch((err) => {
			state.tableData.loading = false;
			console.log(err);
		});
};

const searchList = () => {
	state.pageNum = 1;
	getTableData();
};

const changeState = (val: string, organizeId: string) => {
	let query = {
		organizeId: organizeId,
		state: val,
	};
	changeOrganizeState(query)
		.then((res) => {
			if (res.resultCode == 0) {
				ElMessage({
					type: 'success',
					message: '操作成功',
				});
				getTableData();
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

const onRowView = (organizeId: string) => {
	router.push({
		path: '/system/enterprise/detail',
		query: {
			organizeId: organizeId,
		},
	});
};
const onAudit = (organizeId: string) => {
	router.push({
		path: '/system/enterprise/detail',
		query: {
			organizeId: organizeId,
		},
	});
};

// 页面加载时
onMounted(() => {
	getTableData();
});
onActivated(() => {
	if (state.isOnceMore) {
		getTableData();
	}
});
</script>

<style scoped lang="scss">
:deep(.search-box .el-card__body) {
	padding: 30px 30px 0px 30px;
}
</style>
