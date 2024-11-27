import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';

interface ClassData {
  id: string;
  name: string;
  schedule: string;
  description: string;
}

const GET_CLASSES = gql`
  query GetClasses {
    classes {
      id
      name
      schedule
      description
    }
  }
`;

const CREATE_CLASS = gql`
  mutation Mutation($data: ClassCreateInput!) {
    createClass(data: $data) {
      name
      description
      schedule
      teacher {
        name
      }
    }
  }
`;

const ClassCard: React.FC<{ classData: ClassData; onPress: (classData: ClassData) => void }> = ({
  classData,
  onPress,
}) => (
  <TouchableOpacity style={styles.classCard} onPress={() => onPress(classData)}>
    <View style={styles.classInfo}>
      <Text style={styles.classSubject}>{classData.name}</Text>
      <Text style={styles.classDetails}>{classData.schedule}</Text>
      <Text style={styles.classDetails}>{classData.description}</Text>
    </View>
    <FontAwesome name="chevron-right" size={20} color="#666" />
  </TouchableOpacity>
);

const ClassesScreen: React.FC = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [classSchedule, setClassSchedule] = useState('');

  const { loading: loadingClasses, error: errorClasses, data: dataClasses } = useQuery(GET_CLASSES);

  const [createClass] = useMutation(CREATE_CLASS, {
    refetchQueries: [GET_CLASSES],
    onCompleted: () => setModalVisible(false),
  });

  if (loadingClasses) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (errorClasses) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading classes: {errorClasses.message}</Text>
      </View>
    );
  }

  const handleClassPress = (classData: ClassData) => {
    router.push({
      pathname: '/(tabs)/classScreen',
      params: {
        subject: classData.name,
        schedule: classData.schedule,
        classroom: classData.description,
      },
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dataClasses.classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClassCard classData={item} onPress={handleClassPress} />
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 16,
  },
  classCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  classInfo: {
    flex: 1,
  },
  classSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  classDetails: {
    fontSize: 14,
    color: '#666',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    padding: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#fff',
    marginHorizontal: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#fff',
    marginHorizontal: 16,
  },
});

export default ClassesScreen;
