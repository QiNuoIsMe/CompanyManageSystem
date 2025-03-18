import { getUserInfo, login } from '@/api/user'
import { constantRoutes, resetRouter } from '@/router'
import { getToken, removeToken, setToken } from '@/utils/auth'
const state={ //------管理应用的状态state------
  token:getToken(),//从缓存中读取初始值
  // token:null
  userInfo:{},//存储用户资料的状态
  routes: constantRoutes//静态路由的数组
}

const mutations={ //-----修改状态的方法mutations------
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
    state.userInfo = userInfo//将用户信息存储到state中//通过mutation设置用户信息状态state
  },
  setRoutes(state,newRoutes){
    state.routes = [...constantRoutes,...newRoutes]//更新state，静态路由 + 动态路由(两个都要加...拷贝对象)
  }
}

const actions={// -----异步操作actions-------
  //context上下文，传入参数
  async login(context,data){ //context是一个对象，包含了state,commit,dispatch等方法
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
    return result//Vuex用户模块action中返回result信息
  },
  //退出登录
  logout(context){
    context.commit('removeToken')//删除token
    context.commit('setUserInfo',{})//将用户信息设置为空
    //重置路由,清除上一个用户的路由权限
    resetRouter()
  }
}

export default{
  namespaced:true,//开启命名空间
  state,
  mutations,
  actions
}