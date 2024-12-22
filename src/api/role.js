import request from '@/utils/request'
/**
 * 获取分页查询角色列表
 */
export function getRoleList(params) { 
    return request({
        url:'/sys/role',
        params:params//查询参数(地址参数)，此处不是data请求参数了
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