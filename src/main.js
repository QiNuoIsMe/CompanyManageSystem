import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/styles/index.scss'; // global css

import App from './App';
import router from './router';
import store from './store';

import '@/icons'; // icon
import '@/permission'; // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

//如果是生产（打包）环境，则引入mock
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

//封装自定义指令，用来控制操作权。Vue.directive('指令名',{对象})。会自动给指令名加上v-
Vue.directive('permission',{
  //inserted会在指令作用的元素插入到页面完成以后 触发
  inserted(el,binding){
    //el指令作用的元素的DOM对象，binding 是调用时v-permission="表达式" 中表达式的信息
    //在Vuex中获取用户所拥有的权限标识。
      //userInfo?.表示若userInfo为空则不继续往下读，roles?.表示若roles为空则不继续往下读。
      // ||短路符号，若前面为空则令points为空数组
      const points = store.state.user.userInfo?.roles?.points || []
      //binding.value 是 v-permission="表达式"中的表达式的值
    if(!points.includes(binding.value)){//如果该员工的权限标识不包含 表达式中的权限标识(该员工不存在该权限)，就删除/禁用改元素
      el.remove()//删除元素
      el.disabled = true//隐藏元素
      // 线上的权限数据和线下的代码进行对应（v-permission="表达式"表达式中的权限标识要存在）
      //如在src/views/employee/index.vue中的 添加员工按钮上应用，需要有对应权限标识
      //<el-button v-permission="'add-employee'" size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>

    }
  }
})


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
