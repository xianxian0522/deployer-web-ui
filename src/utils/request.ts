import axios from 'axios';
import {message} from "ant-design-vue";
import router from "../router";

const service = axios.create({
  baseURL: '/',
  timeout: 1000000, // 请求超时时间
})
service.defaults.headers.post['Content-Type'] = 'application/json';

service.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  // console.log(token, 'token', config);
  if (token) {
    config.headers.Authorization = 'Bearer ' + token; //如果token 存在，就带上token
  } else {
    router.push('/login').then();
    // config.headers['token'] = ''; //return
  }
  return config;
}, error => {
  return Promise.reject(error);
})

service.interceptors.response.use(response => {

  return response;
}, error => {
  if(error.response?.status=='401'){
    localStorage.removeItem('token');
    router.push('/login').then();
  }
  message.error(error.response?.data);
  return Promise.reject(error);
})

// export default service

export default {
  get<T>(url: string, params = {}) {
    return new Promise<T>((resolve, reject) => {
      service.get(url, {params})
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  post<T>(url: string, params = {}) {
    return new Promise<T>((resolve, reject) => {
      service.post(url, params)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  put<T>(url: string, params = {}) {
    return new Promise<T>((resolve, reject) => {
      service.put(url, params)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }
}
