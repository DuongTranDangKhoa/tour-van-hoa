import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-gallery-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()" *ngIf="isOpen">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <h2>{{ tourName }}</h2>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>
        
        <!-- Main Image -->
        <div class="main-image-section">
          <img [src]="currentImage" [alt]="tourName" class="main-image">
          <button class="nav-btn prev" (click)="previousImage()" [disabled]="currentIndex === 0">‹</button>
          <button class="nav-btn next" (click)="nextImage()" [disabled]="currentIndex === images.length - 1">›</button>
        </div>
        
        <!-- Thumbnails -->
        <div class="thumbnails">
          <div class="thumbnail" 
               *ngFor="let image of images; let i = index"
               [class.active]="i === currentIndex"
               (click)="selectImage(i)">
            <img [src]="image" [alt]="tourName">
            <div class="play-overlay" *ngIf="i < 3">▶</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      position: relative;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    
    .modal-header h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .close-btn:hover {
      color: #333;
    }
    
    .main-image-section {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f8f8;
      padding: 20px;
    }
    
    .main-image {
      max-width: 100%;
      max-height: 60vh;
      object-fit: contain;
      border-radius: 8px;
    }
    
    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .nav-btn:hover {
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .nav-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .nav-btn.prev {
      left: 20px;
    }
    
    .nav-btn.next {
      right: 20px;
    }
    
    .thumbnails {
      display: flex;
      gap: 12px;
      padding: 20px;
      overflow-x: auto;
      border-top: 1px solid #eee;
    }
    
    .thumbnail {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    
    .thumbnail:hover {
      transform: scale(1.05);
    }
    
    .thumbnail.active {
      border-color: #007bff;
    }
    
    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .play-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
  `]
})
export class ImageGalleryModalComponent {
  @Input() isOpen = false;
  @Input() images: string[] = [];
  @Input() tourName = '';
  @Output() close = new EventEmitter<void>();
  
  currentIndex = 0;
  
  get currentImage(): string {
    return this.images[this.currentIndex] || '';
  }
  
  selectImage(index: number): void {
    this.currentIndex = index;
  }
  
  previousImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
  
  nextImage(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }
  }
  
  closeModal(): void {
    this.close.emit();
  }
}
