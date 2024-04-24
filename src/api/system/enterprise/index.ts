import request from '@/utils/request';

export function getOrganizeList(params: object) {
	return request({
		url: '/api/system/organize/page',
		method: 'get',
		params
	})
}

export function getOrganizeDetail(params: object) {
	return request({
		url: '/api/system/organize/detailAdmin',
		method: 'get',
		params
	})
}

export function changeOrganizeState(data: object) {
	return request({
		url: '/api/system/organize/changeState',
		method: 'post',
		data,
	})
}

export function auditOrganize(data: object) {
	return request({
		url: '/api/system/organize/audit',
		method: 'post',
		data,
	})
}
