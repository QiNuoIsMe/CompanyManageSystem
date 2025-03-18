import router from '@/router'; //引入路由的前置守卫和后置守卫
import store from '@/store'; // token
//导入进度条nprogress，及其样式
import { asyncRoutes } from '@/router'; //引入动态路由
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
/**
 * 前置守卫（参数是一个回调函数）
*/
const whiteList = ['/login','/404']// 白名单的路径
router.beforeEach(async (to,from,next) =>{//to去的路径，from从哪来
  nprogress.start()// 开启进度条
  if(store.getters.token){
    //存在token
    if(to.path === '/login'){
      //跳转主页
      next('/')//中转主页
      //next('地址') 并没有执行后置守卫
      nprogress.done()// 解决手动输入地址时，进度条不关闭的问题
      
    }else{
      //判断是否获取过资料
      if(!store.getters.userId) {//未获取资料
         const { roles } = await store.dispatch("user/getUserInfo")//await获取完资料再去完成跳转
        // console.log(roles.menus) // 该角色具有的权限模块 数组 不确定 可能是8个 1个 0个,roles.menus下是功能模块的名称，如department
        // console.log(asyncRoutes) //动态路由(包含所有权限模块的路由) 数组 8个，包含路径什么的('/department')
        
        //筛选出该员工具有的权限，添加动态路由。filter方法会返回一个新数组 filterRoutes，包含所有满足条件的路由
        const filterRoutes = asyncRoutes.filter( item => {
          //filter方法如果return true则返回该数据到数组(路由)，如果return false则过滤掉该数据(路由)
          return roles.menus.includes(item.name)
        })//筛选后的路由

        store.commit('user/setRoutes',filterRoutes)
        //添加动态路由信息到路由表，需要把404页面添加到最后，把src\router\index.js下的404页面删掉
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true}])// 动态添加路由，并且添加一个 兜底路由 来处理未匹配的路由

        //router添加动态路由之后，需要转发一下
        next(to.path) //目的是让路由拥有信息router的已知缺陷，不然刷新会404
      }else{
        //next() 无地址默认执行后置守卫
        next()// 放行
      }
      
    }
  }else{
    //没有token
    if(whiteList.includes(to.path)){//或者whiteList.indexOf(to.path)>-1能找到该路径的索引
      next()//去的路径在白名单里，放行
    }else{
      next('/login')
      nprogress.done()//解决手动输入地址时，进度条不关闭的问题
    }
  }
  
})

/**
 * 后置守卫（参数也是一个回调函数）
*/
router.afterEach(() => {
  console.log(123)
  nprogress.done()
})