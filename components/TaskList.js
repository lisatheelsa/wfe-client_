import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const TaskList = ({ tasks = [], onComplete, processIndex }) => {
  const handleCompletePress = async (task) => {
    try {
      await onComplete(task.id);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось выполнить задачу");
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.taskContainer}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>Задача {index + 1}</Text>
      </View>
      
      <View style={styles.textWrapper}>
      <Text style={styles.title}>
        {item.name || 'Без названия'}
      </Text>
      <Text style={styles.subtitle}>
        Исполнитель: {item.owner?.fullName || 'Не назначен'}
      </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCompletePress(item)}
      >
        <Text style={styles.buttonText}>Выполнить</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  taskContainer: {
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
  title: {
    fontWeight: '600',
    color: '#0d47a1',
    flexShrink: 1,

    fontSize: 15,
    marginBottom: 5,
    paddingRight: 70, // Увеличиваем отступ для номера
    marginTop: 4, // Добавляем отступ сверху
  },
  numberBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 2, // Повышаем z-index
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textWrapper: {
    maxWidth: '80%', // Ограничиваем ширину текста
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  numberText: {
    color: '#1e88e5',
    fontSize: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1e88e5',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TaskList;