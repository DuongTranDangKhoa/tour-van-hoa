export interface Booking {
  id?: number;
  tourId: number;
  tourName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfPeople: number;
  departureDate: Date;
  returnDate: Date;
  totalPrice: number;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  bookingDate: Date;
}
