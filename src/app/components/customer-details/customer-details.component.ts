// src/app/components/customer-details/customer-details.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

// Interfaces
interface Tour {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  maxGroupSize: number;
}

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

interface TravelInterest {
  value: string;
  label: string;
}

interface BookingData {
  tourId: number;
  selectedDate?: Date;
  numberOfPeople?: number;
  dietary?: any;
  customer?: any;
  payment?: any;
}

interface CustomerData {
  fullName: string;
  email: string;
  country: string;
  phone: string;
  dateOfBirth?: string;
  company?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  language: string;
  specialRequests?: string;
  customerSource?: string;
  interests: string[];
  marketingConsent: boolean;
  privacyConsent: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  @Input() tour: Tour | null = null;
  @Input() bookingData: BookingData = { tourId: 0 };
  @Output() next = new EventEmitter<CustomerData>();
  @Output() back = new EventEmitter<void>();

  // Form and UI state
  customerForm: FormGroup;
  timeLeft = 29 * 60 + 6; // 29:06 minutes in seconds
  showPromoInput = false;
  showPriceBreakdown = true;
  promoCode = '';

  // Timer subscription
  private timerSubscription: Subscription | null = null;

  // Static data
  countries: Country[] = [
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84' },
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
    { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
    { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60' },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64' },
  ];

  travelInterests: TravelInterest[] = [
    { value: 'culture', label: 'Văn hóa & lịch sử' },
    { value: 'food', label: 'Ẩm thực' },
    { value: 'adventure', label: 'Phiêu lưu & thể thao' },
    { value: 'nature', label: 'Thiên nhiên & động vật' },
    { value: 'photography', label: 'Nhiếp ảnh' },
    { value: 'nightlife', label: 'Cuộc sống về đêm' },
    { value: 'shopping', label: 'Mua sắm' },
    { value: 'art', label: 'Nghệ thuật & bảo tàng' },
    { value: 'music', label: 'Âm nhạc & biểu diễn' },
    { value: 'wellness', label: 'Sức khỏe & thư giãn' }
  ];

  // Computed properties
  get numberOfPeople(): number {
    return this.bookingData.numberOfPeople || 1;
  }

  get basePriceTotal(): number {
    return (this.tour?.price || 0) * this.numberOfPeople;
  }

  get taxes(): number {
    return Math.round(this.basePriceTotal * 0.1); // 10% tax
  }

  get discount(): number {
    // Apply discount logic here if needed
    return 0;
  }

  get totalAmount(): number {
    return this.basePriceTotal + this.taxes - this.discount;
  }

  get defaultTourImage(): string {
    return 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=200&fit=crop';
  }

  get tourType(): string {
    return 'Tour riêng';
  }

  get tourLanguage(): string {
    return 'Tiếng Việt';
  }

  get ageRange(): string {
    return '0 - 99 tuổi';
  }

  get hoursLeft(): number {
    return Math.floor(this.timeLeft / 3600) || 8;
  }

  selectedInterests: string[] = [];

  constructor(
    private fb: FormBuilder, 
    private router: Router
  ) {
    this.customerForm = this.createCustomerForm();
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private initializeComponent(): void {
    this.prefillFormData();
    this.startTimer();
    this.setupFormValidation();

    // Initialize default tour data if not provided
    if (!this.tour) {
      this.tour = {
        id: 1,
        name: 'Đà Nẵng: Trải nghiệm Di sản Hội An về đêm',
        imageUrl: this.defaultTourImage,
        price: 3865400,
        duration: '3 giờ',
        rating: 3.8,
        reviewCount: 4,
        maxGroupSize: 15
      };
    }
  }

  private createCustomerForm(): FormGroup {
    return this.fb.group({
      // Required fields
      fullName: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZÀ-ỹ\s]+$/)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      country: ['VN', [Validators.required]],
      phone: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9\s\+\-\(\)]{10,15}$/)
      ]],
      
      // Optional fields
      dateOfBirth: [''],
      company: [''],
      address: [''],
      city: [''],
      postalCode: [''],
      language: ['vi'],
      specialRequests: [''],
      customerSource: [''],
      
      // Consent fields
      marketingConsent: [false],
      privacyConsent: [false, [Validators.requiredTrue]]
    });
  }

  private prefillFormData(): void {
    if (this.bookingData?.customer) {
      this.customerForm.patchValue(this.bookingData.customer);
    }

    // Set default values
    this.customerForm.patchValue({
      country: 'VN',
      language: 'vi'
    });
  }

  private setupFormValidation(): void {
    // Add custom validators or form listeners here
    this.customerForm.get('country')?.valueChanges.subscribe(countryCode => {
      this.updatePhoneValidation(countryCode);
    });
  }

  private updatePhoneValidation(countryCode: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (!phoneControl) return;

    // Update phone validation based on country
    switch (countryCode) {
      case 'VN':
        phoneControl.setValidators([
          Validators.required,
          Validators.pattern(/^(0[3-9])[0-9]{8}$/)
        ]);
        break;
      case 'US':
        phoneControl.setValidators([
          Validators.required,
          Validators.pattern(/^[\+]?[1]?[\s\-\.]?[\(]?[0-9]{3}[\)]?[\s\-\.]?[0-9]{3}[\s\-\.]?[0-9]{4}$/)
        ]);
        break;
      default:
        phoneControl.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9\s\+\-\(\)]{10,15}$/)
        ]);
    }
    phoneControl.updateValueAndValidity();
  }

  private startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.handleTimerExpired();
      }
    });
  }

  private handleTimerExpired(): void {
    // Handle when timer expires
    alert('Thời gian đặt chỗ đã hết! Vui lòng đặt lại.');
    this.router.navigate(['/tours']);
  }

  // Public methods
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatPrice(price: number): string {
    return `₫${price.toLocaleString('vi-VN')}`;
  }

  formatBookingDate(): string {
    if (this.bookingData.selectedDate) {
      return new Intl.DateTimeFormat('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(this.bookingData.selectedDate);
    }
    return 'Thứ 6, 22 tháng 8, 2025 lúc 17:30';
  }

  formatCancellationDeadline(): string {
    const deadline = new Date();
    deadline.setHours(17, 30, 0, 0);
    deadline.setDate(deadline.getDate() - 1);
    
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'long'
    }).format(deadline);
  }

  onInterestChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    if (target.checked) {
      this.selectedInterests.push(value);
    } else {
      const index = this.selectedInterests.indexOf(value);
      if (index > -1) {
        this.selectedInterests.splice(index, 1);
      }
    }
  }

  togglePromoCode(): void {
    this.showPromoInput = !this.showPromoInput;
    if (!this.showPromoInput) {
      this.promoCode = '';
    }
  }

  applyPromoCode(): void {
    if (this.promoCode.trim()) {
      // Handle promo code application
      console.log('Applying promo code:', this.promoCode);
      // You can add API call here to validate and apply promo code
      
      // For demo, show a success message
      alert(`Đã áp dụng mã khuyến mãi: ${this.promoCode}`);
      this.showPromoInput = false;
    }
  }

  changeBookingDetails(event: Event): void {
    event.preventDefault();
    // Navigate back to tour selection or booking details
    this.router.navigate(['/tours', this.tour?.id, 'booking']);
  }

  onBack(): void {
    this.back.emit();
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;
      
      const customerData: CustomerData = {
        fullName: formValue.fullName,
        email: formValue.email,
        country: formValue.country,
        phone: formValue.phone,
        dateOfBirth: formValue.dateOfBirth,
        company: formValue.company,
        address: formValue.address,
        city: formValue.city,
        postalCode: formValue.postalCode,
        language: formValue.language,
        specialRequests: formValue.specialRequests,
        customerSource: formValue.customerSource,
        interests: this.selectedInterests,
        marketingConsent: formValue.marketingConsent,
        privacyConsent: formValue.privacyConsent,
        timestamp: new Date()
      };

      // Save customer data for tracking and CRM
      this.saveCustomerData(customerData);
      
      // Emit to parent component or navigate to payment
      this.next.emit(customerData);
      this.router.navigate(['/checkout/payment'], { 
        state: { 
          customer: customerData,
          booking: this.bookingData,
          tour: this.tour
        }
      });
    } else {
      this.markFormGroupTouched(this.customerForm);
      this.scrollToFirstError();
    }
  }

  private saveCustomerData(customerData: CustomerData): void {
    // Save to localStorage for offline access
    try {
      const existingData = localStorage.getItem('customerData');
      const customers = existingData ? JSON.parse(existingData) : [];
      
      customers.push({
        ...customerData,
        tourId: this.tour?.id,
        tourName: this.tour?.name,
        bookingAmount: this.totalAmount,
        id: Date.now().toString()
      });
      
      localStorage.setItem('customerData', JSON.stringify(customers));
    } catch (error) {
      console.error('Error saving customer data:', error);
    }

    // Here you would typically send this data to your backend API
    // Example:
    // this.customerService.saveCustomer(customerData).subscribe(response => {
    //   console.log('Customer data saved:', response);
    // });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control && control.invalid) {
        control.markAsDirty();
      }
    });
  }

  private scrollToFirstError(): void {
    const firstErrorElement = document.querySelector('.form-control.error');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      (firstErrorElement as HTMLElement).focus();
    }
  }

  // Analytics and tracking methods
  trackFormInteraction(action: string, field?: string): void {
    // Track user interactions for analytics
    console.log(`Form interaction: ${action}`, field ? `Field: ${field}` : '');
    
    // You can integrate with Google Analytics, Facebook Pixel, etc.
    // Example:
    // gtag('event', action, {
    //   event_category: 'Form',
    //   event_label: field || 'general'
    // });
  }

  trackFieldFocus(fieldName: string): void {
    this.trackFormInteraction('field_focus', fieldName);
  }

  trackFieldBlur(fieldName: string): void {
    this.trackFormInteraction('field_blur', fieldName);
  }

  // Utility methods for better UX
  onFieldFocus(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.trackFieldFocus(target.name);
  }

  onFieldBlur(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.trackFieldBlur(target.name);
  }

  // Customer service integration
  openLiveChat(): void {
    // Integration with customer service chat
    console.log('Opening live chat...');
    // You can integrate with Zendesk, Intercom, or custom chat solution
  }

  // Social login methods (if needed)
  signInWithGoogle(): void {
    // Google Sign-In integration
    console.log('Google Sign-In...');
  }

  signInWithFacebook(): void {
    // Facebook Sign-In integration
    console.log('Facebook Sign-In...');
  }
}