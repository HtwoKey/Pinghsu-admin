import request from '@/utils/request'

export function upload(param, config) {
  return request({
    url: '/admin/oss/',
    method: 'post',
    data: param,
    config: config
  })
}
