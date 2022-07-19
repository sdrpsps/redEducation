<template>
  <div class="collects">
    <van-nav-bar title="我的收藏" left-arrow @click-left="onClickLeft" />
    <div class="item" v-for="item in list" :key="item._id">
      <div class="left">
        <h1 class="title">{{ item.title }}</h1>
        <p class="view">
          <van-icon name="eye-o" />
          {{ item.viewCount }} 阅读
        </p>
        <p class="time">{{ item.createTime | formatDate }}</p>
      </div>
      <div class="right">
        <div class="btn">
          <van-button type="primary" class="primary" @click="gotoDetail(item)"
            >详情</van-button
          >
          <van-button type="danger" @click="removeLike(item)">移除</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLikeList, cancelLike } from "@/api/show.js";
import { Notify } from "vant";
import { Dialog } from "vant";
import moment from "moment";
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
    // 获取收藏列表
    async getLike() {
      let res = await getLikeList(this.pageSize, this.currentPage);
      console.log(res, "获取收藏列表");
      let {
        data: { collectInfo },
      } = res;
      this.list = collectInfo;
    },
    // 跳转到详情页
    gotoDetail(item) {
      this.$router.push({
        path: "/detail",
        query: { id: item._id },
      });
    },
    // 移除收藏
    removeLike(item) {
      Dialog.confirm({
        title: "移除收藏",
        message: "是否移除收藏，一旦移除则无法撤回！",
      })
        .then(async () => {
          // on confirm
          let res = await cancelLike(item._id);
          let { statusCode } = res;
          if (statusCode == 200) {
            Notify({
              type: "success",
              message: "移除收藏成功",
              duration: 1000,
            });
          } else if (statusCode == 403) {
            Notify({ type: "danger", message: "请先登录", duration: 1000 });
          } else {
            Notify({ type: "danger", message: "系统繁忙", duration: 1000 });
          }
          // 刷新列表
          this.getLike();
        })
        .catch(() => {
          // on cancel
        });
    },
  },
  created() {
    this.getLike();
  },
  filters: {
    formatDate(val) {
      return moment(val).format("lll");
    },
  },
};
</script>

<style lang="less" scoped>
.collects {
  height: 100vh;
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
        .primary {
          margin-right: 0.1rem;
        }
      }
    }
  }
}
</style>