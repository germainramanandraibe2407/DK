import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Accueil from './src/accueil';
import { Ionicons, AntDesign } from '@expo/vector-icons';

import CreerCarte from './src/CreerCarte';
import VoirCarte from './src/VoirCarte';
import Parametres from './src/Parametres';
import Login from './src/Login';
import Logout from './src/Logout';
import Signup from './src/SignUp';
const Tab = createBottomTabNavigator();

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator>
          <Tab.Screen
              name="Accueil"
              component={Accueil}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home-outline" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Création de carte"
              component={CreerCarte}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="create-outline" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Visualisation de carte"
              component={VoirCarte}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="map-outline" color={color} size={size} />
                ),
              }}
            />
           {/* <Tab.Screen
              name="Paramètres"
              component={Parametres}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="settings-outline" color={color} size={size} />
                ),
              }}
            />*/}
            <Tab.Screen
              name="Déconnexion"
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="log-out-outline" color={color} size={size} />
                ),
              }}
            >
              {() => <Logout handleLogout={handleLogout} />}
            </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <Tab.Navigator>
        <Tab.Screen name="Login" 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-in-outline" color={color} size={size} />
          )
        }}>
          {() => <Login handleLogin={handleLogin} />}
        </Tab.Screen>
        <Tab.Screen name="Signup" component={Signup} options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="adduser" size={size} color={color} />
            ),
            headerShown: false
          }} />
      </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
