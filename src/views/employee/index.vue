<template>
  <div class="container">
    <div class="app-container">
      <!-- 员工 -->
      <div class="left">
        <!-- 搜索框 -->
          <!--prefix-icon="el-icon-search"表示输入框前面的图标，size="small"表示输入框大小，placeholder="输入员工姓名全员搜索"表示输入框提示文字,
           v-model="queryParams.keyword"表示双向绑定关键字数据，
            @input="changeValue"表示监听事件input只要内容发生变化就会触发，调用changeValue方法，更符合应用场景，此处不用@chang是因为change事件是离开焦点触发-->
        <el-input 
        style="margin-bottom:10px" 
        type="text" 
        prefix-icon="el-icon-search" 
        size="small" 
        placeholder="输入员工姓名全员搜索"
        v-model="queryParams.keyword"
        @input="changeValue"
         />
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
          <!-- 添加员工按钮,@click触发路由跳转事件 -->
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')" >添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog=true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
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
            <template v-slot="{row}"><!--作用域插槽，获取当前页数据.后端接口通常会支持分页查询，即根据 page（当前页码）和 pagesize（每页条数）参数返回 当前页的数据，而不是全部数据。-->
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment ===2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作">
          <!-- 按钮放在template中，可以插槽,用v-slot获取数据 -->
            <template v-slot="{ row }">
              <el-button size="mini" type="text">查看</el-button><!--type="text"表示按钮样式,为链接形式-->
              <el-button size="mini" type="text">角色</el-button>
              <!-- 使用element-ui中的气泡确认框el-popconfirm 包裹 删除按钮。在element文档中查看(复制) -->
              <el-popconfirm
                title="确定删除这条数据吗？"
                @onConfirm="confirmDel(row.id)"
              >
                <!--① @onConfirm="confirmDel(row.id)"监听事件，调用方法confirmDel，传入id  ②具名插槽 slot="reference" -->
                <el-button slot="reference" style="margin-left: 10px;" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
          <!--align	flex 布局下的垂直排列方式 top(垂直向上对齐)/middle(垂直居中)/bottom(垂直向下对齐)-->
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <el-pagination 
            layout="total,prev,pager,next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
          <!--layout="total,prev,pager,next"表示分页布局，total表示总条数，prev表示上一页，pager表示页码，next表示下一页
          注意:total="total"表示总条数，她不在queryParams里。:current-page="queryParams.page"表示当前页，:page-size="queryParams.pagesize"表示每页显示条数
          @current-change="changePage"表示current-change事件会在页码改变时触发，changePage为事件触发时调用的方法名
          -->
        </el-row>
      </div>
    </div>
    <!-- 导入excel组件, @uploadSuccess="getEmployeeList"父组件监听子组件import-excel.vue的上传成功的事件，如果监听到该事件，说明上传成功，需调用 重新加载数据方法 -->
    <import-excel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList" />
  </div>
</template>
<script>
import { getDepartment } from '@/api/department'
import { delEmployee, exportEmployee, getEmployeeList } from '@/api/employee'
import { transListToTreeData } from '@/utils'
import FileSaver from 'file-saver'
import ImportExcel from './components/import-excel.vue'
export default {
  name: 'Employee',
  components:{
    ImportExcel//在员工管理页面-导入import-excel.vue组件并注册使用
  },
  data() {
    return {
      depts: [],//组织数据
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      //存储查询参数（后端中获取员工列表有4个查询参数）
      queryParams: {
        departmentId: null,//部门id
        page:1,//当前页
        pagesize:10,//每页显示条数
        keyword:''//关键字// 模糊搜索字段
      },
      total:0,//总条数
      list:[], //存储员工数据
      showExcelDialog: false,//控制导入excel弹窗显示和隐藏

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

    //el-ui中的el-tree方法，切换部门时调用
    selectNode(node){//点击树节点时触发，设置某个节点的选中状态，必须在el-tree上设置node-key属性(node-key——树节点的唯一标识)
      this.queryParams.departmentId = node.id// 重新记录了参数
      //切换部门时将查询数据的页码设置为1
      this.queryParams.page = 1
      this.getEmployeeList()//更新id 和 页码 后，重新获取员工列表数据
    },

    //获取员工列表
    async getEmployeeList(){
      const {rows,total} = await getEmployeeList(this.queryParams)//调用api接口获取员工列表数据,传入查询参数,获取数据,解构赋值,获取员工列表rows,数据总条数total
      this.list =  rows //存入list。获取当前页数据.后端接口通常会支持分页查询，即根据 page（当前页码）和 pagesize（每页条数）参数返回 当前页的数据，而不是全部数据。
      this.total = total//存入total
    },

    //切换页面（切换页码时调用）
    changePage(newPage){
      this.queryParams.page = newPage //将新页码赋值给查询参数
      this.getEmployeeList()//调用获取员工列表数据方法
    },

    //搜索框输入值内容改变时调用
    changeValue(){
      /*采用防抖处理，降低请求频率/次数——通过设置定时器，延迟执行，
      只有在超过规定时间还未有新输入，才会执行内部逻辑(语句)，规定时间内只会执行最后一次的输入
      如果在规定时间内再次触发，则清除上一次的定时器(即不执行内部逻辑)，重新设置定时器*/
      clearTimeout(this.timer)//清除上一次的定时器this.timer，如果没有设置定时器，则为 0
      //设置定时器，内部是一个回调函数和一个参数——延迟300ms执行,在300ms内再次触发，会清除上一次的定时器，重新设置定时器
      this.timer = setTimeout(() =>{
        this.queryParams.page = 1//搜索时将页码设置为第一页
      this.getEmployeeList()//更新查询参数后，调用获取员工列表数据方法(该方法调用api接口，根据查询参数中的四个值查询员工数据)
      },300) 
    },
    //导出员工数据
    async exportEmployee(){//响应拦截器判断是不是blob类型，如果是直接返回数据，不再进行解构-代码位置(src/utils/request.js)
      //调用api接口导出员工数据
      const result = await exportEmployee(this.queryParams)
       // console.log(result) // 使用一个npm包 直接将blob文件下载到本地 file-saver
      // FileSaver.saveAs(blob对象,文件名称)
      FileSaver.saveAs(result,'员工数据.xlsx') // 下载文件
    },
    //删除员工
    async confirmDel(id){
      await delEmployee(id)//调用api接口删除员工数据
      //如果当前员工列表数据list的长度 为1，说明当前页只有一条数据， 并且页面数量大于1 ，则当前页码-1
        //当前页员工数据list.后端接口通常会支持分页查询，即根据 page（当前页码）和 pagesize（每页条数）参数返回 当前页的数据，而不是全部数据。
      if(this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--
      //--删除后重新获取员工列表数据
      this.getEmployeeList()
      this.$message.success('删除员工成功')//提示消息
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