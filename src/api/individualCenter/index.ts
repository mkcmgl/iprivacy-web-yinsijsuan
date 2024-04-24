import request from '@/utils/request';

export function getUserDetail(params?: object) {
    return request({
		url: '/api/system/user/detail',
		method: 'get',
		params
	})
}

export function changePasswordByUser(data?: object) {
	return request({
		url: '/api/system/user/changePasswordByUser',
		method: 'post',
		data
	})
}

export function changePhone(data?: object) {
	return request({
		url: '/api/system/user/changePhone',
		method: 'post',
		data
	})
}

export function sendSmsCodeByUser(data?: object) {
	return request({
		url: '/api/system/sms/sendSmsCodeByUser',
		method: 'post',
		data
	})
}

