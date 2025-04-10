import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, GoogleAuthProvider } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getReactNativePersistence } from 'firebase/auth';

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBpjIuYzuIDL7hrL3G3RMgqQ0N1Q1bn2x4",
  authDomain: "skindiseasepredictor-2f72c.firebaseapp.com",
  projectId: "skindiseasepredictor-2f72c",
  storageBucket: "skindiseasepredictor-2f72c.appspot.com",
  messagingSenderId: "307696079933",
  appId: "1:307696079933:web:9e0731ecd864d88461c654",
  measurementId: "G-MXXBLME496"
};

const app = initializeApp(firebaseConfig);

// Initialize auth for React Native
const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
