import request from '@/utils/request';
export function updateDataResourceField(data:any) {
    return request({
        url: '/data/resource/updateDataResourceField',
        method: 'post',
        // type: 'json',
        data
    })
}