# MockAPI Endpoints - Tour Văn Hóa

## Base URL
```
https://68a026816e38a02c5817df5b.mockapi.io/api/ordertour
```

## API Endpoints

### 1. GET /bookings
**Lấy danh sách tất cả bookings**

**Query Parameters:**
- `page`: Số trang (default: 1)
- `limit`: Số item mỗi trang (default: 10)
- `email`: Lọc theo email khách hàng
- `paymentInfo_paymentMethod`: Lọc theo phương thức thanh toán

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@email.com",
      "phone": "0123456789",
      "idCard": 123456789,
      "dateOfBirth": "25/11/2002",
      "gender": "male",
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "numberOfPeople": 2,
      "departureDate": "2024-12-25",
      "returnDate": "2024-12-30",
      "specialRequests": "Cần xe đưa đón",
      "emergency_contact_name": "Nguyễn Thị B",
      "emergency_contact_phone": "0987654321",
      "emergency_contact_relationship": "Vợ",
      "paymentInfo_paymentMethod": "bank_transfer",
      "paymentInfo_totalAmount": 5000000,
      "paymentInfo_depositAmount": 1000000,
      "paymentInfo_remainingAmount": 4000000,
      "created_at": "25/11/2024",
      "updated_at": "25/11/2024"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 2. GET /bookings/:id
**Lấy chi tiết booking theo ID**

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@email.com",
    "phone": "0123456789",
    "idCard": 123456789,
    "dateOfBirth": "25/11/2002",
    "gender": "male",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "numberOfPeople": 2,
    "departureDate": "2024-12-25",
    "returnDate": "2024-12-30",
    "specialRequests": "Cần xe đưa đón",
    "emergency_contact_name": "Nguyễn Thị B",
    "emergency_contact_phone": "0987654321",
    "emergency_contact_relationship": "Vợ",
    "paymentInfo_paymentMethod": "bank_transfer",
    "paymentInfo_totalAmount": 5000000,
    "paymentInfo_depositAmount": 1000000,
    "paymentInfo_remainingAmount": 4000000,
    "created_at": "25/11/2024",
    "updated_at": "25/11/2024"
  }
}
```

### 3. POST /bookings
**Tạo booking mới**

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@email.com",
  "phone": "0123456789",
  "idCard": 123456789,
  "dateOfBirth": "25/11/2002",
  "gender": "male",
  "address": "123 Đường ABC, Quận 1, TP.HCM",
  "numberOfPeople": 2,
  "departureDate": "2024-12-25",
  "returnDate": "2024-12-30",
  "specialRequests": "Cần xe đưa đón",
  "emergency_contact_name": "Nguyễn Thị B",
  "emergency_contact_phone": "0987654321",
  "emergency_contact_relationship": "Vợ",
  "paymentInfo_paymentMethod": "bank_transfer",
  "paymentInfo_totalAmount": 5000000,
  "paymentInfo_depositAmount": 1000000,
  "paymentInfo_remainingAmount": 4000000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "1",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@email.com",
    "phone": "0123456789",
    "idCard": 123456789,
    "dateOfBirth": "25/11/2002",
    "gender": "male",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "numberOfPeople": 2,
    "departureDate": "2024-12-25",
    "returnDate": "2024-12-30",
    "specialRequests": "Cần xe đưa đón",
    "emergency_contact_name": "Nguyễn Thị B",
    "emergency_contact_phone": "0987654321",
    "emergency_contact_relationship": "Vợ",
    "paymentInfo_paymentMethod": "bank_transfer",
    "paymentInfo_totalAmount": 5000000,
    "paymentInfo_depositAmount": 1000000,
    "paymentInfo_remainingAmount": 4000000,
    "created_at": "25/11/2024",
    "updated_at": "25/11/2024"
  }
}
```

### 4. PUT /bookings/:id
**Cập nhật booking**

**Request Body (chỉ cần gửi các field cần update):**
```json
{
  "fullName": "Nguyễn Văn B",
  "phone": "0987654321",
  "specialRequests": "Cần xe đưa đón và hướng dẫn viên"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking updated successfully",
  "data": {
    "id": "1",
    "updated_at": "25/11/2024"
  }
}
```

### 5. DELETE /bookings/:id
**Xóa booking**

**Response:**
```json
{
  "success": true,
  "message": "Booking deleted successfully",
  "data": {
    "id": "1"
  }
}
```

## Data Structure

