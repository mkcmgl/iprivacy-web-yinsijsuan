import request from '@/utils/request';

export function getIdentityTypeAllList(params?: object) {
	return request({
		url: '/api/cipher/identityType/getAllList',
		method: 'get',
		params,
	});
}

export function getBlackList(params?: object) {
	return request({
		url: '/api/cipher/identityType/blacklistPage',
		method: 'get',
		params,
	});
}

export function updateblackListState(data?: object) {
	return request({
		url: '/api/cipher/identityType/blacklist',
		method: 'put',
		data,
	});
}
