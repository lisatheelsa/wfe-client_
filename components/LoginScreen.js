import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { login } from '../api/authApi';
import { ActivityIndicator } from 'react-native';


const LoginScreen = ({ onLoginSuccess }) => {
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // В LoginScreen.js, измените обработчик handleLogin:
  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { token, user } = await login(loginInput, passwordInput);
      onLoginSuccess(token, user.fullName); // Передаем имя пользователя
    } catch (err) {
      setError('Неверный логин или пароль');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.loginContainer}>
        <Text style={styles.header}>Добро пожаловать</Text>
        <Text style={styles.subheader}>Войдите в систему</Text>

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Логин"
          placeholderTextColor="#90a4ae"
          value={loginInput}
          onChangeText={setLoginInput}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#90a4ae"
          value={passwordInput}
          onChangeText={setPasswordInput}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Войти</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loginContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 30,
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1e88e5',
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    color: '#546e7a',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 15,
    marginBottom: 20,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    color: '#263238',
  },
  loginButton: {
    backgroundColor: '#1e88e5',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  error: {
    color: '#e53935',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginScreen;