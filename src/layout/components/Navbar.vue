<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper"><!--头像-->
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <img v-if="avatar" :src="avatar" class="user-avatar"><!--用户头像非空，显示头像-->
          <span v-else class="username">{{name?.charAt(0)}}</span><!--用户头像为空，使用用户名的第一个字作为头像。此处使用可选链操作符?-->
          <!-- 当？前面的变量为空时，它不会继续往下执行，防止报错，如null?.name 。$ npm i vue@2.7.0  vue-template-compiler@2.7.0   # 需要升级vue版本️-->
          <!-- 用户名称 （文本插值）-->
          <span class="name">{{name}}</span>
          <!-- 图标 -->
          <i class="el-icon-setting" />
        </div>
        <!-- <el-dropdown-menu>：下拉菜单的内容区域。slot="dropdown"：将内容插入到 el-dropdown 的 dropdown 插槽中。 -->
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/QiNuoIsMe/heimahr-01.git">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!-- prevent阻止a标签的默认跳转事件，绑定@click事件 -->
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <!-- native时间修饰符，监听 <el-dropdown-item> 组件根元素的原生 click 事件。告诉 Vue：不要把这个事件当作自定义事件，而是当作原生事件，直接绑定到组件的根元素上。
            divided：添加分隔线。display:block;布局方式渲染为块级元素 -->
          <!-- 用于注册html5组件的根元素的原生事件 -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- .sync修饰符——点击弹窗的叉号即可关闭弹窗。在源码是，外传了一个事件，我们监听该事件，并且把布尔值赋给showDialog -->
    <!-- 监听事件@close，关闭弹窗时触发事件，调用btnCanel方法(重置表单并关闭弹窗) -->
    <el-dialog @close="btnCanel" :visible.sync="showDialog" title="修改密码" width="500px">
      <!-- 修改密码表单 -->
      <el-form ref="passForm" label-width="120px" :model="passForm" :rules="rules"> 
        <!-- ref绑定表单实例，命名为passForm。:model双向绑定表单数据(在data中)。:rules双向绑定校验规则(在data中) -->
        <el-form-item label="旧密码" prop="oldPassword"><!--prop绑定字段oldPassword，与rules校验规则对应字段绑定-->
          <el-input v-model="passForm.oldPassword" show-password size="small"><!--v-model双向绑定表单数据passForm中的oldPassword-->
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" show-password size="small">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="btnOk" size="mini" type="primary">确认修改</el-button>
          <el-button @click="btnCanel" size="mini">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { updatePassword } from '@/api/user'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { mapGetters } from 'vuex'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data(){
    return {
      showDialog:false,//默认为false不显示弹出窗
      //修改密码的表单数据
      passForm:{
        oldPassword:'',
        newPassword:'',//属性名与后端接口接收的参数名保持一致
        confirmPassword:''
      },
      //修改密码表单校验规则
      rules:{//数组类型
        oldPassword:[{required:true,message:'原密码不能为空',trigger:'blur'}],//required:true——必填项。trigger:'blur'，失去焦点时才触发该校验
        newPassword:[{required:true,message:'新密码不能为空',trigger:'blur'},
      {min:6,max:16,message:'新密码的长度为6-16位之间',trigger:'blur'}],
        confirmPassword:[{required:true,message:'重复密码不能为空',trigger:'blur'},
      {
        validator: (rule,value,callback) =>{//自定义校验函数(这里若不使用使用箭头函数，则this并不是指向组件实例，无法引入newPassword)
          //或者在data处，let _this=this，然后在这里调用_this.passForm.newPassword
          if(value !== this.passForm.newPassword){
            callback(new Error('两次输入密码不一致'))
            return
          }
          callback()
        },
        trigger:'blur'
      }]
      }
    }
  },
  computed: {
    //辅助函数。引入modules中getters暴露的属性
    ...mapGetters([
      'sidebar',
      'avatar',//用户头像
      'name'//用户名称
    ])
  },
  methods: {
    updatePassword(){
      //显示修改密码的弹出窗
      this.showDialog = true
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    btnOk(){
      this.$refs.passForm.validate( async isOk =>{
        if(isOk){
          await updatePassword(this.passForm)//调用api/user.js中的updatePassword方法
          //成功了
          this.btnCanel()
          this.$message.success('修改密码成功')
        }
      })
    },
    btnCanel(){
      this.$refs.passForm.resetFields()//$refs: 访问已注册的子组件或元素。//form表单中的方法--重置表单
      this.showDialog = false//关闭弹窗
    },
    async logout() {
      //调用退出登录的action方法
      await this.$store.dispatch('user/logout')//调用store/user.js中的actions中的logout方法
      this.$router.push('/login')//等logout方法执行完毕后 跳转到登录页
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        //水平居中显示
        display:flex;
        align-items: center;

        .username{
          width:30px;
          height: 30px;
          text-align: center;//文字居中
          color: #fff;
          line-height: 30px;//垂直居中
          background-color: #04c9be;
          border-radius: 50%;//圆角
          margin-right: 4px;//距离右边距4px
        }
        .name{
          margin-right:10px;
          font-size: 16px;
        }
        .el-icon-setting{
          font-size: 20px;
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
