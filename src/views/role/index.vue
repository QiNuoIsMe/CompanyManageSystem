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
        <el-table-column prop="name" align="center" width="200px" label="角色">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" size="mini"></el-input><!--row.isEdit为true 处于编辑状态-->
            <span v-else>{{ row.name }}</span><!--不处于编辑状态-->
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200px" label="启用">
          <!-- element-ui官网的table中的 自定义列结构，使用作用域插槽，获取row，column等数据-->
          <template v-slot="{ row }"><!--须在template标签内-->
            <!--编辑状态-->
            <el-switch v-if="row.isEdit"></el-switch>
            <!--非编辑状态-->
            <span v-else> {{ row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无" }} </span> <!--使用两次三目运算符-->
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" type="textarea"></el-input>
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template v-slot="{ row }"><!--v-slot="{ row }"获取当前行数据-->
            <template v-if="row.isEdit">
              <el-button type="primary" size="mini">确定</el-button>
              <el-button size="mini">取消</el-button>
            </template>

            <template v-else>
              <el-button size="mini" type="text">分配权限</el-button><!--type="text"将按钮变为链接类型-->
              <el-button @click="btnEdit(row)" size="mini" type="text">编辑</el-button>
              <el-button size="mini" type="text">删除</el-button>
            </template>
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
    <!-- @close="btnCancel"- 点击叉号关闭弹层时，sync修饰符的事件只关闭弹层，未重置表单，这里需要用@close监听事件重置表单 -->
    <el-dialog @close="btnCancel" width="500px" title="添加角色" :visible.sync="showDialog">
      <!-- 放置表单内容 -->
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称" >
          <el-input v-model="roleForm.name" style="width: 300px" size="mini"></el-input>
        </el-form-item>
        <el-form-item prop="state" label="启用">
          <!-- 重置表单数据 需要prop属性 -->
          <!-- 如果不需要校验 就不需要写 prop属性；但是需要v-model来双向绑定数据 -->
          <!-- switch默认为boolean值，此处需要设置:active-value="1"打开是1，:inactive-value="0"关闭是0。
             有:是防止把1变为字符串 :是 v-bind 的简写，用于动态绑定 HTML 属性到 Vue 实例的数据或表达式。传递非字符串类型的值 -->
          <el-switch :active-value="1" :inactive-value="0" v-model="roleForm.state" size="mini"></el-switch>
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width: 300px" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button @click="btnOK" type="primary" size="mini">确定</el-button>
              <el-button @click="btnCancel" size="mini">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>      
    </el-dialog>
  </div>
</template>
<script>
import { addRole, getRoleList } from '@/api/role';
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
      },

      //添加角色的表单结构
      roleForm:{
        name:'',
        description:'',
        state:0//默认未启用 关闭0 打开1 
      },

      //校验规则
      rules:{
        name:[{ required:true, message:'角色名称不能为空', trigger:'blur'}],
        description:[{ required:true, message:'角色描述不能为空', trigger:'blur'}],
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
      //针对每一行数据添加一个编辑标记
      this.list.forEach(item => {
        // item.isEdit = false // 添加一个属性 初始值为false..用这个表达式 点击编辑时不会切换输入框
        //数据响应式的问题 数据变化 视图更新——针对已有属性，这里的isEdit是原本没有的属性
        //添加的动态属性 不具备响应式的特点
        //this.$set(目标对象,属性名称,初始值) 可以针对目标对象 添加的属性 添加响应式
        this.$set(item,'isEdit',false)
      })
    },

    //切换分页时，请求新的数据
    changePage(newPage){
      this.pageParams.page = newPage //赋值当前页码
      this.getRoleList()
    },

    //确定按钮
    btnOK(){
      this.$refs.roleForm.validate(async isOK => {
        if(isOK){
          await addRole(this.roleForm)//调用api接口方法新增角色数据
          this.$message.success('新增角色成功')//提示消息
          this.getRoleList()//更新数据
          this.btnCancel()//关闭弹层


        }
      })
    },
    btnCancel(){
      this.$refs.roleForm.resetFields()//重置表单
      this.showDialog = false //关闭弹层
    },
    
    //点击编辑行
    btnEdit(row){
      row.isEdit = true //改变行的编辑状态
    }
  }
}
</script>

<style scoped>
.role-operate{
  padding: 10px;
}
</style>
