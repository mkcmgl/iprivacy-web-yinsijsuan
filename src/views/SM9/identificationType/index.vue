<template>
	<div class="identification-type-container layout-padding">
		<el-card shadow="never" class="search-box">
			<div class="content">
				<div class="search-box clearfix">
					<div class="fl mb30">
						<div class="search-name">社会统一信用代码</div>
						<el-input placeholder="请输入社会统一信用代码" readonly v-model="systemParams.organizeCode" size="large"></el-input>
					</div>
				</div>
			</div>
		</el-card>

		<el-card shadow="never" class="mt20 mb20">
			<div class="mb30 tc" v-auth="'api:cipher:identity:type:save'">
				<el-button size="large" type="primary" @click="onOpenAddIdentificationType('add')" v-auth="'api:cipher:identity:type:save'">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增标识类型
				</el-button>
			</div>
			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
				<el-table-column prop="id" label="类型ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="类型名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="state" label="状态" v-auth="'api:cipher:identity:type:updateState'" show-overflow-tooltip>
					<template #default="scope">
						<el-switch
							size="default"
							:active-value="0"
							:inactive-value="1"
							v-model="scope.row.state"
							:before-change="() => changeStatus(scope.row.id, scope.row.state)"
						/>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button
							size="small"
							text
							type="primary"
							@click="onOpenEditIdentificationType('edit', scope.row)"
							v-auth="'api:cipher:identity:type:edit'"
							>编辑</el-button
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
		<IdentificationTypeDialog ref="typeDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="identificationType">
import { reactive, onMounted, ref, defineAsyncComponent } from 'vue';
import { ElMessage } from 'element-plus';
import { getIdentityTypeList, updateIdentityTypeState } from '@/api/SM9/identificationType';
import { cloneDeep } from 'lodash';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';

const stores = useUserInfo();
const { systemParams } = storeToRefs(stores);

const IdentificationTypeDialog = defineAsyncComponent(() => import('@/views/SM9/identificationType/dialog.vue'));

const typeDialogRef = ref();
// 定义变量内容
const state = reactive({
	pageSize: 5,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
	title: '',
});
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getIdentityTypeList({
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

const onOpenAddIdentificationType = (type: string) => {
	typeDialogRef.value.openDialog(type);
};

const onOpenEditIdentificationType = (type: string, row: RowIdentificationType) => {
	let rowInfo = cloneDeep(row);
	typeDialogRef.value.openDialog(type, rowInfo);
};

const changeStatus = (id: string, status: number) => {
	state.loading = true;
	return new Promise((resolve, reject) => {
		updateIdentityTypeState({
			id,
			state: status === 1 ? 0 : 1,
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

onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.search-name {
	width: 120px !important;
}
</style>
