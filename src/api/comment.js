import request from '../utils/request'
/**
 * 评论列表
 * @param {page,rows} params 
 */
export function list(params){
    return request({
        url:'/admin/comments/listPage',
        method:'get',
        params:params
    })
}


export function delComment(id){
    return request({
        url:'/admin/comments/'+id,
        method:'delete',
    })
}

export function changeStatus(id){
    return request({
        url:'/admin/comments/changeStatus/'+id,
        method: 'get'
    })
}

export function replyComment(params){
    return request({
        url:'/admin/comments/reply',
        method: 'post',
        data: params
    })
}

export function getUnreadCount(){
    return request({
        url:'/admin/comments/unreadCount',
        method: 'get'
    })
}