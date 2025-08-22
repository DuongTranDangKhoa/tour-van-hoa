// src/app/models/dietary-preferences.ts
export interface DietaryPreferences {
  id?: string;
  bookingId: string;
  dietaryType: 'meat' | 'vegetarian';
  allergies: string[];
  additionalNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateDietaryPreferencesRequest {
  bookingId: string;
  dietaryType: 'meat' | 'vegetarian';
  allergies: string[];
  additionalNotes?: string;
}

// src/app/models/customer-info.ts  
export interface CustomerInfo {
  id?: string;
  bookingId: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  marketingConsent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCustomerInfoRequest {
  bookingId: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  marketingConsent: boolean;
}

// src/app/models/payment-info.ts
export interface PaymentInfo {
  id?: string;
  bookingId: string;
  paymentMethod: 'card' | 'revolut' | 'paypal' | 'apple_pay' | 'google_pay';
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    postalCode: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePaymentRequest {
  bookingId: string;
  paymentMethod: 'card' | 'revolut' | 'paypal' | 'apple_pay' | 'google_pay';
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    postalCode: string;
  };
  amount: number;
  currency: string;
}