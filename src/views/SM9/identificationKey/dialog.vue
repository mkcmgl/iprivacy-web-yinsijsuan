<template>
	<div class="identification-key-dialog-container">
		<el-dialog title="生成标识密钥" v-model="state.dialog.isShowDialog" width="1080px" @close="closeDialog">
			<div class="search-box clearfix">
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
				<div class="fl mb30">
					<div class="search-name">标识</div>
					<el-input placeholder="请输入标识" v-model="state.handle" maxlength="100" size="large"></el-input>
				</div>

				<div class="fr mb30">
					<el-button type="primary" size="large" @click="generate()" :loading="state.loading">
						<el-icon v-if="!state.loading">
							<ele-Van />
						</el-icon>
						<span>生成</span>
					</el-button>
				</div>
			</div>

			<el-tabs class="demo-tabs">
				<el-tab-pane label="加解密场景">
					<el-form :model="state.ruleForm" :rules="rules" size="large" label-width="110px">
						<el-form-item label="加解密主公钥">
							<div class="form-flex">
								<el-input type="textarea" :rows="2" readonly v-model="state.ruleForm.encrypt_pk" class="mr30"></el-input>
								<el-button type="primary" @click="copyCiphertext(state.ruleForm.encrypt_pk)">复制</el-button>
							</div>
						</el-form-item>
						<el-form-item label="解密标识密钥">
							<div class="form-flex">
								<el-input type="textarea" :rows="3" readonly v-model="state.ruleForm.encrypt_usk" class="mr30"></el-input>
								<el-button type="primary" @click="copyCiphertext(state.ruleForm.encrypt_usk)">复制</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="签名场景">
					<el-form :model="state.ruleForm" :rules="rules" size="large" label-width="110px">
						<el-form-item label="签名主公钥">
							<div class="form-flex">
								<el-input type="textarea" :rows="2" readonly v-model="state.ruleForm.sign_pk" class="mr30"></el-input>
								<el-button type="primary" @click="copyCiphertext(state.ruleForm.sign_pk)">复制</el-button>
							</div>
						</el-form-item>
						<el-form-item label="签名标识密钥">
							<div class="form-flex">
								<el-input type="textarea" :rows="3" readonly v-model="state.ruleForm.sign_usk" class="mr30"></el-input>
								<el-button type="primary" @click="copyCiphertext(state.ruleForm.sign_usk)">复制</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>

			<el-table :data="state.tableData" v-loading="state.loading" class="mt30" style="width: 100%">
				<el-table-column prop="typeName" label="类型名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="handle" label="标识" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="生成时间" show-overflow-tooltip></el-table-column>
			</el-table>
			<Pagination
				:total="state.total"
				v-model:page="state.pageNum"
				v-model:limit="state.pageSize"
				:background="false"
				@pagination="getGenerateHistoryList()"
			/>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="identificationTypeDialog">
import { reactive, ref, getCurrentInstance } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { getIdentityTypeAllList, createIdentificationKeySecret, getHistoryList } from '@/api/SM9/identificationKey';
import commonFunction from '@/utils/commonFunction';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const keyDialogFormRef = ref<FormInstance>();
const state = reactive({
	identityTypeId: '',
	handle: '',
	pageSize: 5,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
	ruleForm: {
		encrypt_pk: '',
		encrypt_usk: '',
		sign_pk: '',
		sign_usk: '',
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
	},
	secretType: '',
	identityTypeList: [] as Array<IdentityTypeListType>,
});
const rules = reactive<FormRules>({
	identificationType: [{ required: true, message: '请输入标识类型', trigger: 'blur' }],
});

const formReset = () => {
	state.identityTypeId = '';
	state.handle = '';
	state.tableData = [];
	state.pageSize = 5;
	state.pageNum = 1;
	state.ruleForm = {
		encrypt_pk: '',
		encrypt_usk: '',
		sign_pk: '',
		sign_usk: '',
	};
};

// 打开弹窗
const openDialog = (type: string, id: string) => {
	keyDialogFormRef.value?.clearValidate();
	formReset();
	state.dialog.type = type;
	getIdentityTypeList();
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	emit('refresh');
};

const generate = () => {
	if (!state.identityTypeId) {
		ElMessage.warning('请选择标识类型');
		return false;
	}
	if (!state.handle) {
		ElMessage.warning('请输入标识');
		return false;
	}
	state.loading = true;
	createIdentificationKeySecret({
		identityTypeId: state.identityTypeId,
		handle: state.handle,
		pageNum: state.pageNum,
		pageSize: state.pageSize,
	})
		.then((res) => {
			state.loading = false;
			if (res.resultCode === 0) {
				// state.tableData = res.data.secret_history.data;
				// state.total = res.data.secret_history.total;
				({ ...state.ruleForm as any } = { ...res.data });
				getGenerateHistoryList();
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			console.error(err);
		});
};

const getGenerateHistoryList = () => {
	getHistoryList({
		handle: state.handle,
		identityTypeId: state.identityTypeId,
		pageNum: state.pageNum,
		pageSize: state.pageSize,
	})
		.then((res) => {
			state.tableData = res.data.data;
			state.total = res.data.total;
		})
		.catch((err) => {
			console.error(err);
		});
};

const getIdentityTypeList = () => {
	getIdentityTypeAllList({
		state: 0,
	})
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

const copyCiphertext = (content: string) => {
	if (content) commonFunction().copyText(content);
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.el-divider--horizontal {
	margin-top: 0px;
}

.form-flex {
	display: flex;
	justify-content: space-between;
	width: 100%;
}
</style>
