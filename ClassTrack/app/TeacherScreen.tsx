import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import TeacherClassesScreen from "./(tabs)/TeacherClassesScreen"; // Clases del maestro
import StudentProfile from "./(tabs)/StudentProfile"; // Perfil del estudiante

export default function TeacherScreen() {
  const [currentView, setCurrentView] = useState<"classes" | "profile">(
    "classes"
  );

  const renderView = () => {
    switch (currentView) {
      case "classes":
        return <TeacherClassesScreen />;
      case "profile":
        return <StudentProfile />;
      default:
        return <Text>Selecciona una vista</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navButtons}>
        <Button title="Mis Clases" onPress={() => setCurrentView("classes")} />
        <Button
          title="Perfil Alumno"
          onPress={() => setCurrentView("profile")}
        />
      </View>
      <View style={styles.content}>{renderView()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
});
