import React from 'react';
import { View, Button, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export default function RecordedSoundTab({ onSelectSound }) {
  const [recordings, setRecordings] = React.useState([]);

  React.useEffect(() => {
    const loadRecordings = async () => {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      const audioFiles = files.filter(file => file.endsWith('.wav') || file.endsWith('.mp3'));
      setRecordings(audioFiles);
    };

    loadRecordings();
  }, []);

  const playSound = async (soundUri) => {
    const { sound } = await Audio.Sound.createAsync({ uri: soundUri });
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.recordingItem}>
            <Text>{item}</Text>
            <Button title="Lire" onPress={() => playSound(`${FileSystem.documentDirectory}${item}`)} />
            <Button title="Sélectionner" onPress={() => onSelectSound(`${FileSystem.documentDirectory}${item}`)} />
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
    alignItems: 'center',
  },
  recordingItem: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
