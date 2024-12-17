import { getUserInfo, login } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/auth'
const state={
  token:getToken(),//从缓存中读取初始值
  // token:null
  userInfo:{}//存储用户资料的状态
}

const mutations={
  setToken(state,token){
    state.token=token
    //同步到缓存(调用@/utils/auth.js中的setToken)
    setToken(token)
  },
  removeToken(state){
    //删除Vuex的token
    state.token=null
    removeToken
  },
  setUserInfo(state,userInfo){
    state.userInfo = userInfo//通过mutation设置用户信息状态state
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
  },
  //获取用户基本资料
  async getUserInfo(context){
    const result = await getUserInfo()//导入api/user.js中的getUserInfo方法
    context.commit("setUserInfo",result)//调用mutation中setUserInfo方法，进行提交(将数据共享到vuex上)
  },
  //退出登录
  logout(context){
    context.commit('removeToken')//删除token
    context.commit('setUserInfo',{})//将用户信息设置为空
  }
}

export default{
  namespaced:true,//开启命名空间
  state,
  mutations,
  actions
}