import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // عدّل إذا كنت تستخدم عنوان مختلف
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
