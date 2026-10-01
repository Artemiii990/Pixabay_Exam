import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { PixabayImage } from '../types/types';
import {
  getFavoritesFromStorage,
  saveFavoriteToStorage,
  removeFavoriteFromStorage,
} from '../services/api';

export const useFavorite = (image: PixabayImage) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const checkFavoriteStatus = async () => {
      try {
        const favorites = await getFavoritesFromStorage();
        if (isMounted) {
          setIsFavorite(favorites.some((fav) => fav.id === image.id));
        }
      } catch (error) {
        console.error('Failed to load favorites status:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkFavoriteStatus();

    return () => {
      isMounted = false;
    };
  }, [image.id]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavoriteFromStorage(image.id);
        setIsFavorite(false);
        Alert.alert('Успішно', 'Видалено з Обраного');
      } else {
        await saveFavoriteToStorage(image);
        setIsFavorite(true);
        Alert.alert('Успішно', 'Додано до Обраного');
      }
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося оновити статус обраного');
    }
  };

  return { isFavorite, isLoading, toggleFavorite };
};