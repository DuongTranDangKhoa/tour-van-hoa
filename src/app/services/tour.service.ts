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
      price: 102.04,
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
      price: 130.61,
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
      price: 73.47,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      destination: 'Cần Thơ, An Giang',
      rating: 4.5,
      maxGroupSize: 15,
      difficulty: 'Easy',
      category: 'Cultural',
      highlights: ['Chợ nổi Cái Răng', 'Chùa Vĩnh Tràng', 'Làng nổi Tân Lập', 'Ẩm thực miền Tây'],
      included: ['Vé xe', 'Khách sạn 3 sao', 'Ăn uống', 'Hướng dẫn viên', 'Bảo hiểm'],
      notIncluded: ['Chi phí cá nhân', 'Đồ uống', 'Tiền tip']
    },
    {
      id: 4,
      name: 'Vietnam Art & Culture Tour – This Is Home',
      description: `Intro Description

⭐ Step into the heart of Vietnam with the Vietnam Art & Culture Tour by This Is Home — an immersive cultural journey designed to connect you with the country's authentic heritage. From traditional craft workshops to wandering the lantern-lit streets of Hoi An, every moment reveals the timeless beauty of Vietnam's traditions. Guided by passionate locals, this full-day adventure blends creativity, cuisine, and community, leaving you with unforgettable memories of Vietnam's soul.

Highlights

🌏 Authentic cultural immersion with local artisans.
☕ Hands-on coffee brewing workshop at Hush Workspace.
🏺 Pottery-making at Le Duc Ha Terra Cotta Studio, including lunch.
🪵 Wood carving workshop at Au Lac with master artisans.
🏮 Explore the enchanting lantern-lit Hoi An Ancient Town.
🏖️ Relax and discover Vietnam's stunning beaches.
🍲 Savor authentic local cuisine, rich in flavor.
🎁 Receive a special keepsake gift set from This Is Home.

General Info

📅 Date & Time: Departure at 08:45 AM – Return at 5:30 PM (full-day tour).
⏳ Duration: Approx. 9 hours.
📍 Location: Hotel/office pick-up & drop-off in the Da Nang – Hoi An area.
👥 Age requirement: Suitable for all ages; children under 16 must be accompanied by an adult.
🚐 Transportation: Private coach (7-seater or 16-seater), air-conditioned.
💰 Pricing:

Package 1: 7-seater – $307/tour | 16-seater – $635/tour.

Package 2: 7-seater – $42/tour | 16-seater – $35/tour.

Full program: USD $296 per person (excludes international flights).
🏨 Accommodation (multi-day option): 3–4 star hotels, double rooms (single available upon request), with Wi-Fi & TV.
🍴 Meals included: Hotel breakfast, 4 lunches, 3 dinners (including Welcome Dinner & Gala Dinner).
🦽 Accessibility: Wheelchair-friendly venues.
📌 Included: Entrance fees, English-speaking guides, all workshops, transportation, meals, and gift set.
❌ Not included: Personal expenses, shopping, phone calls, additional drinks/meals, international flights.
📲 Booking & Contact:

Website: tih.nhi.sg

Email: danh@nhi.sg

WhatsApp: +84 367666618

Full Description

✨ This Is Home brings you a cultural journey to remember through Central Vietnam. Guided by local artisans, you'll learn the art of coffee brewing, pottery, and wood carving. Then, stroll through the vibrant lantern-lit alleys of Hoi An Ancient Town, savor local cuisine, and unwind at breathtaking beaches.

Every experience is designed to connect you deeply with Vietnam's heritage — from creative workshops to heartwarming meals and meaningful keepsakes. With accommodation, transport, guides, and meals fully included, all you need to do is immerse yourself.

🌿 Whether you're a culture enthusiast, a family seeking meaningful bonding, or a traveler craving authentic encounters — this tour promises lasting memories of Vietnam's soul.`,
      duration: '1 ngày (9 giờ)',
      price: 296.00, // USD $296 per person
      imageUrl: '/city-image/da-nang.jpg',
      destination: 'Da Nang - Hoi An',
      rating: 4.9,
      maxGroupSize: 16,
      difficulty: 'Easy',
      category: 'Cultural',
      departureDate: 'Daily',
      languages: ['Vietnamese', 'English'],
      tourProgram: '💰 Pricing:\nPackage 1: 7-seater – $307/tour | 16-seater – $635/tour.\nPackage 2: 7-seater – $42/tour | 16-seater – $35/tour.\nFull program: USD $296 per person (excludes international flights).\n\n🏨 Accommodation (multi-day option): 3–4 star hotels, double rooms (single available upon request), with Wi-Fi & TV.\n🍴 Meals included: Hotel breakfast, 4 lunches, 3 dinners (including Welcome Dinner & Gala Dinner).\n🦽 Accessibility: Wheelchair-friendly venues.\n📌 Included: Entrance fees, English-speaking guides, all workshops, transportation, meals, and gift set.\n❌ Not included: Personal expenses, shopping, phone calls, additional drinks/meals, international flights.\n📲 Booking & Contact:\nWebsite: tih.nhi.sg\nEmail: danh@nhi.sg\nWhatsApp: +84 367666618',
      highlights: [
        '🌏 Authentic cultural immersion with local artisans',
        '☕  Hands-on coffee brewing workshop at Hush Workspace',
        '🏺 Pottery-making at Le Duc Ha Terra Cotta Studio',
        '🪵 Wood carving workshop at Au Lac with master artisans',
        '🏮 Explore the enchanting lantern-lit Hoi An Ancient Town',
        '🏖️ Relax and discover Vietnam\'s stunning beaches',
        '🍲 Savor authentic local cuisine, rich in flavor',
        '🎁 Receive a special keepsake gift set from This Is Home'
      ],
      included: [
        'Entrance fees',
        'English-speaking guides',
        'All workshops',
        'Transportation',
        'Meals',
        'Gift set',
        'Hotel/office pick-up & drop-off'
      ],
      notIncluded: [
        'Personal expenses',
        'Shopping',
        'Phone calls',
        'Additional drinks/meals',
        'International flights'
      ]
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

  filterToursByDestination(destination: string): Observable<Tour[]> {
    const filteredTours = this.tours.filter(tour => 
      tour.destination.toLowerCase().includes(destination.toLowerCase())
    );
    return of(filteredTours);
  }

  getToursByCategory(category: string): Observable<Tour[]> {
    return this.filterToursByCategory(category);
  }
}
