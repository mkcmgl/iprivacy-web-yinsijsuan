import request from '@/utils/request';


export function getProjectList(params: object) {
    return request({
        url: '/api/privacy/project/page',
        method: 'get',
        params
    })
}

export function addProject(data: object) {
    return request({
        url: '/api/privacy/project/save',
        method: 'post',
        data
    })
}

export function projectDetail(params: object) {
    return request({
        url: '/api/privacy/project/detail',
        method: 'get',
        params
    })
}
export function projectAddData(data: object) {
    return request({
        url: '/api/privacy/project/addData',
        method: 'post',
        data
    })
}
export function projectPartnerData(params: object) {
    return request({
        url: '/api/privacy/project/partnerData',
        method: 'get',
        params
    })
}

export function deleteProjectData(params: object) {
    return request({
        url: '/api/privacy/project/removeData',
        method: 'delete',
        params
    })
}
export function auditProject(data:object) {
    return request({
        url: '/api/privacy/project/auditProject',
        method: 'post',
        data
    })
}


export function projectDelete(params: object) {
    return request({
        url: '/api/privacy/project/delete',
        method: 'get',
        params
    })
}
export function projectAuditList(params: object) {
    return request({
        url: '/api/system/organize/auditList',
        method: 'get',
        params
    })
}
