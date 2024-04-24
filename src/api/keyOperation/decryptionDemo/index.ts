import request from '@/utils/request';

export function decrypt(data?: object) {
	return request({
		url: '/api/cipher/demonstrate/decrypt',
		method: 'post',
		data,
	});
}

export function decryptThreshold(data?: object) {
	return request({
		url: '/api/cipher/threshold/decrypt',
		method: 'post',
		data,
	});
}

export function decryptZUC(data?: object) {
	return request({
		url: '/api/cipher/zuc/decrypt',
		method: 'post',
		data,
	});
}
