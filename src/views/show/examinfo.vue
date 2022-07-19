<template>
  <div class="examinfo">
    <van-sticky>
      <van-nav-bar title="答题情况" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <h1 class="title">{{ title }}</h1>
    <!-- 单选题 -->
    <div class="subject">
      <p class="type">单选题</p>
      <div v-for="(item, index) in single.question" :key="item.id" class="card">
        <p class="questionTitle">{{ index + 1 }}、 {{ item.title }}</p>
        <van-field :rules="[{ required: true, message: '不能为空' }]">
          <template #input>
            <div class="answer">
              <van-radio-group
                v-model="item.answer"
                v-for="(items, index) in item.options"
                :key="index"
              >
                <van-radio :name="index" disabled class="answerItem"
                  >{{ index }}. {{ items }}</van-radio
                >
              </van-radio-group>
              <span class="score">{{ item.message }}</span>
            </div>
          </template>
        </van-field>
      </div>
    </div>
    <!-- 多选题 -->
    <div class="subject">
      <p class="type">多选题</p>
      <div
        v-for="(item, index) in multiple.question"
        :key="item.id"
        class="card"
      >
        <p class="questionTitle">{{ index + 1 }}、 {{ item.title }}</p>
        <van-field :rules="[{ required: true, message: '不能为空' }]">
          <template #input>
            <div class="answer">
              <van-checkbox-group
                v-model="item.answer"
                v-for="(items, index) in item.options"
                :key="index"
              >
                <van-checkbox disabled :name="index" class="answerItem"
                  >{{ index }}. {{ items }}</van-checkbox
                >
              </van-checkbox-group>
              <span class="score">{{ item.message }}</span>
            </div>
          </template>
        </van-field>
      </div>
    </div>
    <!-- 判断题 -->
    <div class="subject">
      <p class="type">判断题</p>
      <div
        v-for="(item, index) in judgement.question"
        :key="item.id"
        class="card"
      >
        <p class="questionTitle">{{ index + 1 }}、 {{ item.title }}</p>
        <van-field :rules="[{ required: true, message: '不能为空' }]">
          <template #input>
            <div class="answer">
              <van-radio-group v-model="item.answer">
                <van-radio disabled name="A" class="answerItem"
                  >A. 对</van-radio
                >
                <van-radio disabled name="B" class="answerItem"
                  >B. 错</van-radio
                >
              </van-radio-group>
              <span class="score">{{ item.message }}</span>
            </div>
          </template>
        </van-field>
      </div>
    </div>
    <!-- 简答题 -->
    <div class="subject">
      <p class="type">简答题</p>
      <div v-for="(item, index) in answer.question" :key="item.id" class="card">
        <p class="questionTitle">{{ index + 1 }}、 {{ item.title }}</p>
        <div class="answer">
          <van-field
            disabled
            v-model="item.answer"
            rows="5"
            autosize
            type="textarea"
            maxlength="500"
            placeholder="请输入答案"
            show-word-limit
            :rules="[{ required: true, message: '不能为空' }]"
          >
          </van-field>
          <span class="score">{{ item.message }}</span>
        </div>
      </div>
    </div>
    <van-button type="primary" block round @click="onClickLeft"
      >返回</van-button
    >
  </div>
</template>

<script>
import { getQuestionScore } from "@/api/show.js";
export default {
  data() {
    return {
      answer: [],
      judgement: [],
      multiple: [],
      single: [],
      title: "",
    };
  },
  methods: {
    async getScore() {
      let res = await getQuestionScore(this.$route.query.id);
      console.log(res, "获取答题情况");
      let {
        data: {
          answerDetail: { answer, judgement, multiple, single, title },
        },
      } = res;
      // 写入
      this.answer = answer;
      this.judgement = judgement;
      this.multiple = multiple;
      this.single = single;
      this.title = title;
    },
    onClickLeft() {
      this.$router.push("/show/myexams");
    },
  },
  created() {
    this.getScore();
  },
};
</script>

<style lang="less" scoped>
.examinfo {
  padding-bottom: 50px;
  .title {
    font-size: 0.48rem;
    color: #000;
    background-color: #fff;
    padding: 0.2rem 0;
    padding-left: 0.2rem;
    font-weight: 700;
    border-bottom: 1px solid #e4e4e4;
  }
  .subject {
    .type {
      font-size: 0.48rem;
      color: #000;
      background-color: #fff;
      padding: 0.2rem 0;
      padding-left: 0.2rem;
      font-weight: 700;
      border-bottom: 1px solid #e4e4e4;
    }
    .card {
      margin-bottom: 0.1rem;
      .questionTitle {
        padding: 0.4rem;
        background-color: #fff;
        font-size: 0.38rem;
        line-height: 1.4;
        color: #000;
        font-weight: 500;
        padding-bottom: 0.2rem;
      }
      .answer {
        background-color: #fff;
        padding: 0.2rem 0.4rem;
        .answerItem {
          margin-bottom: 0.2rem;
        }
        .score {
          color: red;
        }
      }
    }
  }
}
</style>