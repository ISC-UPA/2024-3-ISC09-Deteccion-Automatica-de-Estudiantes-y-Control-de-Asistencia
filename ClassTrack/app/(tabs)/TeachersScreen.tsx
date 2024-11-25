import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ApolloProvider, gql, useQuery } from '@apollo/client';
import client from '@/api/apolloClient'; // Configuración del cliente Apollo

// Definición de tipos para navegación y datos de profesor
type RootStackParamList = {
  TeacherProfile: {
    teacherId: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TeacherProfile'>;

interface Teacher {
  studentID: string;
  name: string;
  email: string;
}

// Query GraphQL para obtener la lista de profesores
const GET_TEACHERS = gql`
  query GetTeachers($where: UserWhereInput!) {
    users(where: $where) {
      studentID
      name
      email
    }
  }
`;

// Componente para renderizar tarjetas de profesores
const TeacherCard: React.FC<Teacher> = ({ studentID, name, email }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('TeacherProfile', { teacherId: studentID });
  };

  return (
    <TouchableOpacity style={styles.teacherCard} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>{name}</Text>
        <Text style={styles.teacherDetails}>{studentID}</Text>
        <Text style={styles.teacherDetails}>{email}</Text>
      </View>
      <FontAwesome name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );
};

// Contenido principal de la pantalla
const TeachersScreenContent: React.FC = () => {
  const [sortOption, setSortOption] = useState<'name' | 'department'>('name');

  const { loading, error, data } = useQuery(GET_TEACHERS, {
    variables: {
      where: {
        role: {
          equals: "teacher",
        },
      },
    },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  // Función para ordenar los datos
  const sortData = (data: Teacher[]) => {
    if (sortOption === 'name') {
      return [...data].sort((a, b) => a.name.localeCompare(b.name));
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
          ]}
          style={pickerSelectStyles}
          value={sortOption}
          placeholder={{ label: 'Sort by...', value: null }}
          useNativeAndroidPickerStyle={false}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={sortData(data?.users || [])}
        keyExtractor={(item) => item.studentID}
        renderItem={({ item }) => (
          <TeacherCard
            studentID={item.studentID}
            name={item.name}
            email={item.email}
          />
        )}
      />
    </View>
  );
};

// Proveedor de Apollo para gestionar el contexto de GraphQL
const TeachersScreen: React.FC = () => (
  <ApolloProvider client={client}>
    <TeachersScreenContent />
  </ApolloProvider>
);

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
