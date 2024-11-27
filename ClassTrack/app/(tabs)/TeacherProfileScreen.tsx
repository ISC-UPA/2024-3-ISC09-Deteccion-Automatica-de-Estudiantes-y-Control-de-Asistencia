import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import { Card, Title, Paragraph, Text, Button, Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

interface Class {
  name: string;
  schedule: string;
  description: string;
}

const TeacherProfileScreen = () => {
  const router = useRouter();
  const { teacherId } = useLocalSearchParams(); // Get teacherId from navigation params

  const [teacherData, setTeacherData] = useState({ name: '', studentID: '', email: '' });
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teacherId) {
      setError('No teacherId found');
      setLoading(false);
      return; // Exit early if teacherId is missing
    }

    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error before trying to fetch again

        // Fetch teacher details
        const teacherResponse = await axios.post(
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
            variables: { where: { id: { equals: teacherId } } },
          }
        );

        if (teacherResponse.data?.data?.users?.length > 0) {
          setTeacherData(teacherResponse.data.data.users[0]);
        } else {
          throw new Error('No teacher data found');
        }

        // Fetch classes linked to the teacher
        const classResponse = await axios.post(
          'https://classtrack-api-alumnos-bqh8a0fnbpefhhgq.mexicocentral-01.azurewebsites.net/api/graphql',
          {
            query: `
              query Query($where: ClassWhereInput!) {
                classes(where: $where) {
                  name
                  schedule
                  description
                }
              }
            `,
            variables: {
              where: {
                teacher: {
                  id: {
                    equals: teacherId,
                  },
                },
              },
            },
          }
        );

        setClasses(classResponse.data.data.classes || []);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userEmail');
      router.push('/'); // Navigate to the login or home screen
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(
        'https://classtrack-api-alumnos-bqh8a0fnbpefhhgq.mexicocentral-01.azurewebsites.net/api/graphql',
        {
          query: `
            mutation DeleteUser($where: UserWhereUniqueInput!) {
              deleteUser(where: $where) {
                id
                name
              }
            }
          `,
          variables: { where: { id: teacherId } },
        }
      );
      await AsyncStorage.clear(); // Clear the user data in AsyncStorage
      router.push('/TeachersScreen'); // Redirect to login or home screen
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Perfil del Docente" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Image
              source={{
                uri: 'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg',
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Title>{teacherData.name}</Title>
              <Paragraph>ID: {teacherData.studentID}</Paragraph>
              <Paragraph>Email: {teacherData.email}</Paragraph>
            </View>
          </Card.Content>
        </Card>
        <Title style={styles.classesTitle}>Clases Asignadas</Title>
        {classes.map((classItem, index) => (
          <Card
            key={index}
            style={styles.classCard}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/classScreen',
                params: {
                  subject: classItem.name,
                  schedule: classItem.schedule,
                  classroom: classItem.description,
                },
              })
            }
          >
            <Card.Content>
              <Title>{classItem.name}</Title>
              <Paragraph>{classItem.description}</Paragraph>
              <Text style={styles.classSchedule}>Horario: {classItem.schedule}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      <Button
        mode="contained"
        onPress={() => router.back()}
        style={styles.backButton}
        icon="arrow-left"
      >
        Regresar
      </Button>
      <Button
        mode="contained"
        onPress={handleDelete}
        style={styles.deleteButton}
        icon="delete"
      >
        Eliminar Cuenta
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { padding: 16, paddingBottom: 80 },
  profileCard: { marginBottom: 16, elevation: 2 },
  profileContent: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  profileInfo: { flex: 1 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginTop: 20 },
  backButton: { margin: 16, borderRadius: 8 },
  deleteButton: { margin: 16, borderRadius: 8, backgroundColor: '#F44336' },
  classesTitle: { fontSize: 20, marginVertical: 16, marginLeft: 16 },
  classCard: { marginBottom: 16, marginHorizontal: 16, elevation: 2 },
  classSchedule: { marginTop: 8, color: '#555' },
});

export default TeacherProfileScreen;
