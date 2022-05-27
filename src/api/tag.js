import request from '../utils/request'

export function tagList(){
    return request({
        url:'/admin/tags/list',
        method:'get'
    })
}

export function pageList(params){
    return request({
        url:'/admin/tags/pageList',
        method:'get',
        params:params
    })
}

export function delTag(id){
    return request({
        url:'/admin/tags/'+id,
        method:'delete',
    })
}

export function update(params){
    return request({
        url:'/admin/tags/',
        method:'put',
        data:params
    })
}

export function add(params){
    return request({
        url:'/admin/tags/',
        method:'post',
        data:params
    })
}


