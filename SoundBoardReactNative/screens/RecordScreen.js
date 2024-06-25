import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export default function RecordScreen() {
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [newRecordingName, setNewRecordingName] = useState('');

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      const audioFiles = files.filter(file => file.endsWith('.m4a'));
      setRecordings(audioFiles);
    } catch (error) {
      console.error('Error loading recordings', error);
    }
  };

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();

      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    await loadRecordings();
  };

  const saveRecording = async () => {
    if (newRecordingName.trim() === '') {
      ToastAndroid.show('Veuillez entrer un nom pour l\'enregistrement', ToastAndroid.SHORT);
      return;
    }

    const recordingUri = recording.getURI();
    const newUri = `${FileSystem.documentDirectory}${newRecordingName}.m4a`;

    try {
      await FileSystem.moveAsync({
        from: recordingUri,
        to: newUri,
      });

      setNewRecordingName('');
      await loadRecordings();
      ToastAndroid.show('Enregistrement sauvegardé', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error saving recording', error);
      ToastAndroid.show('Erreur lors de la sauvegarde', ToastAndroid.SHORT);
    }
  };

  const playPauseRecording = async (uri) => {
    if (currentSound) {
      await currentSound.unloadAsync();
      setCurrentSound(null);
      setIsPlaying(false);
      return;
    }

    const { sound } = await Audio.Sound.createAsync({ uri });
    setCurrentSound(sound);
    setIsPlaying(true);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isPlaying) {
        setIsPlaying(false);
        setCurrentSound(null);
      }
    });
  };

  const deleteRecording = async (uri) => {
    try {
      await FileSystem.deleteAsync(uri);
      await loadRecordings();
      ToastAndroid.show('Enregistrement supprimé', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error deleting recording', error);
      ToastAndroid.show('Erreur lors de la suppression', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement'}
        onPress={recording ? stopRecording : startRecording}
      />
      {recording && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Nom de l'enregistrement"
            value={newRecordingName}
            onChangeText={setNewRecordingName}
          />
          <Button title="Sauvegarder l'enregistrement" onPress={saveRecording} />
        </View>
      )}
      <FlatList
        data={recordings}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.recordingItem}>
            <Text>{item.replace(FileSystem.documentDirectory, '')}</Text>
            <View style={styles.recordingActions}>
              <TouchableOpacity onPress={() => playPauseRecording(`${FileSystem.documentDirectory}${item}`)}>
                <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteRecording(`${FileSystem.documentDirectory}${item}`)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  recordingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
});
