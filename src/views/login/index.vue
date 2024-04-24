<template>
	<div class="login-container">
		<div class="login-title">{{ themeConfig.globalTitle }}</div>

		<div class="login-con">
			<div class="login-box">
				<el-tabs v-model="state.tabsActiveName">
					<el-tab-pane label="账号登录" name="password">
						<Account v-if="state.tabsActiveName=='password'" :accountLoading="state.accountLoading" @login="onLogin" />
					</el-tab-pane>
					<el-tab-pane label="手机号登录" name="auth_code">
						<Mobile  v-if="state.tabsActiveName == 'auth_code'" :mobileLoading="state.mobileLoading" @login="onLogin" />
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { defineAsyncComponent, onMounted, reactive, computed, getCurrentInstance } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import { NextLoading } from '@/utils/loading';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { initFrontEndControlRoutes } from '@/router/frontEnd';
import { Session, Cookie } from '@/utils/storage';
import { login } from '@/api/login';
import { encrypt } from '@/utils/jsencrypt';
import { Local } from '@/utils/storage';

// 引入组件
const Account = defineAsyncComponent(() => import('@/views/login/component/account.vue'));
const Mobile = defineAsyncComponent(() => import('@/views/login/component/mobile.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { proxy } = getCurrentInstance() as any;
const route = useRoute();
const router = useRouter();
const state = reactive({
	tabsActiveName: 'password',
	accountLoading: false,
	mobileLoading: false,
});

const randomString = () => {
	let len = 8;
	let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	let maxPos = $chars.length;
	let pwd = '';
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
};

// 登录
const onLogin = (val: loginType) => {
	let pwd = '';
	// if (val.rememberMe) {
	// 	Local.set('userName', val.userName);
	// 	Local.set('password', encrypt(val.password));
	// 	Local.set('rememberMe', val.rememberMe);
	// } else {
		Local.remove('userName');
		Local.remove('password');
		Local.remove('rememberMe');
	// }
	if (state.tabsActiveName == 'password') {
		pwd = proxy.$md5(val.password);
		pwd = proxy.$md5(pwd + pwd.substr(0, 8));
		if (!val.userName) {
			ElMessage.warning('请输入用户名');
			return false;
		}
		if (!val.password) {
			ElMessage.warning('请输入密码');
			return false;
		}
		state.accountLoading = true;
	} else if (state.tabsActiveName == 'auth_code') {
		if (!val.userName) {
			ElMessage.warning('请输入手机号');
			return false;
		}
		if (!val.code) {
			ElMessage.warning('请输入验证码');
			return false;
		}
		state.mobileLoading = true;
	}
	let randomStr = randomString();
	login({
		// tenantId: '1000',
		loginName: val.userName,
		password: val.password ? proxy.$md5(pwd + randomStr) : val.password,
		random: randomStr,
		smsCode: val.code ? val.code : '',
		loginType: state.tabsActiveName,
	})
		.then(async (res) => {
			Session.set('token', res.data.token);
			const isNoPower = await initFrontEndControlRoutes();
			signInSuccess(isNoPower);
		})
		.catch((err) => {
			state.accountLoading = false;
			state.mobileLoading = false;
		});
};

const signInSuccess = (isNoPower: boolean | undefined) => {
	if (isNoPower) {
		router.push('/401');
	} else {
		// 登录成功，跳到转首页
		// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
		router.push('/home');
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	}
	state.accountLoading = false;
	state.mobileLoading = false;
};

// 页面加载时
onMounted(() => {
	NextLoading.done();
});
</script>

<style scoped lang="scss">
@media only screen and (min-width: 1620px) {
	.login-container {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		min-height: 620px;
		background: url('@/assets/login/main-bg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;

		.login-title {
			position: absolute;
			top: 120px;
			left: 120px;
			width: 110%;
			font-size: 60px;
			font-weight: 800;
			font-style: oblique;
			background: linear-gradient(to bottom, #ffff, #f8fdff, #acf5ff, #67eeff, #24d8ff);
			-webkit-background-clip: text;
			color: transparent;
		}

		.login-con {
			position: absolute;
			top: 18%;
			right: 170px;
			padding: 0 45px;
			width: 480px;
			height: 580px;
			background: url('@/assets/login/login.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.login-box {
				position: relative;
				width: 90%;
				margin: 90px auto 0;
			}
		}
	}
}

@media only screen and (min-width: 1100px) and (max-width: 1620px) {
	.login-container {
		position: relative;
		display: flex;
		align-items: center;
		min-width: 540px;
		min-height: 620px;
		width: 100%;
		height: 100%;
		background: url('@/assets/login/main-bg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;

		.login-title {
			position: absolute;
			top: 120px;
			left: 120px;
			width: 110%;
			font-size: 60px;
			font-weight: 800;
			font-style: oblique;
			background: linear-gradient(to bottom, #ffff, #f8fdff, #acf5ff, #67eeff, #24d8ff);
			-webkit-background-clip: text;
			color: transparent;
		}

		.login-con {
			position: absolute;
			top: 18%;
			right: 100px;
			padding: 0 45px;
			width: 460px;
			height: 560px;
			background: url('@/assets/login/login.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.login-box {
				position: relative;
				width: 90%;
				margin: 90px auto 0;
			}
		}
	}
}

@media (min-width: 540px) and (max-width: 1100px) {
	.login-container {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		min-width: 540px;
		min-height: 620px;
		background: url('@/assets/login/main-bg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;

		.login-title {
			position: absolute;
			top: 120px;
			left: 120px;
			width: 110%;
			font-size: 50px;
			font-weight: 800;
			font-style: oblique;
			background: linear-gradient(to bottom, #ffff, #f8fdff, #acf5ff, #67eeff, #24d8ff);
			-webkit-background-clip: text;
			color: transparent;
		}

		.login-con {
			position: absolute;
			top: 25%;
			right: 50px;
			padding: 0 45px;
			width: 420px;
			height: 530px;
			background: url('@/assets/login/login.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.login-box {
				position: relative;
				width: 90%;
				margin: 90px auto 0;
			}
		}
	}
}

@media (max-width: 540px) {
	.login-container {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		min-width: 540px;
		min-height: 620px;
		background: url('@/assets/login/main-bg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;

		.login-title {
			display: none;
		}

		.login-con {
			position: absolute;
			top: 18%;
			padding: 0 45px;
			width: 480px;
			height: 580px;
			background: url('@/assets/login/login.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.login-box {
				position: relative;
				width: 90%;
				margin: 90px auto 0;
			}
		}
	}
}
</style>
