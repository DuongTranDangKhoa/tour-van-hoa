# Tour Văn Hóa - Ứng dụng đặt tour du lịch

Ứng dụng web Angular để đặt tour du lịch khắp Việt Nam với giao diện hiện đại và trải nghiệm người dùng tốt.

## 🚀 Tính năng chính

- **Trang chủ hấp dẫn**: Hero section với hình ảnh nền đẹp mắt
- **Danh sách tours**: Hiển thị các tour du lịch với thông tin chi tiết
- **Tìm kiếm và lọc**: Tìm kiếm theo tên, điểm đến, danh mục, độ khó và giá
- **Đặt tour**: Form đặt tour với validation đầy đủ
- **Responsive design**: Tương thích với mọi thiết bị

## 🛠️ Công nghệ sử dụng

- **Frontend**: Angular 19
- **Styling**: SCSS với CSS Grid và Flexbox
- **State Management**: Angular Services
- **Forms**: Reactive Forms với validation
- **Architecture**: Standalone Components

## 📁 Cấu trúc dự án

```
src/
├── app/
│   ├── components/
│   │   ├── header/          # Header navigation
│   │   ├── hero/            # Hero section
│   │   ├── tour-list/       # Danh sách tours
│   │   ├── tour-card/       # Card hiển thị tour
│   │   ├── booking-form/    # Form đặt tour
│   │   └── footer/          # Footer
│   ├── services/
│   │   ├── tour.service.ts      # Quản lý tours
│   │   └── booking.service.ts   # Quản lý đặt tour
│   ├── models/
│   │   ├── tour.ts              # Interface Tour
│   │   └── booking.ts           # Interface Booking
│   └── app.component.*          # Component chính
```

## 🚀 Cách chạy dự án

### Yêu cầu hệ thống
- Node.js 18+ 
- Angular CLI 19+

### Cài đặt dependencies
```bash
npm install
```

### Chạy ứng dụng
```bash
ng serve
```

Ứng dụng sẽ chạy tại: http://localhost:4200/

### Build production
```bash
ng build
```

## 🎨 Giao diện

### Header
- Logo và navigation menu
- Nút "Đặt tour ngay" nổi bật

### Hero Section
- Hình ảnh nền đẹp mắt
- Call-to-action buttons
- Thống kê về công ty

### Tour List
- Grid layout hiển thị tours
- Bộ lọc tìm kiếm đa tiêu chí
- Responsive design

### Tour Card
- Hình ảnh tour với overlay thông tin
- Rating và category badges
- Thông tin chi tiết và giá
- Nút đặt tour

### Booking Form
- Modal form với validation
- Thông tin khách hàng
- Chọn ngày và số người
- Tính toán tổng tiền

## 📱 Responsive Design

Ứng dụng được thiết kế responsive với:
- Mobile-first approach
- CSS Grid và Flexbox
- Media queries cho các breakpoint
- Touch-friendly interface

## 🔧 Cấu hình

### Tours
- Dữ liệu tours được lưu trong `TourService`
- Hỗ trợ các danh mục: Adventure, Cultural, Relaxation, Nature, City
- Độ khó: Easy, Medium, Hard

### Styling
- Sử dụng SCSS với variables và mixins
- Color scheme: Gradient blues và accent red
- Typography: Segoe UI font family
- Spacing: Consistent margin/padding system

## 🚀 Phát triển tiếp theo

- [ ] Tích hợp backend API
- [ ] Authentication và user management
- [ ] Payment gateway
- [ ] Admin dashboard
- [ ] Multi-language support
- [ ] PWA features
- [ ] Unit tests và E2E tests

## 📄 License

MIT License

## 👥 Tác giả

Được phát triển với ❤️ bằng Angular
