import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import { Card, Title, Paragraph, ProgressBar, Text, Button, Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

interface AbsenceData {
  subject: string;
  count: number; // Cantidad de veces que aparece la materia
}

const StudentProfile = () => {
  const router = useRouter();
  const { studentId } = useLocalSearchParams(); // Obtener el studentId desde la navegación

  const [studentData, setStudentData] = useState({ name: '', studentID: '', email: '' });
  const [absenceData, setAbsenceData] = useState<AbsenceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentResponse = await axios.post(
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
            variables: { where: { id: { equals: studentId } } },
          }
        );
        setStudentData(studentResponse.data.data.users[0]);

        const absenceResponse = await axios.post(
          'https://classtrack-api-alumnos-bqh8a0fnbpefhhgq.mexicocentral-01.azurewebsites.net/api/graphql',
          {
            query: `
              query Query($where: AttendanceWhereInput!) {
                attendances(where: $where) {
                  class {
                    name
                  }
                }
              }
            `,
            variables: { where: { user: { id: { equals: studentId } } } },
          }
        );

        const classCounts: { [key: string]: number } = {};

        absenceResponse.data.data.attendances.forEach((attendance: any) => {
          const className = attendance.class.name;
          if (classCounts[className]) {
            classCounts[className] += 1;
          } else {
            classCounts[className] = 1;
          }
        });

        const formattedAbsenceData = Object.keys(classCounts).map((className) => ({
          subject: className,
          count: classCounts[className],
        }));

        setAbsenceData(formattedAbsenceData);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchStudentData();
  }, [studentId]);

  const renderAbsenceBar = (subject: string, count: number) => {
    const progress = count / 10; // Puedes ajustar el valor máximo (10) según lo que consideres
    const isCritical = count >= 10; // Define cuándo es crítico

    return (
      <Card style={styles.card} key={subject}>
        <Card.Content>
          <View style={styles.subjectRow}>
            <Title style={styles.subjectTitle} numberOfLines={1}>
              {subject}
            </Title>
            <Text style={[styles.absenceText, isCritical && styles.criticalText]}>
              {count}/10
            </Text>
          </View>
          <ProgressBar progress={progress} color={isCritical ? '#F44336' : '#6200EE'} style={styles.progressBar} />
        </Card.Content>
      </Card>
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userEmail');
      router.push('/'); // Navegar a la pantalla de inicio o login
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
          variables: { where: { id: studentId } },
        }
      );
      await AsyncStorage.clear(); // Limpiar los datos del usuario en AsyncStorage
      router.push('/'); // Redirigir al login o página principal
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

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Perfil del Estudiante" />
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
              <Title>{studentData.name}</Title>
              <Paragraph>ID: {studentData.studentID}</Paragraph>
              <Paragraph>Email: {studentData.email}</Paragraph>
            </View>
          </Card.Content>
        </Card>
        {absenceData.map(({ subject, count }) => renderAbsenceBar(subject, count))}
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
  card: { marginBottom: 16, elevation: 2 },
  subjectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subjectTitle: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8 },
  progressBar: { height: 8, borderRadius: 4 },
  absenceText: { fontSize: 14, color: '#757575', flexShrink: 0 },
  criticalText: { color: '#F44336' },
  backButton: { margin: 16, borderRadius: 8 },
  deleteButton: { margin: 16, borderRadius: 8, backgroundColor: '#F44336' }, // Estilo para el botón de eliminación
});

export default StudentProfile;