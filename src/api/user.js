import store from '@/store'
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    // url: '/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/sys/profile',
    headers: {
      'Authorization': `Bearer ${store.getters.token}` // 假设 token 存储在 localStorage 中
    }
  })
}

/**
 * 更新密码
 * **/
export function updatePassword(data) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}

export function getUserDetailById(id) {
  return request({
    url:`/salarys/modify/${id}`,
    // method: 'post'/////-------post->get
    method: 'get'
  })
}
