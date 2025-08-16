import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { TourListComponent } from '../../components/tour-list/tour-list.component';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';
import { Tour } from '../../models/tour';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    TourListComponent,
    BookingFormComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  selectedTour: Tour | null = null;
  showBookingForm: boolean = false;

  openBookingForm(tour: Tour) {
    this.selectedTour = tour;
    this.showBookingForm = true;
  }

  closeBookingForm() {
    this.showBookingForm = false;
    this.selectedTour = null;
  }

  onBookingCreated(booking: any) {
    console.log('Booking created:', booking);
    this.closeBookingForm();
  }
}
