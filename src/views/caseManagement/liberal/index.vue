<template>
	<div class="case-management-liberal-container layout-padding">
		<el-card shadow="never" class="mt20 mb20">
			<div class="mb30 tc">
				<el-button size="large" type="primary" @click="onOpenAddCase()" v-auth="'api:auth:appInfo:add'">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					开通实例
				</el-button>
			</div>

			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
				<el-table-column prop="appName" label="实例名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="appId" label="appID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip> </el-table-column>
				<el-table-column label="操作" width="160">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="getAPPSecret(scope.row.appId)" v-auth="'api:auth:appInfo:secret'"
							>查看APP Secret</el-button
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

		<el-dialog v-model="state.dialogVisible" title="开通实例" width="769px">
			<el-form ref="examplesFormRef" :model="state.form" :rules="rules" label-width="90px" size="large">
				<el-form-item label="实例名称" prop="appName">
					<el-input placeholder="请输入实例名称" v-model="state.form.appName" clearable></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="large">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="large">开 通</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts" setup name="caseManagementLiberal">
import { reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage, FormRules, FormInstance } from 'element-plus';
import { getAppInfoList, getAppInfoSecret, createtAppInfo } from '@/api/caseManagement/liberal';

const examplesFormRef = ref<FormInstance>();

const state = reactive({
	pageSize: 5,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
	dialogVisible: false,
	form: {
		appName: '',
	},
});

const rules = reactive<FormRules>({
	appName: [
		{ required: true, message: '请输入实例名称', trigger: 'blur' },
		{ min: 2, max: 30, message: '实例名称长度为2-30位' },
	],
});

// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getAppInfoList({
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

const getAPPSecret = (appId: string) => {
	getAppInfoSecret({ appId })
		.then((res) => {
			if (res.resultCode === 0) {
				ElMessageBox.alert(`<span>APP Secret:</span> <span class="ml15"> ${res.data}</span>`, '查看APP Secret', {
					confirmButtonText: '确认',
					center: true,
					dangerouslyUseHTMLString: true,
					callback: () => {
						return;
					},
				});
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => console.error(err));
};

const onOpenAddCase = () => {
	state.dialogVisible = true;
	state.form.appName = '';
	examplesFormRef.value?.clearValidate();
};

const onCancel = () => {
	state.dialogVisible = false;
};

const onSubmit = () => {
	examplesFormRef.value?.validate((valid) => {
		if (valid) {
			createtAppInfo({
				appName: state.form.appName,
			})
				.then((res) => {
					if (res.resultCode === 0) {
						getTableData();
						ElMessage.success('开通成功');
						onCancel();
					} else {
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => console.error(err));
		}
	});
};

onMounted(() => {
	getTableData();
});
</script>
<style lang="scss" scoped></style>
