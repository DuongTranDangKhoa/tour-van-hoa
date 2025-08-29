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
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class CustomerDetailsComponent implements OnInit {
  showSpecialRequestInfo = false;

  // Tour information from booking
  tourInfo: OrderState | null = null;
  tourImageUrl: string = '';
  tourName: string = 'Vietnam Art & Culture Tour – This Is Home';
  tourDate: string = '';
  tourSession: string = '';
  tourParticipants: TourParticipant[] = [];
  tourTotalPrice: number = 0;

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

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get tour information from router state or history.state (on reload)
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

  // Get tour language information
  getTourLanguage(): string {
    return 'Vietnamese'; // Default language for Vietnam tours
  }

  // Get tour pricing information
  getTourPricingInfo(): string {
    if (this.tourInfo && this.tourInfo.tourId === 4) {
      // Vietnam Art & Culture Tour specific pricing
      return 'Package 1: 7-seater – $307/tour | 16-seater – $635/tour. Package 2: 7-seater – $42/tour | 16-seater – $35/tour. Full program: USD $296 per person.';
    }
    return 'Contact us for pricing information.';
  }

  // Get tour base price from tour service
  getTourBasePrice(): number {
    if (this.tourInfo && this.tourInfo.tourId === 4) {
      return 296; // USD $296 for Vietnam Art & Culture Tour
    }
    return 0;
  }

  // Get formatted tour base price
  getFormattedTourBasePrice(): string {
    const basePrice = this.getTourBasePrice();
    if (basePrice > 0) {
      return `$${basePrice.toFixed(2)}`;
    }
    return 'Contact for pricing';
  }

  // Get total tickets price in USD
  getTicketsTotalUSD(): number {
    return this.tourParticipants.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  }

  // Simulate tour data for demo purposes
  private simulateTourData(): void {
    // Simulate a realistic tour booking
    this.tourName = 'Vietnam Art & Culture Tour – This Is Home';
    this.tourImageUrl = '/city-image/da-nang.jpg'; // Use image from tour service
    this.tourDate = 'Saturday, September 6, 2025';
    this.tourSession = '8:45 AM';
    this.tourParticipants = [
      { type: 'shared7', name: 'Shared 7', price: 37, fee: 0, quantity: 2 },
      { type: 'shared16', name: 'Shared 16', price: 37, fee: 0, quantity: 1 }
    ];
    // Calculate total: (37 * 2 + 37 * 1) * 24500 = 2,715,000 VND
    this.tourTotalPrice = 2715000;
  }

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
      
      // Pass tour information to payment component
      const orderState = {
        tourId: this.tourInfo?.tourId || 4,
        tourName: this.tourName,
        imageUrl: this.tourImageUrl,
        selectedDate: this.tourDate,
        selectedSession: this.tourSession,
        participants: this.tourParticipants,
        totalPrice: this.tourTotalPrice
      };
      
      this.router.navigate(['/checkout/payment'], { state: orderState });
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