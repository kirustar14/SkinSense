import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Dashboard({ navigation }) {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Landing');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome{ " " + auth.currentUser?.displayName || ""}!</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
    color: '#1a3d56',
  },
  button: {
    backgroundColor: '#1a3d56',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
