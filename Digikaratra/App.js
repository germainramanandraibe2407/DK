import React from 'react';
import Navigation from './Navigation';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: PropTypes has been moved']);

export default function App() {
  return <Navigation />;
}
