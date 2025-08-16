# Tính năng Đặt Tour - Tour Văn Hóa

## Tổng quan
Đã thêm tính năng đặt tour mới với giao diện tương tự như trang web Fever, **BAO GỒM ĐẦY ĐỦ THÔNG TIN NHẬP VÀO** như popup ban đầu, thay thế cho popup đặt tour cũ. **ĐÃ TÍCH HỢP API THỰC SỰ** để tạo booking.

## Các thay đổi chính

### 1. Component mới
- **BookingDetailComponent**: Trang đặt tour chi tiết với UI hiện đại
- Đường dẫn: `src/app/pages/booking-detail/`
- **ĐẦY ĐỦ FORM THÔNG TIN** như popup cũ
- **TÍCH HỢP API**: Gọi `POST /bookings` để tạo booking thực sự

### 2. Cập nhật Tour Card
- Nút "Đặt tour ngay" giờ sẽ navigate đến trang đặt tour thay vì hiển thị popup
- Sử dụng Angular Router để chuyển hướng

### 3. Route mới
- Thêm route: `/tour/:id/book`
- Ví dụ: `/tour/1/book` để đặt tour có ID = 1

### 4. Giao diện
- **Header**: Logo, navigation, search bar, user actions
- **Left Panel**: 
  - Hình ảnh tour (ảnh chính + grid ảnh nhỏ)
  - Thông tin chi tiết tour
  - Mô tả và thông tin chung
  - Chương trình tour
- **Right Panel (Booking Widget)**:
  - **THÔNG TIN KHÁCH HÀNG ĐẦY ĐỦ**:
    - Họ và tên, Email, Số điện thoại
    - CMND/CCCD, Ngày sinh, Giới tính, Địa chỉ
  - **CHI TIẾT ĐẶT TOUR**:
    - Số người, Phương thức thanh toán
    - Ngày khởi hành, Ngày trở về
    - Yêu cầu đặc biệt
  - **THÔNG TIN LIÊN HỆ KHẨN CẤP**:
    - Tên người liên hệ, Số điện thoại, Mối quan hệ
  - **TÓM TẮT TOUR VÀ THANH TOÁN**:
    - Thông tin tour, giá gốc, tổng tiền
    - Đặt cọc (20%), số tiền còn lại

## Cách sử dụng

### 1. Từ trang chủ
- Click vào nút "Đặt tour ngay" trên bất kỳ tour card nào
- Sẽ được chuyển hướng đến trang đặt tour chi tiết

### 2. Trang đặt tour
- **Điền thông tin khách hàng** (bắt buộc):
  - Họ và tên, Email, Số điện thoại
- **Điền thông tin bổ sung** (tùy chọn):
  - CMND/CCCD, Ngày sinh, Giới tính, Địa chỉ
- **Chi tiết tour**:
  - Số người (1-20), Phương thức thanh toán
  - Ngày khởi hành, Ngày trở về
  - Yêu cầu đặc biệt
- **Thông tin liên hệ khẩn cấp** (tùy chọn)
- **Xem tổng giá và đặt cọc**
- **Click "Tiếp tục"** để hoàn tất

### 3. Quy trình API
1. **Validation**: Kiểm tra form hợp lệ
2. **API Call**: Gọi `POST /bookings` với dữ liệu booking
3. **Loading State**: Hiển thị "Đang xử lý..." và disable button
4. **Success**: Hiển thị thông báo thành công với mã booking
5. **Navigation**: Quay về trang chủ
6. **Error Handling**: Xử lý các lỗi khác nhau (400, 500, etc.)

## Cấu trúc file

```
src/app/pages/booking-detail/
├── booking-detail.component.ts      # Logic component với Reactive Forms + API
├── booking-detail.component.html    # Template HTML với đầy đủ form fields
├── booking-detail.component.scss    # Styles CSS
└── booking-detail.component.spec.ts # Unit tests

src/app/services/
├── booking.service.ts               # Service gọi API bookings
└── tour.service.ts                  # Service lấy thông tin tour
```

## Responsive Design
- Giao diện responsive cho mobile và tablet
- Booking widget sẽ không sticky trên màn hình nhỏ
- Layout thay đổi từ 2 cột sang 1 cột trên mobile
- Form fields stack vertically trên mobile

## Tính năng kỹ thuật
- **Reactive Forms**: Sử dụng FormBuilder và FormGroup
- **Validation**: Required fields, email validation, min/max values
- **Two-way data binding**: Form controls và template
- **Dynamic routing**: Với parameters
- **Service injection**: TourService + BookingService
- **TypeScript interfaces**: Type safety với CreateBookingRequest
- **Error handling**: Hiển thị lỗi validation + API errors
- **Loading states**: Disable button và hiển thị spinner khi submit
- **API Integration**: Gọi POST /bookings thực sự

## Form Validation
- **Bắt buộc**: Họ tên, Email, Số điện thoại, Số người, Ngày khởi hành, Ngày trở về
- **Email**: Format email hợp lệ
- **Số người**: Từ 1-20 người
- **Ngày**: Ngày khởi hành phải trong tương lai
- **Hiển thị lỗi**: Dưới mỗi field có lỗi

## API Integration
- **Endpoint**: `POST /bookings`
- **Request Body**: CreateBookingRequest interface
- **Response**: BookingResponse với success/error
- **Error Handling**: 400 (Bad Request), 500 (Server Error), etc.
- **Loading State**: Disable button và hiển thị spinner
- **Success Flow**: Hiển thị mã booking và navigate

## Lưu ý
- Component sử dụng standalone components (Angular 19+)
- Tương thích với Angular Material (nếu muốn thêm sau)
- Có thể mở rộng để thêm:
  - Payment gateway integration
  - Email confirmation
  - Booking management system
  - User authentication
  - Admin panel

## So sánh với popup cũ
| Tính năng | Popup cũ | Trang mới |
|-----------|----------|-----------|
| Thông tin khách hàng | ✅ Đầy đủ | ✅ Đầy đủ |
| Chi tiết tour | ✅ Đầy đủ | ✅ Đầy đủ |
| Liên hệ khẩn cấp | ✅ Đầy đủ | ✅ Đầy đủ |
| Tóm tắt thanh toán | ✅ Đầy đủ | ✅ Đầy đủ |
| Chọn ngày/giờ | ✅ | ❌ Đã xóa |
| Chọn khu vực | ❌ | ❌ Đã xóa |
| API Integration | ❌ | ✅ POST /bookings |
| Loading States | ❌ | ✅ Spinner + Disable |
| Error Handling | ❌ | ✅ API Errors |
| UI/UX | Cơ bản | Hiện đại, tương tự Fever |
| Responsive | Hạn chế | ✅ Tốt |
| Validation | ✅ | ✅ Cải tiến |
| Navigation | Popup | Trang riêng biệt |
