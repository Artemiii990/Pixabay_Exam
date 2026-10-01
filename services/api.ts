import AsyncStorage from '@react-native-async-storage/async-storage';
import { PixabayImage } from '../types/types';

const PIXABAY_API_KEY = '55293536-369571af776bc4513517af32c'; // ключ
const BASE_URL = 'https://pixabay.com/api/';
const FAVORITES_KEY = '@pixabay_favorites';

export const fetchPixabayImages = async (
  query: string,
  page: number = 1,
  perPage: number = 20
): Promise<PixabayImage[]> => {
  const url = `${BASE_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(
    query
  )}&page=${page}&per_page=${perPage}&image_type=photo`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Не вдалося завантажити зображення з API');
  }
  const data = await response.json();
  return data.hits;
};


export const getFavoritesFromStorage = async (): Promise<PixabayImage[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Помилка читання з AsyncStorage', e);
    return [];
  }
};

export const saveFavoriteToStorage = async (image: PixabayImage): Promise<PixabayImage[]> => {
  const current = await getFavoritesFromStorage();
  const exists = current.some((item) => item.id === image.id);
  if (!exists) {
    const updated = [...current, image];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  }
  return current;
};

export const removeFavoriteFromStorage = async (id: number): Promise<PixabayImage[]> => {
  const current = await getFavoritesFromStorage();
  const updated = current.filter((item) => item.id !== id);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
};