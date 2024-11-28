import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import TeachersScreen from "./(tabs)/TeachersScreen"; // Gestión de maestros
import classScreen from "./(tabs)/classScreen"; // Gestión de clases
import StudentScreen from "./(tabs)/StudentsScreen"; // Gestión de estudiantes

export default function AdminScreen() {
  const [currentView, setCurrentView] = useState<
    "teachers" | "classes" | "students"
  >("teachers");
  const [selectedClassId, setSelectedClassId] = useState<string>("1234"); // Ejemplo de un ID fijo de clase

  const renderView = () => {
    switch (currentView) {
      case "teachers":
        return <TeachersScreen />;
      case "classes":
        return <classScreen classId={selectedClassId} />; // Pasamos el ID de la clase como prop
      case "students":
        return <StudentScreen />;
      default:
        return <Text>Selecciona una vista</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navButtons}>
        <Button title="Maestros" onPress={() => setCurrentView("teachers")} />
        <Button title="Clases" onPress={() => setCurrentView("classes")} />
        <Button
          title="Estudiantes"
          onPress={() => setCurrentView("students")}
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
