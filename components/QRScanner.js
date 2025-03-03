import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';

const QRFrame = () => (
  <View style={styles.qrFrame}>
    <View style={styles.qrCorner} />
    <View style={[styles.qrCorner, { right: 0 }]} />
    <View style={[styles.qrCorner, { bottom: 0 }]} />
    <View style={[styles.qrCorner, { right: 0, bottom: 0 }]} />
  </View>
);

export default function QRScanner({ onScan, onCancel }) {
  const [torch, setTorch] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = (scanResult) => {
    if (!scanned) {
      setScanned(true);
      onScan(scanResult.data);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text>QR code scanning is not supported in web browser</Text>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.scannerContainer}>
      <View style={styles.cameraWrapper}>
        <Camera
          style={styles.camera}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          flashMode={
            torch 
              ? Camera.Constants.FlashMode.torch 
              : Camera.Constants.FlashMode.off
          }
        >
          <View style={styles.overlayContainer}>
            <QRFrame />
            <View style={styles.scannerControls}>
              <TouchableOpacity
                style={styles.torchButton}
                onPress={() => setTorch(!torch)}
              >
                <Ionicons 
                  name={torch ? "flashlight" : "flashlight-outline"} 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setTorch(false);
                  onCancel();
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scannerContainer: {
    flex: 1,
    position: 'relative',
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
  overlayContainer: {
    flex: 1,
    backgroundColor: 'transparent',
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
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    minWidth: 100,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
