
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { getAuthenticatedAxios } from '../utils/apiUtils';
import { BarChart, PieChart } from 'react-native-chart-kit';

const StatisticsScreen = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const api = getAuthenticatedAxios(token);

      const active = await api.get('/process/instances', { params: { status: 'ACTIVE' } });
      const ended = await api.get('/process/instances', { params: { status: 'ENDED' } });
      const tasks = await api.get('/task/my');

      setStats({
        activeCount: active.data.length,
        endedCount: ended.data.length,
        taskCount: tasks.data.length,
      });
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />;
  }

  const chartData = {
    labels: ['Активные', 'Завершённые', 'Мои задачи'],
    datasets: [
      {
        data: [stats.activeCount, stats.endedCount, stats.taskCount]
      }
    ]
  };

  const pieData = [
    {
      name: 'Активные',
      count: stats.activeCount,
      color: '#4caf50',
      legendFontColor: '#333',
      legendFontSize: 14
    },
    {
      name: 'Завершённые',
      count: stats.endedCount,
      color: '#f44336',
      legendFontColor: '#333',
      legendFontSize: 14
    },
    {
      name: 'Мои задачи',
      count: stats.taskCount,
      color: '#2196f3',
      legendFontColor: '#333',
      legendFontSize: 14
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Статистика</Text>
      <BarChart
        data={chartData}
        width={screenWidth - 30}
        height={220}
        fromZero
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(33, 150, 243, \${opacity})`,
          labelColor: () => '#000',
          decimalPlaces: 0
        }}
        style={styles.chart}
      />
      <PieChart
        data={pieData}
        width={screenWidth - 30}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          color: (opacity = 1) => `rgba(0, 0, 0, \${opacity})`
        }}
        accessor={'count'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
        style={styles.chart}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  chart: {
    marginVertical: 10,
    borderRadius: 8
  }
});

export default StatisticsScreen;
