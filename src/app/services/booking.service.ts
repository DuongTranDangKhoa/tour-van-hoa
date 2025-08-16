import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  idCard: number;
  dateOfBirth: string; // Đổi thành string: "25/11/2002"
  gender: string;
  address: string;
  numberOfPeople: number;
  departureDate: string;
  returnDate: string;
  specialRequests: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  paymentInfo_paymentMethod: string;
  paymentInfo_totalAmount: number;
  paymentInfo_depositAmount: number;
  paymentInfo_remainingAmount: number;
  created_at: string; // Đổi thành string: "25/11/2024"
  updated_at: string; // Đổi thành string: "25/11/2024"
}

export interface CreateBookingRequest {
  fullName: string;
  email: string;
  phone: string;
  idCard: number;
  dateOfBirth: string; // Đổi thành string
  gender: string;
  address: string;
  numberOfPeople: number;
  departureDate: string;
  returnDate: string;
  specialRequests: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  paymentInfo_paymentMethod: string;
  paymentInfo_totalAmount: number;
  paymentInfo_depositAmount: number;
  paymentInfo_remainingAmount: number;
}

export interface UpdateBookingRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  idCard?: number;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  numberOfPeople?: number;
  departureDate?: string;
  returnDate?: string;
  specialRequests?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  paymentInfo_paymentMethod?: string;
  paymentInfo_totalAmount?: number;
  paymentInfo_depositAmount?: number;
  paymentInfo_remainingAmount?: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: Booking;
}

export interface BookingListResponse {
  success?: boolean;
  data?: Booking[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  // MockAPI có thể trả về array trực tiếp
  [key: string]: any;
}

// Thêm interface mới cho MockAPI response
export interface MockAPIResponse extends Array<Booking> {
  // Extend Array<Booking> để hỗ trợ cả array và object
}

export interface BookingParams {
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // 1. GET /bookings - Lấy danh sách tất cả bookings
  getBookings(params?: BookingParams): Observable<BookingListResponse | MockAPIResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<BookingListResponse | MockAPIResponse>(`${this.apiUrl}/bookings`, { params: httpParams });
  }

  // 2. GET /bookings/:id - Lấy chi tiết booking theo ID
  getBookingById(id: string): Observable<{ success: boolean; data: Booking }> {
    return this.http.get<{ success: boolean; data: Booking }>(`${this.apiUrl}/bookings/${id}`);
  }

  // 3. POST /bookings - Tạo booking mới
  createBooking(bookingData: CreateBookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/bookings`, bookingData);
  }

  // 4. PUT /bookings/:id - Cập nhật booking
  updateBooking(id: string, bookingData: UpdateBookingRequest): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.put<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/bookings/${id}`, bookingData);
  }

  // 5. DELETE /bookings/:id - Xóa booking
  deleteBooking(id: string): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.delete<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/bookings/${id}`);
  }

  // Helper methods sử dụng các API cơ bản trên
  getBookingsByCustomer(email: string): Observable<BookingListResponse> {
    // MockAPI hỗ trợ filtering, nên có thể dùng query parameter
    return this.getBookings({ email });
  }

  getBookingsByPaymentMethod(paymentMethod: string): Observable<BookingListResponse> {
    return this.getBookings({ paymentInfo_paymentMethod: paymentMethod });
  }

  // Cập nhật trạng thái booking (sử dụng PUT /bookings/:id)
  updateBookingStatus(id: string, status: string, reason?: string): Observable<{ success: boolean; message: string; data: any }> {
    const updateData: UpdateBookingRequest = {
      // Thêm field status nếu cần
      // status: status,
      // reason: reason
    };
    return this.updateBooking(id, updateData);
  }

  // Hủy booking (sử dụng DELETE /bookings/:id)
  cancelBooking(id: string, reason: string): Observable<{ success: boolean; message: string; data: any }> {
    return this.deleteBooking(id);
  }
}
