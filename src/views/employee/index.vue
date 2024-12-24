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
        <!-- :data="depts"——双向绑定数据depts。:props="defaultProps"——props为属性名，说明如何解析数据  
        :default-expand-all="true"——默认展开所有节点.:expand-on-click-node="false"——关闭点击折叠/展开 所有节点
         :highlight-current="true"选中后高亮-->
        </el-tree>
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary">添加员工</el-button>
          <el-button size="mini">excel导入</el-button>
          <el-button size="mini">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <!-- 分页 -->
      </div>
    </div>
  </div>
</template>
<script>
import { getDepartment } from '@/api/department'
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
      }

    }
  },
  created() {
    this.getDepartment()//调用方法获取数据
  },
  methods: {
    async getDepartment() {
      //递归方法 将列表转化为树形
      let result = await getDepartment()//api接口获取部门列表数据（异步）
      this.depts = transListToTreeData(result, 0)// utils工具中 将列表转化为树形的方法
      // console.log(this.depts[0])
      this.queryParams.departmentId = this.depts[0].id//记录首个节点id
      // 设置选中节点
      // 树组件渲染是异步的 等到更新完毕
      this.$nextTick(() => {
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
    },
    //el-ui中的el-tree方法
    selectNode(node){
      this.queryParams.departmentId = node.id
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