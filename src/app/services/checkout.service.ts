// src/app/services/checkout.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CheckoutData {
  tourId: string;
  tourName: string;
  selectedDate: string;
  selectedSession: string;
  tickets: TicketSelection[];
  addOnQuantity: number;
  totalPrice: number;
}

export interface TicketSelection {
  id: string;
  name: string;
  price: number;
  bookingFee: number;
  quantity: number;
}

export interface DietaryPreferences {
  pickupOption: 'yes' | 'no';
  dietaryPreference: string;
  allergies: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  country: string;
  phone: string;
  dateOfBirth?: string;
  idCard?: string;
  address?: string;
}

export interface PaymentDetails {
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  postalCode?: string;
}

export interface CompleteBooking {
  checkout: CheckoutData;
  dietary: DietaryPreferences;
  customer: CustomerDetails;
  payment: PaymentDetails;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private checkoutDataSubject = new BehaviorSubject<CheckoutData | null>(null);
  private dietaryDataSubject = new BehaviorSubject<DietaryPreferences | null>(null);
  private customerDataSubject = new BehaviorSubject<CustomerDetails | null>(null);
  private paymentDataSubject = new BehaviorSubject<PaymentDetails | null>(null);

  // Observable streams
  checkoutData$ = this.checkoutDataSubject.asObservable();
  dietaryData$ = this.dietaryDataSubject.asObservable();
  customerData$ = this.customerDataSubject.asObservable();
  paymentData$ = this.paymentDataSubject.asObservable();

  constructor() {
    // Load data from sessionStorage on service initialization
    this.loadFromStorage();
  }

  // Initialize checkout with tour and booking data
  initializeCheckout(checkoutData: CheckoutData): void {
    this.checkoutDataSubject.next(checkoutData);
    this.saveToStorage('checkoutData', checkoutData);
  }

  // Save dietary preferences
  saveDietaryPreferences(dietary: DietaryPreferences): void {
    this.dietaryDataSubject.next(dietary);
    this.saveToStorage('dietaryData', dietary);
  }

  // Save customer details
  saveCustomerDetails(customer: CustomerDetails): void {
    this.customerDataSubject.next(customer);
    this.saveToStorage('customerData', customer);
  }

  // Save payment details
  savePaymentDetails(payment: PaymentDetails): void {
    this.paymentDataSubject.next(payment);
    this.saveToStorage('paymentData', payment);
  }

  // Get current checkout data
  getCurrentCheckoutData(): CheckoutData | null {
    return this.checkoutDataSubject.value;
  }

  // Get current dietary preferences
  getCurrentDietaryData(): DietaryPreferences | null {
    return this.dietaryDataSubject.value;
  }

  // Get current customer details
  getCurrentCustomerData(): CustomerDetails | null {
    return this.customerDataSubject.value;
  }

  // Get current payment details
  getCurrentPaymentData(): PaymentDetails | null {
    return this.paymentDataSubject.value;
  }

  // Check if checkout can proceed to next step
  canProceedToStep(step: number): boolean {
    switch (step) {
      case 1: // Dietary preferences
        return this.checkoutDataSubject.value !== null;
      case 2: // Customer details
        return this.checkoutDataSubject.value !== null && 
               this.dietaryDataSubject.value !== null;
      case 3: // Payment
        return this.checkoutDataSubject.value !== null && 
               this.dietaryDataSubject.value !== null && 
               this.customerDataSubject.value !== null;
      default:
        return false;
    }
  }

  // Get checkout progress percentage
  getCheckoutProgress(): number {
    let progress = 0;
    if (this.checkoutDataSubject.value) progress += 25;
    if (this.dietaryDataSubject.value) progress += 25;
    if (this.customerDataSubject.value) progress += 25;
    if (this.paymentDataSubject.value) progress += 25;
    return progress;
  }

  // Complete the booking
  completeBooking(): Observable<CompleteBooking> {
    return new Observable(observer => {
      const checkoutData = this.checkoutDataSubject.value;
      const dietaryData = this.dietaryDataSubject.value;
      const customerData = this.customerDataSubject.value;
      const paymentData = this.paymentDataSubject.value;

      if (!checkoutData || !dietaryData || !customerData || !paymentData) {
        observer.error('Incomplete booking data');
        return;
      }

      const completeBooking: CompleteBooking = {
        checkout: checkoutData,
        dietary: dietaryData,
        customer: customerData,
        payment: paymentData,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        bookingId: this.generateBookingId()
      };

      // Simulate API call
      setTimeout(() => {
        observer.next(completeBooking);
        observer.complete();
        
        // Clear checkout data after successful booking
        this.clearCheckoutData();
      }, 2000);
    });
  }

