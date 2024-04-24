<template>
	<div class="certificate-management-container layout-padding">
		<el-card shadow="never" class="search-box mb20">
			<div class="content">
				<div class="search-box clearfix">
					<div class="fl mb30">
						<div class="search-name">账号</div>
						<el-input placeholder="请输入账号" v-model="state.account" size="large" clearable></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">名称</div>
						<el-input placeholder="请输入名称" v-model="state.name" size="large" clearable></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">序列号</div>
						<el-input placeholder="请输入序列号" v-model="state.serialCode" size="large" clearable></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">证书识别码</div>
						<el-input placeholder="请输入证书识别码" v-model="state.identifyCode" size="large" clearable></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">申请时间</div>
						<el-date-picker
							size="large"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							v-model="state.approveTime"
							style="width: 300px"
							clearable
						>
						</el-date-picker>
					</div>
					<div class="fl mb30">
						<div class="search-name">状态</div>
						<el-select placeholder="请选择状态" v-model="state.state" size="large" clearable>
							<el-option v-for="item in state.stateList" :key="item.value" :label="item.label" :value="item.value"></el-option
						></el-select>
					</div>
					<div class="fl mb30">
						<div class="search-name">签发人</div>
						<el-input placeholder="请输入签发人" v-model="state.signer" size="large" clearable></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">签发时间</div>
						<el-date-picker
							size="large"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							v-model="state.issueTime"
							style="width: 300px"
							clearable
						>
						</el-date-picker>
					</div>
					<div class="fr mb30">
						<el-button type="primary" size="large" @click="searchList()" v-auth="'api:cipher:certificate:list'">
							<el-icon>
								<ele-Search />
							</el-icon>
							<span>查询</span>
						</el-button>
						<el-button type="info" size="large" @click="clearForm" v-auth="'api:cipher:certificate:list'">
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
				<el-table-column prop="account" label="账号" width="200" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="名称" width="200" show-overflow-tooltip></el-table-column>
				<el-table-column prop="serialCode" label="序列号" width="290" show-overflow-tooltip></el-table-column>
				<el-table-column prop="identifyCode" label="证书识别码" width="310" show-overflow-tooltip></el-table-column>
				<el-table-column prop="approveTime" label="申请时间" width="220" show-overflow-tooltip></el-table-column>
				<el-table-column prop="state" label="状态" width="100">
					<template #default="scope">
						<el-tag type="warning" v-if="scope.row.state === 0">待审核</el-tag>
						<el-tag type="success" v-if="scope.row.state === 1">已签发</el-tag>
						<el-tag type="info" v-if="scope.row.state === 2">驳回</el-tag>
						<el-tag type="danger" v-if="scope.row.state === 3">吊销</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="signer" label="签发人" width="100" show-overflow-tooltip></el-table-column>
				<el-table-column prop="issueTime" label="签发时间" width="180" show-overflow-tooltip></el-table-column>
				<el-table-column prop="maintenanceStartTime" label="有效时间" width="290" show-overflow-tooltip>
					<template #default="scope">
						<div v-if="scope.row.effectiveStartTime && scope.row.effectiveEndTime">
							{{ scope.row.effectiveStartTime + '-' + scope.row.effectiveEndTime }}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
					<template #default="scope">
						<el-button size="small" text type="primary" v-if="scope.row.state === 0" @click="updateState(scope.row.id, 1)"
							>签发</el-button
						>
						<el-button size="small" text type="primary" v-if="scope.row.state === 0" @click="updateState(scope.row.id, 2)"
							>驳回</el-button
						>
						<el-button size="small" text type="primary" v-if="scope.row.state === 1" @click="revoke(scope.row.id, 3)">吊销</el-button>
						<el-button size="small" text type="primary" v-if="scope.row.state === 1" @click="download(scope.row.id)">下载证书</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination
				:total="state.total"
				v-model:page="state.pageNum"
				v-model:limit="state.pageSize"
				:background="false"
				@pagination="getTableData()"
			/>
		</el-card>
	</div>
</template>
<script setup lang="ts" name="certificateManagement">
import { reactive, ref, onActivated, h } from 'vue';
import { formatDate } from '@/utils/formatTime';
import { ElMessage, ElMessageBox, FormInstance, FormRules, ElForm, ElFormItem } from 'element-plus';
import { useRouter } from 'vue-router';
import { getCertificateList, updateCertificateState, downloadCertificateState } from '@/api/SM2/certificate';
const router = useRouter();

