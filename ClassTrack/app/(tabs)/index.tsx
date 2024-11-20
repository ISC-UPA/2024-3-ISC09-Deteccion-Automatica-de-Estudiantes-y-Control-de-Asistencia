import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Card, Title, useTheme } from 'react-native-paper';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.logoContainer}>
            <Image source={{ uri: '../assets/images/ClassTrack3.png' }} style={styles.logo} />
          </View>
          <Title style={styles.title}>Welcome</Title>
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            contentStyle={{ paddingVertical: 8 }}
          >
            Sign In
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    width: '90%',
    borderRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#4A4A4A',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default LoginPage;
