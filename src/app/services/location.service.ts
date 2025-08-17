import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface City {
  name: string;
  country: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private currentCity = new BehaviorSubject<City | null>(null);
  currentCity$ = this.currentCity.asObservable();

  private allCities: City[] = [
    { name: 'Hà Nội', country: 'Việt Nam', imageUrl: '/city-image/ha-noi.png' },
    { name: 'Tp. Hồ Chí Minh', country: 'Việt Nam', imageUrl: '/city-image/sai-gon.webp' },
    { name: 'Đà Nẵng', country: 'Việt Nam', imageUrl: '/city-image/da-nang.jpg' },
    { name: 'Hải Phòng', country: 'Việt Nam', imageUrl: '/city-image/haiphong.png' },
    { name: 'Cần Thơ', country: 'Việt Nam', imageUrl: '/city-image/can-tho.png' }
  ];

  constructor() {
    this.setCurrentCity(this.allCities[0]);
  }

  setCurrentCity(city: City): void {
    this.currentCity.next(city);
  }

  getCurrentCity(): City | null {
    return this.currentCity.value;
  }
}