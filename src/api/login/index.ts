import request from '@/utils/request';

export function login(data: object) {
	return request({
		url: '/api/system/auth/login',
		method: 'post',
		data,
	})
}

export function logout(data?: object) {
	return request({
		url: '/api/system/auth/logout',
		method: 'post',
		data,
	})
}
