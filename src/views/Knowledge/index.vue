<template>
  <div class="knowledge">
    <van-grid :column-num="2">
      <van-grid-item
        v-for="item in questionType"
        :key="item.id"
        icon="records"
        :text="item.name"
        @click="gotoList(item)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getQuestionType } from "@/api/knowledge.js";
export default {
  data() {
    return {
      questionType: [],
    };
  },
  methods: {
    // 获取试卷类型
    async getQuestionCat() {
      let res = await getQuestionType();
      console.log(res, "获取试卷类型");
      let {
        data: { result },
      } = res;
      this.questionType = result;
    },
    gotoList(item) {
      this.$router.push({ path: "/list", query: { type: item.name } });
    },
  },
  created() {
    this.getQuestionCat();
  },
};
</script>

<style lang="less" scoped>
.knowledge {
  height: 100vh;
}
</style>