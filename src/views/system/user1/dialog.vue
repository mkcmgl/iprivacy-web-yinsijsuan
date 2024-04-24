<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="850px">
			<el-form ref="userDialogFormRef" :model="state.ruleForm" :rules="rules" size="large" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="账户名称" prop="loginName">
							<el-input v-model="state.ruleForm.loginName" placeholder="请输入账户名称" maxlength="50" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="姓名" prop="realName">
							<el-input v-model="state.ruleForm.realName" placeholder="请输入姓名" maxlength="50" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="state.ruleForm.phone" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="state.ruleForm.email" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="工号" prop="jobCode">
							<el-input v-model="state.ruleForm.jobCode" placeholder="请输入工号" maxlength="50" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="身份证号" prop="idCartCode">
							<el-input v-model="state.ruleForm.idCartCode" placeholder="请输入身份证号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="微信号" prop="weChatCode">
							<el-input v-model="state.ruleForm.weChatCode" placeholder="请输入微信号" maxlength="50" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30" v-if="state.dialog.type === 'add'">
						<el-form-item label="密码" prop="password">
							<el-input v-model="state.ruleForm.password" placeholder="请输入" type="password" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="用户状态" prop="status">
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
						<el-form-item label="部门">
							<el-cascader
								:options="state.deptData"
								:props="state.props"
								placeholder="请选择部门"
								clearable
								class="w100"
								v-model="state.ruleForm.depts"
								@change="handleChange"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="岗位">
							<el-select
								placeholder="请选择岗位"
								v-model="state.ruleForm.positions"
								multiple
								collapse-tags
								collapse-tags-tooltip
								class="w100"
							>
								<el-option v-for="item in state.ruleForm.positionList" :key="item.id" :label="item.name" :value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="角色">
							<el-select placeholder="请选择角色" multiple v-model="state.ruleForm.roles" class="w100">
								<el-option v-for="item in state.roleList" :key="item.id" :label="item.name" :value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="用户描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入用户描述" maxlength="150"></el-input>
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

<script setup lang="ts" name="systemUserDialog">
import { reactive, ref, getCurrentInstance } from 'vue';
import { addUser, editUser, getUserDetail } from '@/api/system/user';
import { getOrgTreeList, getListByDept } from '@/api/system/dept';
import { getList } from '@/api/system/role';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { verifyPasswordPowerful } from '@/utils/toolsValidate';
const { proxy } = getCurrentInstance() as any;

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const userDialogFormRef = ref<FormInstance>();
const state = reactive({
	ruleForm: {
		id: '',
		loginName: '',
		realName: '',
		idCartCode: '',
		jobCode: '',
		weChatCode: '',
		phone: '',
		email: '',
		password: '',
		status: '0',
		depts: [],
		roles: [],
		positions: [],
		remark: '',
		positionList: [],
	},
	deptData: [] as OrgTreeType[], // 部门数据
	roleList: [],
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
	},
	props: {
		value: 'id',
		label: 'name',
		children: 'children',
		multiple: true,
		checkStrictly: true,
		expandTrigger: 'hover',
		emitPath: false,
	},
});
const checkPwd = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请输入密码'));
	} else if (!verifyPasswordPowerful(value)) {
		callback(new Error('请输入数字，字母，符号(!@#$%^&)组成的8-20位字符'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules>({
	loginName: [
		{ required: true, message: '请输入账户名称', trigger: 'blur' },
		{ pattern: /^[A-Za-z0-9]{1,}$/, message: '账户名称只能包含数字，英文字母' },
	],
	realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
	idCartCode: [
		{
			pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
			message: '请输入正确的身份证号',
			trigger: 'blur',
		},
	],
	jobCode: [{ pattern: /^[0-9A-Za-z]+$/, message: '请输入正确的工号', trigger: 'blur' }],
	phone: [
		{ required: true, message: '请输入手机号', trigger: 'blur' },
		{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
	],
	weChatCode: [{ pattern: /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/, message: '请输入正确的微信号', trigger: 'blur' }],
	email: [
		{
			pattern:
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			message: '请输入正确的邮箱',
			trigger: 'blur',
		},
	],
	password: [{ required: true, validator: checkPwd, trigger: 'blur' }],
	status: [{ required: true, message: '请选择状态', trigger: 'change' }],
});
const getRoleList = () => {
	getList({
		status: '0',
	})
		.then((res) => {
			state.roleList = res.data;
		})
		.catch((err) => {
			console.log(err);
		});
};

const formReset = () => {
	state.ruleForm = {
		id: '',
		loginName: '',
		realName: '',
		idCartCode: '',
		jobCode: '',
		weChatCode: '',
		phone: '',
		email: '',
		password: '',
		status: '0',
		depts: [],
		roles: [],
		positions: [],
		remark: '',
		positionList: [],
	};
};

// 打开弹窗
const openDialog = (type: string, id: string) => {
	userDialogFormRef.value?.clearValidate();
	formReset();
	state.dialog.type = type;
	getOrgTableData();
	getRoleList();
	if (type === 'edit') {
		state.dialog.title = '编辑用户';
		getUserDetail({
			userId: id,
		})
			.then((res) => {
				state.ruleForm = res.data;
				getByDept();
			})
			.catch((err) => {
				console.log(err);
			});
	} else {
		state.dialog.title = '新增用户';
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
	userDialogFormRef.value?.validate((valid) => {
		if (valid) {
			if (state.dialog.type === 'add') {
				let pwd = state.ruleForm.password;
				pwd = proxy.$md5(pwd);
				pwd = proxy.$md5(pwd + pwd.substr(0, 8));
				addUser({
					loginName: state.ruleForm.loginName,
					realName: state.ruleForm.realName,
					idCartCode: state.ruleForm.idCartCode,
					jobCode: state.ruleForm.jobCode,
					weChatCode: state.ruleForm.weChatCode,
					email: state.ruleForm.email,
					phone: state.ruleForm.phone,
					password: pwd,
					status: state.ruleForm.status,
					depts: state.ruleForm.depts,
					roles: state.ruleForm.roles,
					positions: state.ruleForm.positions,
					remark: state.ruleForm.remark,
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
					});
			} else {
				editUser({
					loginName: state.ruleForm.loginName,
					realName: state.ruleForm.realName,
					idCartCode: state.ruleForm.idCartCode,
					jobCode: state.ruleForm.jobCode,
					weChatCode: state.ruleForm.weChatCode,
					email: state.ruleForm.email,
					phone: state.ruleForm.phone,
					status: state.ruleForm.status,
					depts: state.ruleForm.depts,
					roles: state.ruleForm.roles,
					positions: state.ruleForm.positions,
					remark: state.ruleForm.remark,
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
					});
			}
		}
	});
};
// 初始化部门数据
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

const handleChange = () => {
	state.ruleForm.positions = [];
	getByDept();
};

const getByDept = () => {
	getListByDept({
		depts: state.ruleForm.depts.join(','),
	})
		.then((res) => {
			if (res.resultCode === 0) {
				state.ruleForm.positionList = res.data;
			} else {
				ElMessage.success(res.resultDesc);
			}
		})
		.catch((err) => {
			console.log(err);
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
