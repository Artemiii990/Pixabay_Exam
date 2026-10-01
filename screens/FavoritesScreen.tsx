import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PixabayImage, RootStackParamList } from '../types';
import { getFavoritesFromStorage, removeFavoriteFromStorage } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
  const [favorites, setFavorites] = useState<PixabayImage[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const data = await getFavoritesFromStorage();
    setFavorites(data);
  };

  const handleRemove = async (id: number) => {
    const updated = await removeFavoriteFromStorage(id);
    setFavorites(updated);
  };

  const renderItem = ({ item }: { item: PixabayImage }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.imageClick}
        onPress={() => navigation.navigate('Details', { image: item })}
      >
        <Image source={{ uri: item.webformatURL }} style={styles.image} />
        <Text style={styles.author}>{item.user}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleRemove(item.id)}>
        <Text style={styles.deleteText}>Видалити</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Список обраного порожній</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: {
    flexDirection: 'row',
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  imageClick: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  image: { width: 80, height: 80 },
  author: { marginLeft: 12, fontSize: 16, fontWeight: '500' },
  deleteBtn: { backgroundColor: '#FF3B30', padding: 12, borderRadius: 6, marginRight: 8 },
  deleteText: { color: '#fff', fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
});