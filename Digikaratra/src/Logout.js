import React, { useState } from 'react';
import { Button, View, Modal, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Logout({ handleLogout }) {
  const [showModal, setShowModal] = useState(false);

  const handleLogoutPress = async () => {
    setShowModal(true);
  };

  const handleConfirmLogout = async () => {
    await AsyncStorage.removeItem('token');
    handleLogout();
  };

  return (
    <View>
      <Button title="Logout" onPress={handleLogoutPress} />

      <Modal visible={showModal} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
          <Text style={styles.message}>Toutes les données non sauvegardées seront perdues.</Text>
          <View style={styles.buttonContainer}>
            <Button title="Annuler" onPress={() => setShowModal(false)} />
            <Button title="Déconnexion" onPress={handleConfirmLogout} />
          </View>
        </View>
      </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});