### Booking Object
```typescript
interface Booking {
  id: string;                           // ID duy nhất
  fullName: string;                     // Họ tên đầy đủ
  email: string;                        // Email
  phone: string;                        // Số điện thoại
  idCard: number;                       // CMND/CCCD
  dateOfBirth: string;                  // Ngày sinh (format: "25/11/2002")
  gender: string;                       // Giới tính: "male", "female", "other"
  address: string;                      // Địa chỉ
  numberOfPeople: number;               // Số người
  departureDate: string;                // Ngày đi (format: "2024-12-25")
  returnDate: string;                   // Ngày về (format: "2024-12-25")
  specialRequests: string;              // Yêu cầu đặc biệt
  emergency_contact_name: string;       // Tên liên hệ khẩn cấp
  emergency_contact_phone: string;      // SĐT liên hệ khẩn cấp
  emergency_contact_relationship: string; // Quan hệ liên hệ khẩn cấp
  paymentInfo_paymentMethod: string;    // Phương thức thanh toán
  paymentInfo_totalAmount: number;      // Tổng tiền
  paymentInfo_depositAmount: number;    // Tiền đặt cọc
  paymentInfo_remainingAmount: number;  // Tiền còn lại
  created_at: string;                   // Ngày tạo (format: "25/11/2024")
  updated_at: string;                   // Ngày cập nhật (format: "25/11/2024")
}
```

### Payment Methods
- `"bank_transfer"` - Chuyển khoản
- `"credit_card"` - Thẻ tín dụng
- `"cash"` - Tiền mặt

### Gender Values
- `"male"` - Nam
- `"female"` - Nữ
- `"other"` - Khác

## Error Responses

### Common Error Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

## Setup Instructions for MockAPI

1. **Create Resource:** `bookings`
2. **Fields to include:**
   - fullName (string)
   - email (string)
   - phone (string)
   - idCard (number)
   - dateOfBirth (string) - format: "dd/mm/yyyy"
   - gender (string)
   - address (string)
   - numberOfPeople (number)
   - departureDate (string)
   - returnDate (string)
   - specialRequests (string)
   - emergency_contact_name (string)
   - emergency_contact_phone (string)
   - emergency_contact_relationship (string)
   - paymentInfo_paymentMethod (string)
   - paymentInfo_totalAmount (number)
   - paymentInfo_depositAmount (number)
   - paymentInfo_remainingAmount (number)
   - created_at (string) - format: "dd/mm/yyyy"
   - updated_at (string) - format: "dd/mm/yyyy"

3. **Add sample data** using the examples above
4. **Enable all CRUD operations** (GET, POST, PUT, DELETE)
5. **Set up pagination** with default limit of 10
6. **Enable filtering** by email, payment method
7. **Enable sorting** by created_at, updated_at

## Sample Data for Testing

```json
[
  {
    "id": "1",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@email.com",
    "phone": "0123456789",
    "idCard": 123456789,
    "dateOfBirth": "25/11/2002",
    "gender": "male",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "numberOfPeople": 2,
    "departureDate": "2024-12-25",
    "returnDate": "2024-12-30",
    "specialRequests": "Cần xe đưa đón",
    "emergency_contact_name": "Nguyễn Thị B",
    "emergency_contact_phone": "0987654321",
    "emergency_contact_relationship": "Vợ",
    "paymentInfo_paymentMethod": "bank_transfer",
    "paymentInfo_totalAmount": 5000000,
    "paymentInfo_depositAmount": 1000000,
    "paymentInfo_remainingAmount": 4000000,
    "created_at": "25/11/2024",
    "updated_at": "25/11/2024"
  },
  {
    "id": "2",
    "fullName": "Trần Thị C",
    "email": "tranthic@email.com",
    "phone": "0987654321",
    "idCard": 987654321,
    "dateOfBirth": "15/03/1995",
    "gender": "female",
    "address": "456 Đường XYZ, Quận 2, TP.HCM",
    "numberOfPeople": 4,
    "departureDate": "2024-01-15",
    "returnDate": "2024-01-20",
    "specialRequests": "Cần hướng dẫn viên nói tiếng Anh",
    "emergency_contact_name": "Trần Văn D",
    "emergency_contact_phone": "0123456789",
    "emergency_contact_relationship": "Chồng",
    "paymentInfo_paymentMethod": "credit_card",
    "paymentInfo_totalAmount": 8000000,
    "paymentInfo_depositAmount": 1600000,
    "paymentInfo_remainingAmount": 6400000,
    "created_at": "25/11/2024",
    "updated_at": "25/11/2024"
  }
]
```
