import { Component, OnInit } from '@angular/core';
import { LocationService, City } from '../../services/location.service'; // Import cả service và interface

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  cityName = '';
  backgroundImage = '';

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    // Theo dõi thay đổi thành phố từ service
    this.locationService.currentCity$.subscribe((city: City | null) => {
      if (city) {
        this.cityName = city.name;
        this.backgroundImage = city.imageUrl || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80'; // fallback
      }
    });
  }
}