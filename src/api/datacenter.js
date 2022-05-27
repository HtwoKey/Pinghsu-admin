import request from '@/utils/request'

export function getPv(){
    return request({
        url:'/admin/data/pv',
        method:'get',
    })
}

export function getIp(){
    return request({
        url:"/admin/data/ip",
        method: 'get'
    })
}

export function getPvChart(){
    return request({
        url:'/admin/data/pvChart',
        method:'get'
    })
}

export function getIpChart(){
    return request({
        url:'/admin/data/ipChart',
        method:'get'
    })
}

export function getOsGroup(){
    return request({
        url:'/admin/data/osGroup',
        method: 'get'
    })
}