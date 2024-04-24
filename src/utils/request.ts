import axios, { AxiosInstance } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Session } from '@/utils/storage';
import qs from 'qs';
let locationObj = window.location;
let urlStr = locationObj.protocol + '//' + locationObj.host +'/iprivacy230/' ;

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: urlStr,
	timeout: 50000,
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
	paramsSerializer: {
		serialize(params) {
			return qs.stringify(params, { allowDots: true });
		},
	},
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		if (config.method === 'post') {
			let data = config.data ? config.data : '';
			// if (data != '') data.tenantId = '1000';
		}
		if (config.method === 'get') {
			let params = config.params ? config.params : '';
			// if (params != '') params.tenantId = '1000';
		}
		if (Session.get('token')) {
			config.headers!['Authorization'] = `${Session.get('token')}`;
		}
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		const res = response.data;
		if (res.resultCode && res.resultCode !== 0) {
			if (res.resultCode === 1004) {
				// `token` 过期或者账号已在别处登录
				Session.clear(); // 清除浏览器全部临时缓存
				ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
					.then(() => {
						window.location.href = '/iprivacy-web'; // 去登录页
					})
					.catch(() => {});
			} else {
				ElMessage.warning(res.resultDesc);
			}
			return Promise.reject(service.interceptors.response);
		} else {
			return response.data;
		}
	},
	(error) => {
		console.log(error);
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data) ElMessage.error(error.response.statusText);
			else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;
