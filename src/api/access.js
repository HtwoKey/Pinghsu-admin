import request from '../utils/request'
/**
 * 用户代理，访问量
 * @param {page,rows} params 
 */
export function list(params){
    return request({
        url:'/admin/access/list',
        method:'get',
        params:params
    })
}