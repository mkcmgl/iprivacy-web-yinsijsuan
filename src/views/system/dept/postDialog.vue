<template>
	<div class="system-post-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="postDialogFormRef" :rules="rules" :model="state.ruleForm" size="large" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="岗位名称" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="请输入岗位名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="岗位编码" prop="code">
							<el-input v-model="state.ruleForm.code" placeholder="请输入岗位编码" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="状态" prop="status">
							<el-switch
								v-model="state.ruleForm.status"
								inline-prompt
								active-value="0"
								inactive-value="1"
								active-text="启用"
								inactive-text="禁用"
							></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="隶属组织" prop="orgId">
							<el-cascader
								:options="state.deptData"
								:props="{ checkStrictly: true, expandTrigger: 'hover', emitPath: false, value: 'id', label: 'name', children: 'children' }"
								placeholder="请选择组织"
								clearable
								class="w100"
								v-model="state.ruleForm.orgId"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="岗位权限">
							<el-tree ref="menu" :data="state.menuData" :props="state.menuProps" node-key="id" check-strictly show-checkbox class="menu-data-tree"  @check="nodeClick" />
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

<script setup lang="ts" name="systemPostDialog">
import { reactive, ref } from 'vue';
import { getMenuTree } from '@/api/menu';
import { addPosition, editPosition, getOrgTreeList } from '@/api/system/dept';
import { ElMessage, FormInstance, FormRules, ElTree } from 'element-plus';
import { isArray } from 'lodash';
import { deepClone } from '@/utils/other';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const postDialogFormRef = ref<FormInstance>();
const menu = ref<InstanceType<typeof ElTree>>();

const state = reactive({
	ruleForm: {
		id: '',
		name: '', // 岗位名称
		code: '', // 岗位编码
		status: '0', // 状态
		orgId: '', // 隶属组织
		menuIds: [] as string[], //岗位权限
	},
	menuData: [] as TreeType[],
	menuProps: {
		children: 'children',
		label: 'name',
	},
	deptData: [] as OrgTreeType[], // 部门数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		orgId: '',
	},
});
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
	code: [
		{ required: true, message: '请输入岗位编码', trigger: 'blur' },
		{ pattern: /^[A-Za-z0-9]+$/, message: '岗位编码由数字，字母构成', trigger: 'blur' },
	],
	status: [{ required: true, message: '请选择状态', trigger: 'change' }],
	orgId: [{ required: true, message: '请选择组织', trigger: 'change' }],
});
const formReset = () => {
	state.ruleForm = {
		id: '',
		name: '', // 岗位名称
		code: '', // 岗位编码
		status: '0', // 状态
		orgId: '', // 隶属组织
		menuIds: [] as string[], //岗位权限
	};
};

// 打开弹窗
const openDialog = (type: string, orgId: string = '', row: RowPostType) => {
	postDialogFormRef.value?.clearValidate();
	state.dialog.type = type;
	state.dialog.orgId = orgId;
	if (type === 'edit') {
		state.ruleForm = JSON.parse(JSON.stringify(row));
		state.dialog.title = '编辑岗位';
	} else {
		state.dialog.title = '新增岗位';
		formReset();
	}
	state.dialog.isShowDialog = true;
	getMenuData();
	getOrgTableData();
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};

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

// 所有菜单节点数据
const getMenuAllCheckedKeys = () => {
	// 目前被选中的菜单节点
	let checkedKeys = menu.value?.getCheckedKeys();
	// 半选中的菜单节点
	let halfCheckedKeys = menu.value?.getHalfCheckedKeys();
	if (isArray(halfCheckedKeys)) {
		checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys);
	}
	return checkedKeys;
};
// 提交
const onSubmit = () => {
	postDialogFormRef.value?.validate((valid) => {
		if (valid) {
			if (state.dialog.type === 'add') {
				addPosition({
					orgId: state.ruleForm.orgId,
					code: state.ruleForm.code,
					name: state.ruleForm.name,
					status: state.ruleForm.status,
					menus: getMenuAllCheckedKeys(),
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
				editPosition({
					id: state.ruleForm.id,
					orgId: state.ruleForm.orgId,
					code: state.ruleForm.code,
					name: state.ruleForm.name,
					status: state.ruleForm.status,
					menus: getMenuAllCheckedKeys(),
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
// 获取菜单结构数据
const getMenuData = () => {
	state.menuData = [];
	getMenuTree({})
		.then((res) => {
			state.menuData = res.data.records;
			menu.value?.setCheckedKeys(state.ruleForm.menuIds, false);
		})
		.catch((err) => {
			console.log(err);
		});
};

const nodeClick = (currentObj: any, treeStatus: any) => {
	// 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
	let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中,>=0为选中
	// 选中
	if (selected !== -1) {
		// 子节点只要被选中父节点就被选中(需要选中父节点时候调用此方法)
		selectedParent(currentObj)
		// 统一处理子节点为相同的勾选状态
		uniteChildSame(currentObj, true)
	} else {
			// 未选中 处理子节点全部未选中
		if (currentObj.children.length !== 0) {
			uniteChildSame(currentObj, false)
		}
	}
};

// 统一处理子节点为相同的勾选状态
const uniteChildSame = (treeList: any, isSelected: any) => {
	menu.value?.setChecked(treeList.id, isSelected, false)
	for (let i = 0; i < treeList.children.length; i++) {
		uniteChildSame(treeList.children[i], isSelected)
	}
};

// 统一处理父节点为选中
const selectedParent = (currentObj: any) => {
	let currentNode: any | undefined = menu.value?.getNode(currentObj)
	if (currentNode.parent.key !== undefined) {
		menu.value?.setChecked(currentNode.parent, true, false)
		selectedParent(currentNode.parent)
	}
};


// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style>
.menu-data-tree {
	width: 100%;
	border: 1px solid var(--el-border-color);
	border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
	padding: 5px;
}
</style>
