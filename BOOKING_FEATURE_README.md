# Tính năng Đặt Tour - Tour Văn Hóa

## Tổng quan
Đã thêm tính năng đặt tour mới với giao diện tương tự như trang web Fever, **BAO GỒM ĐẦY ĐỦ THÔNG TIN NHẬP VÀO** như popup ban đầu, thay thế cho popup đặt tour cũ. **ĐÃ TÍCH HỢP API THỰC SỰ** để tạo booking. **LAYOUT MỚI**: Phần trên chiếm 100% chiều rộng, phần dưới mới chia 2 cột.

## Các thay đổi chính

### 1. Component mới
- **BookingDetailComponent**: Trang đặt tour chi tiết với UI hiện đại
- Đường dẫn: `src/app/pages/booking-detail/`
- **ĐẦY ĐỦ FORM THÔNG TIN** như popup cũ
- **TÍCH HỢP API**: Gọi `POST /bookings` để tạo booking thực sự
- **LAYOUT MỚI**: Phần trên 100% chiều rộng, phần dưới chia 2 cột

### 2. Cập nhật Tour Card
- Nút "Đặt tour ngay" giờ sẽ navigate đến trang đặt tour thay vì hiển thị popup
- Sử dụng Angular Router để chuyển hướng

### 3. Route mới
- Thêm route: `/tour/:id/book`
- Ví dụ: `/tour/1/book` để đặt tour có ID = 1

### 4. Giao diện mới
- **Header**: Logo, navigation, search bar, user actions
- **Phần trên (100% chiều rộng)**:
  - Hình ảnh tour (ảnh chính + grid ảnh nhỏ)
  - Thông tin chi tiết tour (tên, rating, actions)
- **Phần dưới (chia 2 cột)**:
  - **Left Panel**: Thông tin tour chi tiết
    - Mô tả tour
    - Thông tin chung (điểm đến, thời gian, độ khó, loại tour)
    - Chương trình tour (điểm nổi bật)
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
- **Phần trên (100% chiều rộng)**:
  - Xem hình ảnh tour và thông tin cơ bản
  - Rating, tên tour, các action buttons
- **Phần dưới (chia 2 cột)**:
  - **Left**: Đọc thông tin chi tiết tour
  - **Right**: Điền form đặt tour

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
├── booking-detail.component.html    # Template HTML với layout mới
├── booking-detail.component.scss    # Styles CSS cho layout mới
└── booking-detail.component.spec.ts # Unit tests

src/app/services/
├── booking.service.ts               # Service gọi API bookings
└── tour.service.ts                  # Service lấy thông tin tour
```

## Responsive Design
- Giao diện responsive cho mobile và tablet
- **Phần trên**: Luôn chiếm 100% chiều rộng trên mọi thiết bị
- **Phần dưới**: Chuyển từ 2 cột sang 1 cột trên mobile
- Booking widget sẽ không sticky trên màn hình nhỏ
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
- **Layout Grid**: CSS Grid để chia layout 2 cột

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

## Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                    HEADER (100%)                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              PHẦN TRÊN (100% CHIỀU RỘNG)               │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              HÌNH ẢNH TOUR                          │ │
│  │  ┌─────────────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │ │
│  │  │   Ảnh chính  │ │ Ảnh │ │ Ảnh │ │ Ảnh │ │ Ảnh │   │ │
│  │  │             │ │  1  │ │  2  │ │  3  │ │  4  │   │ │
│  │  └─────────────┘ └─────┘ └─────┘ └─────┘ └─────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              THÔNG TIN TOUR                         │ │
│  │  Tên tour + Rating + Action buttons                 │ │
│  └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              PHẦN DƯỚI (CHIA 2 CỘT)                    │
│                                                         │
│  ┌─────────────────────┐ ┌─────────────────────────────┐ │
│  │                     │ │                             │ │
│  │   LEFT PANEL        │ │      RIGHT PANEL            │ │
│  │   (Tour Info)       │ │    (Booking Widget)         │ │
│  │                     │ │                             │ │
│  │  • Mô tả            │ │  • Thông tin khách hàng     │ │
│  │  • Thông tin chung  │ │  • Chi tiết đặt tour        │ │
│  │  • Chương trình     │ │  • Liên hệ khẩn cấp         │ │
│  │                     │ │  • Tóm tắt + Thanh toán    │ │
│  │                     │ │  • Button "Tiếp tục"        │ │
│  └─────────────────────┘ └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

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
| Layout | Popup nhỏ | **Phần trên 100% + Phần dưới 2 cột** |
