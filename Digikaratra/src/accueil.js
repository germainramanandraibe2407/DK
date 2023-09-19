import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, ScrollView, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import API_IP from './config';

export default function Accueil({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [carteTypes, setCarteTypes] = useState([]);
  const [carteType, setCarteType] = useState(null);
  const [hasCreatedPersonnelCard, setHasCreatedPersonnelCard] = useState(false);

  const userId = route.params?.userId;

  useEffect(() => {
    fetch(`http://${API_IP}:3000/api/typecarte`)
      .then(response => response.json())
      .then(data => setCarteTypes(data))
      .catch(error => {
        console.error(error);
        // handle the error
      });
  }, []);

  const fetchData = () => {
    fetch(`http://${API_IP}:3000/api/carte/${userId}/personnel`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          // l'utilisateur a créé une carte "personnel"
          setHasCreatedPersonnelCard(true);
        } else {
          // l'utilisateur n'a pas créé de carte "personnel"
          setHasCreatedPersonnelCard(false);
        }
      })
      .catch(error => {
        console.error(error);
        // gérer l'erreur
      });
  }
  
  useEffect(() => {
    fetchData();
  }, [userId, modalVisible]);
  

  const handleCarteType = (type) => {
    setCarteType(type);
    setModalVisible(false);
  }

  return (
    <LinearGradient
      colors={['blue', 'white', 'yellow']}
      style={{ flex: 1 }}
    >
    <View style={styles.container}>
      <View style={styles.leftContainer}>
      <Text style={styles.title}>Digikaratra</Text>
        <Image
          source={require('../assets/bienvenue.jpg')}
          style={styles.image}
        />

      {/* Recuperation de texte en bas de bienvenue, {carteTypes.length}= recuperation du nombre de type de carte  */}
      <Text style={styles.sub_title}>La première carte digitale accessible gratuitement pour tout le monde que ce soit  professionnel ou personnel</Text>
    
      </View>
      <View style={styles.rightContainer}>
      <TouchableOpacity style={styles.button} onPress={() => {
        setModalVisible(true);
        fetchData();
      }}>
        <Text style={styles.buttonText}>Créer votre carte de visite</Text>
      </TouchableOpacity>
        {/*<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Visualisation de carte')}>
          <Text style={styles.buttonText}>Voir ma carte de visite</Text>
        </TouchableOpacity>
       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Paramètres')}>
          <Text style={styles.buttonText}>Paramètres</Text>
  </TouchableOpacity>*/}
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choisissez le type de carte de visite </Text>
              {carteTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.buttons, hasCreatedPersonnelCard && type.typeCarte === "personnel" ? styles.disabledButton : null]}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    if (type.typeCarte === "professionnel") {
                      if (hasCreatedPersonnelCard) {
                        // l'utilisateur a déjà créé une carte "personnel"
                        navigation.navigate('Création de carte', { type: type.typeCarte, userId });
                      } else {
                        // l'utilisateur doit d'abord créer une carte "personnel"
                        Alert.alert(
                          "Création de carte",
                          "Vous devez d'abord créer une carte personnelle avant de pouvoir créer une carte professionnelle.",
                          [{ text: "OK" }]
                        );
                      }
                    } else {
                      // le type sélectionné n'est pas "professionnel"
                      navigation.navigate('Création de carte', { type: type.typeCarte, userId });
                    }
                  }}
                  disabled={hasCreatedPersonnelCard && type.typeCarte === "personnel"}
                  >
                    <Text style={[
                      styles.buttonText,
                      hasCreatedPersonnelCard && type.typeCarte === "personnel" ? styles.disabledText : null
                    ]}>
                      {type.typeCarte}
                    </Text>
                </TouchableOpacity>
              ))}
              <Pressable style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButtonText}>Annuler</Text>
              </Pressable>
            </View>
          </View>
      </Modal>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  image: {
    alignSelf: 'center',
    marginVertical: 10,
    width: 300,
    height: 300,
  },
  header: {
    flex: 1,
    marginTop: '-30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    color: '#007FFF', // Couleur bleu violacé
    textShadowColor: '#F2C94C', // Couleur jaune
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 50,
    textAlign: 'center',
  },
  sub_title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  buttons: {
    backgroundColor: '#84DBF0',
    padding: 20,
    borderRadius: 20,
    marginTop: 24,
    marginBottom: -20,
    
  },
  button: {
    backgroundColor: '#84DBF0',
    padding: 20,
    borderRadius: 40,
    marginTop: 24,
    marginBottom: -20,
    width: 355,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17
  },
  disabledButton: {
    backgroundColor: "#D3D3D3", // change the background color
  },
  disabledText: {
    color: "#A9A9A9", // change the text color
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '50%',
    maxWidth: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCloseButton: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginTop: 30,
    alignSelf: 'flex-end',
  },
  modalCloseButtonText: {
    color: '#3F51B5',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

