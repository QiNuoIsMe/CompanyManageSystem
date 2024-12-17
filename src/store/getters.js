const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userInfo.userId,//快速获取userId
  avatar: state => state.user.userInfo.staffPhoto,//用户头像
  name: state => state.user.userInfo.username//用户名称
}
export default getters
