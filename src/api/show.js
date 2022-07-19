import request from "@/utils/request";

// 获取收藏列表
export const getLikeList = (pageSize = 10, currentPage = 1) => {
  let url = "/api/questions/getUserCollects";
  return request.get(url, { params: { pageSize, currentPage } });
};

// 移除收藏
export const cancelLike = (newsId) => {
  let url = "/api/questions/cancelCollect";
  return request.get(url, { params: { newsId } });
};

// 获取试卷列表
export const getAnswerQuestion = (pageSize, currentPage) => {
  let url = "/api/questions/getAnswerQuestion";
  return request.get(url, { params: { pageSize, currentPage } });
};

// 获取评论列表
export const getComment = (pageSize, currentPage) => {
  let url = "/api/v2/comment/getUserComments";
  return request.get(url, { params: { pageSize, currentPage } });
};

// 删除评论
export const deleteComment = (_id) => {
  let url = `/api/comment/delete/${_id}`;
  return request.get(url);
};

// 获取试卷答题情况
export const getQuestionScore = (id) => {
  let url = "/api/questions/getAnswerQuestionById";
  return request.get(url, { params: { id } });
};
