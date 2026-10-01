import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { PixabayImage } from '../types/types';
import { getFavoritesFromStorage, removeFavoriteFromStorage } from '../services/api';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<PixabayImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getFavoritesFromStorage();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      
      const fetchFavorites = async () => {
        const data = await getFavoritesFromStorage();
        if (isMounted) {
          setFavorites(data);
          setIsLoading(false);
        }
      };

      fetchFavorites();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const removeFavorite = async (id: number) => {
    try {
      const updated = await removeFavoriteFromStorage(id);
      setFavorites(updated);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  return { favorites, isLoading, removeFavorite, reloadFavorites: loadFavorites };
};