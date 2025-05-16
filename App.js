import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  FlatList,
  SafeAreaView
} from 'react-native';
import LoginScreen from './components/LoginScreen';
import ProcessCard from './components/ProcessCard';
import { getAuthenticatedAxios } from './utils/apiUtils';
import TaskList from './components/TaskList';
import MyTasks from './components/MyTasks';

const PROCESS_CONFIG = {
  BP1: 44,
  BP2: 45,
  BP3: 46,
  BP4: 47,
  BP5: 48
};

const App = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [processes, setProcesses] = useState([
    { id: PROCESS_CONFIG.BP1, data: null, tasks: [], showTasks: false },
    { id: PROCESS_CONFIG.BP2, data: null, tasks: [], showTasks: false },
    { id: PROCESS_CONFIG.BP3, data: null, tasks: [], showTasks: false },
    { id: PROCESS_CONFIG.BP4, data: null, tasks: [], showTasks: false },
    { id: PROCESS_CONFIG.BP5, data: null, tasks: [], showTasks: false }
  ]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState({
    processes: false,
    tasks: {
      [PROCESS_CONFIG.BP1]: false,
      [PROCESS_CONFIG.BP2]: false,
      [PROCESS_CONFIG.BP3]: false,
      [PROCESS_CONFIG.BP4]: false,
      [PROCESS_CONFIG.BP5]: false
    },
    actions: false,
    completedTasks: false
  });

  useEffect(() => {
    if (token) {
      console.log('Получен токен:', token);
      fetchAllProcesses();
    }
  }, [token]);

  const handleLoginSuccess = async (newToken) => {
    try {
      setToken(newToken);
      setError(null);
    } catch (err) {
      setError('Ошибка при авторизации');
      console.error('Login error:', err);
    }
  };

  const handleLogout = () => {
    setToken('');
    setProcesses([
      { id: PROCESS_CONFIG.BP1, data: null, tasks: [], showTasks: false },
      { id: PROCESS_CONFIG.BP2, data: null, tasks: [], showTasks: false },
      { id: PROCESS_CONFIG.BP3, data: null, tasks: [], showTasks: false },
      { id: PROCESS_CONFIG.BP4, data: null, tasks: [], showTasks: false },
      { id: PROCESS_CONFIG.BP5, data: null, tasks: [], showTasks: false }
    ]);
    setCompletedTasks([]);
    setError(null);
  };

  const fetchAllProcesses = async () => {
    if (!token) return;

    setLoading(prev => ({ ...prev, processes: true }));
    try {
      const api = getAuthenticatedAxios(token);
      
      const processesData = await Promise.all(
        processes.map(async process => {
          const response = await api.get(`/process/${process.id}`);
          return { ...process, data: response.data };
        })
      );

      setProcesses(processesData);
    } catch (err) {
      console.error('Ошибка при получении процессов:', err);
      setError('Не удалось загрузить процессы');
    } finally {
      setLoading(prev => ({ ...prev, processes: false }));
    }
  };

  const fetchTasksByProcessId = async (processId) => {
    if (!token) return;

    setLoading(prev => ({ ...prev, tasks: { ...prev.tasks, [processId]: true } }));
    try {
      const api = getAuthenticatedAxios(token);
      const response = await api.get(`/task/process/${processId}`);
      
      setProcesses(prev => 
        prev.map(process => 
          process.id === processId 
            ? { ...process, tasks: response.data } 
            : process
        )
      );
    } catch (err) {
      console.error(`Ошибка при получении задач для процесса ${processId}:`, err);
      Alert.alert('Ошибка', `Не удалось загрузить задачи для процесса ${processId}`);
    } finally {
      setLoading(prev => ({ ...prev, tasks: { ...prev.tasks, [processId]: false } }));
    }
  };

  const startProcess = async (processId) => {
    if (!token) return;

    setLoading(prev => ({ ...prev, actions: true }));
    try {
      const api = getAuthenticatedAxios(token);
      await api.post(`/process/${processId}/start`);
      Alert.alert('Успех', 'Процесс успешно запущен!');
      await fetchAllProcesses();
    } catch (err) {
      console.error('Ошибка запуска процесса:', err);
      Alert.alert('Ошибка', 'Не удалось запустить процесс');
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

const completeTask = async (taskId) => {
  if (!token) {
    Alert.alert('Ошибка', 'Требуется авторизация');
    return;
  }

  try {
    const api = getAuthenticatedAxios(token);
    
    // 1. Завершаем задачу
    await api.post(`task/${taskId}/complete`, {}, {
      headers: { 
        'Content-Type': 'application/json',
      },
    });

    // 2. Находим процесс, к которому принадлежит задача
    const processWithTask = processes.find(process => 
      process.tasks.some(t => t.id === taskId)
    );

    if (processWithTask) {
      // 3. Обновляем данные процесса
      const processResponse = await api.get(`/process/${processWithTask.id}`);
      const updatedProcess = processResponse.data;

      // 4. Обновляем состояние
      setProcesses(prev => 
        prev.map(process => 
          process.id === processWithTask.id 
            ? { ...process, data: updatedProcess } 
            : process
        )
      );

      // 5. Перезагружаем задачи (если нужно)
      await fetchTasksByProcessId(processWithTask.id);
    }

    Alert.alert("Успех", `Задача #${taskId} завершена`);
    
  } catch (error) {
    console.error("Ошибка:", error);
    Alert.alert("Ошибка", "Не удалось обновить статус процесса");
  }
};
 
const getCompletedProcesses = () => {
  return processes.filter(process => 
    process.data?.executionStatus === "ENDED"
  );
};

  const renderCompletedProcesses = () => {
  const completedProcesses = getCompletedProcesses();

  return (
    <FlatList
      data={completedProcesses}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.notFoundText}>Нет завершенных процессов</Text>
          <Text style={styles.hintText}>Здесь будут отображаться завершенные процессы</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.completedTaskContainer}>
          <Text style={styles.completedTaskTitle}>{item.data?.definitionName}</Text>
          <Text style={styles.completedTaskSubtitle}>ID: {item.id}</Text>
          <Text style={styles.completedTaskSubtitle}>
            Статус: {item.data?.executionStatus}
          </Text>
          {item.data?.endDate && (
            <Text style={styles.completedTaskDate}>
              Завершено: {new Date(item.data.endDate).toLocaleString()}
            </Text>
          )}
        </View>
      )}
      keyExtractor={(item) => `completed-process-${item.id}`}
    />
  );
};
  const toggleTasksVisibility = async (processId) => {
    try {
      setProcesses(prev => 
        prev.map(process => {
          if (process.id === processId) {
            const newShowTasks = !process.showTasks;
            if (newShowTasks && process.tasks.length === 0) {
              fetchTasksByProcessId(processId);
            }
            return { ...process, showTasks: newShowTasks };
          }
          return process;
        })
      );
    } catch (err) {
      console.error('Ошибка при переключении видимости задач:', err);
    }
  };

