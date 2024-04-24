<template>
    <div class="system-role-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" style="height: 500px;"  >
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="date" label="序号" width="80" />
                <el-table-column prop="name" label="项目名称" width="180" />
                <el-table-column prop="address" label="发起机构" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
            </el-table>

        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="dataManageAuthDialog">
import { reactive, ref, nextTick, getCurrentInstance } from 'vue';
import { getMenuTree } from '@/api/menu';
import { setRole, updateRole } from '@/api/system/role';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ElTree } from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node';
import { isArray } from 'lodash';
import { deepClone } from '@/utils/other';
const { proxy } = getCurrentInstance() as any;
import { UploadFilled } from '@element-plus/icons-vue'
import { RowRoleType, TreeType } from '@/types/views';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const roleDialogFormRef = ref<FormInstance>();
const menu = ref<InstanceType<typeof ElTree>>();
const state = reactive({
    ruleForm: {
        id: '',
        name: '', // 角色名称
        roleKey: '', // 角色标识
        keys: [] as string[],
        sort: 0, // 排序
        status: 0, // 角色状态 0正常 1停用
        remark: '' as string | null, // 角色描述
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
        date: '20',
        name: '测试项目',
        address: '浪潮工业互联网股份有限公司',
        createTime:'2023-10-26  16:12:38'
    },

]);
const value = ref('');
const options = [
    {
        value: 'Option1',
        label: 'Option1',
    },
    {
        value: 'Option2',
        label: 'Option2',
    },
    {
        value: 'Option3',
        label: 'Option3',
    },
    {
        value: 'Option4',
        label: 'Option4',
    },
    {
        value: 'Option5',
        label: 'Option5',
    },
]
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 1, max: 30, message: '长度在1-30之间', trigger: 'blur' },
    ],
    roleKey: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
    status: [{ required: true, message: '请选择角色状态', trigger: 'change' }],
    sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
});
const formReset = () => {
    state.ruleForm = {
        id: '',
        name: '', //
        roleKey: '', // 
        keys: [] as string[],
        sort: 1, // 排序
        status: 0, // 
        remark: '', // 
    };
    roleDialogFormRef.value?.resetFields();
};
// 打开弹窗
const openDialog = (type: string, row: RowRoleType) => {
    roleDialogFormRef.value?.clearValidate();
    state.dialog.type = type;
    if (type === 'auth') {
        state.ruleForm = JSON.parse(JSON.stringify(row));
        state.dialog.title = '授权详情';
    } else if (type === 'use') {
        state.dialog.title = '使用详情';
          state.ruleForm = JSON.parse(JSON.stringify(row));
        // 清空表单，此项需加表单验证才能使用

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
                setRole({
                    name: state.ruleForm.name,
                    roleKey: state.ruleForm.roleKey,
                    sort: state.ruleForm.sort,
                    remark: state.ruleForm.remark,
                    keys: getMenuAllCheckedKeys(),
                    status: state.ruleForm.status,
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
                updateRole({
                    name: state.ruleForm.name,
                    roleKey: state.ruleForm.roleKey,
                    sort: state.ruleForm.sort,
                    remark: state.ruleForm.remark,
                    keys: getMenuAllCheckedKeys(),
                    status: state.ruleForm.status,
                    id: state.ruleForm.id,
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
</style>
