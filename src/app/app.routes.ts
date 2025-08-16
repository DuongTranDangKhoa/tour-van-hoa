import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { BookingDetailComponent } from './pages/booking-detail/booking-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'tour/:id/book', component: BookingDetailComponent },
  { path: '**', redirectTo: '' }
];
