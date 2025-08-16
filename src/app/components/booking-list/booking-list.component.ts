import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingService, Booking, BookingListResponse, MockAPIResponse } from '../../services/booking.service';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss'
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  isLoading: boolean = false;
  error: string = '';
  
  // Filter properties
  searchQuery: string = '';
  selectedPaymentMethod: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  // Math object for template
  Math = Math;

  // Test method để kiểm tra binding
  testBinding() {
    console.log('Test binding - isLoading:', this.isLoading);
    console.log('Test binding - error:', this.error);
    console.log('Test binding - bookings length:', this.bookings.length);
  }

  constructor(private bookingService: BookingService) {
    console.log('BookingListComponent constructor called');
    console.log('Initial isLoading state:', this.isLoading);
  }

  ngOnInit() {
    console.log('BookingListComponent ngOnInit called');
    this.loadBookings();
  }

  loadBookings() {
    console.log('loadBookings called, setting isLoading to true');
    this.isLoading = true;
    this.error = '';

    // Safety timeout để đảm bảo isLoading không bị stuck
    const safetyTimeout = setTimeout(() => {
      if (this.isLoading) {
        console.warn('Safety timeout triggered, forcing isLoading to false');
        this.isLoading = false;
        this.error = 'Timeout loading data. Vui lòng thử lại.';
      }
    }, 10000); // 10 giây timeout

    this.bookingService.getBookings({
      page: this.currentPage,
      limit: this.itemsPerPage
    }).subscribe({
      next: (response: BookingListResponse | MockAPIResponse) => {
        clearTimeout(safetyTimeout); // Clear timeout nếu thành công
        console.log('API Response:', response); // Debug log
        
        try {
          // MockAPI có thể trả về array trực tiếp hoặc object có data
          let bookingsData: Booking[] = [];
          let totalCount = 0;
          
          if (Array.isArray(response)) {
            // Nếu response là array trực tiếp (MockAPIResponse)
            bookingsData = response;
            totalCount = response.length;
          } else if (response && typeof response === 'object' && 'data' in response) {
            // Nếu response có property 'data'
            const responseData = response.data;
            if (Array.isArray(responseData)) {
              bookingsData = responseData;
              totalCount = response.pagination?.total || responseData.length;
            }
          } else if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Nếu response có format {success: true, data: [...], pagination: {...}}
            const responseData = response.data;
            if (Array.isArray(responseData)) {
              bookingsData = responseData;
              totalCount = response.pagination?.total || responseData.length;
            }
          } else {
            // Fallback: kiểm tra xem có property nào là array không
            if (response && typeof response === 'object') {
              const arrayKeys = Object.keys(response).filter(key => {
                const value = response[key as keyof typeof response];
                return Array.isArray(value);
              });
              
              if (arrayKeys.length > 0) {
                const firstArrayKey = arrayKeys[0];
                const arrayData = response[firstArrayKey as keyof typeof response];
                if (Array.isArray(arrayData)) {
                  bookingsData = arrayData as Booking[];
                  totalCount = arrayData.length;
                }
              }
            }
          }
          
          if (bookingsData.length > 0) {
            this.bookings = bookingsData;
            this.filteredBookings = bookingsData;
            this.totalItems = totalCount;
            console.log('Bookings loaded successfully:', bookingsData.length, 'items');
          } else {
            this.bookings = [];
            this.filteredBookings = [];
            this.totalItems = 0;
            console.log('No bookings found');
          }
        } catch (parseError) {
          console.error('Error parsing API response:', parseError);
          this.error = 'Lỗi xử lý dữ liệu từ server. Vui lòng thử lại.';
          this.bookings = [];
          this.filteredBookings = [];
          this.totalItems = 0;
        } finally {
          this.isLoading = false;
        }
      },
      error: (error) => {
        clearTimeout(safetyTimeout); // Clear timeout nếu có lỗi
        console.error('Error loading bookings:', error);
        this.error = 'Không thể tải danh sách đặt tour. Vui lòng thử lại.';
        this.bookings = [];
        this.filteredBookings = [];
        this.totalItems = 0;
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onPaymentMethodChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.bookings;

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.fullName.toLowerCase().includes(query) ||
        booking.email.toLowerCase().includes(query) ||
        booking.phone.toLowerCase().includes(query) ||
        booking.address.toLowerCase().includes(query)
      );
    }

    // Payment method filter
    if (this.selectedPaymentMethod) {
      filtered = filtered.filter(booking => 
        booking.paymentInfo_paymentMethod === this.selectedPaymentMethod
      );
    }

    this.filteredBookings = filtered;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadBookings();
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const pages: number[] = [];
    
    // Show max 5 page numbers around current page
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(totalPages, this.currentPage + 2);
    
    // Adjust start and end to always show 5 pages if possible
    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else {
        start = Math.max(1, end - 4);
      }
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Xử lý date string format "dd/mm/yyyy"
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    // Nếu dateString đã là format "dd/mm/yyyy" thì return luôn
    if (dateString.includes('/')) {
      return dateString;
    }
    
    // Nếu là timestamp hoặc format khác, convert về "dd/mm/yyyy"
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return nguyên gốc nếu không parse được
      }
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString; // Return nguyên gốc nếu có lỗi
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getPaymentMethodLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'bank_transfer': 'Chuyển khoản',
      'credit_card': 'Thẻ tín dụng',
      'cash': 'Tiền mặt'
    };
    return labels[method] || method;
  }

  getGenderLabel(gender: string): string {
    const labels: { [key: string]: string } = {
      'male': 'Nam',
      'female': 'Nữ',
      'other': 'Khác'
    };
    return labels[gender] || gender;
  }

  viewBookingDetails(booking: Booking) {
    // TODO: Implement modal or navigation to view details
    console.log('View booking details:', booking);
  }

  editBooking(booking: Booking) {
    // TODO: Implement edit functionality
    console.log('Edit booking:', booking);
  }

  deleteBooking(booking: Booking) {
    if (confirm(`Bạn có chắc chắn muốn xóa đặt tour của ${booking.fullName}?`)) {
      this.bookingService.deleteBooking(booking.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadBookings(); // Reload the list
            alert('Xóa đặt tour thành công');
          } else {
            alert('Không thể xóa đặt tour: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error deleting booking:', error);
          alert('Không thể xóa đặt tour. Vui lòng thử lại.');
        }
      });
    }
  }
}
