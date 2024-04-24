import request from '@/utils/request';

export function getThresholdList(params?: object) {
	return request({
		url: '/api/cipher/threshold/list',
		method: 'get',
		params,
	});
}

export function getPrivateKey(params?: object) {
	return request({
		url: '/api/cipher/threshold/getPrivateKey',
		method: 'get',
		params,
	});
}

export function deleteThreshold(params?: object) {
	return request({
		url: '/api/cipher/threshold/delete',
		method: 'delete',
		params,
	});
}

export function setThreshold(data?: object) {
	return request({
		url: '/api/cipher/threshold/save',
		method: 'post',
		data,
	});
}
