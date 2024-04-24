import request from '@/utils/request';

export function getZUCList(params?: object) {
	return request({
		url: '/api/cipher/invokeLog/zucList',
		method: 'get',
		params,
	});
}
