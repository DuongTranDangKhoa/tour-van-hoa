// src/app/components/customer-details/customer-details.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Tour } from '../../models/tour';

interface BookingData {
  tourId: number;
  selectedDate?: Date;
  numberOfPeople?: number;
  dietary?: any;
  customer?: any;
  payment?: any;
}

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="customer-details-container">
      <!-- Header -->
      <div class="customer-header">
        <h2>Thông tin khách hàng</h2>
        <p>Vui lòng cung cấp thông tin liên hệ để hoàn tất đặt tour</p>
      </div>

      <!-- Tour Summary -->
      <div class="tour-summary" *ngIf="tour">
        <div class="tour-info">
          <img [src]="tour.imageUrl" [alt]="tour.name" class="tour-image">
          <div class="tour-details">
            <h3>{{ tour.name }}</h3>
            <p class="tour-duration">{{ tour.duration }}</p>
            <div class="booking-info">
              <span class="people-count">{{ numberOfPeople }} người</span>
              <span class="total-price">{{ formatPrice(totalAmount) }} VND</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Form -->
      <form [formGroup]="customerForm" (ngSubmit)="onSubmit()" class="customer-form">
        <!-- Personal Information -->
        <div class="form-section">
          <h3>Thông tin cá nhân</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Họ *</label>
              <input 
                type="text" 
                id="firstName" 
                formControlName="firstName"
                class="form-control"
                placeholder="Nhập họ">
              <div class="error-message" *ngIf="customerForm.get('firstName')?.invalid && customerForm.get('firstName')?.touched">
                Vui lòng nhập họ
              </div>
            </div>
            
            <div class="form-group">
              <label for="lastName">Tên *</label>
              <input 
                type="text" 
                id="lastName" 
                formControlName="lastName"
                class="form-control"
                placeholder="Nhập tên">
              <div class="error-message" *ngIf="customerForm.get('lastName')?.invalid && customerForm.get('lastName')?.touched">
                Vui lòng nhập tên
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email"
                class="form-control"
                placeholder="example@email.com">
              <div class="error-message" *ngIf="customerForm.get('email')?.invalid && customerForm.get('email')?.touched">
                Vui lòng nhập email hợp lệ
              </div>
            </div>
            
            <div class="form-group">
              <label for="phone">Số điện thoại *</label>
              <input 
                type="tel" 
                id="phone" 
                formControlName="phone"
                class="form-control"
                placeholder="0903 102 269">
              <div class="error-message" *ngIf="customerForm.get('phone')?.invalid && customerForm.get('phone')?.touched">
                Vui lòng nhập số điện thoại hợp lệ
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="dateOfBirth">Ngày sinh</label>
            <input 
              type="date" 
              id="dateOfBirth" 
              formControlName="dateOfBirth"
              class="form-control">
          </div>
        </div>

        <!-- Address Information -->
        <div class="form-section">
          <h3>Địa chỉ</h3>
          
          <div class="form-group">
            <label for="address">Địa chỉ</label>
            <textarea 
              id="address" 
              formControlName="address"
              class="form-control"
              rows="3"
              placeholder="Nhập địa chỉ đầy đủ"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="city">Tỉnh/Thành phố</label>
              <select id="city" formControlName="city" class="form-control">
                <option value="">Chọn tỉnh/thành phố</option>
                <option value="HCM">TP. Hồ Chí Minh</option>
                <option value="HN">Hà Nội</option>
                <option value="DN">Đà Nẵng</option>
                <option value="HP">Hải Phòng</option>
                <option value="CT">Cần Thơ</option>
                <option value="GL">Gia Lai</option>
                <option value="DL">Đắk Lắk</option>
                <option value="KH">Khánh Hòa</option>
                <option value="QN">Quảng Nam</option>
                <option value="BD">Bình Dương</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="district">Quận/Huyện</label>
              <input 
                type="text" 
                id="district" 
                formControlName="district"
                class="form-control"
                placeholder="Nhập quận/huyện">
            </div>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div class="form-section">
          <h3>Liên hệ khẩn cấp</h3>
          <p class="section-description">Thông tin người liên hệ trong trường hợp khẩn cấp</p>
          
          <div class="form-row">
            <div class="form-group">
              <label for="emergencyContactName">Tên người liên hệ</label>
              <input 
                type="text" 
                id="emergencyContactName" 
                formControlName="emergencyContactName"
                class="form-control"
                placeholder="Họ tên người liên hệ">
            </div>
            
            <div class="form-group">
              <label for="emergencyContactPhone">Số điện thoại</label>
              <input 
                type="tel" 
                id="emergencyContactPhone" 
                formControlName="emergencyContactPhone"
                class="form-control"
                placeholder="Số điện thoại khẩn cấp">
            </div>
          </div>
          
          <div class="form-group">
            <label for="emergencyContactRelation">Mối quan hệ</label>
            <select id="emergencyContactRelation" formControlName="emergencyContactRelation" class="form-control">
              <option value="">Chọn mối quan hệ</option>
              <option value="parent">Cha/Mẹ</option>
              <option value="spouse">Vợ/Chồng</option>
              <option value="sibling">Anh/Chị/Em</option>
              <option value="friend">Bạn bè</option>
              <option value="colleague">Đồng nghiệp</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>

        <!-- Health Information -->
        <div class="form-section">
          <h3>Thông tin sức khỏe</h3>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="hasHealthIssues">
              <span class="checkmark"></span>
              Tôi có vấn đề sức khỏe cần lưu ý
            </label>
          </div>
          
          <div class="form-group" *ngIf="customerForm.get('hasHealthIssues')?.value">
            <label for="healthIssuesDetails">Chi tiết vấn đề sức khỏe</label>
            <textarea 
              id="healthIssuesDetails" 
              formControlName="healthIssuesDetails"
              class="form-control"
              rows="3"
              placeholder="Vui lòng mô tả chi tiết các vấn đề sức khỏe..."></textarea>
          </div>

          <div class="form-group">
            <label for="specialRequests">Yêu cầu đặc biệt</label>
            <textarea 
              id="specialRequests" 
              formControlName="specialRequests"
              class="form-control"
              rows="3"
              placeholder="Có yêu cầu đặc biệt nào khác không?"></textarea>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="form-section">
          <div class="terms-section">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="agreeToTerms">
              <span class="checkmark"></span>
              Tôi đồng ý với <a href="#" target="_blank">Điều khoản dịch vụ</a> và <a href="#" target="_blank">Chính sách bảo mật</a> *
            </label>
            <div class="error-message" *ngIf="customerForm.get('agreeToTerms')?.invalid && customerForm.get('agreeToTerms')?.touched">
              Vui lòng đồng ý với điều khoản dịch vụ
            </div>
          </div>

          <div class="marketing-consent">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="agreeToMarketing">
              <span class="checkmark"></span>
              Tôi muốn nhận thông tin khuyến mãi và tour mới từ chúng tôi
            </label>
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
            [disabled]="customerForm.invalid"
          >
            Tiếp tục thanh toán
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .customer-details-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .customer-header {
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

    .tour-summary {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .tour-info {
      display: flex;
      gap: 1rem;
      align-items: center;
      
      .tour-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
      }
      
      .tour-details {
        flex: 1;
        
        h3 {
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .tour-duration {
          color: #666;
          margin-bottom: 1rem;
        }
        
        .booking-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .people-count {
            color: #666;
          }
          
          .total-price {
            font-size: 1.25rem;
            font-weight: 600;
            color: #007bff;
          }
        }
      }
    }

    .customer-form {
      .form-section {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #e9ecef;
        
        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        h3 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }
        
        .section-description {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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
      
      textarea.form-control {
        resize: vertical;
      }
    }

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

    .terms-section, .marketing-consent {
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e9ecef;
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
      .customer-details-container {
        padding: 1rem;
        margin: 1rem;
      }
      
      .tour-info {
        flex-direction: column;
        text-align: center;
        
        .booking-info {
          justify-content: center;
          gap: 2rem;
        }
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
export class CustomerDetailsComponent implements OnInit {
  @Input() tour: Tour | null = null;
  @Input() bookingData: BookingData = { tourId: 0 };
  @Output() next = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();

  customerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.customerForm = this.createCustomerForm();
  }

  ngOnInit() {
    this.prefillFormData();
  }

  private createCustomerForm(): FormGroup {
    return this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\s\+\-\(\)]+$/)]],
      dateOfBirth: [''],
      
      // Address Information
      address: [''],
      city: [''],
      district: [''],
      
      // Emergency Contact
      emergencyContactName: [''],
      emergencyContactPhone: ['', [Validators.pattern(/^[0-9\s\+\-\(\)]+$/)]],
      emergencyContactRelation: [''],
      
      // Health Information
      hasHealthIssues: [false],
      healthIssuesDetails: [''],
      specialRequests: [''],
      
      // Terms and Conditions
      agreeToTerms: [false, [Validators.requiredTrue]],
      agreeToMarketing: [false]
    });
  }

  private prefillFormData() {
    // Pre-fill with existing data if available
    if (this.bookingData?.customer) {
      this.customerForm.patchValue(this.bookingData.customer);
    }
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
    if (this.customerForm.valid) {
      const customerData = {
        firstName: this.customerForm.get('firstName')?.value,
        lastName: this.customerForm.get('lastName')?.value,
        email: this.customerForm.get('email')?.value,
        phone: this.customerForm.get('phone')?.value,
        dateOfBirth: this.customerForm.get('dateOfBirth')?.value,
        address: this.customerForm.get('address')?.value,
        city: this.customerForm.get('city')?.value,
        district: this.customerForm.get('district')?.value,
        emergencyContact: {
          name: this.customerForm.get('emergencyContactName')?.value,
          phone: this.customerForm.get('emergencyContactPhone')?.value,
          relation: this.customerForm.get('emergencyContactRelation')?.value
        },
        hasHealthIssues: this.customerForm.get('hasHealthIssues')?.value,
        healthIssuesDetails: this.customerForm.get('healthIssuesDetails')?.value,
        specialRequests: this.customerForm.get('specialRequests')?.value,
        agreeToMarketing: this.customerForm.get('agreeToMarketing')?.value,
        timestamp: new Date()
      };

      this.next.emit(customerData);
    } else {
      this.markFormGroupTouched(this.customerForm);
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