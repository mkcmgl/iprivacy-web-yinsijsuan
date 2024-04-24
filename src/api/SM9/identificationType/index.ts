import request from '@/utils/request';

export function getIdentityTypeList(params?: object) {
	return request({
		url: '/api/cipher/identityType/list',
		method: 'get',
		params,
	});
}

export function updateIdentityTypeState(data?: object) {
	return request({
		url: '/api/cipher/identityType/updateState',
		method: 'put',
		data,
	});
}

export function editIdentityType(data?: object) {
	return request({
		url: '/api/cipher/identityType/edit',
		method: 'put',
		data,
	});
}

export function addIdentityType(data?: object) {
	return request({
		url: '/api/cipher/identityType/save',
		method: 'post',
		data,
	});
}
