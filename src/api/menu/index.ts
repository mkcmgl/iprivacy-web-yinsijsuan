import request from '@/utils/request';

export function getMenuTree(data: object) {
	return request({
		url: '/api/system/menu/tree',
		method: 'post',
		data
	})
}

