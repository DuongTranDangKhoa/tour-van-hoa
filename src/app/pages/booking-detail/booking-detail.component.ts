import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tour } from '../../models/tour';
import { TourService } from '../../services/tour.service';

interface TicketType {
  id: string;
  name: string;
  price: number;
  bookingFee: number;
  quantity: number;
}

interface CalendarDay {
  day: string;
  availability: 'none' | 'low' | 'best';
  selected?: boolean;
  price?: number;
  disabled?: boolean;
}

interface MonthOption {
  value: number;
  label: string;
  year: number;
}

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
  showNotification = false;

  // Calendar data
  currentMonth = 0;
  currentYear = new Date().getFullYear();
  selectedDate: Date | null = null;
  selectedSession: string | null = '16:00';
  
  // Available months (từ hiện tại đến 2 năm sau)
  availableMonths: MonthOption[] = [];
  
  // Month navigation - hiển thị 3 tháng một lần
  visibleMonthStartIndex = 0;
  
  // Available sessions (từ 7h đến 18h, mỗi giờ cách nhau 30 phút)
  availableSessions: string[] = [];
  currentSessionIndex = 18; // Index của 16:00 trong mảng sessions

  // Tickets
  tickets: TicketType[] = [
    { id: 'adult', name: 'Shared 7 ', price: 37.00, bookingFee: 0, quantity: 0 },
    { id: 'child', name: 'Shared 16 ', price: 37.00, bookingFee: 0, quantity: 0 },
    { id: 'small-group', name: 'Private  7 ', price: 305.00, bookingFee: 0, quantity: 0 },
    { id: 'large-group', name: 'Private 16 ', price: 629.00, bookingFee: 0, quantity: 0 }
  ];

  // Ticket info visibility tracking
  visibleTicketInfo: Set<string> = new Set();

  // Add-on
  addOnPrice = 15.00;
  addOnQuantity = 0;

  // Calendar days
  days: CalendarDay[] = [];

  // Description processing methods
  getHighlights(): string[] {
    if (!this.tour?.description) return [];
    const description = this.tour.description;
    const highlightsMatch = description.match(/Highlights\s*\n\s*\n(.*?)(?=\n\s*\nGeneral Info|$)/s);
    if (highlightsMatch) {
      return highlightsMatch[1]
        .split('\n')
        .filter(line => line.trim() && line.includes('🌏') || line.includes('☕') || line.includes('🏺') || line.includes('🪵') || line.includes('🏮') || line.includes('🏖️') || line.includes('🍲') || line.includes('🎁'))
        .map(line => line.trim());
    }
    return [];
  }

  getGeneralInfo(): string[] {
    if (!this.tour?.description) return [];
    const description = this.tour.description;
    const generalInfoMatch = description.match(/General Info\s*\n\s*\n(.*?)(?=\n\s*\nFull Description|$)/s);
    if (generalInfoMatch) {
      return generalInfoMatch[1]
        .split('\n')
        .filter(line => line.trim() && (line.includes('📅') || line.includes('⏳') || line.includes('📍') || line.includes('👥') || line.includes('🚐') || line.includes('💰') || line.includes('🏨') || line.includes('🍴') || line.includes('🦽') || line.includes('📌') || line.includes('❌') || line.includes('📲')))
        .map(line => line.trim());
    }
    return [];
  }

  getFullDescription(): string {
    if (!this.tour?.description) return '';
    const description = this.tour.description;
    const fullDescMatch = description.match(/Full Description\s*\n\s*\n(.*?)(?=\n\s*🌿|$)/s);
    if (fullDescMatch) {
      return fullDescMatch[1].trim();
    }
    return '';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      customerName: ['', [Validators.required]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required]],
      numberOfPeople: [1, [Validators.min(1)]],
      paymentMethod: ['bank_transfer'],
      specialRequests: ['']
    });
  }

  ngOnInit(): void {
    this.generateAvailableMonths();
    this.generateAvailableSessions();
    const tourId = this.route.snapshot.paramMap.get('id');
    if (tourId) {
      this.tourService.getTourById(parseInt(tourId)).subscribe(tour => {
        if (tour) {
          this.tour = tour;
          this.generateCalendar();
        }
      });
    }
  }

  generateAvailableMonths(): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    this.availableMonths = [];
    
    // Tạo danh sách các tháng từ hiện tại đến 2 năm sau
    for (let year = currentYear; year <= currentYear + 2; year++) {
      const startMonth = year === currentYear ? currentMonth : 0;
      const endMonth = year === currentYear + 2 ? 11 : 11;
      
      for (let month = startMonth; month <= endMonth; month++) {
        this.availableMonths.push({
          value: month,
          label: this.getMonthLabel(month, year),
          year: year
        });
      }
    }
    
    // Set tháng hiện tại
    this.currentMonth = currentMonth;
    this.currentYear = currentYear;
  }

  getMonthLabel(month: number, year: number): string {
    const monthNames = [
      '1', '2', '3', '4', '5', '6',
      '7', '8', '9', '10', '11', '12'
    ];
    return `${monthNames[month]} ${year}`;
  }

  generateCalendar(): void {
    const year = this.currentYear;
    const month = this.currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    this.days = [];
    for (let i = 0; i < startingDay; i++) {
      this.days.push({ day: '', availability: 'none' });
    }

    // Lấy ngày hiện tại để so sánh
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00 để so sánh chính xác

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const availability = Math.random() > 0.3 ? 'best' : 'low';
      const price = Math.floor(50 + Math.random() * 50); // Random price for demo
      
      // Kiểm tra xem ngày này đã qua chưa
      const isPastDate = date < today;

      this.days.push({
        day: day.toString(),
        availability: availability,
        selected: false,
        price: price,
        disabled: isPastDate
      });
    }
  }

  prevMonth(): void {
    if (this.visibleMonthStartIndex >= 3) {
      this.visibleMonthStartIndex -= 3;
      // Không thay đổi currentMonth và currentYear, chỉ thay đổi visible months
      this.generateCalendar();
    }
  }

  nextMonth(): void {
    if (this.visibleMonthStartIndex + 3 < this.availableMonths.length) {
      this.visibleMonthStartIndex += 3;
      // Không thay đổi currentMonth và currentYear, chỉ thay đổi visible months
      this.generateCalendar();
    }
  }

  canGoPrevMonth(): boolean {
    return this.visibleMonthStartIndex >= 3;
  }

  canGoNextMonth(): boolean {
    return this.visibleMonthStartIndex + 3 < this.availableMonths.length;
  }

  getVisibleMonths(): MonthOption[] {
    return this.availableMonths.slice(this.visibleMonthStartIndex, this.visibleMonthStartIndex + 3);
  }

  selectMonth(monthIndex: number, year: number): void {
    this.currentMonth = monthIndex;
    this.currentYear = year;
    
    // Tự động điều chỉnh visibleMonthStartIndex để tháng được chọn luôn hiển thị
    const selectedMonthIndex = this.availableMonths.findIndex(m => 
      m.value === monthIndex && m.year === year
    );
    
    if (selectedMonthIndex !== -1) {
      // Tính toán vị trí mới để tháng được chọn nằm ở giữa (index 1) của 3 tháng hiển thị
      this.visibleMonthStartIndex = Math.max(0, selectedMonthIndex - 1);
      
      // Đảm bảo không vượt quá giới hạn
      if (this.visibleMonthStartIndex + 3 > this.availableMonths.length) {
        this.visibleMonthStartIndex = Math.max(0, this.availableMonths.length - 3);
      }
    }
    
    this.generateCalendar();
  }

  selectDate(day: CalendarDay): void {
    if (day.day && !day.disabled) {
      this.days.forEach(d => d.selected = false);
      day.selected = true;
      this.selectedDate = new Date(this.currentYear, this.currentMonth, parseInt(day.day));
    }
  }

  selectSession(session: string): void {
    this.selectedSession = session;
  }

  adjustQuantity(ticketId: string, change: number): void {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      const newQuantity = ticket.quantity + change;
      if (newQuantity >= 0) {
        ticket.quantity = newQuantity;
      }
    }
  }

  adjustAddOn(change: number): void {
    this.addOnQuantity = Math.max(0, this.addOnQuantity + change);
  }

  getTotalPrice(): number {
    let total = 0;
    this.tickets.forEach(ticket => {
      total += (ticket.price + ticket.bookingFee) * ticket.quantity;
    });
    total += this.addOnPrice * this.addOnQuantity;
    return total;
  }

  // Convert USD to VND (approximate rate: 1 USD = 24,500 VND)
  getTotalPriceVND(): number {
    return Math.round(this.getTotalPrice() * 24500);
  }

  getTicketQuantity(ticketId: string): number {
    const ticket = this.tickets.find(t => t.id === ticketId);
    return ticket?.quantity || 0;
  }

  onBookTour(): void {
    if (!this.selectedDate || !this.selectedSession) {
      alert('Vui lòng chọn ngày và giờ!');
      return;
    }

    if (!this.isSubmitting) {
      this.isSubmitting = true;
      const orderState = {
        tourId: this.tour?.id || 0,
        tourName: this.tour?.name || 'Tour',
        imageUrl: this.tour?.imageUrl,
        selectedDate: this.selectedDate.toDateString(),
        selectedSession: this.selectedSession,
        participants: this.tickets.map(t => ({
          type: t.id,
          name: t.name,
          price: t.price,
          fee: t.bookingFee,
          quantity: t.quantity
        })).filter(t => t.quantity > 0),
        addOn: this.addOnQuantity > 0 ? { name: 'Photo Opportunity', price: this.addOnPrice, quantity: this.addOnQuantity } : undefined,
        totalPrice: this.getTotalPriceVND()
      };

      this.router.navigate(['/checkout/details'], { state: orderState });
      this.isSubmitting = false;
    }
  }

  generateAvailableSessions(): void {
    this.availableSessions = [];
    
    // Chỉ có 1 khung thời gian là 8:45
    this.availableSessions.push('08:45');
    
    // Set session mặc định là 8:45
    this.selectedSession = '08:45';
    this.currentSessionIndex = 0;
  }

  canGoPrevSession(): boolean {
    return this.currentSessionIndex > 0;
  }

  canGoNextSession(): boolean {
    return this.currentSessionIndex < this.availableSessions.length - 1;
  }

  prevSession(): void {
    if (this.canGoPrevSession()) {
      this.currentSessionIndex--;
      // Không thay đổi selectedSession, chỉ để scroll qua các sessions
    }
  }

  nextSession(): void {
    if (this.canGoNextSession()) {
      this.currentSessionIndex++;
      // Không thay đổi selectedSession, chỉ để scroll qua các sessions
    }
  }

  getVisibleSessions(): string[] {
    // Hiển thị 6 sessions xung quanh session hiện tại
    const startIndex = Math.max(0, this.currentSessionIndex - 2);
    const endIndex = Math.min(this.availableSessions.length, startIndex + 6);
    return this.availableSessions.slice(startIndex, endIndex);
  }

  openImageGallery(): void {
    if (this.tour) {
      this.router.navigate(['/tour', this.tour.id, 'gallery']);
    }
  }

  toggleTicketInfo(ticketId: string): void {
    if (this.visibleTicketInfo.has(ticketId)) {
      this.visibleTicketInfo.delete(ticketId);
    } else {
      this.visibleTicketInfo.add(ticketId);
    }
  }

  isTicketInfoVisible(ticketId: string): boolean {
    return this.visibleTicketInfo.has(ticketId);
  }

  hasSelectedTickets(): boolean {
    return this.tickets.some(ticket => ticket.quantity > 0);
  }

  scrollToBooking(): void {
    const bookingSection = document.querySelector('.booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onScroll(): void {
    const bookingWidget = document.querySelector('.booking-widget');
    if (bookingWidget) {
      const rect = bookingWidget.getBoundingClientRect();
      // Hiển thị notification khi booking widget không còn trong viewport
      this.showNotification = rect.bottom < 0;
    }
  }
}