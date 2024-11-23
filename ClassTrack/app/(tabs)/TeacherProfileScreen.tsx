import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type RootStackParamList = {
  TeacherProfile: undefined;
  ClassScreen: {
    subject: string;
    schedule: string;
    classroom: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TeacherProfile'>;

interface Class {
  subject: string;
  schedule: string;
  classroom: string;
}

interface TeacherProfileProps {
  teacherName: string;
  classes: Class[];
}

const ClassCard: React.FC<Class> = ({ subject, schedule, classroom }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('ClassScreen', {
      subject,
      schedule,
      classroom
    });
  };

  return (
    <TouchableOpacity style={styles.classCard} onPress={handlePress}>
      <View style={styles.classInfo}>
        <Text style={styles.classSubject}>{subject}</Text>
        <Text style={styles.classDetails}>{schedule}</Text>
        <Text style={styles.classDetails}>{classroom}</Text>
      </View>
      <FontAwesome name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );
};

const TeacherProfile: React.FC<TeacherProfileProps> = ({
  teacherName,
  classes,
}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil de maestro</Text>
      </View>
      
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <FontAwesome name="user" size={64} color="#000" />
        </View>
        <Text style={styles.teacherName}>{teacherName}</Text>
        <Text style={styles.sectionTitle}>Clases pertenecientes:</Text>
      </View>

      <View style={styles.classesSection}>
        {classes.map((classItem, index) => (
          <ClassCard
            key={index}
            subject={classItem.subject}
            schedule={classItem.schedule}
            classroom={classItem.classroom}
          />
        ))}
      </View>
    </ScrollView>
  );
};


export const TeacherProfileScreen: React.FC = () => {
  const sampleData = {
    teacherName: "Juan Carlos Herrera",
    classes: [
      {
        subject: "Sistemas Embebidos",
        schedule: "Horario: 9:00 - 10:50 AM",
        classroom: "Aula: 501"
      },
      {
        subject: "Sistemas Embe",
        schedule: "Horario: 9:00 - 10:50 AM",
        classroom: "Aula: 501"
      },
      {
        subject: "Sistemas Embe",
        schedule: "Horario: 9:00 - 10:50 AM",
        classroom: "Aula: 501"
      },
    ],
  };

  return <TeacherProfile {...sampleData} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  profileCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E6F0FF',
    margin: 16,
    borderRadius: 20,
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
  teacherName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    alignSelf: 'flex-start',
  },
  classesSection: {
    padding: 16,
  },
  classCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  classInfo: {
    flex: 1,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  classDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default TeacherProfileScreen;