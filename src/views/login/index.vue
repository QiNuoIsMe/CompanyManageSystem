<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <!-- el-form > el-form-item > el-input -->
        <el-form ref="form" :model="loginForm" :rules="loginRules">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" show-password placeholder="请输入密码" />
          </el-form-item>
          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginForm.isAgree">
              用户平台使用协议
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button style="width:350px" type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>



        <!-- 提示信息 -->
        <!-- <p class="login-tip" style="width:350px">
          仅用于IT培训教学使用，为保障您的个人信息安全，请勿向平台录入任何个人敏感信息 (如手机号、身份证号等)！
        </p> -->
        <!-- 额外按钮 -->
        <!-- <div class="extra-buttons">
          <el-button style="width:150px" type="button">手机登录</el-button>
          <el-button style="width:150px" type="button">扫码登录</el-button>
        </div> -->



      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        mobile: process.env.NODE_ENV === 'development' ? '13800000002' : '',
        password: process.env.NODE_ENV === 'development' ? '123456' : '',
        isAgree: process.env.NODE_ENV === 'development'
      },
      loginRules: {
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          pattern: /^1[3-9]\d{9}$/,
          message: '手机号格式不正确',
          trigger: 'blur'

        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 16,
          message: '密码长度应该为6-16位之间',
          trigger: 'blur'

        }],
        // required只能检测 null undefined ""
        isAgree: [{
          validator: (rule, value, callback) => {
            // rule校验规则
            // value 校验的值
            // callback 函数 - promise resolve reject
            // callback() callback(new Error(错误信息))
            value ? callback() : callback(new Error('您必须勾选用户的使用协议'))
          }
        }]
      }
    }
  },
  methods: {

    // login() {
    //   this.$refs.form.validate(async(isOK) => {
    //     if (isOK) {
    //       // await this.$store.dispatch('user/login', this.loginForm)
    //       // 跳转到 https://heimahr.itheima.net/
    //       // window.location.href = 'https://heimahr.itheima.net';
    //       window.location.href = 'https://heimahr-t.itheima.net/';
    //     }
    //   })
    // }



    login() {
      this.$refs.form.validate(async(isOK) => {
        if (isOK) {
          await this.$store.dispatch('user/login', this.loginForm)
          // Vuex 中的action 返回的promise
          // 跳转主页
          this.$router.push('/')
        }
      })
    }

  }
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color:#606266;
    }
  }

 /*
  .login-tip {
    color: #ff4d4f;
    font-size: 14px;
    text-align: center;
    margin-top: 20px;
  }
  .extra-buttons {
    display: flex;
    justify-content: left;
    margin-top: 10px;
    .el-button {
      margin: 0 10px;
      color: #409eff;
    }
  }
  **/ 
}
</style>
