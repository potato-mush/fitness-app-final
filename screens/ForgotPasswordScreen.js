import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';
import { CameraView } from 'expo-camera';

export default function ForgotPasswordScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleSendCode = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const userData = userDoc.data();
      const email = userData.email;

      // Send password reset email
      await sendPasswordResetEmail(auth, email);

      setModalVisible(true);
    } catch (error) {
      console.error('Error sending code:', error);
      Alert.alert('Error', 'Failed to send code. Please try again.');
    }
  };

  const handleBarCodeScanned = async (data) => {
    if (!data) return;
    setUserId(data);
    setShowScanner(false);
  };

  return (
    <View style={styles.container}>
      {showScanner && Platform.OS !== 'web' ? (
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={({ data }) => handleBarCodeScanned(data)}
          />
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowScanner(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Forgot Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="User ID"
                value={userId}
                onChangeText={setUserId}
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
            <TouchableOpacity style={styles.button} onPress={handleSendCode}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
              navigation.navigate('Login');
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Password reset email sent. Please check your email.</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    navigation.navigate('Login');
                  }}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
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
    maxWidth: 300,
    alignSelf: 'center',
    width: '100%',
  },
  inputWithIcon: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    paddingRight: 40,
  },
  qrIconButton: {
    position: 'absolute',
    right: 8,
    padding: 8,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
});
