import request from '@/utils/request';

export function getNetworkList(params?: object) {
	return request({
		url: '/api/cipher/network/list',
		method: 'get',
		params,
	});
}