const renderProcessItem = ({ item }) => {
  // Находим название процесса по ID
  const processName = Object.keys(PROCESS_CONFIG).find(
    key => PROCESS_CONFIG[key] === item.id
  );

  return (
    <View style={styles.processContainer}>
      <ProcessCard 
        process={item.data} 
        processName={processName} // Передаем название в компонент
        onStartProcess={() => startProcess(item.id)}
        onShowTasks={() => toggleTasksVisibility(item.id)}
        isProcessing={loading.actions || loading.tasks[item.id]}
        showTasks={item.showTasks}
      />
      {item.showTasks && (
        <TaskList 
          tasks={item.tasks} 
          onComplete={(taskId) => completeTask(taskId, item.id)}
        />
      )}
    </View>
  );
};

  const renderContent = () => {
    if (loading.processes && processes.every(p => !p.data)) {
      return <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />;
    }

    if (error) {
      return <Text style={styles.error}>{error}</Text>;
    }

    if (processes.every(p => !p.data)) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.notFoundText}>Процессы не найдены</Text>
          <Text style={styles.hintText}>Попробуйте обновить страницу или проверьте соединение</Text>
        </View>
      );
    }

    return (
      <View style={styles.content}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Активные</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Завершенные</Text>
          </TouchableOpacity>
          
        </View>

        {activeTab === 'active' ? (
          <FlatList
            data={processes.filter(p => p.data)}
            renderItem={renderProcessItem}
            keyExtractor={item => `process-${item.id}`}
          />
        ) : activeTab === 'completed' ? (
          renderCompletedProcesses()
        ) : (
          <MyTasks token={token} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {token ? (
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                onPress={handleLogout} 
                style={styles.logoutButton}
                testID="logout-button"
              >
                <Text style={styles.logoutBtnText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.header}>Бизнес-процессы рекрутинга</Text>
            </View>
            
            {renderContent()}
          </View>
        ) : (
          <LoginScreen 
            onLoginSuccess={handleLoginSuccess} 
            onError={setError}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 100, // Добавим минимальную ширину
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e88e5',
    textAlign: 'center',
    maxWidth: '80%',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
  },
  logoutBtnText: {
    color: '#1e88e5',
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    color: '#e53935',
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  notFoundText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#546e7a',
    marginTop: 20,
  },
  hintText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#90a4ae',
    marginTop: 8,
  },
  processContainer: {
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 30,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#1e88e5',
  },
  tabText: {
    fontSize: 16,
    color: '#1e88e5',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    height: 50,
  },
  content: {
    flex: 1,
  },
  completedTaskContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  completedTaskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  completedTaskSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  completedTaskDate: {
    fontSize: 12,
    color: '#90a4ae',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default App;