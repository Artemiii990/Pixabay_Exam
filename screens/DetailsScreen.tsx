import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import {
  getFavoritesFromStorage,
  saveFavoriteToStorage,
  removeFavoriteFromStorage,
} from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export const DetailsScreen: React.FC<Props> = ({ route }) => {
  const { image } = route.params;
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    const favorites = await getFavoritesFromStorage();
    setIsFavorite(favorites.some((fav) => fav.id === image.id));
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await removeFavoriteFromStorage(image.id);
      setIsFavorite(false);
      Alert.alert('Успішно', 'Видалено з Обраного');
    } else {
      await saveFavoriteToStorage(image);
      setIsFavorite(true);
      Alert.alert('Успішно', 'Додано до Обраного');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: image.largeImageURL }} style={styles.largeImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.author}>Автор: {image.user}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>👁 Перегляди: {image.views}</Text>
          <Text style={styles.stat}>❤️ Лайки: {image.likes}</Text>
          <Text style={styles.stat}>📥 Завантаження: {image.downloads}</Text>
        </View>

        <TouchableOpacity
          style={[styles.favBtn, isFavorite ? styles.removeBtn : styles.addBtn]}
          onPress={toggleFavorite}
        >
          <Text style={styles.btnText}>
            {isFavorite ? 'Видалити з Обраного' : 'Додати в Обране'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  largeImage: { width: '100%', height: 350, resizeMode: 'cover' },
  infoContainer: { padding: 16 },
  author: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  statsRow: { marginVertical: 10, gap: 6 },
  stat: { fontSize: 16, color: '#444' },
  favBtn: { marginTop: 20, padding: 14, borderRadius: 8, alignItems: 'center' },
  addBtn: { backgroundColor: '#34C759' },
  removeBtn: { backgroundColor: '#FF3B30' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});