<template>
  <div>
    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in bannerList" :key="item.ID">
        <img :src="item.imageUrl" alt="" style="width: 100%" />
      </van-swipe-item>
    </van-swipe>
    <!-- tab选项卡 -->
    <van-tabs v-model="tabActive" @click="changeTab">
      <van-tab
        v-for="item in newsCategoryList"
        :key="item._id"
        :title="item.title"
      >
        <!-- 新闻列表 -->
        <van-list class="list">
          <div
            v-for="item in newsList.list"
            :key="item._id"
            class="newsItem"
            @click="gotoDetail(item)"
          >
            <div class="left">
              <h2 class="title">{{ item.title }}</h2>
              <p class="view">
                <van-icon name="eye-o" />
                {{ item.viewCount | formatThousand }} 阅读
              </p>
              <p class="time">{{ item.createTime | formatDate }}</p>
            </div>
            <div class="right">
              <img
                :src="'https://yw.52kfw.cn' + item.imageUrl"
                alt=""
                class="newsIMG"
              />
            </div>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getBannerByID, getNewsCategory, getNewsByCateID } from "@/api/news.js";
import moment from "moment";
moment.locale("zh-cn"); // 这里是进行了汉化 不写这句默认格式是外国的
import numeral from "numeral";
export default {
  data() {
    return {
      // 首页轮播ID
      bannerID: "6268bce29114094ca0ed2354",
      // tab选项卡高亮
      tabActive: 0,
      // 轮播图列表
      bannerList: [],
      // 资讯分类
      newsCategoryList: [],
      // 资讯列表
      newsList: {
        pageSize: 10,
        cate_id: "国家事实",
        currentPage: 1,
        list: [],
        total: 0,
      },
    };
  },
  methods: {
    // 获取轮播图
    async getBannerList() {
      let res = await getBannerByID(this.bannerID);
      console.log(res, "获取轮播图");
      let {
        data: {
          info: { banners },
        },
      } = res;
      this.bannerList = banners;
    },
    // 获取资讯分类
    async getNewsCat() {
      let res = await getNewsCategory();
      console.log(res, "获取资讯分类");
      let {
        data: { list },
      } = res;
      this.newsCategoryList = list;
      this.newsList.cate_id = list[0].title;
    },
    // 获取资讯
    async getNewsList() {
      let res = await getNewsByCateID(this.newsList);
      console.log(res, "获取资讯列表");
      let {
        data: { list, total },
      } = res;
      list.forEach((item) => {
        this.newsList.list.push(item);
      });
      this.newsList.total = total;
    },
    // 切换tab
    changeTab(name, title) {
      this.newsList.cate_id = title;
      this.newsList.list = [];
      this.getNewsList();
    },
    // 跳转到新闻详情页
    gotoDetail(item) {
      // 路由传参
      this.$router.push({
        path: "/detail",
        query: { id: item._id },
      });
    },
  },
  created() {
    this.getBannerList();
    this.getNewsCat();
    this.getNewsList();
  },
  filters: {
    formatDate(val) {
      return moment(val).format("lll");
    },
    formatThousand(val) {
      return numeral(val).format("0,0");
    },
  },
};
</script>

<style lang="less" scoped>
.list {
  padding-bottom: 50px;
  .newsItem {
    display: flex;
    padding: 15px;
    .left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 60%;
      .title {
        font-size: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        color: #1a1a1a;
      }
      .view {
        color: #949494;
      }
      .time {
        color: #949494;
      }
    }
    .right {
      width: 40%;
      .newsIMG {
        width: 100%;
      }
    }
  }
}
</style>>