import request from '@/utils/request';

export function getUserList(params?: object) {
    return request({
		url: '/api/cipher/user/list',
		method: 'get',
		params
	})
}

export function saveUser(data?: object) {
    return request({
		url: '/api/cipher/user/save',
		method: 'post',
		data
	})
}

export function updateBlacklistState(data?: object) {
    return request({
		url: '/api/cipher/user/updateState',
		method: 'post',
		data
	})
}

export function applyUserCertificate(data?: object) {
    return request({
		url: '/api/cipher/user/apply',
		method: 'post',
		data
	})
}