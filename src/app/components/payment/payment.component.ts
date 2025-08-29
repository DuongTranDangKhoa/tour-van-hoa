import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface TourParticipant {
  type: string;
  name: string;
  price: number;
  fee: number;
  quantity: number;
}

interface OrderState {
  tourId: number;
  tourName: string;
  imageUrl: string;
  selectedDate: string;
  selectedSession: string;
  participants: TourParticipant[];
  addOn?: {
    name: string;
    price: number;
    quantity: number;
  };
  totalPrice: number;
}

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
export class PaymentComponent implements OnInit {
  // Tour information from customer details
  tourInfo: OrderState | null = null;
  tourImageUrl: string = '';
  tourName: string = 'Vietnam Art & Culture Tour – This Is Home';
  tourDate: string = '';
  tourSession: string = '';
  tourParticipants: TourParticipant[] = [];
  tourTotalPrice: number = 0;

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

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get tour information from router state or history state
    const navigation = this.router.getCurrentNavigation();
    const navState = navigation?.extras?.state as OrderState | undefined;
    const histState = (history && (history.state as OrderState)) || undefined;

    if (navState?.tourId) {
      this.tourInfo = navState;
      this.loadTourInformation();
      return;
    }

    if (histState?.tourId) {
      this.tourInfo = histState;
      this.loadTourInformation();
      return;
    }

    // Fallback to default/demo when no state is available
    this.loadDefaultTourInformation();
    this.simulateTourData();
  }

  private loadTourInformation(): void {
    if (this.tourInfo) {
      this.tourName = this.tourInfo.tourName;
      this.tourImageUrl = this.tourInfo.imageUrl || '/city-image/da-nang.jpg';
      this.tourDate = this.tourInfo.selectedDate;
      this.tourSession = this.tourInfo.selectedSession;
      this.tourParticipants = this.tourInfo.participants;
      this.tourTotalPrice = this.tourInfo.totalPrice;
    }
  }

  private loadDefaultTourInformation(): void {
    // Set default tour information when no booking data is available
    this.tourName = 'Vietnam Art & Culture Tour – This Is Home';
    this.tourImageUrl = '/city-image/da-nang.jpg'; // Use image from tour service
    this.tourDate = 'Saturday, September 6, 2025';
    this.tourSession = '6:00 AM';
    this.tourParticipants = [
      { type: 'adult', name: 'Shared 7', price: 37, fee: 0, quantity: 1 }
    ];
    this.tourTotalPrice = 906500; // 37 USD * 24500 VND
  }

  private simulateTourData(): void {
    // Simulate a realistic tour booking
    this.tourName = 'Vietnam Art & Culture Tour – This Is Home';
    this.tourImageUrl = '/city-image/da-nang.jpg'; // Use image from tour service
    this.tourParticipants = [
      { type: 'shared7', name: 'Shared 7', price: 37, fee: 0, quantity: 2 },
      { type: 'shared16', name: 'Shared 16', price: 37, fee: 0, quantity: 1 }
    ];
    // Calculate total: (37 * 2 + 37 * 1) * 24500 = 2,715,000 VND
    this.tourTotalPrice = 2715000;
  }

  // Convert VND to USD (approximate rate: 1 USD = 24,500 VND)
  convertVndToUsd(vndAmount: number): number {
    return Math.round(vndAmount / 24500 * 100) / 100;
  }

  // Get total price in USD
  getTotalPriceUSD(): number {
    return this.convertVndToUsd(this.tourTotalPrice);
  }

  // Get formatted total price in USD
  getFormattedTotalPriceUSD(): string {
    return `$${this.getTotalPriceUSD().toFixed(2)}`;
  }

  // Get total price in VND
  getFormattedTotalPriceVND(): string {
    return `₫${this.tourTotalPrice.toLocaleString()}`;
  }

  // Get participant summary text
  getParticipantSummary(): string {
    if (!this.tourParticipants.length) return 'No participants selected';
    
    const totalQuantity = this.tourParticipants.reduce((sum, p) => sum + p.quantity, 0);
    const types = this.tourParticipants
      .filter(p => p.quantity > 0)
      .map(p => `${p.quantity} ${p.name}`)
      .join(', ');
    
    return `${totalQuantity} participant(s) - ${types}`;
  }

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