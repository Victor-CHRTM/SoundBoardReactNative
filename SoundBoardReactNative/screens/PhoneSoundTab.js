import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function PhoneSoundTab({ onSelectSound }) {
  const handleSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      if (result.type === 'success') {
        onSelectSound(result.uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la sélection du fichier');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Sélectionner un son" onPress={handleSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
