# Hướng dẫn Demo Tính năng Đặt Tour

## Bước 1: Khởi động ứng dụng
```bash
npm start
```
Ứng dụng sẽ chạy tại: http://localhost:4200

## Bước 2: Test tính năng đặt tour

### 2.1. Từ trang chủ
1. Mở trình duyệt và truy cập: http://localhost:4200
2. Cuộn xuống phần danh sách tour
3. Tìm một tour bất kỳ (ví dụ: "Khám phá Sapa")
4. **Click vào nút "Đặt tour ngay"** (thay vì hiện popup như trước)

### 2.2. Trang đặt tour sẽ mở
- URL sẽ thay đổi thành: `http://localhost:4200/tour/1/book`
- **LAYOUT MỚI**: 
  - **Phần trên (100% chiều rộng)**: Hình ảnh tour + thông tin cơ bản
  - **Phần dưới (chia 2 cột)**: Thông tin tour + Form đặt tour

### 2.3. Test phần trên (100% chiều rộng)
1. **Header**: Logo "Tour Văn Hóa", navigation, search bar, user menu
2. **Hình ảnh tour**:
   - Ảnh chính lớn với play button
   - Grid 4 ảnh nhỏ bên dưới
   - Ảnh đầu tiên có overlay "tour van hoa presents"
   - Ảnh cuối có button "📷" (Gallery)
3. **Thông tin tour**:
   - Tên tour lớn
   - Rating 4.5 với 5 sao
   - Action buttons: Share (📤) và Like (❤)

### 2.4. Test phần dưới (chia 2 cột)
1. **Left Panel - Thông tin tour**:
   - **Mô tả**: Mô tả chi tiết tour
   - **Thông tin chung**: Điểm đến, thời gian, độ khó, loại tour
   - **Chương trình tour**: Các điểm nổi bật của tour

2. **Right Panel - Booking Widget**:
   - **Thông tin khách hàng (BẮT BUỘC)**:
     - Họ và tên: Nhập tên bất kỳ
     - Email: Nhập email hợp lệ (ví dụ: test@example.com)
     - Số điện thoại: Nhập số điện thoại
   - **Thông tin bổ sung (TÙY CHỌN)**:
     - CMND/CCCD: Có thể để trống
     - Ngày sinh: Chọn ngày sinh
     - Giới tính: Chọn Nam/Nữ/Khác
     - Địa chỉ: Nhập địa chỉ
   - **Chi tiết đặt tour**:
     - Số người: Sử dụng nút + và - để điều chỉnh (1-20)
     - Phương thức thanh toán: Chọn từ dropdown
     - Ngày khởi hành: Chọn ngày trong tương lai
     - Ngày trở về: Tự động tính theo thời gian tour
     - Yêu cầu đặc biệt: Có thể để trống
   - **Thông tin liên hệ khẩn cấp (TÙY CHỌN)**:
     - Tên người liên hệ: Có thể để trống
     - Số điện thoại: Có thể để trống
     - Mối quan hệ: Có thể để trống
   - **Tóm tắt tour và thanh toán**:
     - Thông tin tour, điểm đến, thời gian
     - Giá gốc, số người, tổng tiền
     - Đặt cọc (20%), số tiền còn lại
   - **Click "Tiếp tục"**: 
     - **API CALL**: Sẽ gọi `POST /bookings` thực sự
     - **Loading State**: Button hiển thị "Đang xử lý..." và bị disable
     - **Success**: Hiện thông báo thành công với mã booking và quay về trang chủ
     - **Error**: Hiển thị lỗi tương ứng (400, 500, etc.)

## Bước 3: Test API Integration
1. **Mở Developer Tools** (F12) và chuyển sang tab Network
2. **Điền form và click "Tiếp tục"**
3. **Quan sát Network tab**:
   - Sẽ thấy request `POST /bookings` được gửi
   - Request body chứa đầy đủ thông tin booking
   - Response sẽ trả về success/error

4. **Test các trường hợp**:
   - **Success**: Form hợp lệ → API call thành công → Hiện thông báo thành công
   - **Validation Error**: Form không hợp lệ → Không gọi API → Hiện lỗi validation
   - **API Error**: Form hợp lệ nhưng API lỗi → Hiện lỗi tương ứng

## Bước 4: Test form validation
1. **Để trống các trường bắt buộc**:
   - Họ và tên: Để trống → Hiện lỗi "Trường này là bắt buộc"
   - Email: Nhập email không hợp lệ → Hiện lỗi "Email không hợp lệ"
   - Số điện thoại: Để trống → Hiện lỗi "Trường này là bắt buộc"

2. **Test số người**:
   - Giảm xuống 0 → Không cho phép (tối thiểu 1)
   - Tăng lên 21 → Không cho phép (tối đa 20)

