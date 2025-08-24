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
  customerDetails = {
    fullName: '',
    email: '',
    country: 'VN', // Mặc định là Việt Nam
    phone: '',
    dietaryRestrictions: ''
  };

  constructor(private router: Router) {}

  goToPayment() {
    // Kiểm tra validation cơ bản nếu cần
    if (this.isFormValid()) {
      console.log('Customer Details:', this.customerDetails);
      // Ở đây bạn có thể lưu dữ liệu vào service
      // this.checkoutService.saveCustomerDetails(this.customerDetails);
      
      // Điều hướng đến trang thanh toán
      this.router.navigate(['/checkout/payment']);
    } else {
      // Xử lý lỗi validation nếu cần
      console.log('Vui lòng điền đầy đủ thông tin bắt buộc');
      // Có thể hiển thị thông báo lỗi cho người dùng
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.customerDetails.fullName &&
      this.customerDetails.email &&
      this.customerDetails.country &&
      this.customerDetails.phone
      // this.customerDetails.dietaryRestrictions không bắt buộc theo template
    );
  }
}