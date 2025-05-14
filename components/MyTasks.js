// components/MyTasks.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

const MyTasks = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const api = getAuthenticatedAxios(token);
        const response = await api.post('task/my', {
          // Параметры фильтрации, если нужны
          page: 0,
          size: 20
        });
        
        setTasks(response.data.content || response.data); // В зависимости от структуры ответа
      } catch (err) {
        console.error('Ошибка при получении задач:', err);
        setError('Не удалось загрузить задачи');
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  }, [token]);

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskName}>{item.name || 'Без названия'}</Text>
      <Text style={styles.taskInfo}>ID: {item.id}</Text>
      <Text style={styles.taskInfo}>Статус: {item.state}</Text>
      {item.processName && (
        <Text style={styles.taskInfo}>Процесс: {item.processName}</Text>
      )}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <FlatList
      data={tasks}
      renderItem={renderTaskItem}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Нет задач</Text>
      }
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e88e5',
    marginBottom: 8,
  },
  taskInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: '#e53935',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#90a4ae',
    marginTop: 20,
  },
});

export default MyTasks;