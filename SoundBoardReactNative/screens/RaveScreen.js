import React, { useState } from 'react';
import { View, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { TabView, SceneMap } from 'react-native-tab-view';
import DefaultSoundTab from './DefaultSoundTab';
import RecordedSoundTab from './RecordedSoundTab';
import PhoneSoundTab from './PhoneSoundTab';

export default function RaveScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'default', title: 'Son par défaut' },
    { key: 'recorded', title: 'Enregistrements' },
    { key: 'phone', title: 'Fichiers du téléphone' },
  ]);
  const [selectedSound, setSelectedSound] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transformedSound, setTransformedSound] = useState(null);

  const handleSelectSound = (sound) => {
    setSelectedSound(sound);
  };

  const renderScene = SceneMap({
    default: () => <DefaultSoundTab onSelectSound={handleSelectSound} />,
    recorded: () => <RecordedSoundTab onSelectSound={handleSelectSound} />,
    phone: () => <PhoneSoundTab onSelectSound={handleSelectSound} />,
  });

  const sendSoundToServer = async () => {
    if (!selectedSound) {
      Alert.alert('Erreur', 'Veuillez sélectionner un son d\'abord');
      return;
    }

    setIsProcessing(true);
    try {
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Erreur', 'Erreur lors de l\'envoi au serveur');
    }
  };

  const playSound = async (soundUri) => {
    const { sound } = await Audio.Sound.createAsync({ uri: soundUri });
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: styles.container.width }}
      />
      <View style={styles.controls}>
        <Button title="Envoyer au serveur" onPress={sendSoundToServer} />
        {isProcessing && <ActivityIndicator size="large" color="#0000ff" />}
        {selectedSound && <Button title="Lire son original" onPress={() => playSound(selectedSound)} />}
        {transformedSound && <Button title="Lire son transformé" onPress={() => playSound(transformedSound)} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  controls: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
