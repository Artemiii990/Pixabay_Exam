import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PixabayImage, RootStackParamList } from '../types';
import { fetchPixabayImages } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState<string>('nature');
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async (searchQuery: string, pageNum: number, isNewSearch: boolean = false) => {
    if (isNewSearch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const data = await fetchPixabayImages(searchQuery, pageNum);
      if (isNewSearch) {
        setImages(data);
      } else {
        setImages((prev) => [...prev, ...data]);
      }
    } catch (err: any) {
      setError(err.message || 'Сталася помилка при завантаженні');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadImages(query, 1, true);
  }, []);

  const handleSearch = () => {
    setPage(1);
    loadImages(query, 1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && !loading && images.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadImages(query, nextPage, false);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: PixabayImage }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Details', { image: item })}
      >
        <Image source={{ uri: item.webformatURL }} style={styles.image} />
      </TouchableOpacity>
    ),
    [navigation]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Пошук (nature, cars, animals...)"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Пошук</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.favButton]}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Text style={styles.buttonText}>★</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.center} />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : images.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Зображень не знайдено</Text>
        </View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          numColumns={2}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color="#0000ff" /> : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', padding: 10, gap: 5 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 8,
  },
  favButton: { backgroundColor: '#FF9500' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: { flex: 1, margin: 5, height: 150, borderRadius: 8, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16 },
  emptyText: { fontSize: 16, color: '#666' },
});