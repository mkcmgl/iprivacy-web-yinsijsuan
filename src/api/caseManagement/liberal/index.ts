import request from '@/utils/request';

export function getAppInfoList(params?: object) {
	return request({
		url: '/api/system/appInfo/list',
		method: 'get',
		params,
	})
}

export function createtAppInfo(data?: object) {
	return request({
		url: '/api/system/appInfo/create',
		method: 'post',
		data,
	})
}

export function getAppInfoSecret(params?: object) {
	return request({
		url: '/api/system/appInfo/secret',
		method: 'get',
		params,
	})
}
