
// 设置文件上传接口的url
export function setAjaxUrl() {
    let envUrl = import.meta.env.VITE_API_URL;
    let url = envUrl.endsWith("/") ? envUrl : envUrl + '/';
    return url + 'api/common/fileStore/upload'
}
