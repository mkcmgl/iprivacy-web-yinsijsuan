getDataType
<template>
	<div class="system-role-dialog-container">
		<el-dialog  :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="1000px" :close-on-click-modal="false">
			<el-form  ref="roleDialogFormRef" :model="state.ruleForm" :rules="rules" size="large" label-position="left" label-width="100px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="节点名称" prop="nodeId">
							<el-select
								:disabled="isEditPage"
								v-model="state.ruleForm.nodeId"
								clearable
								placeholder="请选择节点名称"
								style="width: 100%"
							>
								<el-option v-for="item in nodeListOptions" :key="item.nodeId" :label="item.nodeName" :value="item.nodeId" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="数据名称" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="请输入数据名称" maxlength="30" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="数据格式" prop="typeId">
							<el-select
								:disabled="isEditPage"
								v-model="state.ruleForm.typeId"
								clearable
								placeholder="请选择数据格式"
								style="width: 100%"
							>
								<el-option v-for="item in dataModel" :key="item.id" :label="item.dictValue" :value="item.id" />
							</el-select>
							<el-upload
								class="upload-demo"
								:on-success="handleSuccess"
								drag
								limit="1"
								:action="_ACTIONURL_"
								multiple
								v-if="!isEditPage"
							>
								<el-icon class="el-icon--upload"><upload-filled /></el-icon>
								<div class="el-upload__text">点击或拖拽数据文件到此处</div>
							</el-upload>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="数据描述">
							<el-input
								v-model="state.ruleForm.description"
								type="textarea"
								placeholder="请输入角色描述,300字内"
								maxlength="300"
								show-word-limit
							></el-input>
						</el-form-item>
					</el-col>

					<el-col v-if="isEditPage" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-row :gutter="20" class="data-container">
							<el-col  :span="24">
								<!-- <EditResourceTable border height="500" :data="fieldList" :is-edit-page="isEditPage" @change="handleResourceChange" /> -->
								<el-table :data="fieldList" class="table-list"  v-loading="fieldListLoading">
									<el-table-column align="center" label="字段名称" prop="name" />
									<el-table-column align="center" label="数据类型" prop="type">
										<template #default="scope">
											<el-select v-model="scope.row.type" size="mini" placeholder="请选择" >
												<el-option v-for="item in fieldTypeList" :key="item.value" :label="item.label" :value="item.label" />
											</el-select>
										</template>
									</el-table-column>
									<el-table-column align="center" label="描述" prop="fieldDesc">
										<template #default="scope">
											<el-input
												v-model="scope.row.description"
												size="mini"
												:maxlength="12"
												placeholder="请输入描述"
												show-word-limit
											/>
										</template>
									</el-table-column>
								</el-table>
							</el-col>
						</el-row>
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

<script setup lang="ts" name="addDataManageDialog">
import { reactive, ref, nextTick, getCurrentInstance, onUpdated, defineAsyncComponent } from 'vue';
import { getMenuTree } from '@/api/menu';
import { setRole, updateRole } from '@/api/system/role';
import { ElMessage, FormInstance, FormRules, ElMessageBox } from 'element-plus';
import { ElTree } from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node';
import { isArray } from 'lodash';
import { deepClone } from '@/utils/other';
import { dataDetail, dataFilePreview, getDataType, nodeList, saveData ,editData} from '@/api/dataManage';
const { proxy } = getCurrentInstance() as any;
import { UploadFilled } from '@element-plus/icons-vue';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import type { UploadProps, UploadUserFile } from 'element-plus';
import { DataModelList, NodeOptionsListType, RowRoleType, TreeType } from '@/types/views';

const EditResourceTable = defineAsyncComponent(() => import('@/components/EditResourceTable/index.vue'));
const ResourcePreviewTable = defineAsyncComponent(() => import('@/components/ResourcePreviewTable/index.vue'));
// import ResourcePreviewTable from '@/components/ResourcePreviewTable'
// 定义变量内容
const roleDialogFormRef = ref<FormInstance>();
const menu = ref<InstanceType<typeof ElTree>>();
const fieldListLoading = ref(false);
const isEditPage = ref(false);
const dataList = ref([]);
const fieldList = ref([]);
const _ACTIONURL_ = location.origin + '/iprivacy230/api/privacy/data/upload';

