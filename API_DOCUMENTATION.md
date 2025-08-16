# API Documentation - Tour Văn Hóa

## 📋 Tổng quan

API này được thiết kế để quản lý việc đặt tour du lịch. Danh sách tours được để cứng trong frontend, chỉ cần lưu thông tin đặt tour của khách hàng.

## 🔗 Base URL

- **Development:** `http://localhost:3000/api`
- **Production:** `https://api.tourvanhoa.com/api`

## 📚 Endpoints

### 1. Tạo Booking Mới

**POST** `/bookings`

**Mô tả:** Tạo một booking mới cho tour du lịch

**Request Body:**
```json
{
  "tourId": 1,
  "customerInfo": {
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@email.com",
    "phone": "0123456789",
    "idCard": "123456789012",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "address": "123 Đường ABC, Quận 1, TP.HCM"
  },
  "bookingDetails": {
    "numberOfPeople": 2,
    "departureDate": "2024-12-25",
    "returnDate": "2024-12-27",
    "specialRequests": "Cần xe đưa đón từ sân bay",
    "emergencyContact": {
      "name": "Nguyễn Thị B",
      "phone": "0987654321",
      "relationship": "Vợ"
    }
  },
  "paymentInfo": {
    "paymentMethod": "bank_transfer",
    "totalAmount": 5000000,
    "depositAmount": 1000000,
    "remainingAmount": 4000000
  }
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đặt tour thành công",
  "data": {
    "bookingId": "BK20241216001",
    "status": "pending",
    "paymentUrl": "https://payment.example.com/pay/BK20241216001",
    "expiresAt": "2024-12-17T23:59:59Z"
  }
}
```

**Response Error (400/500):**
```json
{
  "success": false,
  "message": "Lỗi validation hoặc server error",
  "errors": [
    "Email không hợp lệ",
    "Số điện thoại không đúng định dạng"
  ]
}
```

### 2. Lấy Danh Sách Bookings

**GET** `/bookings`

**Mô tả:** Lấy danh sách bookings với phân trang và filter

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Trạng thái booking (pending, confirmed, cancelled, completed) |
| customerEmail | string | No | Email khách hàng |
| tourId | number | No | ID của tour |
| startDate | string | No | Ngày bắt đầu (YYYY-MM-DD) |
| endDate | string | No | Ngày kết thúc (YYYY-MM-DD) |
| page | number | No | Trang hiện tại (mặc định: 1) |
| limit | number | No | Số lượng item mỗi trang (mặc định: 10) |

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "BK20241216001",
      "tourId": 1,
      "tourName": "Khám phá Sapa - Nóc nhà Đông Dương",
      "customerInfo": {
        "fullName": "Nguyễn Văn A",
        "email": "nguyenvana@email.com",
        "phone": "0123456789"
      },
      "bookingDetails": {
        "numberOfPeople": 2,
        "departureDate": "2024-12-25",
        "returnDate": "2024-12-27"
      },
      "status": "pending",
      "totalAmount": 5000000,
      "createdAt": "2024-12-16T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 3. Lấy Chi Tiết Booking

**GET** `/bookings/{id}`

**Mô tả:** Lấy thông tin chi tiết của một booking

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | ID của booking |

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "BK20241216001",
    "tourId": 1,
    "tourName": "Khám phá Sapa - Nóc nhà Đông Dương",
    "customerInfo": {
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@email.com",
      "phone": "0123456789",
      "idCard": "123456789012",
      "dateOfBirth": "1990-01-01",
      "gender": "male",
      "address": "123 Đường ABC, Quận 1, TP.HCM"
    },
    "bookingDetails": {
      "numberOfPeople": 2,
      "departureDate": "2024-12-25",
      "returnDate": "2024-12-27",
      "specialRequests": "Cần xe đưa đón từ sân bay",
      "emergencyContact": {
        "name": "Nguyễn Thị B",
        "phone": "0987654321",
        "relationship": "Vợ"
      }
    },
    "paymentInfo": {
      "paymentMethod": "bank_transfer",
      "totalAmount": 5000000,
      "depositAmount": 1000000,
      "remainingAmount": 4000000
    },
    "status": "pending",
    "createdAt": "2024-12-16T10:30:00Z",
    "updatedAt": "2024-12-16T10:30:00Z"
  }
}
```

### 4. Cập Nhật Trạng Thái Booking

**PUT** `/bookings/{id}/status`

**Mô tả:** Cập nhật trạng thái của booking (admin only)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | ID của booking |

**Request Body:**
```json
{
  "status": "confirmed",
  "reason": "Khách hàng đã thanh toán đầy đủ",
  "adminNote": "Xác nhận booking thành công"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái thành công",
  "data": {
    "id": "BK20241216001",
    "status": "confirmed",
    "updatedAt": "2024-12-16T14:30:00Z"
  }
}
```

### 5. Hủy Booking

**DELETE** `/bookings/{id}`

**Mô tả:** Hủy một booking

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | ID của booking |

**Request Body:**
```json
{
  "reason": "Khách hàng thay đổi kế hoạch",
  "refundRequest": true
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Hủy booking thành công",
  "data": {
    "id": "BK20241216001",
    "status": "cancelled",
    "refundProcessed": false
  }
}
```

### 6. Lấy Bookings Theo Customer

**GET** `/bookings/customer/{email}`

**Mô tả:** Lấy tất cả bookings của một khách hàng

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | Email của khách hàng |

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "BK20241216001",
      "tourName": "Khám phá Sapa",
      "status": "confirmed",
      "departureDate": "2024-12-25",
      "totalAmount": 5000000
    }
  ]
}
```

