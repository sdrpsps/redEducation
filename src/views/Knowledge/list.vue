<template>
  <div class="list">
    <van-nav-bar title="试题列表" left-arrow @click-left="onClickLeft" />
    <div class="questionList" v-for="item in questionsList" :key="item._id">
      <div class="left">
        <h1 class="title">{{ item.title }}</h1>
        <p>分类：{{ item.questionType }}</p>
        <p>单选题：{{ item.singleCount }}</p>
        <p>多选题：{{ item.multipleCount }}</p>
        <p>判断题：{{ item.judgementCount }}</p>
        <p>简答题：{{ item.answerCount }}</p>
        <p>{{ item.createTime | formatDate }}</p>
      </div>
      <div class="right">
        <div class="btn">
          <van-button type="primary" @click="gotoExam(item)"
            >开始作答</van-button
          >
        </div>
      </div>
    </div>
    <van-empty
      image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
      description="没有相关试题"
      v-if="questionsList == false"
    />
  </div>
</template>

<script>
import { getQuestionList } from "@/api/knowledge.js";
import moment from "moment";
import { Notify } from "vant";
export default {
  data() {
    return {
      questionsList: [],
      pageSize: 100,
      currentPage: 1,
    };
  },
  methods: {
    async getQueList() {
      let res = await getQuestionList(
        this.$route.query.type,
        this.pageSize,
        this.currentPage
      );
      console.log(res, "获取试卷");
      let {
        data: { questionList },
      } = res;
      this.questionsList = questionList;
    },
    onClickLeft() {
      this.$router.push("/knowledge");
    },
    gotoExam(item) {
      if (sessionStorage.getItem("token")) {
        this.$router.push({
          path: "/exam",
          query: {
            id: item._id,
          },
        });
      } else {
        Notify({ type: "danger", message: "请先登录！" });
      }
    },
  },
  created() {
    this.getQueList();
  },
  filters: {
    formatDate(val) {
      return moment(val).format("YYYY.MM.DD HH:mm:ss");
    },
  },
};
</script>

<style lang="less" scoped>
.list {
  height: 100vh;
  .questionList {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0.2rem;
    border-bottom: 1px solid #999;
    .left {
      width: 70%;
      .title {
        font-size: 0.42rem;
      }
    }
    .left > p {
      color: #666;
      margin: 0.2rem 0;
    }
    .right {
      width: 30%;
    }
  }
}
</style>