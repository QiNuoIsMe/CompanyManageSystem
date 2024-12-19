<template>
  <div class="container">
    <div class="app-container"><!--设置css样式(内边距及字体大小)-->
        <!-- 展示树形结构 -->
    <!-- default-expand-all默认展开所有节点 -->
      <el-tree :default-expand-all="true" :data="depts" :props="defaultProps"> <!-- :props="defaultProps"定义了如何从数据项中读取特定信息来生成树节点。defaultProps 是一个对象，它告诉 <el-tree> 如何解析 depts 数组中的每一项-->
        <!-- 节点结构 -->
        <!--element ui中树形控件的自定义节点——作用域插槽定义树节点内容 v-slot="{node, data}" 只能作用在template(node为当前节点的node对象，data为当前节点的数据) -->
        <template v-slot="{data}">
            <el-row style="width:100%;height:40px" type="flex" justify="span-between" align="middle">
                <!--type="flex"可以设置justify，align。 flex布局下水平排列justify="span-between"两头对齐。flex布局下垂直排列align="middle"垂直居中-->
                <el-col>{{data.name}}</el-col><!--传入真实数据。 写死的数据：<el-col>传智教育</el-col>-->
                <el-col :span="4">
                    <span class="tree-manager">{{data.managerName}}</span><!--传入真实数据。 写死的数据：<span class="tree-manager">管理员</span>-->
                    <!-- 下拉菜单 -->
                    <el-dropdown>
                        <!-- 希纳是区域内容 -->
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <!-- 下拉菜单选项 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>添加子部门</el-dropdown-item>
                          <el-dropdown-item>编辑部门</el-dropdown-item>
                          <el-dropdown-item>删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                      
                </el-col>
            </el-row>
        </template>

      </el-tree>
    </div>
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'; //引入封装好的api接口
export default {
  name: 'Department',
  data(){
    return{
        depts:[],//组织架构的数据
        // depts:[
        //     {
        //         name:'传智教育',
        //         managerName:'管理员',//在后端接口-获取部门列表里的属性名一致，主管名称managerName
        //         children:[{
        //             name:'总裁办',
        //             managerName:'张三',
        //         },{
        //             name:'行政部',
        //             managerName:'李四',

        //         },{
        //             name:'人事部',
        //             managerName:'王五',
        //             children:[{
        //                 name:'财务核算部'
        //             },{
        //                 name:'税务管理部'
        //             },{
        //                 name:'薪资管理部'
        //             }
        //             ]
        //         }//数据属性

        //         ]
        //     }
        // ],//组织架构的数据
        defaultProps:{
            children:'children',//读取子节点的字段名
            label:'name'//显示name(要显示的字段的名字) 指定name属性名作为节点标签文本
        }
    }
  },

  created(){
    this.getDepartment()//调用获取数据的方法methods中getDepartment
  },

  methods:{
    async getDepartment(){
        const result = await getDepartment()//调用封装好的api接口方法
        this.depts = result//把获取的数据传给depts
    }
  }
}
</script>
<!--padding设置内边距-->
<!--span是行内元素display: inline-block;设置为行内块元素-->
<style scoped>
.app-container{
    padding: 30px 140px; 
    font-size: 14px;
}
.tree-manager{
    display: inline-block;/*span是行内元素display: inline-block;设置为行内块元素*/
    width: 50px;
    margin: 10px;
}
</style>