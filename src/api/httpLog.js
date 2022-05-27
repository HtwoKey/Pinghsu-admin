import request from '../utils/request'
/**
 * 
 * @param {page,rows} params 
 */
export function list(params){
    return request({
        url:'/admin/http/list',
        method:'get',
        params:params
    })
}