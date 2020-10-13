import axios from 'axios';
const config = require('./api_link');

const apiRegister = axios.create({
  baseURL: config.API + '/registers',
});

export default apiRegister;