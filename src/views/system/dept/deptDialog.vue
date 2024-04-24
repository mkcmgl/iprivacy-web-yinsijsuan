<template>
	<div class="system-dept-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="deptDialogFormRef" :model="state.ruleForm" :rules="rules" size="large" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="上级组织" prop="parentId">
							<el-cascader
								:options="state.deptData"
								:props="{ checkStrictly: true, expandTrigger: 'hover', emitPath: false, value: 'id', label: 'name', children: 'children' }"
								placeholder="请选择上级组织"
								clearable
								class="w100"
								v-model="state.ruleForm.parentId"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="组织名称" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="请输入组织名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="排序" prop="sort">
							<el-input-number
								v-model.number="state.ruleForm.sort"
								:min="1"
								:max="999"
								step-strictly
								controls-position="right"
								placeholder="请输入排序"
								class="w100"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="large">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="large">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemDeptDialog">
import { reactive, ref, nextTick } from 'vue';
import { addOrg, getOrgTreeList, editOrg } from '@/api/system/dept';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { deepClone } from '@/utils/other';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refreshOrg']);

// 定义变量内容
const deptDialogFormRef = ref<FormInstance>();
const state = reactive({
	ruleForm: {
		id: '',
		parentId: '',
		name: '', // 组织名称
		sort: 1, // 排序
	},
	deptData: [] as OrgTreeType[], // 部门数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
	},
});
const rules = reactive<FormRules>({
	parentId: [{ required: true, message: '请选择上级组织', trigger: 'change' }],
	name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
	sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
});

const getOrgTableData = () => {
	state.deptData = [];
	getOrgTreeList()
		.then((res) => {
			state.deptData = res.data;
		})
		.catch((err) => {
			console.log(err);
		});
};
const formReset = () => {
	state.ruleForm.id = '';
	deptDialogFormRef.value?.resetFields();
};
// 打开弹窗
const openDialog = (type: string, row: RowDeptType) => {
	deptDialogFormRef.value?.clearValidate();
	state.dialog.type = type;
	if (type === 'edit') {
		state.ruleForm = deepClone(row);
		state.dialog.title = '编辑组织结构';
	} else {
		state.dialog.title = '新增组织结构';
		nextTick(() => {
			formReset();
		});
	}
	getOrgTableData();
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
	deptDialogFormRef.value?.validate((valid) => {
		if (valid) {
			if (state.dialog.type === 'add') {
				addOrg({
					sort: state.ruleForm.sort,
					name: state.ruleForm.name,
					parentId: state.ruleForm.parentId,
				})
					.then((res) => {
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('新增成功');
							emit('refreshOrg');
						} else {
							ElMessage.warning(res.resultDesc);
						}
					})
					.catch((err) => {
						console.log(err);
						closeDialog();
					});
			} else {
				editOrg({
					id: state.ruleForm.id,
					sort: state.ruleForm.sort,
					name: state.ruleForm.name,
					parentId: state.ruleForm.parentId,
				})
					.then((res) => {
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('修改成功');
							emit('refreshOrg');
						} else {
							ElMessage.warning(res.resultDesc);
						}
					})
					.catch((err) => {
						console.log(err);
						closeDialog();
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
