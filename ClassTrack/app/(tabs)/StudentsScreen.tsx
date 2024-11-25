import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios'; // Importar axios
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
  studentID: string;
  email: string;
}

const StudentCard: React.FC<Student> = ({ id, name, studentID, email }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('StudentProfile', { studentId: id });
  };

  return (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={handlePress}
      activeOpacity={0.7} // Añadir retroalimentación visual
    >
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{name}</Text>
        <Text style={styles.studentDetails}>ID: {studentID}</Text>
        <Text style={styles.studentDetails}>Email: {email}</Text>
      </View>
      <FontAwesome name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );
};

const StudentsScreen: React.FC = () => {
  const [sortOption, setSortOption] = useState<'name' | 'studentID'>('name');
  const [students, setStudents] = useState<Student[]>([]); // Almacenar los estudiantes
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Realizar la solicitud GraphQL
        const response = await axios.post(
          'https://classtrack-api-alumnos-bqh8a0fnbpefhhgq.mexicocentral-01.azurewebsites.net/api/graphql',
          {
            query: `
              query Query($where: UserWhereInput!) {
                users(where: $where) {
                  name
                  studentID
                  email
                }
              }
            `,
            variables: {
              where: {
                role: {
                  equals: 'student',
                },
              },
            },
          }
        );
        setStudents(response.data.data.users); // Guardar los estudiantes en el estado
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false); // Terminar la carga
      }
    };

    fetchStudents(); // Llamada a la API
  }, []);

  const sortData = () => {
    if (sortOption === 'name') {
      return [...students].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'studentID') {
      return [...students].sort((a, b) => a.studentID.localeCompare(b.studentID));
    }
    return students;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student List</Text>
        <RNPickerSelect
          onValueChange={(value) => setSortOption(value)}
          items={[
            { label: 'Name', value: 'name' },
            { label: 'ID', value: 'studentID' },
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
        keyExtractor={(item) => item.studentID} // Cambiar ID por studentID
        renderItem={({ item }) => (
          <StudentCard
            id={item.studentID} // Usar studentID como id
            name={item.name}
            studentID={item.studentID}
            email={item.email}
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
