import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Tour } from '../../models/tour';
import { TourService } from '../../services/tour.service';
import { BookingService, CreateBookingRequest } from '../../services/booking.service';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss']
})
export class BookingDetailComponent implements OnInit {
  tour: Tour | null = null;
  bookingForm: FormGroup;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService,
    private bookingService: BookingService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      customerName: ['', [Validators.required]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required]],
      customerIdCard: [''],
      customerDateOfBirth: [''],
      customerGender: [''],
      customerAddress: [''],
      numberOfPeople: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      paymentMethod: ['bank_transfer', [Validators.required]],
      departureDate: ['', [Validators.required]],
      returnDate: ['', [Validators.required]],
      specialRequests: [''],
      emergencyContactName: [''],
      emergencyContactPhone: [''],
      emergencyContactRelationship: ['']
    });
  }

  ngOnInit(): void {
    const tourId = this.route.snapshot.paramMap.get('id');
    if (tourId) {
      this.tourService.getTourById(parseInt(tourId)).subscribe(tour => {
        if (tour) {
          this.tour = tour;
          
          // Set default departure and return dates
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const returnDate = new Date(tomorrow);
          returnDate.setDate(tomorrow.getDate() + this.getTourDurationDays());
          
          this.bookingForm.patchValue({
            departureDate: tomorrow.toISOString().split('T')[0],
            returnDate: returnDate.toISOString().split('T')[0]
          });
        }
      });
    }
  }

  getTourDurationDays(): number {
    if (!this.tour) return 1;
    const duration = this.tour.duration;
    if (duration.includes('ngày')) {
      const match = duration.match(/(\d+)\s*ngày/);
      return match ? parseInt(match[1]) : 1;
    }
    return 1;
  }

  onBookTour(): void {
    if (this.bookingForm.valid && this.tour && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData = this.bookingForm.value;
      const totalPrice = this.getTotalPrice();
      const depositAmount = this.getDepositAmount();
      const remainingAmount = this.getRemainingAmount();

      // Tạo booking request theo interface của BookingService
      const bookingRequest: CreateBookingRequest = {
        fullName: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
        idCard: formData.customerIdCard ? parseInt(formData.customerIdCard) : 0,
        dateOfBirth: formData.customerDateOfBirth || '',
        gender: formData.customerGender || '',
        address: formData.customerAddress || '',
        numberOfPeople: formData.numberOfPeople,
        paymentInfo_paymentMethod: formData.paymentMethod,
        departureDate: formData.departureDate,
        returnDate: formData.returnDate,
        specialRequests: formData.specialRequests || '',
        emergency_contact_name: formData.emergencyContactName || '',
        emergency_contact_phone: formData.emergencyContactPhone || '',
        emergency_contact_relationship: formData.emergencyContactRelationship || '',
        paymentInfo_totalAmount: totalPrice,
        paymentInfo_depositAmount: depositAmount,
        paymentInfo_remainingAmount: remainingAmount
      };

      console.log('Gửi booking request:', bookingRequest);

      // Gọi API tạo booking
      this.bookingService.createBooking(bookingRequest).subscribe({
        next: (response) => {
          console.log('Booking thành công:', response);
          this.isSubmitting = false;
          
          if (response.success) {
            alert(`Đặt tour thành công! Mã booking: ${response.data.id}\nChúng tôi sẽ liên hệ với bạn sớm nhất.`);
          } else {
            alert('Đặt tour thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
          }
          
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Lỗi khi tạo booking:', error);
          this.isSubmitting = false;
          
          // Xử lý lỗi khác nhau
          if (error.status === 400) {
            alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
          } else if (error.status === 500) {
            alert('Lỗi server. Vui lòng thử lại sau.');
          } else {
            alert('Có lỗi xảy ra khi đặt tour. Vui lòng thử lại.');
          }
        }
      });
    } else if (this.isSubmitting) {
      // Đang xử lý, không cho phép submit lại
      return;
    } else {
      // Form không hợp lệ
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.bookingForm.controls).forEach(key => {
      const control = this.bookingForm.get(key);
      control?.markAsTouched();
    });
  }

  getTotalPrice(): number {
    const numberOfPeople = this.bookingForm.get('numberOfPeople')?.value || 1;
    return this.tour ? this.tour.price * numberOfPeople : 0;
  }

  getDepositAmount(): number {
    return this.getTotalPrice() * 0.2; // 20% đặt cọc
  }

  getRemainingAmount(): number {
    return this.getTotalPrice() - this.getDepositAmount();
  }

  increaseQuantity(): void {
    const currentValue = this.bookingForm.get('numberOfPeople')?.value || 1;
    if (currentValue < 20) {
      this.bookingForm.patchValue({ numberOfPeople: currentValue + 1 });
    }
  }

  decreaseQuantity(): void {
    const currentValue = this.bookingForm.get('numberOfPeople')?.value || 1;
    if (currentValue > 1) {
      this.bookingForm.patchValue({ numberOfPeople: currentValue - 1 });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Trường này là bắt buộc';
      if (field.errors['email']) return 'Email không hợp lệ';
      if (field.errors['min']) return `Giá trị tối thiểu là ${field.errors['min'].min}`;
      if (field.errors['max']) return `Giá trị tối đa là ${field.errors['max'].max}`;
    }
    return '';
  }
}
