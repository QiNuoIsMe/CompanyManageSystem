<template>
  <div class="container">
    <div class="app-container"><!--设置css样式(内边距及字体大小)-->
        <!-- 展示树形结构 -->
    <!-- default-expand-all默认展开所有节点 -->
      <el-tree :default-expand-all="true" :data="depts" :props="defaultProps" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Department',
  data(){
    return{
        depts:[
            {
                name:'传智教育',
                children:[{
                    name:'总裁办'
                },{
                    name:'行政部'
                },{
                    name:'人事部',
                    children:[{
                        name:'财务核算部'
                    },{
                        name:'税务管理部'
                    },{
                        name:'薪资管理部'
                    }
                    ]
                }//数据属性

                ]
            }
        ],//组织架构的数据
        defaultProps:{
            children:'children',//读取子节点的字段名
            label:'name'//显示name(要显示的字段的名字)
        }
    }
  }
}
</script>
<!--padding设置内边距-->
<style scoped>
.app-container{
    padding: 30px 140px; 
    font-size: 14px;
}
</style>