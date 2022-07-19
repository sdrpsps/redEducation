<template>
  <div class="register">
    <div class="logo">
      <van-image
        round
        width="1rem"
        height="1rem"
        fit="cover"
        src="https://img01.yzcdn.cn/vant/cat.jpeg"
      />
    </div>
    <van-form @submit="onRegister">
      <van-field
        v-model="registerForm.name"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="registerForm.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="请设置密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-model="registerForm.password_replace"
        type="password"
        name="密码"
        label="密码"
        placeholder="请确认密码"
        :rules="[
          { required: true, message: '请填写密码' },
          { validator: passwordSame, message: '两次密码输入不一致' },
        ]"
      />
      <van-field
        v-model="registerForm.email"
        name="pattern"
        label="邮箱"
        placeholder="邮箱"
        :rules="[
          { pattern, message: '请输入正确的邮箱地址' },
          { validator: checkEmailIsValidate, message: '邮箱已被使用' },
        ]"
      />
      <van-field
        v-model="registerForm.code"
        center
        clearable
        label="邮箱验证码"
        placeholder="请输入邮箱验证码"
      >
        <template #button>
          <van-button size="small" type="primary" @click.prevent="sendCode"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"
          >提交注册</van-button
        >
      </div>
    </van-form>
    <van-divider
      :style="{
        color: '#999',
        borderColor: '#1989fa',
        padding: '0 16px',
        margin: '0',
      }"
      >或者</van-divider
    >
    <div style="margin: 16px">
      <van-button round block type="warning" to="/mine">登录</van-button>
    </div>
  </div>
</template>

<script>
import { sendEmailCode, checkEmail, userRegister } from "@/api/mine.js";
import { Notify } from "vant";
export default {
  data() {
    return {
      registerForm: {
        name: "",
        password: "",
        password_replace: "",
        email: "",
        code: "",
      },
      // 邮箱格式正则校验
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    };
  },
  methods: {
    async onRegister() {
      let res = await userRegister(this.registerForm);
      console.log(res, "注册");
      let { statusCode } = res;
      if (statusCode == 200) {
        Notify({
          message: "注册成功，即将跳转到登录页",
          type: "success",
          duration: 2000,
        });
        setTimeout(() => {
          this.$router.push("/mine");
        }, 2000);
      } else if (statusCode == 400) {
        Notify({
          message: "邮箱验证码不正确",
          type: "danger",
          duration: 1000,
        });
      } else {
        Notify({
          message: "系统繁忙",
          type: "danger",
          duration: 1000,
        });
      }
    },
    // 发送验证码
    async sendCode() {
      let res = await sendEmailCode(this.registerForm.email);
      console.log(res, "发送验证码");
      let { statusCode } = res;
      if (statusCode == 200) {
        Notify({
          message: "验证码发送成功",
          type: "success",
          duration: 1500,
        });
      } else {
        Notify({
          message: "系统繁忙",
          type: "danger",
          duration: 1000,
        });
      }
    },
    // 检查邮箱可用
    async checkEmailIsValidate(val) {
      let res = await checkEmail(val);
      console.log(res, "邮箱可用");
      let { statusCode } = res;
      if (statusCode == 200) {
        return true;
      } else {
        return false;
      }
    },
    // 检查密码是否输入一致
    passwordSame(val) {
      if (val == this.registerForm.password) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.register {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 3rem;
  }
}
</style>