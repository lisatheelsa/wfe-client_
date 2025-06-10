import axios from 'axios';

// Базовый URL вашего сервера
const BASE_URL = 'http://192.168.1.35:8080/restapi/';
// const BASE_URL = 'https://wf.processtech.ru/restapi/';

export const login = async (login, password) => {
  try {
    const response = await axios.post(`${BASE_URL}auth/basic`, {
      login,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'text' // <- ВАЖНО: указываем, что ждём просто строку
    });

    console.log('Получен токен:', response.data); // <- теперь это строка JWT
    return response.data; // <- возвращаем строку напрямую
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    throw error;
  }
};

