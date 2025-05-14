import axios from 'axios';

export const getAuthenticatedAxios = (token) => {
  const instance = axios.create({
    baseURL: 'https://wf.processtech.ru/restapi/', // Убедитесь, что это правильный базовый URL
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return instance;
};