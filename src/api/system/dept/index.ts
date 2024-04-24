import request from '@/utils/request';

export function getPositionList(params: object) {
    return request({
        url: '/api/system/position/list',
		method: 'get',
		params
    })
}

export function changePositionStatus(data: object) {
    return request({
        url: '/api/system/position/editStatus',
		method: 'post',
		data
    })
}

export function getOrgTreeList() {
    return request({
        url: '/api/system/org/tree',
		method: 'get',
    })
}

export function getOrgList() {
    return request({
        url: '/api/system/org/list',
		method: 'get',
    })
}

export function addOrg(data: object) {
    return request({
        url: '/api/system/org/add',
		method: 'post',
        data
    })
}

export function deleteOrg(data: object) {
    return request({
        url: '/api/system/org/delete',
		method: 'post',
        data
    })
}

export function editOrg(data: object) {
    return request({
        url: '/api/system/org/edit',
        method: 'post',
        data
    })
}

export function addPosition(data: object) {
    return request({
        url: '/api/system/position/add',
        method: 'post',
        data
    })
}

export function editPosition(data: object) {
    return request({
        url: '/api/system/position/edit',
        method: 'post',
        data
    })
}

export function deletePosition(data: object) {
    return request({
        url: '/api/system/position/delete',
        method: 'post',
        data
    })
}

export function getListByDept(params: object) {
    return request({
        url: '/api/system/position/getListByDept',
        method: 'get',
        params
    })
}