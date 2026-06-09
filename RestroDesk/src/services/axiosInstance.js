import axios from 'axios';
const baseURL = 'http://localhost:3001';   // ← yeh line check karo
const axiosInstance = axios.create({ baseURL });
export default axiosInstance;







