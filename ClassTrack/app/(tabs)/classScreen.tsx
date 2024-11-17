import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';


type RootStackParamList = {
  TeacherProfile: undefined;
  ClassScreen: {
    subject: string;
    schedule: string;
    classroom: string;
  };
};

type ClassScreenRouteProp = RouteProp<RootStackParamList, 'ClassScreen'>;

interface AttendanceRecord {
  id: string;
  studentName: string;
  accumulatedAbsences: number;
  isPresent: boolean;
}

const MAX_ABSENCES = 5;

const AbsenceProgressBar: React.FC<{ absences: number }> = ({ absences }) => {
  const progress = (absences / MAX_ABSENCES) * 100;
  
  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill,
            { width: `${progress}%` },
            absences >= MAX_ABSENCES && styles.progressBarFillMax
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{absences}/{MAX_ABSENCES}</Text>
    </View>
  );
};

const AttendanceScreen: React.FC = () => {
  const route = useRoute<ClassScreenRouteProp>();
  const navigation = useNavigation();


  const defaultParams = {
    subject: "Sin nombre",
    schedule: "Horario no disponible",
    classroom: "Aula no disponible"
  };

 
  const { subject, schedule, classroom } = route.params || defaultParams;

  const courseInfo = {
    name: subject,
    schedule: schedule,
    classroom: classroom,
    group: "ISC09A",
    maxAbsences: MAX_ABSENCES,
    totalStudents: 24,
  };

  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      studentName: 'Sara Itzel García Vidal',
      accumulatedAbsences: 3,
      isPresent: true,
    },
    {
      id: '2',
      studentName: 'Sara Itzel García Vidal',
      accumulatedAbsences: 4,
      isPresent: false,
    },
    {
      id: '3',
      studentName: 'Sara Itzel García Vidal',
      accumulatedAbsences: 4,
      isPresent: true,
    },
    {
      id: '4',
      studentName: 'Sara Itzel García Vidal',
      accumulatedAbsences: 2,
      isPresent: false,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{courseInfo.name}</Text>
      </View>

      <View style={styles.courseInfo}>
        <Text style={styles.courseInfoText}>Horario: {courseInfo.schedule}</Text>
        <Text style={styles.courseInfoText}>Aula: {courseInfo.classroom}</Text>
        <Text style={styles.courseInfoText}>Carrera y Grupo: {courseInfo.group}</Text>
        <Text style={styles.courseInfoText}>Límite de inasistencias: {courseInfo.maxAbsences}</Text>
      </View>

      <View style={styles.totalCounter}>
        <Text style={styles.totalText}>TOTAL</Text>
        <Text style={styles.totalNumber}>{courseInfo.totalStudents}</Text>
        <Text style={styles.totalText}>ASISTENCIAS</Text>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>Asistencias - Noviembre 05</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.attendanceList}>
        {attendanceRecords.map((record) => (
          <View key={record.id} style={styles.attendanceRow}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{record.studentName}</Text>
              <View style={styles.absencesContainer}>
                <Text style={styles.absencesLabel}>Inasistencias acumuladas</Text>
                <AbsenceProgressBar absences={record.accumulatedAbsences} />
              </View>
            </View>
            <View style={[styles.statusIndicator, record.isPresent ? styles.present : styles.absent]}>
              {record.isPresent ? (
                <Ionicons name="checkmark" size={24} color="white" />
              ) : (
                <Ionicons name="close" size={24} color="white" />
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  courseInfo: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  courseInfoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalCounter: {
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalText: {
    fontSize: 12,
    color: '#666',
  },
  totalNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  attendanceList: {
    flex: 1,
  },
  attendanceRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    marginBottom: 4,
  },
  absencesContainer: {
    marginTop: 4,
  },
  absencesLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  present: {
    backgroundColor: '#4CAF50',
  },
  absent: {
    backgroundColor: '#F44336',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 4,
  },
  progressBarFillMax: {
    backgroundColor: '#FF0000',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    width: 30,
  },
});

export default AttendanceScreen;