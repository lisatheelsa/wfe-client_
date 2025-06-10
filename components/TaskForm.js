
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { getAuthenticatedAxios } from '../utils/apiUtils';

const TaskForm = ({ taskId, token, onComplete }) => {
  const [variables, setVariables] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTaskVariables();
  }, []);

  const fetchTaskVariables = async () => {
    try {
      const api = getAuthenticatedAxios(token);
      const response = await api.get(`/task/${taskId}`);
      const vars = response.data?.variables || [];
      setVariables(vars);
      const initialValues = {};
      vars.forEach(v => initialValues[v.name] = '');
      setFormValues(initialValues);
    } catch (err) {
      console.error('Ошибка при получении переменных задачи:', err);
      Alert.alert('Ошибка', 'Не удалось загрузить переменные задачи');
    }
  };

  const handleChange = (name, value) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const api = getAuthenticatedAxios(token);
      await api.post(`/task/${taskId}/complete`, {
        parameters: formValues
      });
      Alert.alert('Успешно', 'Задача завершена');
      onComplete();
    } catch (err) {
      console.error('Ошибка при завершении задачи:', err);
      Alert.alert('Ошибка', 'Не удалось завершить задачу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {variables.map(variable => (
        <View key={variable.name} style={styles.inputGroup}>
          <Text style={styles.label}>{variable.name}</Text>
          <TextInput
            style={styles.input}
            value={formValues[variable.name]}
            onChangeText={(text) => handleChange(variable.name, text)}
            placeholder={`Введите значение для ${variable.name}`}
          />
        </View>
      ))}
      <Button title={loading ? 'Отправка...' : 'Завершить задачу'} onPress={handleSubmit} disabled={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 }
});

export default TaskForm;
