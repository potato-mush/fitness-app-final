import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Platform, AppState } from 'react-native';
import { CameraView } from 'expo-camera';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';

// Lazy load the Overlay component
const Overlay = lazy(() => import('./Overlay'));

export default function LoginScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  // Request camera permission on mount
  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestPermission();
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    try {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user && user.email) {
          getDoc(doc(db, 'users', user.uid))
            .then(userDoc => {
              const userData = userDoc.exists() ? userDoc.data() : {};
              navigation.replace('Home', {
                userId: user.uid,
                userStats: userData
              });
            })
            .catch(error => {
              console.error('Error fetching user data:', error);
              navigation.replace('Home');
            });
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Auth state change error:', error);
    }
  }, [navigation]);

  const handleBarCodeScanned = async (data) => {
    if (!data || qrLock.current) return;
    
    try {
      qrLock.current = true;
      setUserId(data);
      setShowScanner(false);
    } finally {
      qrLock.current = false;
    }
  };

  const handleLogin = async () => {
    try {
      if (!userId || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // Get user document directly using the userId (UID)
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const userData = userDoc.data();
      
      // Authenticate with email and password
      await signInWithEmailAndPassword(auth, userData.email, password);
      
      // Navigation will be handled by the auth state change listener
      
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Error',
        'Invalid user ID or password. Please try again.'
      );
    }
  };

  const LoginForm = () => {
    const [localUserId, setLocalUserId] = useState(userId);
    const [localPassword, setLocalPassword] = useState(password);

    const handleLocalLogin = () => {
      setUserId(localUserId);
      setPassword(localPassword);
      handleLogin();
    };

    return (
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputWithIcon}
            placeholder="User ID"
            value={localUserId}
            onChangeText={setLocalUserId}
            editable={true}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          {Platform.OS !== 'web' && (
            <TouchableOpacity
              style={styles.qrIconButton}
              onPress={() => {
                requestPermission();
                setShowScanner(true);
              }}
            >
              <MaterialCommunityIcons name="qrcode-scan" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={localPassword}
          onChangeText={setLocalPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLocalLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (Platform.OS !== 'web' && permission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showScanner && Platform.OS !== 'web' ? (
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={({ data }) => handleBarCodeScanned(data)}
          />
          {Platform.OS !== 'web' && (
            <Suspense fallback={null}>
              <Overlay />
            </Suspense>
          )}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowScanner(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <LoginForm />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center', // Center vertically
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    maxWidth: 300, // Limit width of inputs
    alignSelf: 'center', // Center horizontally
    width: '100%',
  },
  inputWithIcon: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    paddingRight: 40, // Space for the icon
  },
  qrIconButton: {
    position: 'absolute',
    right: 8,
    padding: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    maxWidth: 300,
    alignSelf: 'center',
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    maxWidth: 300,
    alignSelf: 'center',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  qrFrame: {
    position: 'absolute',
    top: '25%',
    left: '15%',
    right: '15%',
    bottom: '25%',
    borderRadius: 10,
  },
  qrCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
    borderWidth: 2,
  },
  scannerControls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  torchButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: 50,
  },
  cameraWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  camera: {
    width: '100%',
    height: '100%'
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  forgotPasswordButton: {
    marginTop: 15,
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: '#2196F3',
    textAlign: 'center',
  },
});
