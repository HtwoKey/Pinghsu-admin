<template>
  <div id="particles" class="login-container">
    <canvas id="martrix" style="background:#111;position:fixed;z-index:-1;" />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <h3 class="title">HtwoKey-Admin</h3>
      <el-form-item prop="用户名">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="on"
          placeholder="username"
        />
      </el-form-item>
      <el-form-item prop="密码">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :type="pwdType"
          name="password"
          auto-complete="on"
          placeholder="password"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form-item>
      <div class="tips" />
    </el-form>

  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onload() {
      window.onload = function() {
        var canvas = document.getElementById('martrix')
        var ctx = canvas.getContext('2d')
        var w, h
        w = canvas.width = window.innerWidth
        h = canvas.height = window.innerHeight

        // 初始化
        var wordColor = '#33ff33'
        var words = "0123456789qwertyuiopasdfghjklzxcvbnm,./;'\[]QWERTYUIOP{}ASDFGHJHJKL:ZXCVBBNM<>?がガぎギぐグげゲごゴきゃキャきゅキュきょキョりゃリャゅリュりょリョ"
        var wordsArr = words.split('')
        var font_size = 10
        var clumns = parseInt(w / font_size, 10) // 浏览器宽除以字符宽得列数
        var drops = [] // 存储每列的起始位置

        for (var i = 0; i < clumns; i++) {
        // 随机的起始位置
          drops[i] = Math.floor(Math.random() * h)
        }

        // 绘制
        function draw(time) {
          ctx.save()

          // 水平翻转画布
          ctx.translate(w, 0)
          ctx.scale(-1, 1)

          // 填充字符
          ctx.fillStyle = wordColor
          ctx.font = font_size + 'px arial'
          for (var i = 0; i < drops.length; i++) {
            var text = wordsArr[Math.floor(Math.random() * wordsArr.length)]
            ctx.fillText(text, i * font_size, drops[i] * font_size)
            // 0.95的随机数造成列消失的时间不一致，产生的列也随之改变
            if (drops[i] * font_size > h && Math.random() > 0.95) {
              drops[i] = 0
            }
            drops[i]++
          }
          ctx.restore()
        }

        // 循环
        var clearColor = 'rgba(0, 0, 0, .1)' // 每次循环加0.1透明的蒙层
        var lt = 0
        var speed = 50 // 字体下落速度
        function drawFrame(time) {
          if (time - lt > speed) {
            lt = time
            ctx.fillStyle = clearColor
            ctx.fillRect(0, 0, w, h)
            draw()
          }
          window.requestAnimationFrame(drawFrame, canvas)
        }
        window.requestAnimationFrame(drawFrame, canvas)

        // 浏览器缩放
        function resize() {
          w = canvas.width = window.innerWidth
          h = canvas.height = window.innerHeight
        }
        canvas.addEventListener('resize', resize)
        // 绑定F11全屏事件，由于全屏事件在部分浏览器中不会触发resize，和无法通过F11捕捉到fullscreenchange事件，于是用F11的keyup替代。感谢boyipiao童鞋的反馈~
        document.addEventListener('keyup', function(event) {
          var code = event.keyCode || event.which
          if (code === 122) {
            resize()
          }
        }, false)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

img {
  position: absolute;
  height: 52px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    background-image: linear-gradient(to right top,rgba(255,255,255,0.3),rgba(255,255,255,0.7));
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
