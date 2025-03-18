//使用getters开放访问 属性——能够快捷访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userInfo.userId,//快速获取userId
  avatar: state => state.user.userInfo.staffPhoto,//用户头像
  name: state => state.user.userInfo.username,//用户名称
  routes: state => state.user.routes,//使用getters开放路由的访问信息
  company: state => state.user.userInfo.company,//公司名称
  departmentName: state => state.user.userInfo.departmentName//部门名称
}
export default getters
