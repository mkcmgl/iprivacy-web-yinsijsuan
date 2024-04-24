<template>
	<el-form size="large" class="login-content-form">
		<el-form-item class="login-animation1">
			<el-input text placeholder="请输入用户名" v-model="state.ruleForm.userName" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-User /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2">
			<el-input :type="state.isShowPassword ? 'text' : 'password'" placeholder="请输入密码"
				v-model="state.ruleForm.password" autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
				</template>
				<template #suffix>
					<i class="iconfont el-input__icon login-content-password"
						:class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="state.isShowPassword = !state.isShowPassword">
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2">
			<div class="login-flex">
				<el-checkbox v-model="state.ruleForm.rememberMe">记住密码</el-checkbox>
				<el-link type="primary" :underline="false" @click="goForgotPwd">忘记密码</el-link>
			</div>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-button type="primary" class="login-content-submit" @click="onSignIn" :loading="accountLoading">
				<span>登 录</span>
			</el-button>
		</el-form-item>
		<el-form-item class="login-animation2">
			<div class="login-register-flex">
				<el-link type="primary" :underline="false" @click="goRegister">&lt 没有账号？注册</el-link>
			</div>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts" name="loginAccount">
import { reactive, computed, ref, onMounted } from 'vue';
import { Local } from '@/utils/storage';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import { useRoute, useRouter } from 'vue-router';

// 定义变量内容
const emit = defineEmits(['login']);
const props = defineProps({
	accountLoading: {
		type: Boolean,
		default: false,
	},
});
const route = useRoute();
const router = useRouter();
const state = ref({
	isShowPassword: false,
	ruleForm: {
		userName: '',
		password: '',
		rememberMe: false,
	},
});

// const getLoalStorge = () => {
// 	const userName = Local.get('userName');
// 	const password = Local.get('password');
// 	const rememberMe = Local.get('rememberMe');
// 		// state.value.ruleForm = {
// 	if (password) {
// 		state.value.ruleForm.password = decrypt(password)
// 	}
// 	if (userName) {
// 		state.value.ruleForm.userName = userName
// 	}

// };
onMounted(() => {
	state.value.ruleForm.password = '';
	state.value.ruleForm.userName = '';
	Local.remove('userName');
	Local.remove('password');
	Local.remove('rememberMe');
});
// getLoalStorge();
// 登录
const onSignIn = (val: object) => {
	emit('login', state.value.ruleForm);
};
const goRegister = () => {
	router.push('/register');
};
const goForgotPwd = () => {
	router.push('/forgotPwd');
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

	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;

		&:hover {
			color: #909399;
		}
	}

	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}

	.login-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.login-register-flex {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 100%;
	}
}
</style>
