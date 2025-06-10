
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getExecutorByName } from '../utils/apiUtils';

const UserProfile = ({ token, username }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getExecutorByName(token, username);
      if (response.data && response.data.length > 0) {
        setProfile(response.data[0]);
      } else {
        Alert.alert("Информация", "Профиль не найден");
      }
    } catch (error) {
      console.error("Ошибка при получении профиля:", error);
      Alert.alert("Ошибка", "Не удалось загрузить профиль пользователя");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="small" color="#0000ff" />;
  }

  if (!profile) {
    return <Text style={styles.error}>Нет данных о пользователе</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Профиль пользователя</Text>
      <Text>ФИО: {profile.fullName || '—'}</Text>
      <Text>Логин: {profile.name}</Text>
      <Text>Тип: {profile.type}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8
  },
  error: {
    color: 'red',
    textAlign: 'center'
  }
});

export default UserProfile;
