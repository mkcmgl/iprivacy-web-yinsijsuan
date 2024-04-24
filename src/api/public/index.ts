import request from '@/utils/request';
import { setAjaxUrl } from '@/utils/PlatformName';

export function sendSmsCode(data: object) {
	return request({
		url: '/api/system/sms/sendSmsCode',
		method: 'post',
		data
	})
}

export function validSmsCode(params: object) {
	return request({
		url: '/api/system/auth/validSmsCode',
		method: 'get',
		params
	})
}

export function forgetPassword(data: object) {
	return request({
		url: '/api/system/user/forgetPassword',
		method: 'post',
		data
	})
}

export function getZoneInfo(params: object) {
	return request({
		url: '/api/system/zone/getZoneInfo',
		method: 'get',
		params
	})
}

export function getIndustryCategoryNew(params: object) {
	return request({
		url: 'api/system/industry/getIndustryCategoryNew',
		method: 'get',
		params,
	})
}

// 查询字典值
export function getDict(params?: object) {
	return request({
		url: '/api/system/dict/get',
		method: 'get',
		params
	})
}

// 上传文件
export function upload(data: object) {
	return request({
		url: setAjaxUrl(),
		method: 'post',
		headers: { "Content-Type": "multipart/form-data" },
		data
	})
}

// 修改密码
export function changePassword(data: object) {
	return request({
		url: '/api/system/user/changePassword',
		method: 'post',
		data
	})
}

// 获取系统参数
export function getSystemParam(params?: object) {
	return request({
		url: '/api/system/organize/getSystemParam',
		method: 'get',
		params
	})
}