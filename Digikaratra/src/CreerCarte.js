import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, View, Text,TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import API_IP from './config';
import * as MailComposer from 'expo-mail-composer';

export default function CreerCarte({ route }) {
  const type = route.params?.type;
  const userId = route.params?.userId;
  const [carteId, setCarteId] = useState(null);
  const navigation = useNavigation();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [titre, setTitre] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [cin, setCin] = useState('');
  const [adresse, setAdresse] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [site_web, setSite_web] = useState('');
  const [fb, setFb] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [twiter, setTwiter] = useState('');
  const [description, setDescription] = useState('');
  const [photo_cin, setPhotoCIN] = useState(null);
  const [photo_recent, setPhotoRecent] = useState(null);
  const [photo_logo, setPhotoLogo] = useState(null);

  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://${API_IP}:3000/api/carte/${userId}/personnel`);
        const { data } = response;
        console.log(data);
        setCin(data[0].cin);
        console.log(data[0].cin);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUser();
  }, [userId]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const prendrePhotoCIN = async () => {
    if (hasPermission) {
      const { uri } = await Camera.takePictureAsync();
      setPhotoCIN(uri);
    } else {
      Alert.alert('Permission refusée', 'Vous devez accorder la permission à la caméra pour pouvoir prendre une photo de CIN.');
    }
  };

  const ajouterPhotoCIN = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Vous devez accorder la permission à la galerie d\'images pour pouvoir ajouter une photo de CIN.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setPhotoCIN(result.uri);
    }
  };

  const ajouterPhotoRecent = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Vous devez accorder la permission à la galerie d\'images pour pouvoir ajouter une photo récente.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.cancelled) {
      setPhotoRecent(result.uri);
    }
  };
  
  const ajouterPhotoLogo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Vous devez accorder la permission à la galerie d\'images pour pouvoir ajouter une photo de logo.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.cancelled) {
      setPhotoLogo(result.uri);
    }
  };
  

  const enregistrerCarte = async () => {
    
    if (nom && dateNaissance && email && adresse && telephone && description && titre) {
      try {
        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('prenom', prenom);
        formData.append('dateNaissance', dateNaissance);
        formData.append('titre', titre);
        formData.append('adresse', adresse);
        formData.append('email', email);
        formData.append('telephone', telephone);
        formData.append('site_web', site_web);
        formData.append('fb', fb);
        formData.append('tiktok', tiktok);
        formData.append('linkedin', linkedin);
        formData.append('whatsapp', whatsapp);
        formData.append('twiter', twiter);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('userId', userId);
        formData.append('cin', cin);
       if (type === 'professionnel') {
          if (entreprise) {
            formData.append('entreprise', entreprise);
          } else {
            Alert.alert('Erreur', 'Veuillez remplir le champ entreprise obligatoire.');
            return;
          }
        }
    
        if (photo_cin) {
          formData.append('photo_cin', {
            uri: photo_cin,
            type: 'image/jpeg',
            name: 'photo_cin.jpeg',
          });
        }
    
        if (photo_recent) {
          formData.append('photo_recent', {
            uri: photo_recent,
            type: 'image/jpeg',
            name: 'photo_recent.jpeg',
          });
        }
    
        if (photo_logo) {
          formData.append('photo_logo', {
            uri: photo_logo,
            type: 'image/jpeg',
            name: 'photo_logo.jpeg',
          });
        }
    
        const response = await axios.post(`http://${API_IP}:3000/api/carte`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        setCarteId(response.data.id);
        
        Alert.alert('Succès', 'La carte de visite a été enregistrée avec succès.');
        navigation.navigate('Visualisation de carte', { carteId: response.data.id });
        
      } catch (error) {
        console.error(error);
        {/*Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement de la carte de visite.');*/}
        if (error.response.status === 400) {
          Alert.alert('Erreur', error.response.data);
        }
      }
    } else {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires.');
    }
    
};


return (
  <ScrollView contentContainerStyle={styles.container}>
      {type ? (
          <>
              <Text style={[styles.title, {textAlign: 'center'}]}>Créer une carte de visite {type === 'professionnel' ? 'professionnelle' : 'personnelle'}{type === 'professionnel' && cin ? ` avec l'identifiant n° :${cin}` : ''}</Text>

              <View style={styles.row}>
              <View style={[styles.col, { marginRight: 10 }]}>
                <TextInput style={styles.input} label="Nom *" value={nom} onChangeText={setNom} type="text" mode="outlined"/>
                <TextInput style={styles.input} label="Prenom *" value={prenom} onChangeText={setPrenom} mode="outlined"/>
                <TextInput style={styles.input} label="Date de naissance (AAAA-MM-JJ) *" placeholder='ex: 2023-05-12' value={dateNaissance} onChangeText={setDateNaissance} mode="outlined"/>
                {type === 'personnel' && (
                  <TextInput style={styles.input} label="Numero carte d'identité(CIN/passeport/permis de conduire/carte d'étudiant) *" value={cin} onChangeText={setCin} mode="outlined"/>
                )}
                {type === 'professionnel' && (
                  <TextInput
                    style={styles.input}
                    label="Entreprise *"
                    value={entreprise}
                    onChangeText={setEntreprise}
                    mode="outlined"
                  />
                )}
                <TextInput style={styles.input} label="E-mail *" value={email} placeholder='ex: hoagtarget@email.com' onChangeText={setEmail} keyboardType="email-address" mode="outlined"/>
                <TextInput style={styles.input} label="Site web" value={site_web} placeholder='http://www.example.com' onChangeText={setSite_web} mode="outlined"/>
                {type === 'personnel' && (
                  <>
                <TextInput style={styles.input} label="Nom facebook" value={fb} onChangeText={setFb} mode="outlined"/>
                <TextInput style={styles.input} label="Nom tiktok" value={tiktok} onChangeText={setTiktok} mode="outlined"/>
                </>
                )}
                {type === 'professionnel' && (
                  <>
                <TextInput style={styles.input} label="Nom linkedin" value={linkedin} onChangeText={setLinkedin} mode="outlined"/>
                <TextInput style={styles.input} label="Telephone whatsapp" placeholder="Indicatif pays + 10 chiffres ex : +261 034 96 881 33" value={whatsapp} onChangeText={setWhatsapp} mode="outlined" />
                <TextInput style={styles.input} label="Nom twiter" value={twiter} onChangeText={setTwiter} mode="outlined"/>
                </>
                )}
                <TextInput style={styles.input} label="Brève description de vous *" placeholder='Je suis un web designer' value={description} onChangeText={setDescription} mode="outlined"/>
                <TextInput style={styles.input} label="Fonction *" value={titre} onChangeText={setTitre} mode="outlined" />
                <TextInput style={styles.input} label="Adresse physique *" placeholder="Adresse physique : Lot/Faritra/Firaisana/code postal " value={adresse} onChangeText={setAdresse} mode="outlined"/>
                <TextInput style={styles.input} label="Telephone *" placeholder="Indicatif pays + 10 chiffres ex : +261 034 96 881 33" value={telephone} onChangeText={setTelephone} keyboardType="phone-pad" mode="outlined"/>
              </View>

              </View>
              {type === 'professionnel' && (
                  <>

                      <TouchableOpacity style={styles.button} onPress={ ajouterPhotoLogo}>
                          <Text style={styles.buttonText}>Ajouter votre logo en png ou jpeg</Text>
                      </TouchableOpacity>
                      {photo_logo && <Image source={{ uri: photo_logo }} style={styles.image} />}
                  </>
              )}
                  <TouchableOpacity style={styles.button} onPress={ajouterPhotoCIN}>
                      <Text style={styles.buttonText}>{type === 'professionnel' ? 'Ajouter une photo de votre carte professionnel (badge, carte ou autres)' : "Ajouter une carte d'identité(CIN ou passeport ou permis de conduire ou carte d'étudiant)"}</Text>
                  </TouchableOpacity>
                  {photo_cin && <Image source={{ uri: photo_cin }} style={styles.image} />}

                  <TouchableOpacity style={styles.button} onPress={ajouterPhotoRecent}>
                      <Text style={styles.buttonText}>Ajouter une photo de profile récente</Text>
                  </TouchableOpacity>
                  {photo_recent && <Image source={{ uri: photo_recent }} style={styles.image} />}
            
              <TouchableOpacity style={styles.button} onPress={enregistrerCarte}>
                  <Text style={styles.buttonText}>Enregistrer</Text>
              </TouchableOpacity>
          </>
      ) : (
              // Afficher un message demandant à l'utilisateur de choisir le type de carte
              <Text>Veuillez choisir le type de carte.</Text>
          )}
  </ScrollView>
);

}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    fontSize: 10,
    height: 50,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10, // Ajout du marginBottom
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    marginBottom: 20,
  },
  spacer: {
    width: 40,
  },
});
