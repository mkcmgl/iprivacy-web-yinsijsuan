import request from '@/utils/request';

export function getIdentificationKeyList(params?: object) {
	return request({
		url: '/api/cipher/identityType/page',
		method: 'get',
		params,
	});
}

export function createIdentificationKeySecret(data?: object) {
	return request({
		url: '/api/cipher/identityType/createSecret',
		method: 'put',
		data,
	});
}

export function getIdentityTypeAllList(params?: object) {
	return request({
		url: '/api/cipher/identityType/getAllList',
		method: 'get',
		params,
	});
}

export function updateIdentityKeyState(data?: object) {
	return request({
		url: '/api/cipher/identityType/updateState',
		method: 'put',
		data,
	});
}

export function getHistoryList(params?: object) {
	return request({
		url: '/api/cipher/identityLog/list',
		method: 'get',
		params,
	});
}
