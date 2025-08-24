import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class PaymentComponent {
  // Dữ liệu cho form thẻ tín dụng
  cardDetails = {
    number: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  };

  // Trạng thái chọn phương thức thanh toán
  selectedPaymentMethod: string = 'credit-card';

  // Trạng thái checkbox
  termsAgreed: boolean = false;
  newsletterSubscribed: boolean = false;

  constructor(private router: Router) {}

  // Phương thức xử lý thanh toán
  processPayment() {
    // Kiểm tra điều kiện cơ bản
    if (this.isPaymentValid()) {
      console.log('Processing payment with method:', this.selectedPaymentMethod);
      console.log('Card details:', this.cardDetails);
      console.log('Terms agreed:', this.termsAgreed);
      console.log('Newsletter subscribed:', this.newsletterSubscribed);
      
      // Ở đây bạn có thể:
      // 1. Gọi service để xử lý thanh toán
      // 2. Chuyển đến trang xác nhận
      // 3. Hiển thị modal thành công
      
      // Ví dụ: Chuyển đến trang xác nhận
      this.router.navigate(['/checkout/confirmation']);
    } else {
      // Xử lý lỗi validation
      console.log('Please fill in all required fields and agree to terms');
      // Có thể hiển thị thông báo lỗi cho người dùng
    }
  }

  // Kiểm tra tính hợp lệ của form thanh toán
  private isPaymentValid(): boolean {
    // Kiểm tra điều kiện cơ bản
    const basicConditions = this.termsAgreed; // Phải đồng ý điều khoản
    
    // Nếu chọn thanh toán bằng thẻ, kiểm tra thông tin thẻ
    if (this.selectedPaymentMethod === 'credit-card') {
      return basicConditions && 
             !!this.cardDetails.number && 
             !!this.cardDetails.expiryDate && 
             !!this.cardDetails.cvv && 
             !!this.cardDetails.cardholderName;
    }
    
    // Các phương thức thanh toán khác chỉ cần đồng ý điều khoản
    return basicConditions;
  }

  // Phương thức xử lý khi thay đổi phương thức thanh toán
  onPaymentMethodChange(method: string) {
    this.selectedPaymentMethod = method;
  }

  // Phương thức xử lý khi đồng ý điều khoản
  onTermsAgreeChange(checked: boolean) {
    this.termsAgreed = checked;
  }

  // Phương thức xử lý khi đăng ký nhận tin
  onNewsletterChange(checked: boolean) {
    this.newsletterSubscribed = checked;
  }
}