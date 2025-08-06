// utils/axiosConfig.js
import axios from 'axios';
import setAuthToken from './setAuthToken';
import { API_IMAGE_URL } from '../constants/configValues';

class AxiosConfig {
  static setupAxiosDefaults() {
    axios.defaults.baseURL = API_IMAGE_URL+ "/api"; // Or dynamically fetch from config
    const token = localStorage.getItem('jwt_token') || '';
    setAuthToken(token);
  }
}

export default AxiosConfig;
