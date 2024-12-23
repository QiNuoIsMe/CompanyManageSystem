import request from '@/utils/request'
/**
 * 获取分页查询角色列表
 */
export function getRoleList(params) { 
    return request({
        url:'/sys/role',
        params:params//查询参数(地址参数)，此处不是data请求参数了
        // URL 查询参数 (params)：适用于传递过滤条件、分页信息等，它们会被添加到 URL 的末尾作为查询字符串的一部分。这种方式适合传递少量的、非敏感的数据。
    })
 }

/**
 * 新增角色
 */
export function addRole(data){
    return request({
        url:'/sys/role',
        method:'post',
        data:data
    })
}
/**
 * 修改角色
 */
export function updateRole(data){
    return request({
        url:`/sys/role/${data.id}`,//后端接口传回的data中包含四个字段，id name description state
        method:'put',
        data
    })
}
/***
 * 删除角色
 */
export function delRole(id) { 
    return request({
        url:`/sys/role/${id}`,
        method:'delete'
    })
 }