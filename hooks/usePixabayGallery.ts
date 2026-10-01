import { useState, useEffect, useCallback } from 'react';
import { PixabayImage } from '../types/types';
import { fetchPixabayImages } from '../services/api';

export const usePixabayGallery = (initialQuery: string = 'nature') => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async (searchQuery: string, pageNum: number, isNewSearch: boolean = false) => {
    if (isNewSearch) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
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
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadImages(initialQuery, 1, true);
  }, [initialQuery, loadImages]);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setPage(1);
    loadImages(query, 1, true);
  }, [query, loadImages]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && !isLoading && images.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadImages(query, nextPage, false);
    }
  }, [isLoadingMore, isLoading, images.length, page, query, loadImages]);

  return {
    query,
    setQuery,
    images,
    isLoading,
    isLoadingMore,
    error,
    handleSearch,
    handleLoadMore,
  };
};