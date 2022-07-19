import request from "@/utils/request";

// 获取轮播图
export const getBannerByID = (id) => {
  let url = "/api/v1/banner/bypos";
  return request.get(url, { params: { id } });
};

// 获取资讯分类
export const getNewsCategory = () => {
  let url = "/api/cate/flist";
  return request.get(url);
};

// 获取资讯
export const getNewsByCateID = ({ pageSize, cate_id, currentPage }) => {
  let url = "/api/news/flist";
  return request.get(url, { params: { pageSize, cate_id, currentPage } });
};

// 获取资讯详情
export const getNewsDetailByCateID = (newsId) => {
  let url = "/api/news/detail";
  return request.get(url, { params: { newsId } });
};

// 获取评论列表
export const getCommentByID = (newsId, pageSize = 5, currentPage = 1) => {
  let url = "/api/comment/getCommentList";
  return request.get(url, { params: { newsId, pageSize, currentPage } });
};

// 增加阅读数
export const addNewsViewCount = (newsId) => {
  let url = "/api/news/viewAdd";
  return request.post(url, { newsId });
};

// 提交评论
export const submit = (content, newsId, title) => {
  let url = "/api/comment/submitComment";
  return request.post(url, { content, newsId, title });
};

// 收藏文章
export const addLike = (newsId) => {
  let url = "/api/questions/addCollect";
  return request.get(url, { params: { newsId } });
};
