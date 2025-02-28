import SvgIcon from '@/components/SvgIcon'; // svg component
import Vue from 'vue';

// register globally
Vue.component('svg-icon', SvgIcon) //一、全局注册组件

// 二、下面三行代码的任务是 把 同级目录的 svg目录下的.svg图片引入到项目中来
// 相当于把svg下的所有的svg图片打包到了项目中
// 如果想用svg图片 就在svg目录下去寻找就可以了
    //1、require.context(目标目录,是否扫描子目录，正则表达式)扫描目录中的文件
    //2、数组方法 map =foreach(循环)
    // map是循环每一项 svg图片 map(()=>{})
    //req函数能够引用图片到项目中
    // 3、使用函数调用，参数微req——将所有的svg都引用到项目中
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

//三、将svg打包到symbol标签中——在vue.config.js中配置webpack loader插件
//四、插件中加了icon-前缀，因此在引用时也需要加icon-前缀——在/src/component/SvgIcon/index.vue-中添加



