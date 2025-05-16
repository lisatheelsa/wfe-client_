import axios from 'axios';

export const getAuthenticatedAxios = (token) => {
  const instance = axios.create({
    // baseURL: 'https://testing.processtech.ru/wfe/restapi/',
    // baseURL: 'https://wf.processtech.ru/restapi/',
    baseURL: 'https://testing.processtech.ru/restapi/',

    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return instance;
};