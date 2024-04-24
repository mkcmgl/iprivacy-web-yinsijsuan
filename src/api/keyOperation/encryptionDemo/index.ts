import request from '@/utils/request';

export function encrypt(data?: object) {
	return request({
		url: '/api/cipher/demonstrate/encrypt',
		method: 'post',
		data,
	});
}

export function readCer(data?: object) {
	return request({
		url: '/api/cipher/demonstrate/readCer',
		method: 'post',
		data,
	});
}

export function encryptThreshold(data?: object) {
	return request({
		url: '/api/cipher/threshold/encrypt',
		method: 'post',
		data,
	});
}

export function verifyPublicKey(params?: object) {
	return request({
		url: '/api/cipher/threshold/verifyPublicKey',
		method: 'get',
		params,
	});
}

export function encryptZUC(data?: object) {
	return request({
		url: '/api/cipher/zuc/encrypt',
		method: 'post',
		data,
	});
}
