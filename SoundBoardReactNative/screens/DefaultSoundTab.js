import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const defaultSounds = [
  { name: 'Cats', path: 'server/models/cats.onnx' },
  { name: 'Dogs', path: 'server/models/dogs.onnx' },
  { name: 'Jazz', path: 'server/models/jazz.onnx' },
  { name: 'Speech', path: 'server/models/speech.onnx' },
  { name: 'Darbouka', path: 'server/models/darbouka.onnx' },
];

export default function DefaultSoundTab({ onSelectSound }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={defaultSounds}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelectSound(item.path)}>
            <Text style={styles.soundItem}>{item.name}</Text>
          </TouchableOpacity>
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
  soundItem: {
    padding: 20,
    fontSize: 18,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    borderRadius: 5,
  },
});
