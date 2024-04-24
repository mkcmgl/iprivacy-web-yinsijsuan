import request from '@/utils/request';

export function getInvokeLogList(params?: object) {
    return request({
		url: '/api/cipher/invokeLog/list',
		method: 'get',
		params
	})
}
