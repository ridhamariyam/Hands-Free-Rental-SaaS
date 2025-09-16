import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8001/api/', // Updated to match backend
  timeout: 10000,
});

export default instance;
