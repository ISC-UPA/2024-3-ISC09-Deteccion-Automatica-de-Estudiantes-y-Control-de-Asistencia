import React from "react";
import { View, StyleSheet } from "react-native";
import StudentProfile from "./(tabs)/StudentProfile"; // Perfil del estudiante

export default function StudentScreen() {
  return (
    <View style={styles.container}>
      <StudentProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
