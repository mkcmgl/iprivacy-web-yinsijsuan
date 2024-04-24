<template>
	<div class="identification-type-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="850px">
			<el-form ref="typeDialogFormRef" :model="state.ruleForm" :rules="rules" size="large" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="标识类型" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="请输入标识类型" maxlength="50" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="large">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="large">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="identificationTypeDialog">
import { reactive, ref } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { addIdentityType, editIdentityType } from '@/api/SM9/identificationType';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const typeDialogFormRef = ref<FormInstance>();
const state = reactive({
	ruleForm: {
		id: '',
		name: '',
	} as RowIdentificationType,
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
	},
});
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入标识类型', trigger: 'blur' }],
});

const formReset = () => {
	state.ruleForm = {
		id: '',
		name: '',
	};
};

// 打开弹窗
const openDialog = (type: string, row: RowIdentificationType) => {
	typeDialogFormRef.value?.clearValidate();
	formReset();
	state.dialog.type = type;
	if (type === 'edit') {
		state.dialog.title = '编辑标识类型';
		state.ruleForm = row;
	} else {
		state.dialog.title = '新增标识类型';
	}
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = () => {
	typeDialogFormRef.value?.validate((valid) => {
		if (valid) {
			if (state.dialog.type === 'add') {
				addIdentityType({
					name: state.ruleForm.name,
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
			} else {
				editIdentityType({
					id: state.ruleForm.id,
					name: state.ruleForm.name,
				})
					.then((res) => {
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('编辑成功');
							emit('refresh');
						} else {
							ElMessage.warning(res.resultDesc);
						}
					})
					.catch((err) => {
						console.error(err);
					});
			}
		}
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.Hidden {
	display: none;
}
</style>
