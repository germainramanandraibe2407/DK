import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';


export default function ScannerQR() {
    const [qrData, setQRData] = useState('');
  
    const handleScan = (event) => {
      setQRData(event.data);
    };
  
    return (
      <View style={styles.container}>
        <QRCodeScanner onRead={handleScan} />
        <Text style={styles.text}>{qrData}</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    text: {
      marginTop: 20,
    },
  });
  