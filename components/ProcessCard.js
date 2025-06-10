import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProcessCard = ({ 
  process, 
  onStartProcess, 
  onShowTasks, 
  isProcessing, 
  showTasks,
  processName
}) => {
  const formatDate = (dateString) => {
    const options = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{processName}</Text>
        </View>
        <Text style={styles.title}>
          {process?.definitionName || 'Неизвестный процесс'}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Icon name="info" size={18} color="#1e88e5" />
          <Text style={styles.detailText}>{process?.executionStatus || 'Н/Д'}</Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="access-time" size={18} color="#1e88e5" />
          <Text style={styles.detailText}>
            {process?.startDate ? formatDate(process.startDate) : 'Дата не указана'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, isProcessing && styles.buttonDisabled]}
          onPress={onStartProcess}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
                <Icon name="play-arrow" size={20} color="#fff" />
                <Text style={styles.buttonText}>Запустить</Text>
              </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.showTasksButton, showTasks && styles.activeTab]}
          onPress={onShowTasks}
        >
          <>
            <Icon 
              name={showTasks ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.showTasksButtonText}>
              {showTasks ? 'Скрыть задачи' : 'Показать задачи'}
            </Text>
          </>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  numberBadge: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
  },
  numberText: {
    color: '#1e88e5',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0d47a1',
    flexShrink: 1,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eceff1',
    paddingTop: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#37474f',
    marginLeft: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
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
  },
  buttonDisabled: {
    backgroundColor: '#90caf9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  showTasksButton: {
    backgroundColor: '#42a5f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    paddingHorizontal: 25,
  },
  activeTab: {
    backgroundColor: '#1565c0',
  },
  showTasksButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProcessCard;