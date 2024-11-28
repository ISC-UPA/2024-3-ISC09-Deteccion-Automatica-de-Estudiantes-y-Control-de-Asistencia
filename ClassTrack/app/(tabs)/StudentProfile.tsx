import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import { Card, Title, Paragraph, ProgressBar, Text, Button, Appbar, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

interface AbsenceData {
  subject: string;
  count: number;
}

const StudentProfile = () => {
  const router = useRouter();
  const { studentId } = useLocalSearchParams();

  const [studentData, setStudentData] = useState({ name: '', studentID: '', email: '' });
  const [absenceData, setAbsenceData] = useState<AbsenceData[]>([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false); // For toggling edit mode
  const [updatedData, setUpdatedData] = useState(studentData); // For storing updated values

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
        setUpdatedData(studentResponse.data.data.users[0]);

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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userEmail');
      router.push('/'); // Redirige al login o pantalla principal
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        'https://classtrack-api-alumnos-bqh8a0fnbpefhhgq.mexicocentral-01.azurewebsites.net/api/graphql',
        {
          query: `
            mutation UpdateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
              updateUser(where: $where, data: $data) {
                name
                studentID
                email
              }
            }
          `,
          variables: {
            where: { id: studentId },
            data: {
              name: updatedData.name,
              studentID: updatedData.studentID,
              email: updatedData.email,
            },
          },
        }
      );

      if (response.data.data.updateUser) {
        setStudentData(response.data.data.updateUser);
        setEditMode(false);
        alert('Datos actualizados correctamente.');
      } else {
        alert('Error al actualizar los datos.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Hubo un error al intentar actualizar los datos.');
    }
  };

  const renderAbsenceBar = (subject: string, count: number) => {
    const progress = count / 10;
    const isCritical = count >= 10;

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
              {editMode ? (
                <>
                  <TextInput
                    label="Nombre"
                    value={updatedData.name}
                    onChangeText={(text) => setUpdatedData({ ...updatedData, name: text })}
                  />
                  <TextInput
                    label="ID"
                    value={updatedData.studentID}
                    onChangeText={(text) => setUpdatedData({ ...updatedData, studentID: text })}
                  />
                  <TextInput
                    label="Email"
                    value={updatedData.email}
                    onChangeText={(text) => setUpdatedData({ ...updatedData, email: text })}
                  />
                  <Button mode="contained" onPress={handleUpdate}>
                    Guardar Cambios
                  </Button>
                </>
              ) : (
                <>
                  <Title>{studentData.name}</Title>
                  <Paragraph>ID: {studentData.studentID}</Paragraph>
                  <Paragraph>Email: {studentData.email}</Paragraph>
                  <Button mode="text" onPress={() => setEditMode(true)}>
                    Editar Información
                  </Button>
                </>
              )}
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
});

export default StudentProfile;
