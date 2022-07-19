<template>
  <div class="myexams">
    <van-nav-bar title="我的考试" left-arrow @click-left="onClickLeft" />
    <div class="item" v-for="item in list" :key="item.answerId">
      <div class="left">
        <h1 class="title">{{ item.title }}</h1>
        <p>答对题数：{{ item.correctCount }}</p>
        <p>总题目数：{{ item.totalCount }}</p>
        <p>答对率：{{ item.correctPercent | formatPercent }}</p>
        <p class="time">{{ item.createTime | formatDate }}</p>
      </div>
      <div class="right">
        <div class="btn">
          <van-button type="primary" class="primary" @click="gotoExaminfo(item)"
            >查看详情</van-button
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
import { getAnswerQuestion } from "@/api/show.js";
import moment from "moment";
import numeral from "numeral";
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
    // 获取试卷列表
    async getQuestionList() {
      let res = await getAnswerQuestion(this.pageSize, this.currentPage);
      let {
        data: { answerList },
      } = res;
      console.log(res, "获取试卷列表");
      this.list = answerList;
    },
    // 跳转试卷详情
    gotoExaminfo(item) {
      this.$router.push({
        path: "/show/examinfo",
        query: {
          id: item.answerId,
        },
      });
    },
  },
  created() {
    this.getQuestionList();
  },
  filters: {
    formatDate(val) {
      return moment(val).format("lll");
    },
    formatPercent(val) {
      return numeral(val).format("0.00%");
    },
  },
};
</script>

<style lang="less" scoped>
.myexams {
  height: 100%;
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