<template>
	<div class="identification-type-container layout-padding">
		<el-card shadow="never" class="search-box">
			<div class="content">
				<div class="search-box clearfix">
					<div class="fl mb30">
						<div class="search-name">密钥名称</div>
						<el-input v-model="state.name" placeholder="请输入密钥名称" size="large"></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">密钥类型</div>
						<el-select placeholder="请选择密钥类型" v-model="state.type" size="large" clearable>
							<el-option v-for="(value, key) in typeMap" :key="key" :label="value" :value="key"></el-option
						></el-select>
					</div>
					<div class="fl mb30">
						<div class="search-name">生成时间</div>
						<el-date-picker
							size="large"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							v-model="state.generationTime"
							style="width: 300px"
							clearable
						>
						</el-date-picker>
					</div>
					<div class="fr">
						<el-button type="primary" size="large" @click="searchList" v-auth="'api:cipher:threshold:list'">
							<el-icon>
								<ele-Search />
							</el-icon>
							<span>查询</span>
						</el-button>
						<el-button type="info" size="large" @click="clearForm" v-auth="'api:cipher:threshold:list'">
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
			<div class="mb30 tc" v-auth="'api:cipher:threshold:save'">
				<el-button size="large" type="primary" @click="onOpenAddKeyGeneration()" v-auth="'api:cipher:threshold:save'">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					生成密钥
				</el-button>
			</div>
			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
				<el-table-column prop="name" label="密钥名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="type" label="密钥类型" show-overflow-tooltip>
					<template #default="scope">{{ typeMap[scope.row.type] }}</template>
				</el-table-column>
				<el-table-column prop="share" label="私钥份额" show-overflow-tooltip></el-table-column>
				<el-table-column prop="publicKey" label="公钥" show-overflow-tooltip></el-table-column>
				<el-table-column prop="LoginName" label="创建人" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="生成时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="useNumber" label="私钥使用次数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="copyPublicKey(scope.row.publicKey)" v-auth="'api:cipher:threshold:list'"
							>复制公钥</el-button
						>
						<el-button size="small" text type="primary" @click="copyPrivateKey(scope.row.id)" v-auth="'api:cipher:threshold:privateKey'"
							>复制私钥</el-button
						>
						<el-button size="small" text type="primary" @click="deleteKeyGeneration(scope.row.id)" v-auth="'api:cipher:threshold:delete'"
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
		</el-card>
		<KeyGenerationDialog ref="keyDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="keyGeneration">
import { reactive, onMounted, ref, defineAsyncComponent } from 'vue';
import { ElMessage } from 'element-plus';
import { getThresholdList, getPrivateKey, deleteThreshold } from '@/api/thresholdKey/keyGeneration';
import { formatDate } from '@/utils/formatTime';
import commonFunction from '@/utils/commonFunction';

const keyDialogRef = ref();

const KeyGenerationDialog = defineAsyncComponent(() => import('@/views/thresholdKey/keyGeneration/dialog.vue'));

const typeDialogRef = ref();
// 定义变量内容
const state = reactive({
	type: '',
	name: '',
	generationTime: [],
	pageSize: 5,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
});
const typeMap = {
	1: '加密',
	2: '签名',
};
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getThresholdList({
		type: state.type,
		name: state.name,
		startTime: state.generationTime && state.generationTime[0] ? formatDate(state.generationTime[0], 'YYYY-mm-dd') : '',
		endTime: state.generationTime && state.generationTime[1] ? formatDate(state.generationTime[1], 'YYYY-mm-dd') : '',
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
	state.type = '';
	state.name = '';
	state.generationTime = [];
	state.pageSize = 5;
	state.pageNum = 1;
	getTableData();
};

const onOpenAddKeyGeneration = () => {
	keyDialogRef.value.openDialog();
};

const copyPublicKey = (publicKey: string) => {
	commonFunction().copyText(publicKey);
};

const copyPrivateKey = (id: string) => {
	getPrivateKey({ id })
		.then((res) => {
			if (res.resultCode === 0) {
				commonFunction().copyText(res.data);
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

const deleteKeyGeneration = (id: string) => {
	deleteThreshold({ id })
		.then((res) => {
			if (res.resultCode === 0) {
				ElMessage.success('删除成功');
				getTableData();
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.search-name {
	width: 120px !important;
}
</style>
