import request from '@/utils/request';

// 查询字典值
export function getDetailMain(params?: object) {
	return request({
		url: '/api/common/dict/detailMain',
		method: 'get',
		params,
	});
}
