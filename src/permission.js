import router from '@/router'; //引入路由的前置守卫和后置守卫
import store from '@/store'; // token
//导入进度条nprogress，及其样式
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

/**
 * 前置守卫（参数是一个回调函数）
*/
const whiteList = ['/login','/404']// 白名单的路径
router.beforeEach((to,from,next) =>{//to去的路径，from从哪来
  nprogress.start()// 开启进度条
  if(store.getters.token){
    //存在token
    if(to.path === '/login'){
      //跳转主页
      next('/')//中转主页
      //next('地址') 并没有执行后置守卫
      nprogress.done()// 解决手动输入地址时，进度条不关闭的问题
      
    }else{
      //next() 无地址默认执行后置守卫
      next()// 放行
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