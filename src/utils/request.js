import axios from "axios";
import { API_URL } from "@/config/config.js";

// 创建axios实例
const instance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  // TODO 添加请求头
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    if(sessionStorage.getItem("token")){
      // 添加授权的token
      config.headers.Authorization = "Bearer " + sessionStorage.getItem("token");
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response.data;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default instance;
