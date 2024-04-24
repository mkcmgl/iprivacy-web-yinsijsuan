<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :close-on-click-modal="false">
			<el-form ref="roleDialogFormRef" :model="state.nodeForm" :rules="rules" size="large" label-position="left" label-width="100px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="节点名称" prop="nodeName">
							<el-input v-model="state.nodeForm.nodeName" placeholder="请输入节点名称" maxlength="30" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="节点IP" prop="nodeIp">
							<el-input v-model="state.nodeForm.nodeIp" placeholder="请输入节点IP" maxlength="30" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="节点端口" prop="nodePort">
							<el-input v-model="state.nodeForm.nodePort" placeholder="请输入节点端口" maxlength="30" clearable></el-input>
						</el-form-item>
					</el-col>
					<div v-if="state.dialog.type == 'edit'" style="width: 100%">
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
							<el-form-item label="激活状态" prop="activationStatus">
								<el-switch
									size="default"
									:active-value="1"
									:inactive-value="0"
									:disabled="state.nodeForm.onlineStatus == 0"
									v-model="state.nodeForm.activationStatus"
								/>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
							<el-form-item label="在线状态" prop="onlineStatus">
								<div class="align-center">
									<div
										class="mg-r-2"
										:class="{
											'round-green': state.nodeForm.onlineStatus == 1,
											'round-red': state.nodeForm.onlineStatus == 0,
										}"
									/>
									<div>{{ state.nodeForm.onlineStatus == 0 ? '离线' : '在线' }}</div>
								</div>
							</el-form-item>
						</el-col>
					</div>
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

<script setup lang="ts" name="addNode">
import { reactive, ref, nextTick, getCurrentInstance, onMounted, onUpdated } from 'vue';
import { ElMessage, FormInstance, FormRules,  } from 'element-plus';
import { ElTree } from 'element-plus';

import { addNode, nodeDetail, editNode } from '@/api/nodeManage';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import {  RowRoleType, TreeType } from '@/types/views';

// 定义变量内容
const roleDialogFormRef = ref<FormInstance>();
const menu = ref<InstanceType<typeof ElTree>>();
const state = reactive({
	nodeForm: {
		nodeId: '',
		nodeName: '',
		nodeIp: '',
		nodePort: '',
		name: '', // 
		roleKey: '', // 
		keys: [] as string[],
		sort: 0, // 排序
		status: 0, // 
		remark: '' as string | null, //
		fileId: '',
		onlineStatus: -1,
		activationStatus: '',
	},
	menuData: [] as TreeType[],
	menuProps: {
		children: 'children',
		label: 'name',
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
	},
});

const tableData = ref([
	{
		data: '2016-05-03',
		msg: 'Tom',
		dataType: 'No. 189, Grove St, Los Angeles',
	},
]);



const equalToEmpty = (rule: any, value: any, callback: any) => {
	if (/^\s+$/gi.test(value)) {
		callback(new Error('不能全输入空格'));
	} else {
		callback();
	}
};

const dataName = (rule: any, value: any, callback: any) => {
	if (!/^(?=.*[a-zA-Z])(?=.*[\d_-])[a-zA-Z\d_-]{6,32}$/.test(value)) {
		callback(new Error('6-32个字符，只能由英文字母、数字及‘_’‘-’组成'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules>({
	nodeName: [
		{ required: true, message: '请输入节点名称', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ required: true, validator: dataName, trigger: 'blur' },
	],
	nodeIp: [
		{ required: true, message: '请输入节点IP', trigger: 'change' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ min: 1, max: 20, message: '长度在1-20之间', trigger: 'blur' },
	],
	nodePort: [
		{ required: true, message: '请输入节点IP', trigger: 'change' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ min: 1, max: 20, message: '长度在1-20之间', trigger: 'blur' },
	],
	activationStatus: [{ required: true, message: '请输入节点IP', trigger: 'change' }],
	onlineStatus: [{ required: true, message: '请输入节点IP', trigger: 'change' }],
});
const formReset = () => {
	state.nodeForm = {
		nodeId: '',
		nodeName: '',
		nodeIp: '',
		nodePort: '',
		name: '', // 
		roleKey: '', 
		keys: [] as string[],
		sort: 1, // 排序
		status: 0, // 
		remark: '', // 
		fileId: '', //
		onlineStatus: -1,
		activationStatus: '',
	};
	roleDialogFormRef.value?.resetFields();
};


onUpdated(() => {
	isEdit();
});
const isEdit = () => {
	// if (state.dialog.type === 'edit') {
	// }
};
// 打开弹窗
const openDialog = (type: string, row: RowRoleType) => {
	roleDialogFormRef.value?.clearValidate();
	state.dialog.type = type;
	if (type === 'edit') {
		console.log(`output->row`, row);
		state.nodeForm = JSON.parse(JSON.stringify(row));
		state.dialog.title = '编辑数据';
	} else {
		state.dialog.title = '添加数据';
		// 清空表单，此项需加表单验证才能使用
		nextTick(() => {
			formReset();
		});
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
	roleDialogFormRef.value?.validate((valid) => {
		if (valid) {
			if (state.dialog.type === 'add') {
				addNode({
					nodeName: state.nodeForm.nodeName,
					nodeIp: state.nodeForm.nodeIp,
					nodePort: state.nodeForm.nodePort,
				})
					.then((res: any) => {
						console.log(`output->res`, res);
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('新增成功');
							emit('refresh');
						} else {
							ElMessage.warning(res.resultDesc);
						}
					})
					.catch((err: any) => {
						console.log(err);
						closeDialog();
					});
			} else {
				console.log(`output->`, state.nodeForm);
				editNode({
					nodeName: state.nodeForm.nodeName,
					nodeId: state.nodeForm.nodeId,
					nodeIp: state.nodeForm.nodeIp,
					nodePort: state.nodeForm.nodePort,
					activationStatus: state.nodeForm.activationStatus,
					onlineStatus: state.nodeForm.onlineStatus,
				})
					.then((res) => {
						console.log(`output->res`, res);
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('编辑成功');
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
.dataKey {
	display: flex;
	width: 100%;
	justify-content: end;
	.span-blue {
		color: #2d8cf0;
		margin-right: 10px;
	}
}
.upload-text {
	::v-deep(.el-upload-list) {
		display: none;
	}
}
.upload-demo {
	width: 100%;
	margin-top: 20px;
}
</style>
