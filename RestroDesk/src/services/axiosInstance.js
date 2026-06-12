import axios from 'axios';

const baseURL = 'http://localhost:3001';

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('Axios instance created with baseURL:', baseURL); // Debug line

export default axiosInstance;