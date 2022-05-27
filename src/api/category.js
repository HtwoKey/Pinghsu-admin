import request from '../utils/request'

export function list(){
    return request({
        url:'/admin/category/list',
        method:'get'
    })
}

export function pageList(params){
    return request({
        url:'/admin/category/page',
        method:'get',
        params:params
    })
}

export function add(params){
    return request({
        url:'/admin/category/',
        method:'post',
        data:params
    })
}

export function delCategory(id){
    return request({
        url:'/admin/category/'+id,
        method:'delete'
    })
}

export function update(params){
    return request({
        url:'/admin/category/update',
        method:'post',
        data:params
    })
}