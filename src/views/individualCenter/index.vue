<template>
	<div class="individual-center-container layout-padding">
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>个人信息</span>
				</div>
			</template>
			<el-row>
				<el-col :span="24">
					<el-form :model="state.form" label-width="150px">
						<el-form-item label="账号名称">
							<span>{{ state.form.loginName }}</span>
						</el-form-item>
						<el-form-item label="姓名">
							<span>{{ state.form.realName }}</span>
						</el-form-item>
						<el-form-item label="密码">
							<el-button type="primary" link @click="onOpenChangePwd()">修改密码</el-button>
						</el-form-item>
						<el-form-item label="手机号">
							<span class="mr10">{{ state.form.phone }}</span>
							<el-button type="primary" link @click="onOpenChangePhone()">修改手机号</el-button>
						</el-form-item>
						<el-form-item label="邮箱">
							<span>{{ state.form.email }}</span>
						</el-form-item>
						<el-form-item label="工号">
							<span>{{ state.form.jobCode }}</span>
						</el-form-item>
						<el-form-item label="微信号">
							<span>{{ state.form.weChatCode }}</span>
						</el-form-item>
						<el-form-item label="所属部门">
							<div>
								<div v-for="(item, index) in state.form.orgNames" :key="index">{{ item }}</div>
							</div>
						</el-form-item>
						<el-form-item label="上一次登录时间">
							<span>{{ state.form.lastLoginTime }}</span>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-card>
		<ChangePwdDialog ref="changePwdDialogRef" />
		<el-dialog title="修改手机号" v-model="state.isShowDialog" width="850px">
			<el-form ref="changePhoneFormRef" :model="state.phoneForm" :rules="rules" label-position="left" label-width="120px" size="large">
				<el-form-item label="新手机号" prop="loginName">
					<el-input v-model="state.phoneForm.loginName" placeholder="请输入新手机号" maxlength="11" clearable></el-input>
				</el-form-item>
				<el-form-item label="请输入验证码" prop="smsCode">
					<div class="change-phone-smsCode">
						<el-input v-model="state.phoneForm.smsCode" class="smsCode-input" placeholder="请输入验证码" maxlength="6"></el-input>
						<el-button class="smsCode-btn" @click="getsmsCode" plain :disabled="!state.canUpClick">{{ state.text }}</el-button>
					</div>
				</el-form-item>
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
<script lang="ts" setup name="individualCenter">
import { reactive, onMounted, defineAsyncComponent, ref } from 'vue';
import { getUserDetail, changePhone, sendSmsCodeByUser } from '@/api/individualCenter';
import { useUserInfo } from '@/stores/userInfo';
import { storeToRefs } from 'pinia';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { sendSmsCode } from '@/api/public/index';

const ChangePwdDialog = defineAsyncComponent(() => import('@/components/changePwd/index.vue'));

const changePwdDialogRef = ref();
const changePhoneFormRef = ref<FormInstance>();

const state = reactive({
	form: {
		loginName: '',
		realName: '',
		phone: '',
		email: '',
		jobCode: '',
		weChatCode: '',
		lastLoginTime: '',
		orgNames: [],
	},
	phoneForm: {
		loginName: '',
		smsCode: '',
	},
	isShowDialog: false,
	text: '获取短信验证码',
	upTotalTime: 60,
	canUpClick: true,
});

const rules = reactive<FormRules>({
	loginName: [
		{ required: false, message: '请输入新手机号', trigger: 'blur' },
		{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
	],
});

const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);

// 打开修改密码弹窗
const onOpenChangePwd = () => {
	changePwdDialogRef.value.openDialog(userInfos.value.userId, 'userCenter', state.form.phone);
};

const getDetail = () => {
	getUserDetail({
		userId: userInfos.value.userId,
	})
		.then((res) => {
			state.form = res.data;
		})
		.catch((err) => {
			console.error(err);
		});
};

const lockSendButton = () => {
	state.canUpClick = false;
	state.text = state.upTotalTime + 's后重新发送';
	let in_clock = setInterval(() => {
		state.upTotalTime--;
		state.text = state.upTotalTime + 's后重新发送';
		if (state.upTotalTime < 0) {
			window.clearInterval(in_clock);
			state.text = '获取短信验证码';
			state.upTotalTime = 60;
			state.canUpClick = true;
		}
	}, 1000);
};

const getsmsCode = () => {
	let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
	if (!reg.test(state.phoneForm.loginName)) {
		ElMessage.warning('请输入正确的手机号');
		return false;
	}
	sendSmsCode({
		phone: state.phoneForm.loginName,
		type: 1,
	})
		.then((res) => {
			ElMessage.success(`已发送验证码请注意查收`);
			lockSendButton();
		})
		.catch((err) => {
			console.log(err);
		});
};

const onOpenChangePhone = () => {
	changePhoneFormRef.value?.resetFields();
	state.isShowDialog = true;
};

// 关闭弹窗
const closeDialog = () => {
	state.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};

const onSubmit = () => {
	changePhoneFormRef.value?.validate((valid) => {
		if (valid) {
			changePhone({
				...state.phoneForm,
			}).then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('手机号修改成功');
					closeDialog();
					getDetail();
				} else {
					ElMessage.warning(res.resultDesc);
				}
			});
		}
	});
};

onMounted(() => {
	getDetail();
});
</script>
<style lang="scss" scoped>
.change-phone-smsCode {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;

	.smsCode-input {
		width: 60%;
	}
	.smsCode-btn {
		width: 36%;
	}
}
</style>
