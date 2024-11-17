import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface Subject {
  name: string;
  currentAbsences: number;
  maxAbsences: number;
}

interface StudentProfileProps {
  studentName: string;
  studentId: string;
  subjects: Subject[];
}

const SubjectProgressBar: React.FC<Subject> = ({ name, currentAbsences, maxAbsences }) => {
  const progress = (currentAbsences / maxAbsences) * 100;

  return (
    <View style={styles.progressBarContainer}>
      <Text style={styles.subjectName}>{name}</Text>
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress}%` },
              currentAbsences >= maxAbsences && styles.progressBarFillMax,
            ]}
          />
        </View>
        <View style={styles.progressBarNumbers}>
          {/* Left number (0) */}
          <Text style={[styles.progressNumber, styles.progressNumberLeft]}>0</Text>
          
          {/* Middle number (current absences) */}
          <Text style={[
            styles.progressNumber, 
            styles.progressNumberMiddle,
            { left: `${progress}%` }
          ]}>
            {currentAbsences}
          </Text>
          
          {/* Right number (max absences) */}
          <Text style={[styles.progressNumber, styles.progressNumberRight]}>
            {maxAbsences}
          </Text>
        </View>
      </View>
    </View>
  );
};

const StudentProfile: React.FC<StudentProfileProps> = ({
  studentName,
  studentId,
  subjects,
}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <FontAwesome name="user" size={64} color="#000" />
        </View>
        <Text style={styles.studentName}>{studentName}</Text>
        <Text style={styles.studentId}>{studentId}</Text>
      </View>

      <View style={styles.progressSection}>
        {subjects.map((subject, index) => (
          <SubjectProgressBar
            key={index}
            name={subject.name}
            currentAbsences={subject.currentAbsences}
            maxAbsences={subject.maxAbsences}
          />
        ))}
      </View>
    </ScrollView>
  );
};

// Example usage component
export const StudentProfileScreen: React.FC = () => {
  const sampleData = {
    studentName: "Sara Itzel García Vidal",
    studentId: "UP210612 - ISC09A",
    subjects: [
      { name: "Sist. embebidos", currentAbsences: 2, maxAbsences: 4 },
      { name: "Prog. web", currentAbsences: 1, maxAbsences: 5 },
      { name: "Inglés", currentAbsences: 4, maxAbsences: 7 },
      { name: "Español", currentAbsences: 1, maxAbsences: 2 },
      { name: "Seg. Informática", currentAbsences: 1, maxAbsences: 3 },
    ],
  };

  return <StudentProfile {...sampleData} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E6F0FF',
    borderRadius: 20,
    margin: 16,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: '#666',
  },
  progressSection: {
    padding: 16,
  },
  progressBarContainer: {
    marginBottom: 32, // Increased to accommodate the numbers below
  },
  subjectName: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  progressBarWrapper: {
    width: '100%',
    height: 30, // Increased height to accommodate the progress bar and numbers
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  progressBarFillMax: {
    backgroundColor: '#FF0000',
  },
  progressBarNumbers: {
    position: 'relative',
    width: '100%',
    height: 20,
    marginTop: 4,
  },
  progressNumber: {
    position: 'absolute',
    fontSize: 12,
    color: '#666',
    top: 0,
  },
  progressNumberLeft: {
    left: 0,
  },
  progressNumberMiddle: {
    transform: [{ translateX: -6 }], // Half of the typical number width to center it
  },
  progressNumberRight: {
    right: 0,
  },
});

export default StudentProfileScreen;