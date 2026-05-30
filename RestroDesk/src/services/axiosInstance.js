import axios from 'axios';

const baseURL = 'http://localhost:5000'; // json-server default port

export default axios.create({ baseURL });