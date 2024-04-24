<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="userDialogFormRef" :model="state.ruleForm" :rules="rules" size="large" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="账号" prop="account">
							<el-input v-model="state.ruleForm.account" placeholder="请输入账号" maxlength="30" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="名称" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="请输入名称" maxlength="30" clearable></el-input>
						</el-form-item>
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

<script setup lang="ts" name="systemRoleDialog">
import { reactive, ref, nextTick, getCurrentInstance } from 'vue';
import { saveUser } from '@/api/SM2/user';
import { setRole, updateRole } from '@/api/system/role';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ElTree } from 'element-plus';
import { isArray } from 'lodash';
import { deepClone } from '@/utils/other';
const { proxy } = getCurrentInstance() as any;

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const userDialogFormRef = ref<FormInstance>();
const state = reactive({
	ruleForm: {
		account: '', // 账号
		name: '', // 名称
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
	},
});
const rules = reactive<FormRules>({
	account: [
		{ required: true, message: '请输入账号', trigger: 'blur' },
		{ min: 2, max: 20, message: '长度在2-20之间', trigger: 'blur' },
		{ pattern: /^[A-Za-z0-9]+$/, message: '账号由数字字母构成', trigger: 'blur' },
	],
	name: [
		{ required: true, message: '请输入名称', trigger: 'blur' },
		{ min: 2, max: 20, message: '长度在2-20之间', trigger: 'blur' },
		{ pattern: /^[A-Za-z0-9]+$/, message: '名称由数字字母构成', trigger: 'blur' },
	],
});
const formReset = () => {
	state.ruleForm = {
		account: '',
		name: '', // 角色名称
	};
	userDialogFormRef.value?.resetFields();
};
// 打开弹窗
const openDialog = (type: string, row: RowRoleType) => {
	userDialogFormRef.value?.clearValidate();
	state.dialog.type = type;
	state.dialog.title = '添加用户';
	// 清空表单，此项需加表单验证才能使用
	nextTick(() => {
		formReset();
	});
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
	userDialogFormRef.value?.validate((valid) => {
		if (valid) {
			saveUser({
				account: state.ruleForm.account,
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
					console.log(err);
					closeDialog();
				});
		}
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.system-role-dialog-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
