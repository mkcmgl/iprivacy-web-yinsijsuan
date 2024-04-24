import request from '@/utils/request';

export function getIdentityLogList(params?: object) {
	return request({
		url: '/api/cipher/identityLog/list',
		method: 'get',
		params,
	});
}

export function getIdentityTypeAllList(params?: object) {
	return request({
		url: '/api/cipher/identityType/getAllList',
		method: 'get',
		params,
	});
}
