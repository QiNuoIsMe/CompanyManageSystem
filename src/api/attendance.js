import request from '@/utils/request'
// 获取考勤列表(查询考勤数据列表)
export function getAttendancesList(params) {
  return request({
    url: '/attendances',
    method:'get',
    params
  })
}
// //获取考勤详情(根据用户id和月份查询已归档的考勤明细)
export function getAtteArchiveDetail(data) {
  return request({
    url: `/attendances/archive/${data.userId}/${data.yearMonth}`,
    method:'get',
  })
}
/**编辑用户的考勤记录
 */
export function updateAttendance(data) {
  return request({
    url: `/attendances/${data.userId}`,
    method: 'put',
    data
  })
}
/**
 * 归档历史列表
 */
export function getArchivingList(params) {
  return request({
    url: '/attendances/reports/year',
    method:'get',
    params
  })
}
//归档历史列表--详情
export function getArchivingCont(params) {
  return request({
    url: `/attendances/reports/${params.atteArchiveMonthlyId}`,
    params
  })
}

export function importArchive(data) {
  return request({
    url: '/archive/atte/export',
    method: 'post',
    data
  })
}
// 提醒接口
export function notify() {
  return request({
    url: '/notify/mail',
    method: 'post'
  })
}
// 月度考勤记录归档
export function archives(params) {
  return request({
    url: '/attendances/archives',
    params
  })
}
/**
 * 新建考勤报表
 */
export function newReports(params) {
  return request({
    url: '/attendances/newReports',
    params
  })
}
export function information() {
  return request({})
}

export function pay() {
  return request({})
}
//获取月考勤报表数据
export function reportFormList(params) {
  return request({
    url: '/attendances/reports',
    params
  })
}

// 请假保存--------put-》post
export function leaveSave(data) {
  return request({
    url: '/cfg/leave',
    method: 'put',
    // method: 'post',
    data
  })
}
// 请假获取--------post->get
export function getLeave(data) {
  return request({
    url: '/cfg/leave/list',
    // method: 'get',
    method: 'post',
    data
  })
}
// 扣款设置保存--------put->post
export function deductionsSave(data) {
  return request({
    url: '/cfg/deduction',
    // method: 'put',
    method: 'post',
    data
  })
}
// 获取扣款设置
export function getDeductions(data) {
  return request({
    url: '/cfg/ded/list',
    method: 'post',
    data
  })
}

// 加班配置保存
export function overtimeSave(data) {
  return request({
    url: '/cfg/extDuty',
    method: 'put',
    data
  })
}

// 获取加班配置---------post->get
export function getOvertime(data) {
  return request({
    url: '/cfg/extDuty/item',
    // method: 'post',
    method: 'get',
    data
  })
}
// 考勤数据保存
export function attendanceSave(id) {
  return request({
    url: '/cfg/atte',
    method: 'put',
    // data
    id
  })
}
// 考勤数据保存---------post->get
export function getAttendance(id) {////参数改为id，method改为get！！！！！！！！！！！！！！！
  return request({
    url: '/cfg/atte/item',
    // method: 'post',
    method: 'get',
    data
  })
}
export function fileUpdate(data) {
  return request({
    url: `/employee/archives/${data.month}`,
    method: 'put',
    data
  })
}