const state = reactive({
	pageSize: 5,
	pageNum: 1,
	account: '',
	name: '',
	serialCode: '',
	identifyCode: '',
	state: '',
	signer: '',
	approveTime: [],
	issueTime: [],
	loading: false,
	tableData: [],
	total: 0,
	dialogVisible: false,
	password: '',
	stateList: [
		{
			value: '',
			label: '全部',
		},
		{
			value: 0,
			label: '待审核',
		},
		{
			value: 1,
			label: '已签发',
		},
		{
			value: 2,
			label: '驳回',
		},
		{
			value: 3,
			label: '吊销',
		},
	],
});

const transferFormRef = ref<FormInstance>();

const rules = reactive<FormRules>({
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ min: 2, max: 20, message: '长度在2-20之间', trigger: 'blur' },
	],
});

const getTableData = () => {
	state.loading = true;
	state.tableData = [];
	getCertificateList({
		account: state.account,
		name: state.name,
		serialCode: state.serialCode,
		identifyCode: state.identifyCode,
		state: state.state,
		signer: state.signer,
		approveStartTime: state.approveTime && state.approveTime[0] ? formatDate(state.approveTime[0], 'YYYY-mm-dd') : '',
		approveEndTime: state.approveTime && state.approveTime[1] ? formatDate(state.approveTime[1], 'YYYY-mm-dd') : '',
		issueStartTime: state.issueTime && state.issueTime[0] ? formatDate(state.issueTime[0], 'YYYY-mm-dd') : '',
		issueEndTime: state.issueTime && state.issueTime[1] ? formatDate(state.issueTime[1], 'YYYY-mm-dd') : '',
		pageSize: state.pageSize,
		pageNum: state.pageNum,
	})
		.then((res) => {
			state.loading = false;
			state.tableData = res.data.data;
			state.total = res.data.total;
		})
		.catch((err) => {
			state.loading = false;
			console.error(err);
		});
};

const searchList = () => {
	state.pageNum = 1;
	getTableData();
};

const clearForm = () => {
	state.account = '';
	state.name = '';
	state.serialCode = '';
	state.identifyCode = '';
	state.state = '';
	state.signer = '';
	state.approveTime = [];
	state.issueTime = [];
	getTableData();
};

const revoke = (id: string, state: number) => {
	ElMessageBox.confirm('请确认是否吊销证书', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then((res) => {
		updateState(id, state);
	});
};

const updateState = (id: string, state: number) => {
	updateCertificateState({
		id,
		state,
	}).then((res) => {
		if (res.resultCode === 0) {
			ElMessage.success('操作成功');
			getTableData();
		} else {
			ElMessage.warning(res.resultDesc);
		}
	});
};

const download = (id: string) => {
	ElMessageBox.prompt(h('p', null, [h('i', { style: 'color: red' }, '* '), h('span', null, '请输入用于加密证书的密码')]), '证书密码', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputPattern: /^.{2,30}$/,
		inputErrorMessage: '密码长度2-30位',
	})
		.then(({ value }) => {
			downloadCertificateState({
				id,
				password: value,
			})
				.then((res) => {
					// 创建 Blob 对象
					const blob = new Blob([res as any], { type: 'application/zip' });

					if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
						// 兼容IE
						(window.navigator as any).msSaveOrOpenBlob(blob, id);
					} else {
						// 创建 URL 对象
						const url = URL.createObjectURL(blob);

						// 创建链接
						const link = document.createElement('a');
						link.href = url;
						link.download = id;

						// 模拟点击链接进行下载
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);

						// 释放 URL 对象
						URL.revokeObjectURL(url);
					}
				})
				.catch((err) => {});
		})
		.catch((err) => console.log(err));
};

const onOpenDetailWorkOrder = (id: number) => {
	router.push({
		path: '/maintenance/workOrder/detail',
		query: { id },
	});
};
const onRowDealWithWorkOrder = (id: number, state: number) => {
	handleMaintenanceOrder({ id })
		.then((res) => {
			if (res.resultCode === 0) {
				if (state === 0 || state === 1) {
					router.push({
						path: '/maintenance/workOrder/dealWith',
						query: { id },
					});
				} else if (state === 2 || state === 3) {
					router.push({
						path: '/maintenance/workOrder/acceptance',
						query: { id },
					});
				}
			} else {
				ElMessage.success(res.resultDesc);
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

const onCancel = () => {
	state.dialogVisible = false;
};

const onSubmit = () => {
	transferFormRef.value?.validate((valid) => {
		if (valid) {
			transferMaintenanceOrder({
				id: state.id,
				maintenanceUserId: state.form.maintenanceUserId,
			})
				.then((res) => {
					if (res.resultCode === 0) {
						getTableData();
						ElMessage.success('转派成功');
						onCancel();
					} else {
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => {
					console.error(err);
				});
		}
	});
};

onActivated(() => {
	getTableData();
});
</script>
<style scoped lang="scss">
.certificate-management-container :deep(.search-box .el-card__body) {
	padding: 30px 30px 0px 30px;
}
</style>
