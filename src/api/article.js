import request from '../utils/request'
/**
 * 文章列表
 * @param {page,rows} params 
 */
export function list(params){
    return request({
        url:'/admin/article/list',
        method:'get',
        params:params
    })
}
/**
 * 根据id获取文章
 * @param {id} id 
 */
export function fetchArticle(id) {
    return request({
      url: 'admin/article/'+id,
      method: 'get',
    })
  }
/**
 * 创建文章
 * @param {*} params 
 */
export function createArticle(params) {
  return request({
    url: 'admin/article/',
    method: 'post',
    data:params
  })
}
/**
 * 修改文章
 * @param {*} params 
 */
export function updateArticle(params) {
  return request({
    url: 'admin/article/update',
    method: 'post',
    data:params
  })
}
/**
 * 删除文章
 * @param {*} id 
 */
export function delArticle(id){
  return request({
    url: 'admin/article/'+id,
    method: 'delete'
  })
}
/**
 * 修改文章评论开关
 * @param {*} params 
 */
export function changeSwitch(params){
  return request({
    url:'admin/article/changeSwitch',
    method:'post',
    data: params
  })
} 
/**
 * 修改文章发布状态
 * @param {*} params 
 */

export function changeStatus(params){
  return request({
    url:'admin/article/changeStatus',
    method: 'post',
    data: params
  })
}