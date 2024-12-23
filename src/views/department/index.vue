<template>
  <div class="container">
    <div class="app-container"><!--设置css样式(内边距及字体大小)-->
        <!-- 展示树形结构 -->
    <!-- :default-expand-all="true"可以写为default-expand-all默认展开所有节点 -->
    <!-- expand-on-click-node默认点击展开/收缩所有节点 -->
      <el-tree :expand-on-click-node="false" :default-expand-all="true" :data="depts" :props="defaultProps"> <!-- :props="defaultProps"定义了如何从数据项中读取特定信息来生成树节点。defaultProps 是一个对象，它告诉 <el-tree> 如何解析 depts 数组中的每一项-->
        <!-- 节点结构 -->
        <!-- 插槽在vue中是一种很常见的写法，让父组件可以向子组件指定位置插入html结构，也是一种组件间通信的方式。一共有三种分类:默认插槽、具名插槽、作用域插槽， -->
        <!--element ui中树形控件的自定义节点——作用域插槽定义树节点内容 v-slot="{node, data}" 只能作用在template(node为当前节点的node对象，data为当前节点的数据) -->
        <template v-slot="{data}">
            <el-row style="width:100%;height:40px" type="flex" justify="span-between" align="middle">
                <!--type="flex"可以设置justify，align。 flex布局下水平排列justify="span-between"两头对齐。flex布局下垂直排列align="middle"垂直居中-->
                <el-col>{{data.name}}</el-col><!--传入真实数据。 写死的数据：<el-col>传智教育</el-col>-->
                <el-col :span="4">
                    <span class="tree-manager">{{data.managerName}}</span><!--传入真实数据。 写死的数据：<span class="tree-manager">管理员</span>-->
                    <!-- 下拉菜单  $event 实参表示类型-->
                    <el-dropdown @command="operateDept($event,data.id)">
                        <!-- 显示区域内容 -->
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <!-- 下拉菜单选项 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                          <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                          <el-dropdown-item command="del">删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                      
                </el-col>
            </el-row>
        </template>

      </el-tree>
    </div>
    <!-- 放置弹层(组件add-dept.vue) -->
    <!-- .sync修饰符表示会接受子组件的事件 update:showDialog，会将 该事件的值 传递 给data中的 属性showDialog-->
    <!--ref="addDept",获取子组件实例  :currentNodeId为prop属性，用于与子组件add-dept.js传值， "currentNodeId"为变量名 -->
    <add-dept ref="addDept" @updateDepartment="getDepartment" :current-node-id="currentNodeId" :show-dialog.sync="showDialog"></add-dept>
  </div>
</template>

<script>
import { delDepartment, getDepartment } from '@/api/department'; //引入封装好的api接口
import { transListToTreeData } from '@/utils';
import AddDept from './components/add-dept.vue'; //引入新增部门的组件add-dept.vue

export default {
  name: 'Department',
  components:{ AddDept },//引入组件，可以作为标签<AddDept />
  data(){
    return{
      currentNodeId:null,//存储当前点击下拉菜单的节点的id
        showDialog: false,//隐藏弹层
        depts: [],//组织架构的数据
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
    async getDepartment(){//获取部门数据
        const result = await getDepartment()//调用封装好的api接口方法
        //this.depts = result//把获取的数据传给depts(这里的数据是列表型)
        this.depts = transListToTreeData(result,0)//调用utils/index.ks中封装的transListToTreeData方法，将列表型数据转化为树形数据
    },
    //操作部门方法
    operateDept(type,id){
        if(type === 'add'){
            //添加子部门
            this.showDialog = true//显示弹层
            this.currentNodeId = id //将当前节点id赋值给变量
        }else if(type === 'edit'){
           //编辑子部门
            this.showDialog = true//显示弹层
            this.currentNodeId = id //将当前节点id赋值给变量，要用id获得数据
            //父组件调用子组件的方法 来获取数据（①在标签<add-dept>中增加属性ref="addDept",获取子组件实例，）
            //this.currentNodeId = id 更新了props-是异步动作
            //this.$refs.addDept.getDepartmentDetail()直接调用子组件的方法-是同步的方法，比异步先进行
            //即未完成id赋值就执行了获取数据的操作，有问题——使用nextTick方法——等待上一步数据渲染完成，才执行内部的回调函数
            this.$nextTick(() => {
              this.$refs.addDept.getDepartmentDetail()//②this.$refs.addDept是弹层组件(子组件add-dept)的实例对象，相当于子组件的this ，调用子组件的方法获取表单数据
            })
        }else{//删除部门
          //$confirm打开消息提示，返回promise，成功-then；失败-catch
          this.$confirm('确认删除此部门吗').then(async () => {
            await delDepartment(id) //导入 并 调用api接口删除数据
            this.$message.success('删除成功')
            this.getDepartment()//重新拉取数据
          })

        }
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
    margin: 30px;
}
</style>