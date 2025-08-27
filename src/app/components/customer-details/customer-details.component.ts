import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class CustomerDetailsComponent {
  showSpecialRequestInfo = false;

  customerDetails = {
    fullName: '',
    email: '',
    country: 'VN',
    phone: '',
    dietaryPreference: '',
    allergies: [] as string[],
    specialRequest: ''
  };

  allergyInput: string = '';
  showSuggestions: boolean = false;
  allergySuggestions: string[] = [
    'Hải sản', 'Tôm', 'Cua', 'Ốc', 'Đậu phộng', 'Sữa', 'Trứng',
    'Đậu nành', 'Gluten', 'Đậu xanh', 'Thịt bò', 'Thịt heo', 'Gà', 'Cá hồi', 'Cá ngừ'
  ];
  filteredSuggestions: string[] = [];

  constructor(private router: Router) {}

  toggleSpecialRequestInfo() {
    this.showSpecialRequestInfo = !this.showSpecialRequestInfo;
  }

  onAllergyInput() {
    if (this.allergyInput.length > 0) {
      this.showSuggestions = true;
      this.filteredSuggestions = this.allergySuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(this.allergyInput.toLowerCase())
      );
    } else {
      this.showSuggestions = false;
      this.filteredSuggestions = [];
    }
  }

  selectAllergy(allergy: string) {
    if (!this.customerDetails.allergies.includes(allergy)) {
      this.customerDetails.allergies.push(allergy);
    }
    this.allergyInput = '';
    this.showSuggestions = false;
  }

  removeAllergy(allergy: string) {
    this.customerDetails.allergies = this.customerDetails.allergies.filter(item => item !== allergy);
  }

  goToPayment() {
    if (this.isFormValid()) {
      console.log('Customer Details:', this.customerDetails);
      // Logic to save data can be added here
      this.router.navigate(['/checkout/payment']);
    } else {
      console.log('Vui lòng điền đầy đủ thông tin bắt buộc');
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.customerDetails.fullName &&
      this.customerDetails.email &&
      this.customerDetails.country &&
      this.customerDetails.phone
    );
  }
}