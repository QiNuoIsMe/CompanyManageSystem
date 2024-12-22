<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate"><!--添加角色按钮-->
        <el-button size="mini" type="primary">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <el-table-column prop="name" align="center" width="200px" label="角色" />
        <el-table-column prop="state" align="center" width="200px" label="启用">
          <!-- element-ui官网的table中的 自定义列结构，使用作用域插槽，获取row，column等数据-->
          <template v-slot="{ row }"><!--须在template标签内-->
            <span> {{ row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无" }} </span> <!--使用两次三目运算符-->
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述" />
        <el-table-column align="center" label="操作">
          <template>
            <el-button size="mini" type="text">分配权限</el-button><!--type="text"将按钮变为链接类型-->
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-row>：定义一行。它可以包含多个 <el-col> 子元素 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件  -->
        <el-pagination layout="prev,pager,next"></el-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getRoleList } from '@/api/role';
export default {
  name: 'Role',
  
  data(){
    return{
      list:[],//存放角色列表
    }

  },
  created(){
    this.getRoleList()//不传参数，后端默认首页为1，每页10条
  },

  methods:{
    async getRoleList(){//不传参数，后端默认首页为1，每页10条
      const { rows } = await getRoleList()//获取数据(rows角色数据,total用于分页查询)（需查看后端返回的数据，
      this.list = rows
    }
  }
}
</script>

<style scoped>
.role-operate{
  padding: 10px;
}
</style>
