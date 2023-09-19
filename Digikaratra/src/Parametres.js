import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import SettingsList from 'react-native-settings-list';

export default function Parametres() {
    const [switchState, setSwitchState] = useState(false);
  
    const handleSwitchToggle = (value) => {
      setSwitchState(value);
    };
  
    return (
      <View style={styles.container}>
        <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
          <SettingsList.Header headerStyle={{ marginTop: 15 }} />
          <SettingsList.Item
            title='Notifications'
            titleStyle={{ fontSize: 16 }}
            onPress={() => Alert.alert('Notifications Pressed')}
          />
          <SettingsList.Item
            title='Mode sombre'
            titleStyle={{ fontSize: 16 }}
            hasSwitch={true}
            switchState={switchState}
            switchOnValueChange={handleSwitchToggle}
          />
          <SettingsList.Item
            title='Langue'
            titleStyle={{ fontSize: 16 }}
            onPress={() => Alert.alert('Langue Pressed')}
          />
        </SettingsList>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });
  