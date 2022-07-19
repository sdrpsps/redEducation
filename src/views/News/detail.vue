<template>
  <div class="detailPage">
    <van-sticky>
      <van-nav-bar title="资讯详情" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <div class="detail">
      <h1 class="title">{{ newsDetail.title }}</h1>
      <div class="info">
        <p class="view">
          <van-icon name="eye-o" />
          {{ newsDetail.viewCount | formatThousand }} 阅读
        </p>
        <p class="time">{{ newsDetail.createTime | formatDate }}</p>
        <van-icon
          name="like-o"
          class="like"
          @click="like()"
          ref="like"
          color="black"
        />
      </div>
      <div class="text">
        {{ newsDetail.description }}
      </div>
    </div>
    <div class="commentList">
      <h1 class="title">评论列表</h1>
      <div class="commentItem" v-for="item in commentList" :key="item._id">
        <div class="left">
          <img
            :src="'http://yw.52kfw.cn' + item.userInfo.imageUrl"
            alt=""
            class="avatar"
          />
        </div>
        <div class="right">
          <span class="username">{{ item.userName }}</span>
          <span class="time">{{ item.createTime | formatDate2 }}</span>
          <span class="content">{{ item.content }}</span>
        </div>
      </div>
      <van-pagination
        v-model="currentPage"
        :total-items="total"
        :items-per-page="pagesize"
        @change="changePage"
      />
    </div>
    <div class="message">
      <h1 class="title">留言</h1>
      <van-field
        v-model="message"
        rows="5"
        autosize
        type="textarea"
        maxlength="140"
        placeholder="请输入留言"
        show-word-limit
      />
      <van-button
        type="info"
        round
        @click="submitMessage"
        class="submitBtn"
        block
        >提交</van-button
      >
    </div>
  </div>
</template>

<script>
import {
  getNewsDetailByCateID,
  getCommentByID,
  addNewsViewCount,
  submit,
  addLike,
} from "@/api/news.js";
import { getLikeList, cancelLike } from "@/api/show.js";
import { Notify } from "vant";
import moment from "moment";
moment.locale("zh-cn"); // 这里是进行了汉化 不写这句默认格式是外国的
import numeral from "numeral";
export default {
  data() {
    return {
      newsDetail: [],
      commentList: [],
      pagesize: 5,
      currentPage: 1,
      total: 0,
      message: "",
      collectList: [],
      isLike: false,
    };
  },
  methods: {
    // 点击返回首页
    onClickLeft() {
      this.$router.push("/");
    },
    // 获取新闻详情
    async getNewsDetail() {
      let res = await getNewsDetailByCateID(this.$route.query.id);
      console.log(res, "获取新闻详情");
      let {
        data: { info },
      } = res;
      this.newsDetail = info;
    },
    // 获取收藏列表
    async getLike() {
      if(sessionStorage.getItem("token")){
        let res = await getLikeList();
        console.log(res, "获取收藏列表");
        let {
          data: {
            collectionList: { collectNewsIds },
          },
        } = res;
        this.collectList = collectNewsIds;
        this.isLiked();
      }
    },
    // 判断是否收藏文章
    isLiked() {
      if (this.collectList.indexOf(this.$route.query.id) == -1) {
        console.log("不存在");
        this.isLike = false;
      } else {
        console.log("存在");
        this.isLike = true;
        this.$refs.like.style.color = "red";
      }
    },
    // 收藏文章
    async like() {
      if (this.isLike == false) {
        let addLikeRes = await addLike(this.$route.query.id);
        console.log(addLikeRes, "收藏文章");
        let { statusCode } = addLikeRes;
        if (statusCode == 200) {
          this.isLike = true;
          this.$refs.like.style.color = "red";
          Notify({ duration: 1000, type: "success", message: "收藏成功" });
        } else if (statusCode == 403) {
          Notify({ duration: 1000, type: "danger", message: "请先登录！" });
        } else {
          Notify({
            duration: 1000,
            type: "danger",
            message: "系统繁忙，请稍后再试",
          });
        }
      } else {
        let cancelLikeRes = await cancelLike(this.$route.query.id);
        console.log(cancelLikeRes, "取消收藏文章");
        let { statusCode } = cancelLikeRes;
        if (statusCode == 200) {
          this.isLike = false;
          this.$refs.like.style.color = "black";
          Notify({ duration: 1000, type: "success", message: "取消收藏成功" });
        } else if (statusCode == 403) {
          Notify({ duration: 1000, type: "danger", message: "请先登录！" });
        } else {
          Notify({
            duration: 1000,
            type: "danger",
            message: "系统繁忙，请稍后再试",
          });
        }
      }
    },
    // 获取评论列表
    async getCommentList() {
      let res = await getCommentByID(
        this.$route.query.id,
        this.pagesize,
        this.currentPage
      );
      console.log(res, "获取评论列表");
      let {
        data: { commentList, total },
      } = res;
      this.commentList = commentList;
      this.total = total;
    },
    // 切换页码
    changePage(val) {
      this.currentPage = val;
      this.getCommentList();
    },
    // 增加阅读数
    async addView() {
      let res = await addNewsViewCount(this.$route.query.id);
      console.log(res, "增加阅读数");
    },
    // 提交评论
    async submitMessage() {
      let res = await submit(
        this.message,
        this.$route.query.id,
        this.newsDetail.title
      );
      console.log(res, "提交评论");
      let { statusCode } = res;
      if (statusCode == 200) {
        Notify({ duration: 1000, type: "success", message: "提交成功" });
      } else if (statusCode == 400) {
        Notify({ duration: 1000, type: "danger", message: "输入内容不能为空" });
      } else if (statusCode == 403) {
        Notify({ duration: 1000, type: "danger", message: "请先登录！" });
      } else {
        Notify({
          duration: 1000,
          type: "danger",
          message: "系统繁忙，请稍后再试",
        });
      }
      // 刷新评论列表
      this.getCommentList();
    },
  },
  created() {
    this.getNewsDetail();
    this.getCommentList();
    this.addView();
    this.getLike();
  },
  filters: {
    formatDate(val) {
      return moment(val).format("lll");
    },
    formatDate2(val) {
      return moment(val).fromNow();
    },
    formatThousand(val) {
      return numeral(val).format("0,0");
    },
  },
};
</script>

<style lang="less" scoped>
.detailPage {
  padding-bottom: 50px;
  .detail {
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 0.6rem;
      line-height: 1.4;
      margin-bottom: 0.2rem;
    }
    .info {
      display: flex;
      align-items: center;
      margin-bottom: 0.2rem;
      .like {
        font-size: 0.5rem;
      }
    }
    .info > p {
      margin-right: 0.1rem;
    }
    .text {
      border-top: 2px solid #999;
      padding: 0.3rem;
      line-height: 1.5;
      text-indent: 2em;
    }
  }
  .commentList {
    padding: 0.3rem;
    .title {
      font-size: 0.6rem;
    }
    .commentItem {
      display: flex;
      align-items: center;
      padding: 0.3rem;
      .left {
        display: flex;
        justify-content: center;
        width: 25%;
        .avatar {
          width: 50px;
          height: 50px;
        }
      }
      .right {
        width: 75%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .time {
          padding: 0.3rem 0;
        }
      }
    }
  }
  .message {
    padding: 0.3rem;
    .title {
      font-size: 0.6rem;
      margin-bottom: 0.4rem;
    }
    .submitBtn {
      margin-top: 0.2rem;
    }
  }
}
</style>