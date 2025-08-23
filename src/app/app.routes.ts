import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { BookingDetailComponent } from './pages/booking-detail/booking-detail.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { TourGalleryComponent } from './pages/tour-gallery/tour-gallery.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'booking-detail/:id', component: BookingDetailComponent },
  { path: 'tour/:id/book', component: BookingDetailComponent },
  { path: 'tour/:id/gallery', component: TourGalleryComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'checkout/dietary', loadComponent: () => import('./components/dietary-preferences/dietary-preferences.component').then(m => m.DietaryPreferencesComponent) },
  { path: 'checkout/details', loadComponent: () => import('./components/customer-details/customer-details.component').then(m => m.CustomerDetailsComponent) },
  { path: 'checkout/payment', loadComponent: () => import('./components/payment/payment.component').then(m => m.PaymentComponent) },
  { path: '**', redirectTo: '' }
  ];