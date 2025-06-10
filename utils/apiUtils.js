import axios from 'axios';

// Функция для добавления токена в заголовки запроса
export const getAuthenticatedAxios = (token) => {
  return axios.create({
    // baseURL: 'http://192.168.1.35:8080/restapi/',
    baseURL: 'https://wf.processtech.ru/restapi/',
    timeout: 30000, // 30 секунд
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    responseType: 'json' // Явно указываем ожидаемый тип данных
  });
};
export const delegateTask = async (token, taskId, currentOwnerName, keepCurrentOwner, newAssignees) => {
  const api = getAuthenticatedAxios(token);
  return api.patch(`/task/${taskId}/delegate`, newAssignees, {
    params: {
      currentOwnerName,
      keepCurrentOwner
    }
  });
};
// Получить исполнителя по имени
export const getExecutorByName = async (token, name) => {
  const api = getAuthenticatedAxios(token);
  return api.get(`/executor/?name=${encodeURIComponent(name)}`);
};

// Удалить исполнителей (если нужно)
export const removeExecutors = async (token, executorIds) => {
  const api = getAuthenticatedAxios(token);
  return api.delete('/executor/', { data: executorIds });
};
