<template>
	<div class="key-generation-dialog-container">
		<el-dialog title="生成密钥" v-model="state.dialog.isShowDialog" width="760px" @close="closeDialog">
			<el-form ref="keyDialogFormRef" :model="state.ruleForm" :rules="rules" size="large" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="密钥名称" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="请输入密钥名称" maxlength="30" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="密钥类型" prop="type">
							<el-select placeholder="请选择密钥类型" v-model="state.ruleForm.type" size="large" clearable>
								<el-option v-for="(value, key) in typeMap" :key="key" :label="value" :value="key"></el-option
							></el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="私钥份额" prop="share">
							<el-input v-model.number="state.ruleForm.share" placeholder="请输入私钥份额" maxlength="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="解密份额" prop="thresholdValue">
							<el-input v-model.number="state.ruleForm.thresholdValue" placeholder="请输入解密份额" maxlength="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="state.ruleForm.remark" placeholder="请输入备注" type="textarea" :rows="5" maxlength="200"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<img src="../../../assets/thresholdKey/2.png" style="width: 100%" />
						<img src="../../../assets/thresholdKey/3.png" style="width: 100%" />
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="keyGenerationDialog">
import { reactive, ref } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { setThreshold } from '@/api/thresholdKey/keyGeneration';

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
		name: '',
		type: '',
		remark: '',
		share: '' as unknown as number,
		thresholdValue: '',
	},
	dialog: {
		isShowDialog: false,
	},
	secretType: '',
	identityTypeList: [] as Array<IdentityTypeListType>,
});
const typeMap = {
	1: '加密',
	2: '签名',
};
const checkThresholdValue = (rule: any, value: any, callback: any) => {
	console.log(value);
	if (value === '') {
		callback(new Error('请输入密钥份额'));
	} else if (value >= 2 && value <= state.ruleForm.share) {
		callback();
	} else {
		if (state.ruleForm.share === 2) {
			callback(new Error('密钥份额可输入2份'));
		} else {
			callback(new Error(`密钥份额可输入2-${state.ruleForm.share}份`));
		}
	}
};
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入密钥名称', trigger: 'blur' }],
	type: [{ required: true, message: '请输入密钥类型', trigger: 'change' }],
	share: [
		{ required: true, message: '请输入私钥份额', trigger: 'blur' },
		{ type: 'number', min: 2, max: 10, message: '私钥份额可输入2-10份', trigger: 'blur' },
	],
	thresholdValue: [{ required: true, validator: checkThresholdValue, trigger: 'blur' }],
});

const formReset = () => {
	keyDialogFormRef.value?.resetFields();
	state.ruleForm.remark = '';
};

// 打开弹窗
const openDialog = () => {
	formReset();
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};

// 取消
const onCancel = () => {
	state.dialog.isShowDialog = false;
	closeDialog();
};

const onSubmit = () => {
	keyDialogFormRef.value?.validate((valid) => {
		if (valid) {
			setThreshold({
				...state.ruleForm,
			})
				.then((res) => {
					if (res.resultCode === 0) {
						closeDialog();
						ElMessage.success('新增成功');
						emit('refresh');
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

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.key-generation-dialog-container {
	.el-select,
	.el-select-v2 {
		width: 100%;
	}

	.el-select .el-input {
		width: 100%;
	}
}

.el-divider--horizontal {
	margin-top: 0px;
}
</style>
