import axios from 'axios';

// const BASE_URL = 'https://testing.processtech.ru/wfe/restapi/';
const BASE_URL = 'https://wf.processtech.ru/restapi/';
// const BASE_URL = 'https://testing.processtech.ru/restapi/';


export const login = async (login, password) => {
  try {
    const response = await axios.post(`${BASE_URL}auth/basic`, {
      login,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'text' 
    });

    console.log('Получен токен:', response.data); 
    return response.data; 
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    throw error;
  }
};

