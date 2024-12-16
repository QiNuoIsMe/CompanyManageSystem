import { login } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/auth'
const state={
  token:getToken()//从缓存中读取初始值
  // token:null
}

const mutations={
  setToken(state,token){
    state.token=token
    //同步到缓存(调用@/utils/auth.js中的setToken)
    setToken(token)
  },
  removeToken(){
    //删除Vuex的token
    state.token=null
    removeToken
  }
}

const actions={
  //context上下文，传入参数
  async login(context,data){
    console.log(data)
    //
    //async await,只有返回的promise成功执行才会执行await下方代码；若执行失败axios(utils中request)已进行处理封装
    const token = await login(data)//导入login方法import {login} from '@/api/user'(网址中返回的数据data是token)
    //返回一个token 123456
    // context.commit('setToken','123456')
    context.commit('setToken',token)
  }
}

export default{
  namespaced:true,//开启命名空间
  state,
  mutations,
  actions
}