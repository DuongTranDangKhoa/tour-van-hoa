import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Tour } from '../../models/tour';
import { BookingService, CreateBookingRequest } from '../../services/booking.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent {
  @Input() tour: Tour | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() bookingCreated = new EventEmitter<any>();

  bookingForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {
    this.bookingForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      customerIdCard: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      customerDateOfBirth: [''],
      customerGender: ['male'],
      customerAddress: ['', Validators.required],
      numberOfPeople: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      departureDate: ['', Validators.required],
      returnDate: ['', Validators.required],
      specialRequests: [''],
      emergencyContactName: [''],
      emergencyContactPhone: [''],
      emergencyContactRelationship: [''],
      paymentMethod: ['bank_transfer', Validators.required]
    });
  }

  closeForm() {
    this.close.emit();
    this.bookingForm.reset({
      numberOfPeople: 1,
      paymentMethod: 'bank_transfer',
      customerGender: 'male'
    });
    this.isSubmitting = false;
  }

  calculateTotalPrice(): number {
    if (!this.tour) return 0;
    const numberOfPeople = this.bookingForm.get('numberOfPeople')?.value || 1;
    return this.tour.price * numberOfPeople;
  }

  calculateDepositAmount(): number {
    return Math.round(this.calculateTotalPrice() * 0.2); // 20% deposit
  }

  calculateRemainingAmount(): number {
    return this.calculateTotalPrice() - this.calculateDepositAmount();
  }

  // Format date từ input type="date" thành format "dd/mm/yyyy"
  formatDateForAPI(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Format current date thành "dd/mm/yyyy"
  getCurrentDateFormatted(): string {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onSubmit() {
    if (this.bookingForm.valid && this.tour) {
      this.isSubmitting = true;

      const formValue = this.bookingForm.value;
      const currentDate = this.getCurrentDateFormatted();
      
      const bookingRequest: CreateBookingRequest = {
        fullName: formValue.customerName,
        email: formValue.customerEmail,
        phone: formValue.customerPhone,
        idCard: parseInt(formValue.customerIdCard),
        dateOfBirth: formValue.customerDateOfBirth ? this.formatDateForAPI(formValue.customerDateOfBirth) : '',
        gender: formValue.customerGender,
        address: formValue.customerAddress,
        numberOfPeople: formValue.numberOfPeople,
        departureDate: formValue.departureDate,
        returnDate: formValue.returnDate,
        specialRequests: formValue.specialRequests || '',
        emergency_contact_name: formValue.emergencyContactName || '',
        emergency_contact_phone: formValue.emergencyContactPhone || '',
        emergency_contact_relationship: formValue.emergencyContactRelationship || '',
        paymentInfo_paymentMethod: formValue.paymentMethod,
        paymentInfo_totalAmount: this.calculateTotalPrice(),
        paymentInfo_depositAmount: this.calculateDepositAmount(),
        paymentInfo_remainingAmount: this.calculateRemainingAmount()
      };

      this.bookingService.createBooking(bookingRequest).subscribe({
        next: (response) => {
          this.bookingCreated.emit(response);
          this.closeForm();
          alert('Đặt tour thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        },
        error: (error) => {
          console.error('Error creating booking:', error);
          this.isSubmitting = false;
          alert('Không thể đặt tour. Vui lòng thử lại hoặc liên hệ với chúng tôi.');
        }
      });
    }
  }
}