## 🗄️ Cấu trúc Database

### Bảng `bookings`
```sql
CREATE TABLE bookings (
  id VARCHAR(20) PRIMARY KEY,
  tour_id INT NOT NULL,
  customer_full_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_id_card VARCHAR(20),
  customer_date_of_birth DATE,
  customer_gender ENUM('male', 'female', 'other'),
  customer_address TEXT,
  number_of_people INT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  special_requests TEXT,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(50),
  payment_method ENUM('bank_transfer', 'credit_card', 'cash'),
  total_amount DECIMAL(12,2) NOT NULL,
  deposit_amount DECIMAL(12,2) NOT NULL,
  remaining_amount DECIMAL(12,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_departure_date ON bookings(departure_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
```

## 🔐 Authentication & Authorization

**Lưu ý:** Các API này cần được bảo vệ bằng authentication. Có thể sử dụng:

- JWT Token
- API Key
- Session-based authentication

**Quyền truy cập:**
- `POST /bookings` - Public (khách hàng)
- `GET /bookings` - Admin only
- `GET /bookings/{id}` - Admin hoặc khách hàng sở hữu
- `PUT /bookings/{id}/status` - Admin only
- `DELETE /bookings/{id}` - Admin hoặc khách hàng sở hữu
- `GET /bookings/customer/{email}` - Admin hoặc khách hàng sở hữu

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🚀 Implementation Notes

### 1. Booking ID Format
- Format: `BK{YYYYMMDD}{3-digit-sequence}`
- Example: `BK20241216001`, `BK20241216002`

### 2. Validation Rules
- Email phải đúng định dạng
- Số điện thoại: chỉ cho phép số, dấu +, -, (), space
- Ngày khởi hành phải sau ngày hiện tại
- Ngày trở về phải sau ngày khởi hành
- Số người: 1-20 người

### 3. Payment Processing
- Đặt cọc: 20% tổng tiền
- Còn lại: 80% tổng tiền
- Hỗ trợ 3 phương thức: chuyển khoản, thẻ tín dụng, tiền mặt

### 4. Error Handling
- Trả về message lỗi rõ ràng bằng tiếng Việt
- Log tất cả lỗi để debug
- Rate limiting để tránh spam

## 📝 Testing

### Test Cases cần thiết:
1. Tạo booking thành công
2. Validation các trường bắt buộc
3. Kiểm tra format email, phone
4. Kiểm tra logic ngày tháng
5. Kiểm tra tính toán tiền
6. Test các trạng thái booking
7. Test phân trang và filter
8. Test authentication/authorization

### Tools Testing:
- Postman
- Insomnia
- curl commands
- Unit tests (Jest/Mocha)
- Integration tests
- E2E tests

## 🔄 Webhooks (Optional)

Nếu cần tích hợp với hệ thống khác:

```json
{
  "url": "https://webhook.example.com/booking-updated",
  "events": ["booking.created", "booking.updated", "booking.cancelled"],
  "secret": "webhook_secret_key"
}
```

## 📞 Support

Nếu có câu hỏi về API, vui lòng liên hệ:
- Email: dev@tourvanhoa.com
- Slack: #api-support
- Documentation: https://docs.tourvanhoa.com/api

