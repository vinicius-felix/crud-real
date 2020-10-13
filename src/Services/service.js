import axios from 'axios';
const config = require('./api_link');

const apiReceptivos = axios.create({
  baseURL: config.API + '/products',
});

export default apiReceptivos;