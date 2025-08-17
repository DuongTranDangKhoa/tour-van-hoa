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
  quantity: number; // Thêm quantity
}

interface CalendarDay {
  day: string;
  availability: 'none' | 'low' | 'best';
  selected?: boolean;
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
  currentMonth = 1;
  selectedDate: Date | null = null;
  selectedSession: string | null = '16:00';

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

  generateCalendar(): void {
    const year = 2025;
    const month = this.currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    this.days = [];
    for (let i = 0; i < startingDay; i++) {
      this.days.push({ day: '', availability: 'none' });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const availability = Math.random() > 0.3 ? 'best' : 'low';

      this.days.push({
        day: day.toString(),
        availability: availability,
        selected: false
      });
    }
  }

  selectMonth(monthIndex: number): void {
    this.currentMonth = monthIndex;
    this.generateCalendar();
  }

  prevMonth(): void {
    this.currentMonth = (this.currentMonth - 1 + 3) % 3;
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = (this.currentMonth + 1) % 3;
    this.generateCalendar();
  }

  selectDate(day: CalendarDay): void {
    if (day.day) {
      this.days.forEach(d => d.selected = false);
      day.selected = true;
      this.selectedDate = new Date(2025, this.currentMonth, parseInt(day.day));
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
}