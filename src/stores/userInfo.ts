import { defineStore } from 'pinia';
import { Session } from '@/utils/storage';
import { getUserPermissions } from '@/api/system/user';
import { getSystemParam } from '@/api/public';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			userName: '',
			photo: '',
			roles: [],
			permissions: [],
			positions: [],
			menus: [],
			userId: '',
		},
		systemParams: {
			signMasterPublicKey: '', // 签名主公钥
			organizeCode: '', // 社会信用统一代码
			systemParam: '', // 系统参数
			encryptMasterPublicKey: '', // 加密主公钥
		},
	}),
	actions: {
		async setUserInfos() {
			const userInfos: any = await this.getApiUserInfo();
			this.userInfos = userInfos;
		},
		async getApiUserInfo() {
			return new Promise((resolve) => {
				getUserPermissions()
					.then((res) => {
						const userInfos = {
							userName: res.data.realName,
							photo: '',
							roles: res.data.roles,
							permissions: res.data.permissions,
							positions: res.data.positions,
							menus: res.data.menus,
							userId: res.data.userId,
						};
						resolve(userInfos);
					})
					.catch((err) => console.log(err));
			});
		},

		async setSystemParams() {
			// const systemParams: any = await this.getSyetemParams();
			// this.systemParams = systemParams;
		},

		async getSyetemParams() {
			return new Promise((resolve) => {
				getSystemParam()
					.then((res) => {
						const systemParams = {
							signMasterPublicKey: res.data.signMasterPublicKey,
							organizeCode: res.data.organizeCode,
							systemParam: res.data.systemParam,
							encryptMasterPublicKey: res.data.encryptMasterPublicKey,
						};
						resolve(systemParams);
					})
					.catch((err) => console.log(err));
			});
		},
	},
});
