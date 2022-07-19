<template>
  <div class="comments">
    <van-nav-bar title="我的评论" left-arrow @click-left="onClickLeft" />
    <div class="item" v-for="item in list" :key="item._id">
      <div class="left">
        <h1 class="title">{{ item.title }}</h1>
        <p class="time">评论时间:{{ item.createTime | formatDate }}</p>
        <p>评论内容: {{ item.content }}</p>
      </div>
      <div class="right">
        <div class="btn">
          <van-button type="danger" @click="removeComment(item)"
            >移除</van-button
          >
        </div>
      </div>
    </div>
    <van-empty
      class="custom-image"
      image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
      description="暂无相关信息"
      v-if="list == false"
    />
  </div>
</template>

<script>
import { getComment,deleteComment } from "@/api/show.js";
import moment from "moment";
import { Notify } from "vant";
import { Dialog } from "vant";
export default {
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
    };
  },
  methods: {
    onClickLeft() {
      this.$router.push("/mine");
    },
    // 获取评论列表
    async getCommentList() {
      let res = await getComment(this.pageSize, this.currentPage);
      console.log(res, "获取评论列表");
      let {
        data: { commentList },
      } = res;
      this.list = commentList;
    },
    // 移除评论
    removeComment(item) {
      Dialog.confirm({
        title: "移除评论",
        message: "是否移除评论，一旦移除则无法撤回！",
      })
        .then(async () => {
          // on confirm
          let res = await deleteComment(item._id);
          let { statusCode } = res;
          if (statusCode == 200) {
            Notify({
              type: "success",
              message: "移除评论成功",
              duration: 1000,
            });
          } else if (statusCode == 403) {
            Notify({ type: "danger", message: "请先登录", duration: 1000 });
          } else {
            Notify({ type: "danger", message: "系统繁忙", duration: 1000 });
          }
          // 刷新列表
          this.getCommentList();
        })
        .catch(() => {
          // on cancel
        });
    },
  },
  created() {
    this.getCommentList();
  },
  filters: {
    formatDate(val) {
      return moment(val).format("lll");
    },
  },
};
</script>

<style lang="less" scoped>
.comments {
  padding-bottom: 50px;
  .item {
    display: flex;
    border-bottom: 1px solid #e4e4e4;
    padding: 0.3rem;
    .left {
      width: 60%;
      display: flex;
      flex-direction: column;
      .title {
        font-size: 0.42rem;
        line-height: 1.2;
        color: #1a1a1a;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .left > p {
      padding: 0.1rem 0;
      font-size: 0.24rem;
      color: #949494;
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40%;
      .btn {
        display: flex;
      }
    }
  }
}
</style>