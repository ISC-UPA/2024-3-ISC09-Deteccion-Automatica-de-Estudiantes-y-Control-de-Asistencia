import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminLayout from './administrator/_layout';
import StudentLayout from './student/_layout';
import TeacherLayout from './teacher/_layout';
import { View, Text } from 'react-native';

export default function TabLayout() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      const userRole = await AsyncStorage.getItem('userRole');
      setRole(userRole);
      setLoading(false);
    };

    getUserRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (role === 'administrator') {
    return <AdminLayout />;
  } else if (role === 'teacher') {
    return <TeacherLayout />;
  } else if (role === 'student') {
    return <StudentLayout />;
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Rol no válido.</Text>
      </View>
    );
  }
}
