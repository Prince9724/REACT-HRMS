import axios from 'axios';
const baseURL = 'http://localhost:3000';  // change 5000 to 3000
const axiosInstance = axios.create({ baseURL });
export default axiosInstance;