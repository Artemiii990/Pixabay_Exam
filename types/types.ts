export interface PixabayImage {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  user: string;
  views: number;
  likes: number;
  downloads: number;
  tags: string;
}

export type RootStackParamList = {
  Home: undefined;
  Details: { image: PixabayImage };
  Favorites: undefined;
};