/*
    封装axios 异步请求
*/
// import Vue from 'vue'
import axios from "axios"
import router from '../router/index';

import {
  Loading,
  Message
} from 'element-ui';
let loading;
// 开启加载
const startLoading = () => {
  loading = Loading.service({
    lock: true,
    text: "拼命加载中",
    background: "rgba(0,0,0,0.7)"
  });
}
// 关闭加载
const endLoading = () => {
  loading.close()
}

let API_Root = ''
if(window.location.href.includes('ymd.romacredit.com')){
  API_Root = 'http://ymd.romacredit.com:8765/emdManager/'
}else{
  API_Root = 'http://ymdsit.romacredit.com:8765/emdManager/'
}
const API_Root_DEV = 'http://ymdsit.romacredit.com:8765/emdManager/'

axios.defaults.baseURL = (process.env.NODE_ENV === 'production' ? API_Root : API_Root_DEV)

// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 加载动画
  startLoading();
   /*if(localStorage.getItem("Authorization")){
       config.headers.token = localStorage.getItem("Authorization");
   }
   if(!localStorage.getItem("Authorization")){
     router.push('/login')
   }
   console.log('请求到');*/
  return config
}, function (error) {
  Message.error('请求失败')
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(response => {
  // 结束加载动画
  endLoading();
  // console.log('拦截到');
  // 获取错误状态码
//   const {code} = response.data;
//   if(code == 100012){
//       // 清除token
//       localStorage.removeItem('eleTokenA')
//       // 跳转到登录
//       router.push('/login')
//   }
  return response
},error => {
  // 错误提醒
  endLoading();
  console.log(error);

//   return Promise.reject(error)
})

export default axios
