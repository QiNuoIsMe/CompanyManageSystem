//请求模块api
import request from '@/utils/request'

export function login(data) {
  //返回数据(promise对象)
  return request({
    //后端网址-https://heimahr.itheima.net/api/sys/login
    url: 'sys/login',
    method: 'post',
    data // data:data
  })
}

export function getUserInfo(){
  return request({
    url: '/sys/profile',//地址再后端接口文档中用户相关/获取用户信息里
    method: 'get'//不写默认get
  })
}

