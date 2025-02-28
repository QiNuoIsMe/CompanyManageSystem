<template>
  <div class="container">
    <div class="app-container">
      员工
      <div class="left">
        <el-input style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small" placeholder="输入员工姓名全员搜索" />
        <!-- 树形组件 -->
        <el-tree 
        ref="deptTree"
        node-key="id"
        :data="depts" 
        :props="defaultProps"  
        :default-expand-all="true"
        :expand-on-click-node="false"
        :highlight-current="true"
        @current-change="selectNode">
        <!--@current-change表示 -->
        <!-- ref="deptTree"——给树组件起个实例 名字，方便调用方法。node-key="id"——树节点的唯一标识。
          :data="depts"——双向绑定数据depts。:props="defaultProps"——props为属性名，说明如何解析数据  
        :default-expand-all="true"——默认展开所有节点.:expand-on-click-node="false"——关闭点击折叠/展开 所有节点
         :highlight-current="true"选中后高亮。@current-change表示current-change事件会在当前选中的树节点发生变化时触发，selectNode为事件触发时调用的方法名-->
        </el-tree>
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary">添加员工</el-button>
          <el-button size="mini">excel导入</el-button>
          <el-button size="mini">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像" width="80px">
            <template v-slot="{row}">
              <!-- :size="30"中:表示数字，只需写数字不用写px -->
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" ></el-avatar>
              <span v-else class="username">{{row.username.charAt(0)}}</span><!--如果没有头像，则显示姓名的首字母，样式为username的样式-->
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{row}">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment ===2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作">
          <!-- 按钮放在template中，可以插槽,用v-slot获取数据 -->
            <template >
              <el-button size="mini" type="text">查看</el-button><!--type="text"表示按钮样式,为链接形式-->
              <el-button size="mini" type="text">角色</el-button>
              <el-button size="mini" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
          <!--align	flex 布局下的垂直排列方式 top(垂直向上对齐)/middle(垂直居中)/bottom(垂直向下对齐)-->
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <el-pagination 
            layout="total,prev,pager,next"
            :total="1000"
          />
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { getDepartment } from '@/api/department'
import { getEmployeeList } from '@/api/employment'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Employee',
  data() {
    return {
      depts: [],//组织数据
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      //存储查询参数（后端中获取员工列表有4个查询参数）
      queryParams: {
        departmentId: null//部门id
      },
      list:[] //存储员工数据

    }
  },
  created() {
    this.getDepartment()//调用方法获取数据
  },
  methods: {
    //获取部门列表数据方法，在钩子函数中调用
    async getDepartment() {
      //递归方法 将列表转化为树形
      let result = await getDepartment()//api接口获取部门列表数据（异步）
      this.depts = transListToTreeData(result, 0)// utils工具中 将列表转化为树形的方法
      // console.log(this.depts[0])
      this.queryParams.departmentId = this.depts[0].id//记录首个节点id
      // 设置选中节点
      // 树组件渲染是异步的 等到数据更新完毕
      this.$nextTick(() => {
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)//这个setCurrentKey方法是el-tree组件的方法(可查看文档)
      })
      //在获取部门列表数据 且设置选中节点后，调用获取员工列表方法
      this.getEmployeeList()
    },
    //el-ui中的el-tree方法
    selectNode(node){//点击树节点时触发，设置某个节点的选中状态，必须在el-tree上设置node-key属性(node-key——树节点的唯一标识)
      this.queryParams.departmentId = node.id
      this.getEmployeeList()//更新id后，重新获取员工列表数据
    },
    //获取员工列表
    async getEmployeeList(){
      const {rows} = await getEmployeeList(this.queryParams)//调用api接口获取员工列表数据,传入查询参数,获取数据,解构赋值,获取rows
      this.list =  rows //存入list
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}
</style>