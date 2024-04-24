import request from '@/utils/request';

export function verifySign(data?: object) {
	return request({
		url: '/api/cipher/demonstrate/verify',
		method: 'post',
		data,
	});
}

export function verifyThresholdSign(data?: object) {
	return request({
		url: '/api/cipher/threshold/verify',
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

export function verifyZUCSign(data?: object) {
	return request({
		url: '/api/cipher/zuc/verify',
		method: 'post',
		data,
	});
}
