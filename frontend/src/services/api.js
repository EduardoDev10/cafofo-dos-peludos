import axios from 'axios';

// Instância centralizada do Axios para a API do backend
const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

export default api;
