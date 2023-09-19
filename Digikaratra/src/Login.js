import * as React from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import API_IP from './config';

export default function Login({ handleLogin }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [userId, setUserId] = React.useState(null); // nouvelle variable d'état pour stocker l'userId
  const navigation = useNavigation(); // get navigation object
  const [text, setText] = React.useState('');

  const handlePress = () => {
    // send login request to API
    console.log(API_IP);
    fetch(`http://${API_IP}:3000/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setErrorMessage(data.error);
        } else if (data.token) {
          handleLogin(data.token && data.userId);
          setUserId(data.userId);
          console.log(data);
          navigation.navigate('Accueil', { userId: data.userId });
        }
      })
      .catch(error => {
        console.error('Login error', error);
        setErrorMessage('Il y a un erreur dans votre email ou mot de passe ');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digikaratra</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        label="Email"
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!isPasswordVisible}
        label="Mot de passe"
        mode="outlined"
      />
      <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupLinkText}>Pas encore de compte ? S'inscrire</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      
      {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 40,
    color: '#007FFF', // Couleur bleu violacé
    textShadowColor: '#F2C94C', // Couleur jaune
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    color: '#8e8e8e',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  signupLink: {
    marginTop: 20,
    marginBottom: 20
  },
  signupLinkText: {
    color: '#1877f2',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#1877f2', // Couleur bleu Facebook
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 16,
  },
  
});
