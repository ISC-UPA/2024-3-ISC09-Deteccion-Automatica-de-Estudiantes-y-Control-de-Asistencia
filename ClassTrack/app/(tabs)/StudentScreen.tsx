import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { ProfileCard } from '@/components/ProfileCard';
import { AbsenceBar } from '@/components/AbsenceBar';
import { BackButton } from '@/components/BackButton';

const StudentScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileCard name="Sara Itzel García Vidal" id="UP210612 - ISC09A" />
        <AbsenceBar subject="Sist. embebidos" absences={4} maxAbsences={10} />
        <AbsenceBar subject="Prog. web" absences={10} maxAbsences={10} />
        <AbsenceBar subject="Inglés" absences={7} maxAbsences={10} />
        <AbsenceBar subject="Español" absences={2} maxAbsences={10} />
        <AbsenceBar subject="Seg. Informático" absences={3} maxAbsences={10} />
        {/* Add more AbsenceBars here as needed */}
      </ScrollView>
      <BackButton onPress={() => console.log('Go back')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: 80, // Add padding at the bottom to prevent overlapping with BackButton
  },
});

export default StudentScreen;
