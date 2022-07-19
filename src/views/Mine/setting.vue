<template>
  <div class="settings">
    <van-nav-bar title="个人信息" left-arrow @click-left="onClickLeft" />
    <van-divider />
    <van-form>
      <van-field name="uploader" label="修改头像">
        <template #input>
          <van-uploader
            v-model="uploader"
            :max-count="1"
            :after-read="uploadIMG"
          />
        </template>
      </van-field>
      <van-cell title="用户名" :value="userInfo.name" />
      <van-cell title="邮箱" :value="userInfo.email" />
    </van-form>
    <van-divider />
    <van-cell title="修改密码" is-link to="/password" />
  </div>
</template>

<script>
import { updateAvatar, uploadPicture } from "@/api/mine.js";
import { Notify } from "vant";

export default {
  data() {
    return {
      uploader: [],
      userInfo: [],
      avatarUrl: "",
    };
  },
  methods: {
    // 返回
    onClickLeft() {
      this.$router.push("/mine");
    },
    // 重新加载页面时，重新写入用户信息
    getUserInfo() {
      let userInfo = sessionStorage.getItem("userInfo");
      this.userInfo = JSON.parse(userInfo);
    },
    async changeAvatar() {
      let res = await updateAvatar(this.userInfo._id, this.avatarUrl);
      console.log(res, "修改头像");
      let { statusCode } = res;
      if (statusCode == 200) {
        Notify({ duration: 1500, type: "success", message: "头像修改成功" });
        // 更新sessionStorage
        let {
          data: { userInfo },
        } = res;
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      } else {
        Notify({ duration: 1500, type: "danger", message: "修改失败" });
      }
    },
    async uploadIMG() {
      // 要传的是是一个文件，要使用formData
      let formData = new FormData();
      formData.append("cover", this.uploader[0].file);
      let res = await uploadPicture(formData);
      console.log(res, "上传图片");
      let { statusCode } = res;
      if (statusCode == 200) {
        Notify({ duration: 1500, type: "success", message: "上传成功" });
        this.avatarUrl = res.data.url;
        // 调用修改头像
        this.changeAvatar();
      } else {
        Notify({ duration: 1500, type: "danger", message: "上传失败" });
      }
    },
  },
  created() {
    this.getUserInfo();
  },
};
</script>

<style lang="less" scoped>
.settings{
  height: 100vh;
}
</style>