// src/app/components/payment/payment.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../../models/tour';
import { Router } from '@angular/router';

interface BookingData {
  tourId: number;
  selectedDate?: Date;
  numberOfPeople?: number;
  dietary?: any;
  customer?: any;
  payment?: any;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="payment-container">
      <div class="payment-header">
        <h2>Thanh toán</h2>
        <p>Vui lòng kiểm tra thông tin và chọn phương thức thanh toán</p>
      </div>

      <!-- Order Summary -->
      <div class="order-summary">
        <h3>Tóm tắt đơn hàng</h3>
        <div class="tour-info" *ngIf="tour">
          <img [src]="tour.imageUrl" [alt]="tour.name" class="tour-image">
          <div class="tour-details">
            <h4>{{ tour.name }}</h4>
            <p class="tour-duration">{{ tour.duration }}</p>
            <p class="tour-price">{{ formatPrice(tour.price) }} VND/người</p>
          </div>
        </div>
        
        <div class="booking-details">
          <div class="detail-row">
            <span>Số người:</span>
            <span>{{ numberOfPeople }} người</span>
          </div>
          <div class="detail-row">
            <span>Giá mỗi người:</span>
            <span>{{ formatPrice(tour?.price || 0) }} VND</span>
          </div>
          <div class="detail-row total">
            <span>Tổng cộng:</span>
            <span class="total-amount">{{ formatPrice(totalAmount) }} VND</span>
          </div>
        </div>
      </div>

      <!-- Customer Info Summary -->
      <div class="customer-summary" *ngIf="bookingData.customer">
        <h3>Thông tin khách hàng</h3>
        <p><strong>Họ tên:</strong> {{ bookingData.customer.firstName }} {{ bookingData.customer.lastName }}</p>
        <p><strong>Email:</strong> {{ bookingData.customer.email }}</p>
        <p><strong>Số điện thoại:</strong> {{ bookingData.customer.phone }}</p>
      </div>

      <!-- Payment Form -->
      <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()" class="payment-form">
        <h3>Phương thức thanh toán</h3>
        
        <div class="payment-methods">
          <div class="payment-method">
            <input type="radio" id="credit-card" value="credit-card" formControlName="paymentMethod">
            <label for="credit-card">
              <i class="fas fa-credit-card"></i>
              Thẻ tín dụng / Ghi nợ
            </label>
          </div>
          
          <div class="payment-method">
            <input type="radio" id="momo" value="momo" formControlName="paymentMethod">
            <label for="momo">
              <i class="fab fa-apple-pay"></i>
              Ví MoMo
            </label>
          </div>
          
          <div class="payment-method">
            <input type="radio" id="banking" value="banking" formControlName="paymentMethod">
            <label for="banking">
              <i class="fas fa-university"></i>
              Chuyển khoản ngân hàng
            </label>
          </div>
        </div>

        <!-- Credit Card Details -->
        <div class="card-details" *ngIf="paymentForm.get('paymentMethod')?.value === 'credit-card'">
          <div class="form-group">
            <label for="cardNumber">Số thẻ</label>
            <input 
              type="text" 
              id="cardNumber" 
              formControlName="cardNumber"
              placeholder="1234 5678 9012 3456"
              class="form-control"
            >
            <div class="error-message" *ngIf="paymentForm.get('cardNumber')?.invalid && paymentForm.get('cardNumber')?.touched">
              Vui lòng nhập số thẻ hợp lệ
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="expiryDate">Ngày hết hạn</label>
              <input 
                type="text" 
                id="expiryDate" 
                formControlName="expiryDate"
                placeholder="MM/YY"
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input 
                type="text" 
                id="cvv" 
                formControlName="cvv"
                placeholder="123"
                class="form-control"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="cardholderName">Tên chủ thẻ</label>
            <input 
              type="text" 
              id="cardholderName" 
              formControlName="cardholderName"
              placeholder="Nguyen Van A"
              class="form-control"
            >
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="terms">
          <label class="checkbox-label">
            <input type="checkbox" formControlName="acceptTerms">
            <span class="checkmark"></span>
            Tôi đồng ý với <a href="#" target="_blank">Điều khoản dịch vụ</a> và <a href="#" target="_blank">Chính sách bảo mật</a>
          </label>
          <div class="error-message" *ngIf="paymentForm.get('acceptTerms')?.invalid && paymentForm.get('acceptTerms')?.touched">
            Vui lòng đồng ý với điều khoản dịch vụ
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="goBack()">
            <i class="fas fa-arrow-left"></i>
            Quay lại
          </button>
          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="paymentForm.invalid || isProcessing"
          >
            <span *ngIf="!isProcessing">
              <i class="fas fa-lock"></i>
              Thanh toán {{ formatPrice(totalAmount) }} VND
            </span>
            <span *ngIf="isProcessing">
              <i class="fas fa-spinner fa-spin"></i>
              Đang xử lý...
            </span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .payment-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .payment-header {
      text-align: center;
      margin-bottom: 2rem;
      
      h2 {
        color: #333;
        margin-bottom: 0.5rem;
      }
      
      p {
        color: #666;
      }
    }

