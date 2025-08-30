import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { Tour } from '../../models/tour';

@Component({
  selector: 'app-tour-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gallery-overlay">
      <div class="gallery-modal">
        <!-- Close Button inside modal -->
        <button class="close-btn" (click)="goBack()">
          <i class="icon">×</i>
        </button>

        <!-- Main Image Section -->
        <div class="main-image-section">
          <img [src]="currentImage" [alt]="tour?.name" class="main-image">
          <button class="nav-btn prev" (click)="previousImage()" [disabled]="currentIndex === 0">‹</button>
          <button class="nav-btn next" (click)="nextImage()" [disabled]="currentIndex === images.length - 1">›</button>
        </div>

        <!-- Thumbnails Row -->
        <div class="thumbnails-row">
          <div class="thumbnail" 
               *ngFor="let image of images; let i = index"
               [class.active]="i === currentIndex"
               (click)="selectImage(i)">
            <img [src]="image" [alt]="tour?.name">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gallery-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .gallery-modal {
      background: white;
      border-radius: 12px;
      max-width: 95vw;
      width: 1200px;
      max-height: 90vh;
      overflow: hidden;
      position: relative;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
    }

    .close-btn:hover {
      background: rgba(0, 0, 0, 1);
    }

    .main-image-section {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f8f8;
      padding: 40px;
      min-height: 500px;
    }

    .main-image {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
      border-radius: 8px;
    }

    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 8px;
      width: 56px;
      height: 56px;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    }

    .nav-btn:hover {
      background: white;
    }

    .nav-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .nav-btn.prev {
      left: 30px;
    }

    .nav-btn.next {
      right: 30px;
    }

    .thumbnails-row {
      display: flex;
      gap: 20px;
      padding: 30px;
      overflow-x: auto;
      border-top: 1px solid #eee;
      justify-content: center;
    }

    .thumbnail {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 3px solid transparent;
      flex-shrink: 0;
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

    @media (max-width: 768px) {
      .gallery-modal {
        max-width: 95vw;
        width: 95vw;
        max-height: 95vh;
      }

      .main-image-section {
        padding: 20px;
        min-height: 300px;
      }

      .nav-btn {
        width: 48px;
        height: 48px;
        font-size: 20px;
      }

      .nav-btn.prev {
        left: 15px;
      }

      .nav-btn.next {
        right: 15px;
      }

      .thumbnails-row {
        padding: 20px;
        gap: 15px;
      }

      .thumbnail {
        width: 80px;
        height: 80px;
      }
    }
  `]
})
export class TourGalleryComponent implements OnInit {
  tour: Tour | null = null;
  images: string[] = [];
  currentIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService
  ) {}

  ngOnInit(): void {
    const tourId = this.route.snapshot.paramMap.get('id');
    if (tourId) {
      this.tourService.getTourById(parseInt(tourId)).subscribe(tour => {
        if (tour) {
          this.tour = tour;
          this.generateTourImages();
        }
      });
    }
  }

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

  generateTourImages(): void {
    if (this.tour) {
      // Danh sách hình ảnh từ hero section
      this.images = [
        '/city-image/TRUONG_6M0A2586.jpg',      // Hình chính
        '/city-image/6M0A2532.JPG',              // Grid item 1
        '/city-image/6M0A0688.JPG',              // Grid item 2  
        '/city-image/6M0A0599.JPG',              // Grid item 3
        '/city-image/6M0A0493.JPG',              // Grid item 4
        '/city-image/6M0A2901.JPG',              // User gallery 1
        '/city-image/6M0A2900.JPG',              // User gallery 2
        '/city-image/6M0A0646.JPG',              // User gallery 3
        '/city-image/6M0A0529.JPG'               // User gallery 4
      ];
    }
  }

  goBack(): void {
    this.router.navigate(['/booking-detail', this.tour?.id]);
  }
}
