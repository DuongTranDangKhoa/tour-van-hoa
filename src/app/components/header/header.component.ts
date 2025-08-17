import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LocationService, City } from '../../services/location.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentLocation = 'Ho Chi Minh';
  searchQuery = '';
  citySearchQuery = '';
  currentLanguage = 'EN';
  showSuggestions = false;
  showCityModal = false;

  constructor(private locationService: LocationService) {}
  showCategories = false;
  showSubCategory = false; // Biến điều khiển danh mục con
  selectedCategory = ''; // Lưu danh mục đã chọn

  // Danh sách danh mục
// Danh sách danh mục tiếng Việt
categories = [
  { name: 'Tất cả trải nghiệm', icon: 'assets/images/all-experiences.png', children: [] },
    { name: 'Du lịch', icon: 'assets/images/tourism.png', children: [
      { name: 'Xem tất cả Du lịch', icon: 'assets/images/see-all.png' },
      { name: 'Tham quan thành phố', icon: 'assets/images/city-tours.png' },
      { name: 'Điểm tham quan nổi bật', icon: 'assets/images/top-attractions.png' },
      { name: 'Chuyến đi & Thăm quan', icon: 'assets/images/day-trips.png' },
      { name: 'Chuyến du ngoạn & Thuyền', icon: 'assets/images/cruises.png' }
    ]},
    { name: 'Tiết kiệm', icon: 'assets/images/budget.png', children: [] },
    { name: 'Ẩm thực & Đồ uống', icon: 'assets/images/food.png', children: [] },
    { name: 'Văn hóa', icon: 'assets/images/culture.png', children: [] },
    { name: 'Hoạt động', icon: 'assets/images/activities.png', children: [] },
    { name: 'Âm nhạc', icon: 'assets/images/music.png', children: [] },
    { name: 'Đời sống ban đêm', icon: 'assets/images/nightlife.png', children: [] },
    { name: 'Triển lãm & Trải nghiệm', icon: 'assets/images/exhibits.png', children: [] },
    { name: 'Ca kịch & Show', icon: 'assets/images/live-shows.png', children: [] },
];

  changeLocation(): void {
    this.showCityModal = true;
  }

  closeCityModal(): void {
    this.showCityModal = false;
    this.citySearchQuery = '';
  }

  getFilteredCities() {
    if (!this.citySearchQuery.trim()) {
      return this.cities.filter(c => c.name.includes('Hà Nội') || c.name.includes('TP.HCM'));
    }
    return this.cities.filter(city =>
      city.name.toLowerCase().includes(this.citySearchQuery.toLowerCase())
    );
  }

  getSuggestedCities() {
  const suggested = [
    { name: 'Tp. Hồ Chí Minh', country: 'Việt Nam', imageUrl: '/city-image/sai-gon.webp' },
    { name: 'Đà Nẵng', country: 'Việt Nam', imageUrl: '/city-image/da-nang.jpg' },
    { name: 'Hải Phòng', country: 'Việt Nam', imageUrl: '/city-image/hai-phong.webp' },
    { name: 'Cần Thơ', country: 'Việt Nam', imageUrl: '/city-image/can-tho.png' },
  ];
  
  if (this.citySearchQuery.trim()) {
    return suggested.filter(city =>
      city.name.toLowerCase().includes(this.citySearchQuery.toLowerCase())
    );
  }
  
  return suggested;
}

  selectCity(city: City) {
  this.currentLocation = city.name;
  this.locationService.setCurrentCity(city); // Gửi dữ liệu lên service
  this.closeCityModal();
}

  toggleSearch(): void {
    this.showSuggestions = !this.showSuggestions;
  }

  onSearchEnter(): void {
    console.log('Searching for:', this.searchQuery);
    this.showSuggestions = false;
  }

  selectSuggestion(tag: string): void {
    this.searchQuery = tag;
    this.showSuggestions = false;
    this.onSearchEnter();
  }

  openCategories(): void {
    this.showCategories = true;
    this.showSubCategory = false;
  }

  closeCategories(): void {
    this.showCategories = false;
    this.showSubCategory = false;
  }

  getSubCategories() {
    const parentCategory = this.categories.find(c => c.name === this.selectedCategory);
    return parentCategory ? parentCategory.children : [];
  }

  selectCategory(category: { name: string, children: any[] }): void {
    if (category.children && category.children.length > 0) {
      this.selectedCategory = category.name;
      this.showSubCategory = true;
      this.showCategories = false;
    } else {
      console.log('Selected category:', category.name);
      this.closeCategories();
    }
  }
  selectSubCategory(subCategory: { name: string }): void {
    console.log('Selected sub-category:', subCategory.name);
    this.closeSubCategory();
  }
  closeSubCategory(): void {
    this.showSubCategory = false;
    this.showCategories = true;
  }

  toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'EN' ? 'VN' : 'EN';
  }

  toggleWishlist(): void {
    console.log('Toggle wishlist');
  }

  openUserProfile(): void {
    console.log('Opening user profile');
  }

  // Danh sách thành phố (đã có trong file trước đó)
  cities = [
  { name: 'Hà Nội', country: 'Việt Nam', imageUrl: '/city-image/ha-noi.png' },
  { name: 'Tp. Hồ Chí Minh', country: 'Việt Nam', imageUrl: '/city-image/sai-gon.webp' },
  { name: 'Đà Nẵng', country: 'Việt Nam', imageUrl: '/city-image/da-nang.jpg' },
  { name: 'Hải Phòng', country: 'Việt Nam', imageUrl: '/city-image/hai-phong.webp' },
  { name: 'Cần Thơ', country: 'Việt Nam', imageUrl: '/city-image/can-tho.png' },
];
}