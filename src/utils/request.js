import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  // baseURL:'/api',// 基础地址
  baseURL:process.env.VUE_APP_BASE_API,// 基础地址(不同环境下基础地址不同)(开发/生产环境)
  timeout:10000// 超时，单位毫秒，10000ms=10s
})// 创建一个新的axios实例

// 请求拦截器
// 两个参数，成功调用第一个回调函数，失败调用第二个
service.interceptors.request.use((config)=>{
  // 注入token
  // this.$store.getters但是这里不是组件，是actions。所以使用导出的store
  // store.getter.token => 将toekn放入请求头里面
  if(store.getters.token){
    config.headers.Authorization = 'Bearer ${store.getters.token}'
  }
  return config
},(error)=>{
  // 失败执行promise
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response)=>{
  // axios默认包裹了data,解构数据
  const {data,message,success} = response.data
  if(success){
    return data
  }else{
    // debugger
    Message({type:'error',message})
    return Promise.reject(new Error(message))
  }
},(error)=>{
  // debugger
  // 提示错误消息error.message。之前是this.$message.warning()。
  // 此处引入element-ui中Message方法
  Message({type:'error',message:error.message})
  return Promise.reject(error)
})

export default service