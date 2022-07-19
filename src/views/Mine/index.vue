<template>
  <div class="mine">
    <!-- 未登录界面 -->
    <div class="notLogin" v-if="isLogin == false">
      <div class="logo">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="cover"
          src="https://img01.yzcdn.cn/vant/cat.jpeg"
        />
      </div>
      <van-form @submit="login">
        <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit"
            >登录</van-button
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
        <van-button round block type="warning" to="/register">注册</van-button>
      </div>
    </div>
    <!-- 已登录界面 -->
    <div v-if="isLogin == true" class="logged_in">
      <div class="userInfo">
        <div class="left">
          <van-image
            width="1.2rem"
            height="1.2rem"
            :src="'https://yw.52kfw.cn' + userInfo.imageUrl"
            class="avatar"
          />
          <div class="info">
            <p class="username">{{ userInfo.name }}</p>
            <p class="email">{{ userInfo.email }}</p>
          </div>
        </div>
        <div class="right">
          <van-icon name="setting-o" @click="gotoSettings" />
        </div>
      </div>
      <van-divider />
      <van-cell title="我的考试" is-link to="/show/myexams" icon="records" />
      <van-cell title="我的收藏" is-link to="show/collects" icon="like-o" />
      <van-cell title="我的评论" is-link to="/show/comments" icon="like-o" />
      <van-divider />
      <van-cell title="退出" is-link @click="logout" icon="close" />
    </div>
  </div>
</template>

<script>
import { loginSys } from "@/api/mine.js";
import { Notify } from "vant";
export default {
  data() {
    return {
      username: "",
      password: "",
      userInfo: [],
      isLogin: false,
    };
  },
  methods: {
    async login() {
      let res = await loginSys(this.username, this.password);
      console.log(res, "登录");
      let { statusCode } = res;
      // 逻辑判断
      if (statusCode == 200) {
        let {
          data: { token, userInfo },
        } = res;
        this.isLogin = true;
        Notify({ duration: 1000, type: "success", message: "登录成功" });
        // 写入用户信息
        this.userInfo = userInfo;
        // 写入sessionStorage保存token和用户信息
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        sessionStorage.setItem("token", token);
      } else if (statusCode == 403) {
        Notify({ duration: 1000, type: "danger", message: "用户密码错误" });
      } else if (statusCode == 404) {
        Notify({ duration: 1000, type: "danger", message: "用户信息不存在" });
      }
    },
    // 判断是否登录
    isLoginSys() {
      if (sessionStorage.getItem("token")) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    },
    // 重新加载页面时，重新写入用户信息
    getUserInfo() {
      let userInfo = sessionStorage.getItem("userInfo");
      this.userInfo = JSON.parse(userInfo);
    },
    // 推出
    logout() {
      this.isLogin = false;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userInfo");
      Notify({ duration: 1000, type: "success", message: "你已退出" });
    },
    gotoSettings() {
      this.$router.push("/settings");
    },
  },
  created() {
    this.isLoginSys();
    this.getUserInfo();
  },
};
</script>

<style lang="less" scoped>
.mine {
  height: 100vh;
  .notLogin {
    display: flex;
    flex-direction: column;
    .logo {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 3rem;
    }
  }
  .logged_in {
    .userInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0.2rem;
      background-color: #fff;
      .left {
        display: flex;
        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 0.2rem;
          .username {
            font-weight: 700;
            margin-bottom: 0.2rem;
          }
        }
      }
      .right {
        display: flex;
        font-size: 0.6rem;
      }
    }
  }
}
</style>