import request from '@/utils/request'
/**
 * 获取员工列表
 */
export function getEmployeeList(params){
    return request({
        //后端地址https://heimahr.itheima.net/api/sys/user
        //后端接口文档的获取部门列表的地址https://www.apifox.cn/apidoc/shared-e2644216-aad4-4529-a630-78f0631ab076/api-45197364
        url: 'sys/user',
        params
    })
}