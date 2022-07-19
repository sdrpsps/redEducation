<template>
  <div class="password">
    <van-nav-bar title="修改密码" left-arrow @click-left="onClickLeft" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="oldPassword"
        type="password"
        name="密码"
        placeholder="请输入原始密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-model="newPassword"
        type="password"
        name="密码"
        placeholder="请输入新密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-model="newPassword_replace"
        type="password"
        name="密码"
        placeholder="确认新密码"
        :rules="[
          { required: true, message: '请填写密码' },
          { validator: newPasswordSame, message: '密码不一致' },
        ]"
      />
      <div style="margin: 16px">
        <van-button round block type="danger" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { changePassword } from "@/api/mine.js";
import { Notify } from "vant";
export default {
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      newPassword_replace: "",
    };
  },
  methods: {
    // 返回
    onClickLeft() {
      this.$router.push("/settings");
    },
    // 检查新密码是否一致
    newPasswordSame(val) {
      if (val == this.newPassword) {
        return true;
      } else {
        return false;
      }
    },
    // 提交
    async onSubmit() {
      let res = await changePassword(this.oldPassword, this.newPassword);
      console.log(res, "修改密码");
      let { statusCode } = res;
      // 逻辑判断
      if (statusCode == 200) {
        Notify({ duration: 1500, type: "success", message: "修改成功" });
        setTimeout(()=>{
          this.$router.push("/settings");
        },1500)
      } else if (statusCode == 403) {
        Notify({ duration: 1000, type: "danger", message: "原始密码错误" });
      } else {
        Notify({ duration: 1000, type: "danger", message: "系统繁忙" });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.password{
  height: 100vh;
}
</style>