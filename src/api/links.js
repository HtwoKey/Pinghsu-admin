import request from '../utils/request'
/**
 * 友链列表
 * @param {page,rows} params 
 */
export function list(params){
    return request({
        url:'/admin/links/pageList',
        method:'get',
        params:params
    })
}


export function addLinks(params){
    return request({
        url:'/admin/links/',
        method:'post',
        data: params
    })
}

export function deleteLinks(id){
    return request({
        url:"/admin/links/"+id,
        method:'delete'
    })
}

export function updateLinks(params){
    return request({
        url:'/admin/links/',
        method:'put',
        data:params
    })
}

export function applyList(params){
    return request({
        url:'/admin/links/applyList',
        method:'get',
        params:params
    })
}

export function getUntreatedCount(){
    return request({
        url:'/admin/links/untreated',
        method: 'get'
    })
}