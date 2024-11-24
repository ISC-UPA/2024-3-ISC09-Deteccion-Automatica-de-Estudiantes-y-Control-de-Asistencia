import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  TeacherProfile: {
    teacherId: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TeacherProfile'>;

interface Teacher {
  id: string;
  name: string;
  code: string;
  department: string;
}

const TeacherCard: React.FC<Teacher> = ({ id, name, code, department }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('TeacherProfile', { teacherId: id });
  };

  return (
    <TouchableOpacity
      style={styles.teacherCard}
      onPress={handlePress}
      activeOpacity={0.7} // Feedback visual al presionar
    >
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>{name}</Text>
        <Text style={styles.teacherDetails}>{code}</Text>
        <Text style={styles.teacherDetails}>{department}</Text>
      </View>
      <FontAwesome name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );
};

const TeachersScreen: React.FC = () => {
  const [sortOption, setSortOption] = useState<'name' | 'department'>('name');
  const [data] = useState<Teacher[]>([
    { id: '1', name: 'Rodrigo Sánchez', code: 'UP210612', department: 'ISC09A' },
    { id: '2', name: 'Maria López', code: 'UP210789', department: 'ISC09B' },
    { id: '3', name: 'Juan Pérez', code: 'UP210456', department: 'ISC09C' },
    { id: '4', name: 'Laura Gómez', code: 'UP210123', department: 'ISC09A' },
  ]);

  const sortData = () => {
    if (sortOption === 'name') {
      return [...data].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'department') {
      return [...data].sort((a, b) => a.department.localeCompare(b.department));
    }
    return data;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teacher List</Text>
        <RNPickerSelect
          onValueChange={(value) => setSortOption(value)}
          items={[
            { label: 'Name', value: 'name' },
            { label: 'Department', value: 'department' },
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
          <TeacherCard
            id={item.id}
            name={item.name}
            code={item.code}
            department={item.department}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Fondo claro para mejor contraste
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6200EE', // Color consistente para la cabecera
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  teacherCard: {
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
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  teacherDetails: {
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

export default TeachersScreen;
