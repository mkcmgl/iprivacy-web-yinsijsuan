<template>
	<el-form size="large" class="login-content-form">
		<el-form-item class="login-animation1">
			<el-input text placeholder="请输入手机号" v-model="state.ruleForm.userName" clearable autocomplete="off">
				<template #prefix>
					<i class="iconfont icon-phone el-input__icon"></i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2">
			<el-col :span="15">
				<el-input text maxlength="6" placeholder="请输入验证码" v-model="state.ruleForm.code" clearable autocomplete="off">
					<template #prefix>
						<el-icon class="el-input__icon"><ele-Position /></el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<el-button type="primary" class="login-content-code" @click="getsmsCode" plain :disabled="!state.canUpClick">{{ state.text }}</el-button>
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation3">
			<el-button type="primary" class="login-content-submit" :loading="mobileLoading" @click="onSignIn">
				<span>登 录</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts" name="loginMobile">
import { reactive , onMounted } from 'vue';
import { sendSmsCode } from '@/api/public/index';
import { ElMessage } from 'element-plus';

// 定义变量内容
const emit = defineEmits(['login']);
const props = defineProps({
	mobileLoading: {
		type: Boolean,
		default: false,
	},
});
const state = reactive({
	ruleForm: {
		userName: '',
		code: '',
	},
	text: '获取短信验证码',
	upTotalTime: 60,
	canUpClick: true,
});

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
	state.ruleForm.userName = ''
	state.ruleForm.code = ''
});
const getsmsCode = () => {
	let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
	if (!reg.test(state.ruleForm.userName)) {
		ElMessage.warning('请输入正确的手机号');
		return false;
	}
	sendSmsCode({
		type: '0',
		phone: state.ruleForm.userName,
	})
		.then((res) => {
			lockSendButton();
		})
		.catch((err) => {
			console.log(err);
		});
};

const onSignIn = () => {
	emit('login', state.ruleForm);
};
</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
	.login-msg {
		color: var(--el-text-color-placeholder);
	}
}
</style>
