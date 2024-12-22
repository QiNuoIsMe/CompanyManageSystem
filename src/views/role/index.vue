<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate"><!--添加角色按钮-->
        <!-- @click="showDialog = true"此处只有一行代码就不再写个方法了 -->
        <el-button @click="showDialog = true" size="mini" type="primary">添加角色</el-button>
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
        <!-- 放置分页组件  属性名见el-ui官网分页查询的attribution-->
        <el-pagination 
        @current-change="changePage"
        :page-size="pageParams.pagesize"
        :current-page="pageParams.page"
        :total="pageParams.total"
        layout="prev,pager,next"></el-pagination>
      </el-row>
    </div>
    <!-- 放置弹层，此处就不用子组件了 -->
    <el-dialog width="500px" title="添加角色" :visible.sync="showDialog">
      <!-- 放置表单内容 -->
      <el-form>
        <el-form-item label="角色名称" label-width="120px">
          <el-input style="width: 300px" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="启用" label-width="120px">
          <el-switch size="mini"></el-switch>
        </el-form-item>
        <el-form-item label="角色描述" label-width="120px">
          <el-input type="textarea" :rows="3" style="width: 300px" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="7">
              <el-button type="primary" size="mini">确定</el-button>
              <el-button size="mini">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>      
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList } from '@/api/role';
export default {
  name: 'Role',
  
  data(){
    return{
      showDialog: false,
      list:[],//存放角色列表
      //将分页信息放置到一个对象中
      pageParams:{
        page:1,//第几页，属性名需要与传入后端的字段名保持一致
        pagesize:5,//每页多少条
        total:0//数据总条数
      }
    }

  },
  created(){
    this.getRoleList()//不传参数，后端默认首页为1，每页10条
  },

  methods:{
    async getRoleList(){//不传参数，后端默认首页为1，每页10条
      const { rows, total } = await getRoleList(this.pageParams)//获取数据(rows角色数据,total用于分页查询)（需查看后端返回的数据，
      this.list = rows
      this.pageParams.total = total
    },

    //切换分页时，请求新的数据
    changePage(newPage){
      this.pageParams.page = newPage //赋值当前页码
      this.getRoleList()
    }
  }
}
</script>

<style scoped>
.role-operate{
  padding: 10px;
}
</style>
