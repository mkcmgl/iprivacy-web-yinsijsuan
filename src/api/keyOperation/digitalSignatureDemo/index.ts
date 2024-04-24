import request from '@/utils/request';

export function demonstrateSign(data?: object) {
	return request({
		url: '/api/cipher/demonstrate/sign',
		method: 'post',
		data,
	});
}

export function signThreshold(data?: object) {
	return request({
		url: '/api/cipher/threshold/sign',
		method: 'post',
		data,
	});
}

// 门限密钥无分页列表
export function getListWithoutPage(params?: object) {
	return request({
		url: '/api/cipher/threshold/listWithoutPage',
		method: 'get',
		params,
	});
}

export function signZUC(data?: object) {
	return request({
		url: '/api/cipher/zuc/sign',
		method: 'post',
		data,
	});
}
