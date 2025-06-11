import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // عدّل إذا كنت تستخدم عنوان مختلف
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request if it exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
