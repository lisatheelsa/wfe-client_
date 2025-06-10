
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import LoginScreen from './components/LoginScreen';
import ProcessCard from './components/ProcessCard';
import TaskList from './components/TaskList';
import UserProfile from './components/UserProfile';
import StatisticsScreen from './components/StatisticsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuthenticatedAxios } from './utils/apiUtils';

const Stack = createStackNavigator();

const MainScreen = ({ token, username, handleLogout }) => {
  const [processes, setProcesses] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState({ processes: false });
  const [error, setError] = useState(null);

  const fetchProcesses = async () => {
    if (!token) return;
    setLoading(prev => ({ ...prev, processes: true }));
    try {
      const api = getAuthenticatedAxios(token);
      const response = await api.get('/process/instances', {
        params: { status: activeTab === 'active' ? 'ACTIVE' : 'ENDED' }
      });
      setProcesses(response.data);
    } catch (err) {
      console.error('Ошибка при получении процессов:', err);
      setError('Не удалось загрузить процессы');
    } finally {
      setLoading(prev => ({ ...prev, processes: false }));
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Бизнес-процессы</Text>
      {username && <UserProfile token={token} username={username} />}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab('active')}>
          <Text style={activeTab === 'active' ? styles.activeTab : styles.inactiveTab}>Активные</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('ended')}>
          <Text style={activeTab === 'ended' ? styles.activeTab : styles.inactiveTab}>Завершённые</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Выход</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => handleLogout('Stats')}
        style={styles.statButton}
      >
        <Text style={styles.statButtonText}>📊 Статистика</Text>
      </TouchableOpacity>

      {loading.processes ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView>
          {processes.map(process => (
            <ProcessCard key={process.id} process={process} token={token} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const App = () => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [goStats, setGoStats] = useState(false);

  const handleLoginSuccess = (newToken, userLogin) => {
    setToken(newToken);
    setUsername(userLogin);
  };

  const handleLogout = (route) => {
    if (route === 'Stats') {
      setGoStats(true);
    } else {
      setToken('');
      setUsername('');
    }
  };

  if (!token) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Главная" options={{ headerShown: false }}>
          {() => (
            <MainScreen token={token} username={username} handleLogout={handleLogout} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Статистика">
          {() => <StatisticsScreen token={token} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  activeTab: { color: 'blue', fontWeight: 'bold' },
  inactiveTab: { color: 'gray' },
  logout: { color: 'red' },
  error: { color: 'red', textAlign: 'center', marginTop: 10 },
  statButton: {
    backgroundColor: '#2196f3',
    marginHorizontal: 30,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  statButtonText: {
    color: '#fff',
    fontWeight: '600'
  }
});

export default App;
