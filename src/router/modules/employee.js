import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  children: [
    //第一个二级路由
    {
      path: '',
      name: 'employee',
      component: () => import('@/views/employee'),
      meta: {
        title: '员工',
        icon: 'people'
      }
    },
    //第二个二级路由
    {
      path: '/employee/detail',// 员工详情的地址(自己命名)
      component: () => import('@/views/employee/detail'),//懒加载，引入detail.vue组件
      hidden: true,//表示隐藏在左侧菜单
      meta: {
        title: '员工详情'//二级路由的标题，显示在导航的文本
      }
    }
  ]
}
