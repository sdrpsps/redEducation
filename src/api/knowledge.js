import request from "@/utils/request.js";

// 获取试卷类型
export const getQuestionType = () => {
  let url = "/api/questions/types";
  return request.get(url);
};

// 获取试卷类型
export const getQuestionList = (questionType, pageSize, currentPage) => {
  let url = "/api/questions/getQuestion";
  return request.get(url, { params: { questionType, pageSize, currentPage } });
};

// 获取试卷题目
export const getQuestion = (id) => {
  let url = "/api/questions/getQuestionById";
  return request.get(url, { params: { id } });
};

// 提交试卷
export const submitQuestions = ({
  answer,
  answerTime,
  questionId,
  questionType,
  title,
  userId,
  userName,
}) => {
  let url = "/api/questions/submitQuestion";
  return request.post(url, {
    answer,
    answerTime,
    questionId,
    questionType,
    title,
    userId,
    userName,
  });
};
