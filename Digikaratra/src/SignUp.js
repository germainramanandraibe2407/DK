import React, { useState } from 'react';
import {Button, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import API_IP from './config';

const Signup = ({ navigation }) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch(`http://${API_IP}:3000/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password
        })
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setSuccessMessage('Inscription réussie ! Redirection en cours...');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 4000); // Redirection après 2 secondes
      } else if (data.message === 'Utilisateur créé avec succès') {
        setSuccessMessage('Utilisateur créé avec succès. Redirection en cours...');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 3000); // Redirection après 2 secondes
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
{/*formulaire de base*/}
  return (

    
    <View style={styles.container}>
      <Text style={styles.title}>Digikaratra</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
      <TextInput
        style={styles.input}
        label="First Name"
        onChangeText={text => setFirstName(text)}
        value={firstname}
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        label="Last Name"
        onChangeText={text => setLastName(text)}
        value={lastname}
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        label="Email"
        onChangeText={text => setEmail(text)}
        value={email}
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        label="Password"
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
        value={password}
        mode="outlined"
      />
      <TouchableOpacity style={styles.button}  >
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
};




{/* style du formulaire */}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
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
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Signup;
