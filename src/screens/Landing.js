import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, TextInput, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, WEB_CLIENT_ID, EXPO_CLIENT_ID } from '@env';
import { makeRedirectUri } from 'expo-auth-session';
import { updateProfile } from 'firebase/auth';


WebBrowser.maybeCompleteAuthSession();

export default function Landing() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const navigation = useNavigation();

  const [request, response, promptAsync] = useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    redirectUri: makeRedirectUri({
      useProxy: true,
    }),
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate('Dashboard');
      }
    });
    return unsub; // Unsubscribe when the component unmounts
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      console.log('Authentication response:', response?.authentication);
      const credential = GoogleAuthProvider.credential(response.authentication.idToken);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.replace('Dashboard');

        })
        .catch((err) => {
          Alert.alert('Google Login Error', err.message);
        });
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter email and password');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
const handleSignUp = async () => {
  if (!email || !password || !confirmPassword) {
    return Alert.alert('Error', 'Please fill all fields');
  }
  if (password !== confirmPassword) {
    return setPasswordMatch(false);
  }
  if (password.length < 6) {
    return setIsPasswordValid(false);
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // After user is created, update the user's profile with their display name
    await updateProfile(userCredential.user, {
      displayName: name, 
    });
    await userCredential.user.reload();
    // Alert the user of success and close the modal
    Alert.alert('Success', 'Account created!');
    setIsModalVisible(false);

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };


  const toggleModal = (isSignUp) => {
    setIsSignUp(isSignUp);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPasswordMatch(true);
    setIsPasswordValid(true);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Welcome!</Text>
      <TouchableOpacity style={styles.button} onPress={() => toggleModal(true)}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => toggleModal(false)}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
            {isSignUp && (
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, !isPasswordValid && styles.errorInput]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {!isPasswordValid && <Text style={styles.errorText}>Password must be at least 6 characters</Text>}
            {isSignUp && (
              <>
                <TextInput
                  style={[styles.input, !passwordMatch && styles.errorInput]}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
                {!passwordMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
              </>
            )}
            <TouchableOpacity style={styles.button} onPress={isSignUp ? handleSignUp : handleLogin}>
              <Text style={styles.buttonText}>{isSignUp ? 'Create Account' : 'Login'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a3d56',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 15,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 14,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a3d56',
  },
  input: {
    width: '100%',
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
});
