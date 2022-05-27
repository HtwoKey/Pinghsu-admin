import request from '../utils/request'


export function login(params) {
    return request({
      url: '/admin/login',
      method: 'post',
      data: params
    })
  }
  
  export function getInfo(token) {
    return request({
      url: '/admin/user/info',
      method: 'get',
      params: { token }
    })
  }
  
  export function logout(token) {
    return request({
      url: '/admin/logout',
      method: 'post',
      params:{token}
    })
  }

export function add(params){

}


export function del(id){

}

export function list(){
    return request({
        url:'/admin/user/list',
        method:'get'
    })
}

export function update(params){

}