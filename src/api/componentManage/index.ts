import request from '@/utils/request';


export function updateComponent(data: object) {
    return request({
        url: '/api/privacy/pipeline/updateComponent',
        method: 'post',
        data
    })
}

export function allListComponent( ) {
    return request({
        url: '/api/privacy/component/allList',
        method: 'get',
    })
}

export function detailComponent(params: object) {
    return request({
        url: '/api/privacy/pipeline/detail',
        method: 'get',
        params
    })
}

export function projectDataComponent(params: object) {
    return request({
        url: '/api/privacy/project/projectData',
        method: 'get',
        params
    })
}
export function pageListComponent(params: object) {
    return request({
        url: '/api/privacy/pipeline/page',
        method: 'get',
        params
    })
}