    .order-summary, .customer-summary {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      
      h3 {
        color: #333;
        margin-bottom: 1rem;
        font-size: 1.25rem;
      }
    }

    .tour-info {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      
      .tour-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
      }
      
      .tour-details {
        flex: 1;
        
        h4 {
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .tour-duration, .tour-price {
          color: #666;
          margin-bottom: 0.25rem;
        }
        
        .tour-price {
          font-weight: 600;
          color: #007bff;
        }
      }
    }

    .booking-details {
      .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        
        &.total {
          border-top: 1px solid #dee2e6;
          padding-top: 0.5rem;
          margin-top: 1rem;
          font-weight: 600;
          
          .total-amount {
            color: #007bff;
            font-size: 1.25rem;
          }
        }
      }
    }

    .customer-summary {
      p {
        margin-bottom: 0.5rem;
        color: #555;
      }
    }

    .payment-form {
      h3 {
        color: #333;
        margin-bottom: 1.5rem;
        font-size: 1.25rem;
      }
    }

    .payment-methods {
      margin-bottom: 2rem;
      
      .payment-method {
        margin-bottom: 1rem;
        
        input[type="radio"] {
          display: none;
        }
        
        label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          
          &:hover {
            border-color: #007bff;
          }
          
          i {
            font-size: 1.25rem;
            color: #007bff;
            width: 24px;
          }
        }
        
        input:checked + label {
          border-color: #007bff;
          background: #f8f9ff;
        }
      }
    }

    .card-details {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1rem;
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
        font-weight: 500;
      }
      
      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.2s ease;
        
        &:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        
        &.error {
          border-color: #dc3545;
        }
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
    }

    .terms {
      margin-bottom: 2rem;
      
      .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        cursor: pointer;
        line-height: 1.5;
        
        input[type="checkbox"] {
          margin-top: 0.25rem;
        }
        
        a {
          color: #007bff;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.875rem 2rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      &.btn-primary {
        background: #007bff;
        color: white;
        flex: 1;
        justify-content: center;
        
        &:hover:not(:disabled) {
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

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    @media (max-width: 768px) {
      .payment-container {
        padding: 1rem;
        margin: 1rem;
      }
      
      .tour-info {
        flex-direction: column;
        text-align: center;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class PaymentComponent {
  @Input() tour: Tour | null = null;
  @Input() bookingData: BookingData = { tourId: 0 };
  @Output() submit = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();

  paymentForm: FormGroup;
  isProcessing = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.paymentForm = this.createPaymentForm();
  }

  private createPaymentForm(): FormGroup {
    return this.fb.group({
      paymentMethod: ['credit-card', [Validators.required]],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      cardholderName: [''],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }

  get numberOfPeople(): number {
    return this.bookingData.numberOfPeople || 1;
  }

  get totalAmount(): number {
    return (this.tour?.price || 0) * this.numberOfPeople;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN');
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.isProcessing = true;
      
      const paymentData = {
        ...this.paymentForm.value,
        totalAmount: this.totalAmount,
        currency: 'VND'
      };
      
      // Simulate processing delay
      setTimeout(() => {
        // Navigate to success page or show success message
        alert('Thanh toán thành công!');
        this.router.navigate(['/bookings']);
        this.isProcessing = false;
      }, 1000);
    } else {
      this.markFormGroupTouched(this.paymentForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  goBack() {
    this.back.emit();
  }
}