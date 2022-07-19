<template>
  <div id="app">
    <router-view />
    <!-- tabbar -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="newspaper-o" to="/">红色资讯</van-tabbar-item>
      <van-tabbar-item icon="description" to="/knowledge"
        >知识库</van-tabbar-item
      >
      <van-tabbar-item icon="user-o" to="/mine">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
};
</script>

<style lang="less">
@import "@/assets/css/reset.less";
#app {
  font-size: 14px;
  background-color: #f5f5f5;
  height: 100%;
  max-width: 750px;
  margin: 0 auto;
}
</style>