3. **Test ngày**:
   - Chọn ngày trong quá khứ → Có thể gây lỗi validation

## Bước 5: Test loading states
1. **Click "Tiếp tục"** với form hợp lệ
2. **Quan sát button**:
   - Text thay đổi thành "⏳ Đang xử lý..."
   - Button bị disable (không thể click lại)
   - Spinner xoay liên tục
3. **Sau khi API response**:
   - Button trở về trạng thái bình thường
   - Hiển thị thông báo thành công/lỗi

## Bước 6: Test responsive design
1. Thay đổi kích thước cửa sổ trình duyệt
2. Hoặc mở Developer Tools và chọn mobile view
3. Quan sát:
   - **Phần trên**: Vẫn chiếm 100% chiều rộng trên mọi thiết bị
   - **Phần dưới**: Chuyển từ 2 cột sang 1 cột trên mobile
   - Form fields stack vertically
   - Booking widget không còn sticky
   - Padding và spacing thay đổi

## Bước 7: Test navigation
1. Từ trang đặt tour, click vào logo "Tour Văn Hóa"
2. Sẽ quay về trang chủ
3. Click "Đặt tour ngay" trên tour khác để test

## Các tính năng đã implement

### ✅ Hoàn thành
- [x] Component đặt tour mới với UI tương tự Fever
- [x] **ĐẦY ĐỦ FORM THÔNG TIN** như popup ban đầu
- [x] Navigation từ tour card đến trang đặt tour
- [x] **Thông tin khách hàng đầy đủ** (bắt buộc + tùy chọn)
- [x] **Chi tiết đặt tour** (số người, thanh toán, ngày)
- [x] **Thông tin liên hệ khẩn cấp**
- [x] **Tóm tắt tour và thanh toán** (giá, đặt cọc, còn lại)
- [x] **Form validation** với error messages
- [x] **API Integration**: Gọi `POST /bookings` thực sự
- [x] **Loading States**: Spinner + Disable button khi submit
- [x] **Error Handling**: Xử lý API errors (400, 500, etc.)
- [x] Tính toán giá tự động
- [x] Responsive design
- [x] TypeScript interfaces và type safety
- [x] Unit tests
- [x] Loại bỏ popup cũ
- [x] **Đã xóa phần "Chọn ngày và phiên"**
- [x] **Đã xóa phần "Đặt tour" và "Chọn khu vực"**
- [x] **LAYOUT MỚI**: Phần trên 100% chiều rộng, phần dưới chia 2 cột

### 🔄 Có thể mở rộng sau
- [ ] Payment gateway integration
- [ ] Email confirmation
- [ ] Booking management system
- [ ] User authentication
- [ ] Admin panel
- [ ] Advanced validation rules
- [ ] File upload (CMND/CCCD)
- [ ] Real-time booking status updates
- [ ] SMS notifications

## Troubleshooting

### Nếu gặp lỗi build
```bash
npm install
npm run build
```

### Nếu gặp lỗi runtime
1. Kiểm tra console trong Developer Tools
2. Đảm bảo TourService có method `getTourById`
3. Kiểm tra route configuration
4. Kiểm tra form validation
5. Kiểm tra API endpoint `/bookings` có hoạt động không

### Nếu giao diện không đẹp
1. Kiểm tra CSS đã được compile
2. Clear browser cache
3. Restart development server

### Nếu form không submit được
1. Kiểm tra tất cả trường bắt buộc đã điền
2. Kiểm tra format email hợp lệ
3. Kiểm tra số người trong khoảng 1-20
4. Kiểm tra ngày khởi hành trong tương lai

### Nếu API call thất bại
1. Kiểm tra Network tab trong Developer Tools
2. Kiểm tra API endpoint có đúng không
3. Kiểm tra request body có đúng format không
4. Kiểm tra server có hoạt động không

## Kết quả mong đợi
- Nút "Đặt tour ngay" sẽ navigate đến trang mới thay vì hiện popup
- **Giao diện đẹp, hiện đại tương tự trang Fever**
- **ĐẦY ĐỦ THÔNG TIN NHẬP VÀO như popup ban đầu**
- **Form validation hoạt động tốt**
- **Đã xóa phần "Chọn ngày và phiên"**
- **Đã xóa phần "Đặt tour" và "Chọn khu vực"**
- **API Integration hoạt động**: Gọi `POST /bookings` thực sự
- **Loading states**: Spinner + Disable button khi submit
- **Error handling**: Xử lý API errors đầy đủ
- **LAYOUT MỚI**: Phần trên chiếm 100% chiều rộng, phần dưới chia 2 cột
- Responsive trên mọi thiết bị
- Tương tác mượt mà với các form controls
- **Tính toán giá và đặt cọc chính xác**
- **Tạo booking thực sự trong database**
