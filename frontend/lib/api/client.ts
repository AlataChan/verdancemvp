import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * 创建axios实例作为API客户端
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒超时
  withCredentials: false, // 禁用凭证发送
});

/**
 * 请求拦截器，添加认证令牌
 */
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    // 如果存在token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器，处理常见错误
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 处理401未授权错误
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // 清除无效token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      
      // 重定向到登录页
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 