const fieldTypeList = ref([{
	value: 0,
	label: 'String'
}, {
	value: 1,
	label: 'Integer'
}, {
	value: 2,
	label: 'Double'
}, {
	value: 3,
	label: 'Long'
}, {
	value: 5,
	label: 'Boolean'
	}]
);
const state = reactive({
	ruleForm: {
		id: '',
		description: '',
		nodeId: '',
		name: '',
		typeId: '',
		roleKey: '',
		fileList: [],
		keys: [] as string[],
		sort: 0, // 排序

		remark: '' as string | null, // 角色描述
		fileId: '',
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
const value = ref('');
const nodeListOptions = ref(<NodeOptionsListType>[]);

const fileList = ref<UploadUserFile[]>([]);

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
	console.log(file, uploadFiles);
};

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
	console.log(uploadFile);
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length} totally`);
};

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
	return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
		() => true,
		() => false
	);
};

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
	nodeId: [{ required: true, message: '请选择节点名称' }],
	name: [
		{ required: true, message: '请输入数据名称', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ required: true, validator: dataName, trigger: 'blur' },
	],
	typeId: [{ required: true, message: '请选择角色状态', trigger: 'change' }],
	sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
});
const formReset = () => {
	state.ruleForm = {
		id: '',
		nodeId: '',
		description: '',
		typeId: '',
		name: '', //
		fileList: [],
		roleKey: '',
		keys: [] as string[],
		sort: 1,

		remark: '',
		fileId: '', //
	};
	roleDialogFormRef.value?.resetFields();
};

const dataModel = ref(<DataModelList>[]);
onUpdated(() => {
	getDataTypeList();
	getNodeList();
	// console.log(`output->location`, location);
});
const getDataTypeList = () => {
	getDataType({ code: 'dataModel' }).then((res) => {
		console.log(`output->res`, res);
		dataModel.value = res.data;
		console.log(`output->dataModel`, dataModel.value);
	});
};
const getNodeList = () => {
	nodeList().then((res) => {
		console.log(`output->res`, res);
		nodeListOptions.value = res.data;
		console.log(`output->`, nodeListOptions.value);
	});
};

const getDataDetail = (id: string) => {
	fieldListLoading.value = true;
	dataDetail({ dataId: id }).then((res: any) => {
		state.ruleForm = res.data;
		state.ruleForm.typeId = Number(res.data.typeId);
		dataList.value = res.data.previewData;
		fieldList.value = res.data.fieldList;
		fieldListLoading.value = false;
		console.log(`output->dataDetailMsg`, state.ruleForm);
		// fieldListLoading.value = true;
		// dataFilePreview({ fileId: dataDetailMsg.value.fileId }).then((res: any) => {
		// 	console.log(`output->res`, res);
		// 	dataList.value = res.data.dataList;
		// 	fieldList.value = res.data.fieldList;
		// 	console.log(`output->fileList.value`, dataList.value, fieldList.value);
		// 	fieldListLoading.value = false;
		// });
	});
};
// 打开弹窗
const openDialog = (type: string, row: RowRoleType) => {
	roleDialogFormRef.value?.clearValidate();
	state.dialog.type = type;
	if (type === 'edit') {
		console.log(`output->row`, row);
		getDataDetail(row.id);

		state.dialog.title = '编辑数据';
		isEditPage.value = true;
	} else {
		state.dialog.title = '添加数据';
		isEditPage.value = false;
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
				saveData({
					name: state.ruleForm.name,
					nodeId: state.ruleForm.nodeId,
					description: state.ruleForm.description,
					typeId: state.ruleForm.typeId,
					fileId: state.ruleForm.fileId,
					fieldList: state.ruleForm.fileList,
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
			} else {
				console.log(`output->state.ruleForm`, state.ruleForm, fieldList.value);
				editData({
					id: state.ruleForm.id,
					name: state.ruleForm.name,
					description: state.ruleForm.description,
					fieldList: fieldList.value,
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
						console.log(err);
						closeDialog();
					});
			}
		}
	});
};

const onAddDataTable = () => {
	tableData.value.push(<any>[]);
};

const handleSuccess = (file: any) => {
	console.log(`output->file`, file);
	state.ruleForm.fileId = file.data.id;
	// state.ruleForm.fileList.push(file.data);
	// dataFilePreviewList();
};
const dataFilePreviewList = () => {
	fieldListLoading.value = true;
	dataFilePreview({ fileId: state.ruleForm.fileId }).then((res: any) => {
		console.log(`output->res`, res);
		dataList.value = res.data.dataList;
		fieldList.value = res.data.fieldList;
		console.log(`output->fileList.value`, dataList.value, fileList.value);
		fieldListLoading.value = false;
	});
};
const handleResourceChange = (data: any) => {
	fieldList.value = data;
	//   this.dataForm.fieldList = this.formatParams()
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
