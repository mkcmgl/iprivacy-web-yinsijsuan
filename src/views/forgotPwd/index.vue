<template>
	<div class="forgot-page">
		<el-card class="forgot-container">
			<template #header>
				<div class="forgot-header">
					<div class="forgot-back" @click="goLogin" v-if="state.step != 3">
						<i class="iconfont icon-fanhui1"></i>
						<span>返回去登录</span>
					</div>
					<div class="forgot-title">忘记密码</div>
				</div>
			</template>
			<div class="forgot-form-container">
				<div class="forgot-form">
					<div class="forgot-form-title" v-if="state.step != 2">请重新设置密码</div>
					<el-form
						:model="state.forgotForm"
						ref="forgotFormRef"
						:rules="rules"
						label-width="80px"
						label-position="top"
						:inline="false"
						size="large"
					>
						<div v-if="state.step == 1">
							<el-form-item prop="phone">
								<el-input v-model="state.forgotForm.phone" placeholder="请输入手机号"></el-input>
							</el-form-item>
							<el-form-item prop="smsCode">
								<div class="forgot-smsCode">
									<el-input
										v-model="state.forgotForm.smsCode"
										class="smsCode-input"
										placeholder="请输入验证码"
										maxlength="6"
									></el-input>
									<el-button type="primary" class="smsCode-btn" @click="getsmsCode" plain :disabled="!state.canUpClick">{{
										state.text
									}}</el-button>
								</div>
							</el-form-item>
							<el-form-item prop="password">
								<el-input v-model="state.forgotForm.password" placeholder="请输入新密码" type="password"></el-input>
							</el-form-item>
							<el-form-item prop="rePassword">
								<el-input v-model="state.forgotForm.rePassword" placeholder="请确认新密码" type="password"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="nextStep" :loading="loading">下一步</el-button>
							</el-form-item>
						</div>
						<div v-if="state.step == 2">
							<el-form-item>
								<div class="center">
									<img src="@/assets/forgotPwd/finished.png" />
								</div>
							</el-form-item>
							<el-form-item>
								<div class="center green">密码设置完成！</div>
							</el-form-item>
							<el-form-item>
								<el-button type="success" @click="nextStep">去登录</el-button>
							</el-form-item>
						</div>
					</el-form>
				</div>
			</div>
		</el-card>
	</div>
</template>
<script setup lang="ts" name="forgotPwdIndex">
import { reactive, ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { verifyPasswordPowerful } from '@/utils/toolsValidate';
import { sendSmsCode, validSmsCode, forgetPassword } from '@/api/public/index';
import { ElMessage } from 'element-plus';
const { proxy } = getCurrentInstance() as any;

const forgotFormRef = ref<FormInstance>();
const state = reactive({
	step: 1,
	forgotForm: {
		password: '',
		rePassword: '',
		phone: '',
		smsCode: '',
	},
	text: '获取短信验证码',
	upTotalTime: 60,
	canUpClick: true,
});
const loading = ref(false);
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
	} else if (value !== state.forgotForm.password) {
		callback(new Error('两次输入密码不同'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules>({
	password: [{ validator: checkPwd, trigger: 'blur' }],
	rePassword: [{ validator: checkRePwd, trigger: 'change' }],
	phone: [
		{ required: true, message: '请输入手机号', trigger: 'blur' },
		{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
	],
	smsCode: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }],
});

const router = useRouter();

const goLogin = () => {
	router.replace('/login');
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
	if (!reg.test(state.forgotForm.phone)) {
		ElMessage.warning('请输入正确的手机号');
		return false;
	}
	sendSmsCode({
		type: '0',
		phone: state.forgotForm.phone,
	})
		.then((res) => {
			lockSendButton();
		})
		.catch((err) => {
			console.log(err);
		});
};

const nextStep = () => {
	forgotFormRef.value?.validate((valid) => {
		if (valid) {
			switch (state.step) {
				case 1:
					let pwd = state.forgotForm.password;
					pwd = proxy.$md5(pwd);
					pwd = proxy.$md5(pwd + pwd.substr(0, 8));
					loading.value = true;
					forgetPassword({
						loginName: state.forgotForm.phone,
						newPassword: pwd,
						phone: state.forgotForm.phone,
						smsCode: state.forgotForm.smsCode,
					})
						.then((res) => {
							loading.value = false;
							if (res.resultCode === 0) {
								state.step = 2;
							} else {
								ElMessage.warning(res.resultDesc);
							}
						})
						.catch((err) => {
							loading.value = false;
							console.log(err);
						});
					break;
				case 2:
					goLogin();
					break;
				default:
					break;
			}
		}
	});
};
</script>
<style scoped lang="scss">
.forgot-page {
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

	.forgot-container {
		min-width: 80%;
		min-height: 80%;
		margin: 0 auto;

		.forgot-header {
			position: relative;
			padding: 30px 0px;

			.forgot-back {
				display: inline-block;
				color: #4362fd;
				margin-left: 30px;
				font-size: 20px;
				cursor: pointer;

				span {
					margin-left: 12px;
				}
			}

			.forgot-title {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				color: #051877;
				font-size: 30px;
			}
		}

		.forgot-form-container {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60vh;

			.forgot-form {
				width: 450px;

				:deep(.el-button--large) {
					width: 100%;
				}

				.forgot-smsCode {
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 100%;

					.smsCode-input,
					.smsCode-btn {
						width: 46%;
					}
				}

				.center {
					width: 100%;
					text-align: center;
				}

				.green {
					color: #1dbe00;
				}
			}

			.forgot-form-title {
				color: #666666;
				font-size: 20px;
				margin-bottom: 30px;
			}
		}
	}
}
</style>
