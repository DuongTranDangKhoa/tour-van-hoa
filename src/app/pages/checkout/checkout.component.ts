// src/app/pages/checkout/checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { Tour } from '../../models/tour';

// Import các components
import { DietaryPreferencesComponent } from '../../components/dietary-preferences/dietary-preferences.component';
import { CustomerDetailsComponent } from '../../components/customer-details/customer-details.component';
import { PaymentComponent } from '../../components/payment/payment.component';

export type CheckoutStep = 'dietary' | 'customer' | 'payment';

interface BookingData {
  // Tour selection data
  tourId: number;
  selectedDate?: Date;
  numberOfPeople?: number;
  
  // Dietary preferences
  dietary?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    allergies?: string[];
    specialRequests?: string;
  };
  
  // Customer information
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    emergencyContact?: {
      name: string;
      phone: string;
    };
  };
  
  // Payment information
  payment?: {
    method: string;
    amount: number;
    currency: string;
  };
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, 
    DietaryPreferencesComponent, 
    CustomerDetailsComponent, 
    PaymentComponent
  ],
  template: `
    <div class="checkout-container">
      <!-- Progress Indicator -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
        </div>
        <div class="progress-steps">
          <div class="step" [class.active]="currentStep === 'dietary'" [class.completed]="isStepCompleted('dietary')">
            <span class="step-number">1</span>
            <span class="step-label">Ẩm thực</span>
          </div>
          <div class="step" [class.active]="currentStep === 'customer'" [class.completed]="isStepCompleted('customer')">
            <span class="step-number">2</span>
            <span class="step-label">Thông tin</span>
          </div>
          <div class="step" [class.active]="currentStep === 'payment'" [class.completed]="isStepCompleted('payment')">
            <span class="step-number">3</span>
            <span class="step-label">Thanh toán</span>
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="step-content">
        <!-- Step 1: Dietary Preferences -->
        <app-dietary-preferences 
          *ngIf="currentStep === 'dietary'"
          [tour]="tour"
          [bookingData]="bookingData"
          (next)="onDietaryNext($event)"
          (back)="onGoBack()"
        ></app-dietary-preferences>

        <!-- Step 2: Customer Details -->
        <app-customer-details
          *ngIf="currentStep === 'customer'"
          [tour]="tour"
          [bookingData]="bookingData"
          (next)="onCustomerNext($event)"
          (back)="onGoBack()"
        ></app-customer-details>

        <!-- Step 3: Payment -->
        <app-payment
          *ngIf="currentStep === 'payment'"
          [tour]="tour"
          [bookingData]="bookingData"
          (submit)="onPaymentSubmit($event)"
          (back)="onGoBack()"
        ></app-payment>
      </div>

      <!-- Success State -->
      <div *ngIf="currentStep === 'success'" class="success-state">
        <div class="success-content">
          <i class="fas fa-check-circle"></i>
          <h2>Đặt tour thành công!</h2>
          <p>Cảm ơn bạn đã đặt tour <strong>{{ tour?.name }}</strong>.</p>
          <p>Chúng tôi sẽ gửi email xác nhận đến <strong>{{ bookingData.customer?.email }}</strong> trong vài phút tới.</p>
          <div class="success-actions">
            <button class="btn btn-primary" (click)="goToBookings()">
              Xem đặt chỗ của tôi
            </button>
            <button class="btn btn-secondary" (click)="goHome()">
              Về trang chủ
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="currentStep === 'loading'" class="loading-state">
        <div class="loading-content">
          <div class="spinner"></div>
          <h3>Đang xử lý thanh toán...</h3>
          <p>Vui lòng không đóng trình duyệt</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .progress-container {
      background: white;
      padding: 2rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .progress-bar {
      max-width: 800px;
      margin: 0 auto 2rem;
      height: 4px;
      background: #e9ecef;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #007bff, #0056b3);
      transition: width 0.3s ease;
    }

    .progress-steps {
      display: flex;
      justify-content: space-between;
      max-width: 600px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      
      .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #e9ecef;
        color: #6c757d;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-bottom: 0.5rem;
        transition: all 0.3s ease;
      }
      
      .step-label {
        font-size: 0.9rem;
        color: #6c757d;
        font-weight: 500;
      }
      
      &.active .step-number {
        background: #007bff;
        color: white;
      }
      
      &.completed .step-number {
        background: #28a745;
        color: white;
      }
      
      &.active .step-label,
      &.completed .step-label {
        color: #333;
      }
    }

    .step-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .success-state, .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      padding: 2rem;
    }

    .success-content, .loading-content {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      max-width: 500px;
      width: 100%;
    }

    .success-content {
      i {
        font-size: 4rem;
        color: #28a745;
        margin-bottom: 1.5rem;
      }

      h2 {
        color: #333;
        margin-bottom: 1rem;
      }

      p {
        color: #666;
        margin-bottom: 1rem;
        line-height: 1.6;
      }

      .success-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
        flex-wrap: wrap;
      }

      .btn {
        padding: 0.875rem 2rem;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        display: inline-block;

        &.btn-primary {
          background: #007bff;
          color: white;
          
          &:hover {
            background: #0056b3;
            transform: translateY(-1px);
          }
        }

        &.btn-secondary {
          background: #6c757d;
          color: white;
          
          &:hover {
            background: #545b62;
            transform: translateY(-1px);
          }
        }
      }
    }

    .loading-content {
      h3 {
        color: #333;
        margin-bottom: 1rem;
      }

      p {
        color: #666;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #e9ecef;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 2rem;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    }

    @media (max-width: 768px) {
      .progress-steps {
        padding: 0 1rem;
      }
      
      .step .step-label {
        font-size: 0.8rem;
      }
      
      .success-actions {
        flex-direction: column;
      }
      
      .success-content, .loading-content {
        padding: 2rem 1rem;
        margin: 0 1rem;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  tour: Tour | null = null;
  currentStep: CheckoutStep | 'success' | 'loading' = 'dietary';
  
  // Unified booking data object
  bookingData: BookingData = {
    tourId: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService
  ) {}

  ngOnInit() {
    // Get tour ID from route parameters
    const tourId = this.route.snapshot.paramMap.get('tourId');
    if (tourId) {
      this.bookingData.tourId = +tourId;
      this.loadTour(+tourId);
    }

    // Check if there's existing booking data from query params
    const existingBooking = this.route.snapshot.queryParams['booking'];
    if (existingBooking) {
      try {
        const parsedBooking = JSON.parse(decodeURIComponent(existingBooking));
        this.bookingData = { ...this.bookingData, ...parsedBooking };
      } catch (e) {
        console.warn('Could not parse booking data from URL');
      }
    }

    // Check current step from query params
    const stepParam = this.route.snapshot.queryParams['step'];
    if (stepParam && this.isValidStep(stepParam)) {
      this.currentStep = stepParam as CheckoutStep;
    }
  }

  private loadTour(tourId: number) {
    this.tourService.getTourById(tourId).subscribe({
      next: (tour) => {
        this.tour = tour || null;
        if (!this.tour) {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error loading tour:', error);
        this.router.navigate(['/']);
      }
    });
  }

  private isValidStep(step: string): boolean {
    return ['dietary', 'customer', 'payment'].includes(step);
  }

  // Step navigation methods
  onDietaryNext(data: any) {
    // Merge dietary data into bookingData
    this.bookingData = {
      ...this.bookingData,
      dietary: data
    };
    
    this.currentStep = 'customer';
    this.updateURL();
  }

  onCustomerNext(data: any) {
    // Merge customer data into bookingData
    this.bookingData = {
      ...this.bookingData,
      customer: data
    };
    
    this.currentStep = 'payment';
    this.updateURL();
  }

  onPaymentSubmit(data: any) {
    // Merge payment data into bookingData
    this.bookingData = {
      ...this.bookingData,
      payment: {
        ...data,
        amount: this.calculateTotalAmount(),
        currency: 'VND'
      }
    };
    
    this.currentStep = 'loading';
    this.processPayment();
  }

  onGoBack() {
    switch (this.currentStep) {
      case 'customer':
        this.currentStep = 'dietary';
        break;
      case 'payment':
        this.currentStep = 'customer';
        break;
      default:
        // Go back to tour details or home
        this.router.navigate(['/']);
        return;
    }
    this.updateURL();
  }

  private processPayment() {
    // Simulate payment processing
    setTimeout(() => {
      // In real app, send bookingData to backend API
      console.log('Final Booking Data:', {
        ...this.bookingData,
        bookingDate: new Date(),
        status: 'confirmed'
      });
      
      this.currentStep = 'success';
    }, 2000);
  }

  private calculateTotalAmount(): number {
    if (!this.tour || !this.bookingData.numberOfPeople) {
      return this.tour?.price || 0;
    }
    return this.tour.price * (this.bookingData.numberOfPeople || 1);
  }

  private updateURL() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        step: this.currentStep
      },
      queryParamsHandling: 'merge'
    });
  }

  // Navigation methods
  goHome() {
    this.router.navigate(['/']);
  }

  goToBookings() {
    this.router.navigate(['/bookings']);
  }

  // Utility methods
  canNavigateToStep(step: CheckoutStep): boolean {
    switch (step) {
      case 'dietary':
        return true;
      case 'customer':
        return !!this.bookingData.dietary;
      case 'payment':
        return !!this.bookingData.dietary && !!this.bookingData.customer;
      default:
        return false;
    }
  }

  isStepCompleted(step: CheckoutStep): boolean {
    switch (step) {
      case 'dietary':
        return !!this.bookingData.dietary;
      case 'customer':
        return !!this.bookingData.customer;
      case 'payment':
        return !!this.bookingData.payment;
      default:
        return false;
    }
  }

  getProgressPercentage(): number {
    switch (this.currentStep) {
      case 'dietary': return 33;
      case 'customer': return 66;
      case 'payment': return 100;
      default: return 0;
    }
  }

  // Method to get booking summary for confirmation
  getBookingSummary() {
    return {
      tour: this.tour,
      totalAmount: this.calculateTotalAmount(),
      numberOfPeople: this.bookingData.numberOfPeople || 1,
      customerName: this.bookingData.customer ? 
        `${this.bookingData.customer.firstName} ${this.bookingData.customer.lastName}` : '',
      customerEmail: this.bookingData.customer?.email || '',
      specialRequests: this.bookingData.dietary?.specialRequests || '',
      hasAllergies: (this.bookingData.dietary?.allergies?.length ?? 0) > 0
    };
  }
}