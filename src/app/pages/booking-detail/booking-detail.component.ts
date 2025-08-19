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

  // Calendar data
  currentMonth = 0;
  currentYear = new Date().getFullYear();
  selectedDate: Date | null = null;
  selectedSession: string | null = '16:00';
  
  // Available months (từ hiện tại đến 2 năm sau)
  availableMonths: MonthOption[] = [];
  
  // Available sessions (từ 7h đến 18h, mỗi giờ cách nhau 30 phút)
  availableSessions: string[] = [];
  currentSessionIndex = 18; // Index của 16:00 trong mảng sessions

  // Tickets
  tickets: TicketType[] = [
    { id: 'adult', name: 'Người lớn (16+)', price: 350000, bookingFee: 29500, quantity: 0 },
    { id: 'child', name: 'Trẻ em (3-15)', price: 285000, bookingFee: 29500, quantity: 0 },
    { id: 'family', name: 'Gói gia đình (tối đa 2 người lớn)', price: 995000, bookingFee: 29500, quantity: 0 },
    { id: 'group', name: 'Nhóm (tối thiểu 6 vé)', price: 309500, bookingFee: 29500, quantity: 0 },
    { id: 'premium', name: 'Premium - Ưu tiên vào cửa', price: 479500, bookingFee: 29500, quantity: 0 }
  ];

  // Add-on
  addOnPrice = 150000;
  addOnQuantity = 0;

  // Calendar days
  days: CalendarDay[] = [];

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
      'THG 1', 'THG 2', 'THG 3', 'THG 4', 'THG 5', 'THG 6',
      'THG 7', 'THG 8', 'THG 9', 'THG 10', 'THG 11', 'THG 12'
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

  selectMonth(monthIndex: number, year: number): void {
    this.currentMonth = monthIndex;
    this.currentYear = year;
    this.generateCalendar();
  }

  prevMonth(): void {
    const currentIndex = this.availableMonths.findIndex(m => 
      m.value === this.currentMonth && m.year === this.currentYear
    );
    
    if (currentIndex > 0) {
      const prevMonth = this.availableMonths[currentIndex - 1];
      this.currentMonth = prevMonth.value;
      this.currentYear = prevMonth.year;
      this.generateCalendar();
    }
  }

  nextMonth(): void {
    const currentIndex = this.availableMonths.findIndex(m => 
      m.value === this.currentMonth && m.year === this.currentYear
    );
    
    if (currentIndex < this.availableMonths.length - 1) {
      const nextMonth = this.availableMonths[currentIndex + 1];
      this.currentMonth = nextMonth.value;
      this.currentYear = nextMonth.year;
      this.generateCalendar();
    }
  }

  canGoPrevMonth(): boolean {
    const currentIndex = this.availableMonths.findIndex(m => 
      m.value === this.currentMonth && m.year === this.currentYear
    );
    return currentIndex > 0;
  }

  canGoNextMonth(): boolean {
    const currentIndex = this.availableMonths.findIndex(m => 
      m.value === this.currentMonth && m.year === this.currentYear
    );
    return currentIndex < this.availableMonths.length - 1;
  }

  getCurrentIndex(): number {
    return this.availableMonths.findIndex(m => 
      m.value === this.currentMonth && m.year === this.currentYear
    );
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

  getTicketQuantity(ticketId: string): number {
    const ticket = this.tickets.find(t => t.id === ticketId);
    return ticket?.quantity || 0;
  }

  onBookTour(): void {
    if (!this.selectedDate || !this.selectedSession) {
      alert('Vui lòng chọn ngày và giờ!');
      return;
    }

    if (this.bookingForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      // Gọi API tạo booking...
      console.log('Booking:', this.bookingForm.value, this.selectedDate, this.selectedSession);
      this.isSubmitting = false;
      alert('Đặt tour thành công!');
    }
  }

  generateAvailableSessions(): void {
    this.availableSessions = [];
    
    // Tạo sessions từ 7:00 đến 18:00, mỗi giờ cách nhau 30 phút
    for (let hour = 7; hour <= 18; hour++) {
      // Giờ chẵn (7:00, 8:00, 9:00, ...)
      this.availableSessions.push(`${hour.toString().padStart(2, '0')}:00`);
      
      // Giờ lẻ (7:30, 8:30, 9:30, ...) - trừ 18:30
      if (hour < 18) {
        this.availableSessions.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    
    // Set session mặc định là 16:00
    this.selectedSession = '16:00';
    this.currentSessionIndex = this.availableSessions.indexOf('16:00');
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
      this.selectedSession = this.availableSessions[this.currentSessionIndex];
    }
  }

  nextSession(): void {
    if (this.canGoNextSession()) {
      this.currentSessionIndex++;
      this.selectedSession = this.availableSessions[this.currentSessionIndex];
    }
  }

  getVisibleSessions(): string[] {
    // Hiển thị 6 sessions xung quanh session hiện tại
    const startIndex = Math.max(0, this.currentSessionIndex - 2);
    const endIndex = Math.min(this.availableSessions.length, startIndex + 6);
    return this.availableSessions.slice(startIndex, endIndex);
  }
}