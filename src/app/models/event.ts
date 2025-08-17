export interface Event {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  totalReviews: number;
  date: Date;
  price: number;
  isFavorite?: boolean;
  location: string;
}
