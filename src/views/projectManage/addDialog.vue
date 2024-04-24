<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :close-on-click-modal="false">
			<el-form ref="roleDialogFormRef" :model="state.ruleForm" :rules="rules" size="large" label-position="left" label-width="100px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="项目名称" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="请输入数据名称" maxlength="30" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="项目描述">
							<el-input
								v-model="state.ruleForm.description"
								type="textarea"
								placeholder="请输入角色描述,300字内"
								maxlength="300"
								show-word-limit
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<span class="title-weight">协作机构</span>

						<div class="mb30">
							<div class="mg-t-20 align-center">
								<span>发起机构</span>
								<el-tooltip class="box-item" effect="dark" content="发起创建项目的机构" placement="right">
									<el-icon class="mg-l-10"><QuestionFilled /></el-icon>
								</el-tooltip>
							</div>
							<div class="mg-t-20 mg-l-20">
								<span>浪潮工业互联网股份有限公司</span>
							</div>
						</div>

						<!-- <div class="mb30 align-center">
							<span class="itemTipXing">协作机构</span>
							<el-tooltip class="box-item" effect="dark" content="受邀参与协作的机构" placement="right">
								<el-icon class="mg-l-10"><QuestionFilled /></el-icon>
							</el-tooltip>
						</div> -->
						<el-form-item label="协作机构" prop="partnerIds" class="el-form-flex-column">
							<el-table :data="state.ruleForm.partnerIds" border style="width: 70%">
								<el-table-column label="机构名称">
									<template #default="scope">
										<el-form-item label-width="10px">
											<el-select
												v-model="scope.row.partnerId"
												filterable
												clearable
												remote
												@change="handleSelectChange"
												reserve-keyword
												placeholder="请输入机构名称"
												:remote-method="remoteMethod"
												:loading="loading"
												style="width: 240px"
												><el-option v-for="item in options" :key="item.organizeId" :label="item.organizeName" :value="item.organizeId" />
												<template #loading>
													<svg class="circular" viewBox="0 0 50 50">
														<circle class="path" cx="25" cy="25" r="20" fill="none" />
													</svg>
												</template>
											</el-select>
										</el-form-item>
									</template>
								</el-table-column>
								<el-table-column label="操作" width="100">
									<template #default="scope">
										<el-button
											size="small"
											text
											:disabled="scope.$index == 0"
											type="primary"
											@click="onProjectDel(scope.row, scope.$index)"
											v-auth="'api:role:delete'"
											:icon="Delete"
											>删除</el-button
										>
									</template>
								</el-table-column>
							</el-table>
							<el-button size="default" :icon="Plus" style="width: 70%; margin-top: 10px" @click="addTable"> 添加协作机构</el-button>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30"> </el-col>
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

<script setup lang="ts" name="addProjectDialog">
import { reactive, ref, nextTick, watch, onMounted, onUpdated } from 'vue';
import { getMenuTree } from '@/api/menu';
import { setRole, updateRole } from '@/api/system/role';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ElTree } from 'element-plus';
import { UploadFilled, Plus, Delete } from '@element-plus/icons-vue';
import { QuestionFilled } from '@element-plus/icons-vue';
import { ProjectModelList, RowRoleType, TreeType, PartnerIdList } from '@/types/views';
import { addProject ,projectAuditList} from '@/api/projectManage';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const roleDialogFormRef = ref<FormInstance>();
const menu = ref<InstanceType<typeof ElTree>>();
const state = reactive({
	ruleForm: {
		name: '',
		description: '',
		partnerIds: [{},],
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
const tableData = ref([{}]);

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
const partnerIds = (rule: any, value: any, callback: any) => {
	if (!value[0].partnerId) {
		callback(new Error('至少需要一个协作机构'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules>({
	name: [
		{ required: true, message: '请输入项目名称', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ required: true, validator: dataName, trigger: 'blur' },
	],
	partnerIds: [{ required: true, validator: partnerIds, trigger: 'blur' },],
});
const formReset = () => {
	state.ruleForm = {
		name: '',
		description: '',
		partnerIds: [{}],
	};
	roleDialogFormRef.value?.resetFields();
};
// 打开弹窗
const openDialog = (type: string, row: RowRoleType) => {
	console.log(`output->state.ruleForm`, state.ruleForm);
	roleDialogFormRef.value?.clearValidate();
	state.dialog.type = type;
	if (type === 'edit') {
		state.ruleForm = JSON.parse(JSON.stringify(row));
		state.dialog.title = '编辑项目';
	} else {
		state.dialog.title = '创建项目';
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
const onProjectDel = (e: any, index: number) => {
	state.ruleForm.partnerIds.splice(index, 1);
};
const partnerIdList = ref<string[]>([]);
const onSubmit = () => {
	roleDialogFormRef.value?.validate((valid) => {
		if (valid) {
			console.log(`output->state.ruleForm`, state.ruleForm, tableData);
			state.ruleForm.partnerIds.forEach((item) => { 
				partnerIdList.value.push((item as PartnerIdList).partnerId)
			})
			if (state.dialog.type === 'add') {
				addProject({
					name: state.ruleForm.name,
					description: state.ruleForm.description,
					partnerIds: partnerIdList.value,
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
				// updateRole({
				// 	name: state.ruleForm.name,
				// 	roleKey: state.ruleForm.roleKey,
				// 	sort: state.ruleForm.sort,
				// 	remark: state.ruleForm.remark,
				// 	keys: getMenuAllCheckedKeys(),
				// 	status: state.ruleForm.status,
				// 	id: state.ruleForm.id,
				// })
				// 	.then((res) => {
				// 		if (res.resultCode === 0) {
				// 			closeDialog();
				// 			ElMessage.success('编辑成功');
				// 			emit('refresh');
				// 		} else {
				// 			ElMessage.warning(res.resultDesc);
				// 		}
				// 	})
				// 	.catch((err) => {
				// 		console.log(err);
				// 		closeDialog();
				// 	});
			}
		}
	});
};

interface ListItem {
	organizeId: string;
	organizeName: string;
}
const options = ref<ListItem[]>([]);
const value = ref<string[]>([]);
const loading = ref(false);



onUpdated(() => {

});
const remoteMethod = (query: string) => {
	if (query) {
		loading.value = true;
projectAuditList({organizeName:query}).then((res: any) => {
	options.value = res.data;
	loading.value = false;
	});
		
	} else {
		options.value = [];
	}
};

const handleSelectChange = () => {
	console.log(`output->value.value`, value.value);
};


const addTable = () => {
	state.ruleForm.partnerIds.push(<any>[]);
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

	a {
		color: #2d8cf0;
	}
}
.itemTipXing:before {
	content: '*';
	color: var(--el-color-danger);
	margin-right: 4px;
}
.el-form-flex-column {
	flex-direction: column;
}
</style>
