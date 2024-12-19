import request from '@/utils/request'
/**
 * 从后端获取组织架构数据
 */
export function getDepartment(){
    return request({
        url:'/company/department'//后端接口文档的获取部门列表的地址https://www.apifox.cn/apidoc/shared-e2644216-aad4-4529-a630-78f0631ab076/api-45197364
    })
}

/**
 * 
 * 从后端获取部门负责人 数据
 */
export function getManagerList(){
    return request({
        url:'/sys/user/simple'//后端接口文档的获取部门负责人列表的地址
    })
}