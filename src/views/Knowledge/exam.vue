<template>
  <div class="exam">
    <van-sticky>
      <van-nav-bar title="正在做题" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <h1 class="title">试卷名称：{{ sumbitForm.title }}</h1>
    <van-form @submit="onSubmit">
      <!-- 单选题 -->
      <div class="subject">
        <p class="type">单选题</p>
        <div
          v-for="(item, index) in singleQuestion"
          :key="item.id"
          class="card"
        >
          <p class="questionTitle">{{ index + 1 }}、 {{ item.title }}</p>
          <van-field :rules="[{ required: true, message: '不能为空' }]">
            <template #input>
              <div class="answer">
                <van-radio-group
                  v-model="item.answer"
                  v-for="(items, index) in item.options"
                  :key="index"
                >
                  <van-radio :name="index" class="answerItem"
                    >{{ index }}. {{ items }}</van-radio
                  >
                </van-radio-group>
              </div>
            </template>
          </van-field>
        </div>
      </div>

      <!-- 多选题 -->
      <div class="subject">
        <p class="type">多选题</p>
        <div
          v-for="(item, index) in multipleQuestion"
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
                  <van-checkbox :name="index" class="answerItem"
                    >{{ index }}. {{ items }}</van-checkbox
                  >
                </van-checkbox-group>
              </div>
            </template>
          </van-field>
        </div>
      </div>
      <!-- 判断题 -->
      <div class="subject">
        <p class="type">判断题</p>
        <div
          v-for="(item, index) in judgementQuestion"
          :key="item.id"
          class="card"
        >
          <p class="questionTitle">{{ index + 1 }}、 {{ item.title }}</p>
          <van-field :rules="[{ required: true, message: '不能为空' }]">
            <template #input>
              <div class="answer">
                <van-radio-group v-model="item.answer">
                  <van-radio name="A" class="answerItem">A. 对</van-radio>
                  <van-radio name="B" class="answerItem">B. 错</van-radio>
                </van-radio-group>
              </div>
            </template>
          </van-field>
        </div>
      </div>
      <!-- 简答题 -->
      <div class="subject">
        <p class="type">简答题</p>
        <div
          v-for="(item, index) in answerQuestion"
          :key="item.id"
          class="card"
        >
          <p class="questionTitle">{{ index + 1 }}、 {{ item.title }}</p>
          <van-field
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
        </div>
      </div>

      <van-button type="primary" block round native-type="submit"
        >提交</van-button
      >
    </van-form>
  </div>
</template>

<script>
import { getQuestion, submitQuestions } from "@/api/knowledge.js";
import { Dialog } from "vant";
import { Notify } from "vant";
export default {
  data() {
    return {
      answerQuestion: [],
      judgementQuestion: [],
      multipleQuestion: [],
      singleQuestion: [],
      // 提交相关
      sumbitForm: {
        answer: {},
        answerTime: "00：00：00",
        questionId: "",
        questionType: "",
        title: "",
        userId: "",
        userName: "",
      },
    };
  },
  methods: {
    // 返回
    onClickLeft() {
      Dialog.confirm({
        title: "离开考试",
        message: "是否离开考试，离开后成绩作废",
      })
        .then(() => {
          // on confirm
          this.$router.push("/knowledge");
        })
        .catch(() => {
          // on cancel
        });
    },
    // 获取题目
    async getQuestionList() {
      let res = await getQuestion(this.$route.query.id);
      console.log(res, "获取试题");
      let {
        data: {
          questionList: {
            answerQuestion,
            judgementQuestion,
            multipleQuestion,
            singleQuestion,
            questionType,
            title,
          },
        },
      } = res;
      // 写入
      this.answerQuestion = answerQuestion;
      this.judgementQuestion = judgementQuestion;
      this.multipleQuestion = multipleQuestion;
      this.singleQuestion = singleQuestion;
      this.sumbitForm.questionType = questionType;
      this.sumbitForm.title = title;
    },
    // 写入答案对象
    writeAnswer() {
      // 遍历单选
      this.singleQuestion.forEach((item) => {
        this.sumbitForm.answer[item.id] = item.answer;
      });
      // 遍历多选
      this.multipleQuestion.forEach((item) => {
        this.sumbitForm.answer[item.id] = item.answer;
      });
      // 遍历判断
      this.judgementQuestion.forEach((item) => {
        this.sumbitForm.answer[item.id] = item.answer;
      });
      // 遍历简答
      this.answerQuestion.forEach((item) => {
        this.sumbitForm.answer[item.id] = item.answer;
      });
      console.log(this.sumbitForm.answer, "答案对象");
    },
    // 写入试卷及用户信息
    getUserInfo() {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      this.sumbitForm.userId = userInfo._id;
      this.sumbitForm.userName = userInfo.name;
      this.sumbitForm.questionId = this.$route.query.id;
    },
    // 提交试卷
    async onSubmit() {
      this.writeAnswer();
      console.log(this.sumbitForm, "即将提交的数据");
      let res = await submitQuestions(this.sumbitForm);
      console.log(res, "提交试卷");
      let { statusCode } = res;
      if (statusCode == 200) {
        Notify({
          duration: 1000,
          type: "success",
          message: "提交成功，即将前往答题详情",
        });
        setTimeout(() => {
          this.$router.push("/examinfo");
        }, 1000);

      } else {
        Notify({ duration: 1000, type: "dangger", message: "系统繁忙" });
      }
    },
  },
  created() {
    this.getQuestionList();
    this.getUserInfo();
  },
};
</script>

<style lang="less" scoped>
.exam {
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
      }
    }
  }
}
</style>