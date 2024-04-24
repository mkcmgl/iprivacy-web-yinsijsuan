<template>
	<div class="register-page">
		<div class="register-container">
			<div class="register-title">企业注册</div>
			<div class="register-subtitle">
				<div>账号信息</div>
			</div>
			<div class="register-form">
				<el-form :model="state.registerForm" size="large" ref="registerRef" :rules="rules" label-width="110px" label-position="left" :inline="false">
					<el-form-item label="登录账号" prop="loginName">
						<el-input v-model="state.registerForm.loginName" maxlength="50"></el-input>
					</el-form-item>
					<el-form-item label="手机号" prop="phone">
						<el-input v-model="state.registerForm.phone" maxlength="11"></el-input>
					</el-form-item>
					<el-form-item label="短信验证码" prop="smsCode">
						<div class="register-smsCode">
							<el-input v-model="state.registerForm.smsCode" class="smsCode-input" maxlength="6"></el-input>
							<el-button type="primary" class="smsCode-btn" @click="getsmsCode" :disabled="!state.canUpClick">{{ state.text }}</el-button>
						</div>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="state.registerForm.email" maxlength="45"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model="state.registerForm.password" type="password" maxlength="20"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="rePassword">
						<el-input v-model="state.registerForm.rePassword" type="password" maxlength="20"></el-input>
					</el-form-item>
					<el-form-item>
						<div class="register-submit-container">
							<el-button type="warning" class="register-submit" @click="setRegister">注册</el-button>
							<span class="register-submit-login" @click="goLogin">
								<span>已有账号？</span>
								<span class="login-btn">立即登录</span>
							</span>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts" name="registerIndex">
import { reactive, ref, getCurrentInstance, onMounted, onUpdated } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { sendSmsCode } from '@/api/public/index';
import { register } from '@/api/register/index';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { verifyPasswordPowerful } from '@/utils/toolsValidate';

const { proxy } = getCurrentInstance() as any;

const state = reactive({
	registerForm: {
		loginName: '',
		phone: '',
		smsCode: '',
		email: '',
		password: '',
		rePassword: '',
	},
	text: '获取短信验证码',
	upTotalTime: 60,
	canUpClick: true,
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
const checkRePwd = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请确认密码'));
	} else if (value !== state.registerForm.password) {
		callback(new Error('两次输入密码不同'));
	} else {
		callback();
	}
};
const registerRef = ref<FormInstance>();
const rules = reactive<FormRules>({
	loginName: [
		{ required: true, message: '请输入登录账号', trigger: 'blur' },
		{ pattern: /^[A-Za-z0-9]{1,}$/, message: '登录账号只能包含数字，英文字母' },
	],
	phone: [
		{ required: true, message: '请输入手机号', trigger: 'blur' },
		{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
	],
	smsCode: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }],
	email: [
		{ required: true, message: '请输入邮箱', trigger: 'blur' },
		{ pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱' },
	],
	password: [{ required: true, validator: checkPwd, trigger: 'blur' }],
	rePassword: [{ required: true, validator: checkRePwd, trigger: 'change' }],
});
const route = useRoute();
const router = useRouter();

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

onMounted(() => {
	console.log(`output`);
	state.registerForm = {
		loginName: '',
		phone: '',
		smsCode: '',
		email: '',
		password: '',
		rePassword: '',
	}
	
});


const getsmsCode = () => {
	let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
	if (!reg.test(state.registerForm.phone)) {
		ElMessage.warning('请输入正确的手机号');
		return false;
	}
	sendSmsCode({
		type: '1',
		phone: state.registerForm.phone,
	})
		.then((res) => {
			lockSendButton();
		})
		.catch((err) => {
			console.log(err);
		});
};

const setRegister = () => {
	registerRef.value?.validate((valid) => {
		if (valid) {
			let pwd = state.registerForm.password;
			pwd = proxy.$md5(pwd);
			pwd = proxy.$md5(pwd + pwd.substr(0, 8));
			register({
				loginName: state.registerForm.loginName,
				phone: state.registerForm.phone,
				smsCode: state.registerForm.smsCode,
				email: state.registerForm.email,
				password: pwd,
			})
				.then((res) => {
					ElMessage.success('注册成功');
					goLogin();
				})
				.catch((err) => console.log(err));
		}
	});
};

const goLogin = () => {
	router.replace('/login');
};
</script>
<style scoped lang="scss">
.register-page {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
	height: 100%;
	min-height: 620px;
	background: url('@/assets/login/main-bg.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	color: #333333;

	.register-container {
		min-width: 80%;
		min-height: 80%;
		margin: 0 auto;
		padding: 30px 0px;
		background-color: #ffffff;
		border-radius: 8px;

		.register-title {
			text-align: center;
			font-size: 30px;
			color: #051877;
			font-weight: bold;
			margin-bottom: 30px;
		}

		.register-subtitle {
			width: 100%;
			padding: 20px 0px;
			color: #666666;
			font-size: 20px;
			font-weight: bold;
			background-color: #f4f4f4;

			div {
				width: 50%;
				margin: 0 auto;
			}
		}

		.register-form {
			width: 50%;
			margin: 30px auto;

			.register-smsCode {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;

				.smsCode-input,
				.smsCode-btn {
					width: 46%;
				}
			}

			.register-submit-container {
				width: 70%;
				margin: 0 auto;

				.register-submit {
					width: 40%;
					max-width: 50%;
				}

				.register-submit-login {
					margin-left: 30px;
					cursor: pointer;
					.login-btn {
						color: #051877 !important;
					}
				}
			}
		}
	}
}
</style>
