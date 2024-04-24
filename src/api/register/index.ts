import request from '@/utils/request';

export function register(data: object) {
	return request({
		url: '/api/system/auth/register',
		method: 'post',
		data
	})
}
