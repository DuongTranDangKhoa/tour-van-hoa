export interface Tour {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  imageUrl: string;
  destination: string;
  rating: number;
  maxGroupSize: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Adventure' | 'Cultural' | 'Relaxation' | 'Nature' | 'City';
  highlights: string[];
  included: string[];
  notIncluded: string[];
  departureDate?: Date | string;
  returnDate?: Date | string;
  languages?: string[];
  tourProgram?: string;
}