  // Calculate total with taxes and fees
  calculateTotal(): number {
    const checkoutData = this.checkoutDataSubject.value;
    if (!checkoutData) return 0;

    let total = 0;
    checkoutData.tickets.forEach(ticket => {
      total += (ticket.price + ticket.bookingFee) * ticket.quantity;
    });
    
    // Add any add-ons
    total += checkoutData.addOnQuantity * 150000; // Add-on price

    return total;
  }

  // Validate checkout data
  validateCheckoutData(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.checkoutDataSubject.value) {
      errors.push('Missing tour booking data');
    }
    
    if (!this.dietaryDataSubject.value) {
      errors.push('Missing dietary preferences');
    }
    
    const customerData = this.customerDataSubject.value;
    if (!customerData) {
      errors.push('Missing customer details');
    } else {
      if (!customerData.fullName) errors.push('Full name is required');
      if (!customerData.email) errors.push('Email is required');
      if (!customerData.phone) errors.push('Phone number is required');
    }
    
    const paymentData = this.paymentDataSubject.value;
    if (!paymentData) {
      errors.push('Missing payment details');
    } else if (paymentData.paymentMethod === 'card') {
      if (!paymentData.cardNumber) errors.push('Card number is required');
      if (!paymentData.expiryDate) errors.push('Expiry date is required');
      if (!paymentData.cvc) errors.push('CVC is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Clear all checkout data
  clearCheckoutData(): void {
    this.checkoutDataSubject.next(null);
    this.dietaryDataSubject.next(null);
    this.customerDataSubject.next(null);
    this.paymentDataSubject.next(null);
    
    // Clear from storage
    sessionStorage.removeItem('checkoutData');
    sessionStorage.removeItem('dietaryData');
    sessionStorage.removeItem('customerData');
    sessionStorage.removeItem('paymentData');
  }

  // Private helper methods
  private saveToStorage(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  private loadFromStorage(): void {
    try {
      const checkoutData = sessionStorage.getItem('checkoutData');
      if (checkoutData) {
        this.checkoutDataSubject.next(JSON.parse(checkoutData));
      }

      const dietaryData = sessionStorage.getItem('dietaryData');
      if (dietaryData) {
        this.dietaryDataSubject.next(JSON.parse(dietaryData));
      }

      const customerData = sessionStorage.getItem('customerData');
      if (customerData) {
        this.customerDataSubject.next(JSON.parse(customerData));
      }

      const paymentData = sessionStorage.getItem('paymentData');
      if (paymentData) {
        this.paymentDataSubject.next(JSON.parse(paymentData));
      }
    } catch (error) {
      console.error('Error loading checkout data from storage:', error);
    }
  }

  private generateBookingId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BKG-${timestamp}-${random}`;
  }

  // Format currency helper
  formatCurrency(amount: number, currency: 'VND' | 'EUR' = 'VND'): string {
    if (currency === 'EUR') {
      // Convert VND to EUR for demo
      const eurAmount = amount / 25000;
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(eurAmount);
    }
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  // Format date helper
  formatDate(dateString: string, locale: 'vi-VN' | 'en-US' | 'fr-FR' = 'vi-VN'): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return date.toLocaleDateString(locale, options);
  }

  // Get step name
  getStepName(step: number): string {
    switch (step) {
      case 1: return 'Dietary Preferences';
      case 2: return 'Customer Details';
      case 3: return 'Payment';
      default: return 'Unknown Step';
    }
  }

  // Get total number of people
  getTotalPeople(): number {
    const checkoutData = this.checkoutDataSubject.value;
    if (!checkoutData) return 0;
    return checkoutData.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  }

  // Check if booking has expired (for timer functionality)
  isBookingExpired(): boolean {
    const checkoutData = this.checkoutDataSubject.value;
    if (!checkoutData) return true;
    
    // Assume booking expires after 30 minutes
    const bookingStartTime = sessionStorage.getItem('bookingStartTime');
    if (!bookingStartTime) {
      // Set start time if not exists
      sessionStorage.setItem('bookingStartTime', Date.now().toString());
      return false;
    }
    
    const startTime = parseInt(bookingStartTime);
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    return (currentTime - startTime) > thirtyMinutes;
  }

  // Get remaining time for booking
  getRemainingTime(): { minutes: number; seconds: number } {
    const bookingStartTime = sessionStorage.getItem('bookingStartTime');
    if (!bookingStartTime) {
      sessionStorage.setItem('bookingStartTime', Date.now().toString());
      return { minutes: 30, seconds: 0 };
    }
    
    const startTime = parseInt(bookingStartTime);
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    const elapsed = currentTime - startTime;
    const remaining = Math.max(0, thirtyMinutes - elapsed);
    
    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    return { minutes, seconds };
  }
}