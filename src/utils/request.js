import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import NProgress from 'nprogress' // 进度条
import router from '../router/index'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    NProgress.start()// 进度条开始
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)
// response 拦截器
service.interceptors.response.use(
  response => {
    NProgress.done()// 关闭进度条
    const res = response.data
    switch (res.code) {
      case 200:
        return response.data
      case 400:
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
        break
      case 401:
        MessageBox.confirm(
          res.message,
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            router.push({
              path: '/login'
            })
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        break
      case 404:
        router.push({
          path: '/404'
        })
        break
      case 504:
        Message({
          message: '连接服务器失败，请稍后在试',
          type: 'error',
          duration: 5 * 1000
        })
        break
      default :
        Promise.reject('error')
    }
  },
  error => {
    NProgress.done()// 关闭进度条
    const code = error.data.code
    console.log('err' + error) // for debug

    switch (code) {
      case 401:
        MessageBox.confirm(
          error.message,
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            router.push({
              path: '/login'
            })
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        break
    }

    if (code != null) {
      Message({
        message: error.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: '连接服务失败，请稍后在试',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
