import request from "@/utils/request.js";

// 登录
export const loginSys = (username, password) => {
  let url = "/api/v1/user/login";
  return request.post(url, { username, password });
};

// 发送验证码
export const sendEmailCode = (email) => {
  let url = "/api/user/getCode";
  return request.post(url, { email });
};

// 验证邮箱是否可用
export const checkEmail = (email) => {
  let url = "/api/user/emailIsValidate";
  return request.post(url, { email });
};

// 用户注册
export const userRegister = ({ name, email, password, code }) => {
  let url = "/api/user/register";
  return request.post(url, { name, email, password, code });
};

// 修改头像
export const updateAvatar = (_id, imageUrl) => {
  let url = "/api/user/updateAvatar";
  return request.post(url, { _id, imageUrl });
};

// 图片上传
export const uploadPicture = (cover) => {
  let url = "/api/upload/store";
  // cover是一个文件，所以下面传参是要把{}去除
  return request.post(url, cover);
};

// 修改密码
export const changePassword = (oldPassword, newPassword) => {
  let url = "/api/v1/user/updatePwd";
  return request.post(url, { oldPassword, newPassword });
};
