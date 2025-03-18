import request from '@/utils/request'
/**
 * 获取员工列表
 */
export function getEmployeeList(params){
    return request({
        //后端地址https://heimahr.itheima.net/api/sys/user
        //后端接口文档的获取部门列表的地址https://www.apifox.cn/apidoc/shared-e2644216-aad4-4529-a630-78f0631ab076/api-45197364
        url: '/sys/user',
        params
    })
}
/**
 * 导出员工的excel
 */
export function exportEmployee(){
    return request({
        url:'/sys/user/export',
        //改变接受数据的类型(原本为json格式)
        responseType:'blob'//使用blob二进制流的形式接受数据
    }) 
}
/**
 * 下载员工导入模板
 */
export function getExportTemplate(){
    return request({
        url:'/sys/user/import/template',
        responseType:'blob'//二进制文件流
    })
}
/**
 * 上传用户的excel
 */
export function uploadExcel(data){
    return request({
        url:'/sys/user/import',
        method: 'post',
        data//form-data类型，因为要上传文件类型
    })
}
/**
 * 删除员工
 */
export function delEmployee(id){
    return request({
        url:`/sys/user/${id}`,//反引号``，模板字符串语法,允许嵌入变量和表达式.拼接id
        method: 'delete'
    })
}
