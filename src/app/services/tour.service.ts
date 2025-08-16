import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tour } from '../models/tour';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private tours: Tour[] = [
    {
      id: 1,
      name: 'Khám phá Sapa - Nóc nhà Đông Dương',
      description: 'Hành trình khám phá vùng núi Tây Bắc với những thửa ruộng bậc thang tuyệt đẹp, văn hóa dân tộc độc đáo và khí hậu mát mẻ quanh năm.',
      duration: '3 ngày 2 đêm',
      price: 2500000,
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      destination: 'Sapa, Lào Cai',
      rating: 4.8,
      maxGroupSize: 20,
      difficulty: 'Medium',
      category: 'Nature',
      highlights: ['Thửa ruộng bậc thang', 'Đỉnh Fansipan', 'Văn hóa dân tộc', 'Chợ tình Sapa'],
      included: ['Vé máy bay', 'Khách sạn 3 sao', 'Ăn uống', 'Hướng dẫn viên', 'Bảo hiểm'],
      notIncluded: ['Chi phí cá nhân', 'Đồ uống', 'Tiền tip']
    },
    {
      id: 2,
      name: 'Du lịch biển Nha Trang - Đảo ngọc',
      description: 'Khám phá vẻ đẹp của biển Nha Trang với những bãi biển cát trắng, nước biển xanh trong và các hoạt động giải trí dưới nước.',
      duration: '4 ngày 3 đêm',
      price: 3200000,
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      destination: 'Nha Trang, Khánh Hòa',
      rating: 4.6,
      maxGroupSize: 25,
      difficulty: 'Easy',
      category: 'Relaxation',
      highlights: ['Bãi biển Nha Trang', 'Đảo Hòn Tre', 'Tháp Bà Ponagar', 'Lặn biển'],
      included: ['Vé máy bay', 'Khách sạn 4 sao', 'Ăn uống', 'Hướng dẫn viên', 'Bảo hiểm'],
      notIncluded: ['Chi phí cá nhân', 'Đồ uống', 'Tiền tip']
    },
    {
      id: 3,
      name: 'Hành trình miền Tây sông nước',
      description: 'Trải nghiệm cuộc sống miền Tây Nam Bộ với những con sông, chợ nổi và văn hóa ẩm thực độc đáo.',
      duration: '2 ngày 1 đêm',
      price: 1800000,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      destination: 'Cần Thơ, An Giang',
      rating: 4.5,
      maxGroupSize: 15,
      difficulty: 'Easy',
      category: 'Cultural',
      highlights: ['Chợ nổi Cái Răng', 'Chùa Vĩnh Tràng', 'Làng nổi Tân Lập', 'Ẩm thực miền Tây'],
      included: ['Vé xe', 'Khách sạn 3 sao', 'Ăn uống', 'Hướng dẫn viên', 'Bảo hiểm'],
      notIncluded: ['Chi phí cá nhân', 'Đồ uống', 'Tiền tip']
    }
  ];

  constructor() { }

  getTours(): Observable<Tour[]> {
    return of(this.tours);
  }

  getTourById(id: number): Observable<Tour | undefined> {
    const tour = this.tours.find(t => t.id === id);
    return of(tour);
  }

  searchTours(query: string): Observable<Tour[]> {
    const filteredTours = this.tours.filter(tour => 
      tour.name.toLowerCase().includes(query.toLowerCase()) ||
      tour.destination.toLowerCase().includes(query.toLowerCase()) ||
      tour.category.toLowerCase().includes(query.toLowerCase())
    );
    return of(filteredTours);
  }

  filterToursByCategory(category: string): Observable<Tour[]> {
    const filteredTours = this.tours.filter(tour => tour.category === category);
    return of(filteredTours);
  }

  filterToursByPrice(minPrice: number, maxPrice: number): Observable<Tour[]> {
    const filteredTours = this.tours.filter(tour => 
      tour.price >= minPrice && tour.price <= maxPrice
    );
    return of(filteredTours);
  }
}
