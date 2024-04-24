import request from '@/utils/request';

export function getCertificateList(params?: object) {
    return request({
		url: '/api/cipher/certificate/list',
		method: 'get',
		params
	})
}

export function updateCertificateState(data?: object) {
    return request({
		url: '/api/cipher/certificate/updateState',
		method: 'put',
		data
	})
}

export function downloadCertificateState(data?: object) {
    return request({
		url: '/api/cipher/certificate/download',
		method: 'post',
		data,
        responseType: 'blob',
	})
}