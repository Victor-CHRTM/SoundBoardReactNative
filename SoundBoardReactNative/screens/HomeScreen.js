import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setConnection, selectConnection } from '../store/slices/connectionSlice';

export default function HomeScreen({ navigation }) {
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [previousServers, setPreviousServers] = useState([]);
  const dispatch = useDispatch();
  const { isConnected } = useSelector(selectConnection);

  useEffect(() => {
    const loadPreviousServers = async () => {
      try {
        const servers = await AsyncStorage.getItem('previousServers');
        if (servers) {
          setPreviousServers(JSON.parse(servers));
        }
      } catch (error) {
        console.error('Failed to load previous servers', error);
      }
    };

    loadPreviousServers();
  }, []);

  const handleConnectionAttempt = async (ip, port) => {
    const url = `http://${ip}:${port}/`;
    setIsConnecting(true);
    try {
      const response = await fetch(url);
      if (response.ok) {
        dispatch(setConnection({ isConnected: true, ip, port }));

        const newServer = { ip, port };
        const serverExists = previousServers.some(
          server => server.ip === ip && server.port === port
        );

        if (!serverExists) {
          const updatedServers = [newServer, ...previousServers].slice(0, 3); // limit to 3 entries
          await AsyncStorage.setItem('previousServers', JSON.stringify(updatedServers));
          setPreviousServers(updatedServers);
        }

        ToastAndroid.show('Connexion réussie', ToastAndroid.SHORT);
        navigation.navigate('MainTabs');
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      ToastAndroid.show('Connexion échouée, connexion de secours activée...', ToastAndroid.SHORT);
      dispatch(setConnection({ isConnected: true, ip, port }));
      navigation.navigate('MainTabs');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnect = () => {
    if (ip && port) {
      handleConnectionAttempt(ip, port);
    } else {
      ToastAndroid.show('Veuillez entrer une IP et un port', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text>IP Address:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter IP address"
        value={ip}
        onChangeText={setIp}
        keyboardType="numeric"
      />
      <Text>Port:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Port"
        value={port}
        onChangeText={setPort}
        keyboardType="numeric"
      />
      <Button title="Connect" onPress={handleConnect} disabled={isConnecting || isConnected} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});
