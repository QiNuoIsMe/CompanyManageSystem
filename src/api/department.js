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
 * 从后端获取部门负责人 数据(封装api接口)
 */
export function getManagerList(){
    return request({
        url:'/sys/user/simple'//后端接口文档的获取部门负责人列表的地址
    })
}

/**
 * 
 * 新增部门
 */
export function addDepartment(data) { 
    return request({
        url:'/company/department',//后端接口文档的新增部门的地址，需要查看参数
        method:'post',
        data//data:data
    })
    
 }

 /**
 * 
 * 获取部门详情
 */
export function getDepartmentDetail(id){
    return request({
        url:`/company/department/${id}`//反引号``
    })
}
 /**
 * 
 * 修改/更新部门
 */
export function updateDepartment(data){
    return request({
        url: `/company/department/${data.id}`,
        method:'put',
        data
    })

}