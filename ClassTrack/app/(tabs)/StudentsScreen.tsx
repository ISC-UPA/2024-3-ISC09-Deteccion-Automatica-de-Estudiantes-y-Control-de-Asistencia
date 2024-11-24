import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  StudentProfile: {
    studentId: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'StudentProfile'>;

interface Student {
  id: string;
  name: string;
  code: string;
  classroom: string;
}

const StudentCard: React.FC<Student> = ({ id, name, code, classroom }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('StudentProfile', { studentId: id });
  };

  return (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={handlePress}
      activeOpacity={0.7} // Añade retroalimentación visual
    >
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{name}</Text>
        <Text style={styles.studentDetails}>ID: {code}</Text>
        <Text style={styles.studentDetails}>Classroom: {classroom}</Text>
      </View>
      <FontAwesome name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );
};

const StudentsScreen: React.FC = () => {
  const [sortOption, setSortOption] = useState<'name' | 'code'>('name');
  const [data] = useState<Student[]>([
    { id: '1', name: 'Sara Itzel García Vidal', code: 'UP21612', classroom: 'ISC09A' },
    { id: '2', name: 'Juan Pérez López', code: 'UP21589', classroom: 'ISC09A' },
    { id: '3', name: 'Ana María Fernández', code: 'UP21478', classroom: 'ISC09A' },
    { id: '4', name: 'Luis Hernández Gómez', code: 'UP21345', classroom: 'ISC09A' },
  ]);

  const sortData = () => {
    if (sortOption === 'name') {
      return [...data].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'code') {
      return [...data].sort((a, b) => a.code.localeCompare(b.code));
    }
    return data;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student List</Text>
        <RNPickerSelect
          onValueChange={(value) => setSortOption(value)}
          items={[
            { label: 'Name', value: 'name' },
            { label: 'ID', value: 'code' },
          ]}
          style={pickerSelectStyles}
          value={sortOption}
          placeholder={{ label: 'Sort by...', value: null }}
          useNativeAndroidPickerStyle={false}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={sortData()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudentCard
            id={item.id}
            name={item.name}
            code={item.code}
            classroom={item.classroom}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Fondo claro para mejor lectura
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6200EE',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#fff',
  },
});

export default StudentsScreen;
