import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Tour } from '../../models/tour';
import { WishlistService } from '../../services/wishlist.service'; // Thêm import

@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-card.component.html',
  styleUrls: ['./tour-card.component.scss']
})
export class TourCardComponent {
  @Input() tour!: Tour;

  constructor(
    private router: Router,
    private wishlistService: WishlistService // Thêm service
  ) {}

  onCardClick(): void {
    if (this.tour?.id) {
      this.router.navigate(['/booking-detail', this.tour.id]);
    }
  }

  onBookTour(): void {
    if (this.tour?.id) {
      this.router.navigate(['/tour', this.tour.id, 'book']);
    } else {
      console.warn('Tour ID is missing');
    }
  }

  toggleWishlist(): void {
    if (this.isInWishlist()) {
      this.wishlistService.removeFromWishlist(this.tour.id.toString());
    } else {
      // Tạo object wishlist từ tour
      const wishlistItem = {
        id: this.tour.id.toString(),
        name: this.tour.name,
        imageUrl: this.tour.imageUrl
      };
      this.wishlistService.addToWishlist(wishlistItem);
    }
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.tour.id.toString());
  }

  // Format ngày từ duration (ví dụ: "3 days" → "3 ngày")
  formatDate(): string {
    if (this.tour.duration) {
      return this.tour.duration.replace('days', 'ngày').replace('day', 'ngày');
    }
    return '';
  }

  // Format giá
  formatPrice(): string {
    return this.tour.price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
  }

  // Hiển thị 5 sao
  getStars(): string {
    if (this.tour.rating) {
      const fullStars = Math.floor(this.tour.rating);
      const emptyStars = 5 - fullStars;
      return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
    }
    return '★★★★★';
  }
}