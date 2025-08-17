import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface WishlistItem {
  id: string;
  name: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlist = new BehaviorSubject<WishlistItem[]>([]);
  wishlist$ = this.wishlist.asObservable();

  constructor() {
    // Load từ localStorage nếu có
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      this.wishlist.next(JSON.parse(saved));
    }

    // Lưu vào localStorage khi thay đổi
    this.wishlist$.subscribe(items => {
      localStorage.setItem('wishlist', JSON.stringify(items));
    });
  }

  addToWishlist(item: WishlistItem): void {
    const current = this.wishlist.value;
    if (!current.some(e => e.id === item.id)) {
      this.wishlist.next([...current, item]);
    }
  }

  removeFromWishlist(itemId: string): void {
    const current = this.wishlist.value;
    this.wishlist.next(current.filter(e => e.id !== itemId));
  }

  isInWishlist(itemId: string): boolean {
    return this.wishlist.value.some(e => e.id === itemId);
  }

  getWishlist(): WishlistItem[] {
    return this.wishlist.value;
  }

  clearWishlist(): void {
    this.wishlist.next([]);
  }
}