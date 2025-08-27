import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { BookingDetailComponent } from './pages/booking-detail/booking-detail.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { TourGalleryComponent } from './pages/tour-gallery/tour-gallery.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { PaymentComponent } from './components/payment/payment.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'booking-detail/:id', component: BookingDetailComponent },
  { path: 'tour/:id/book', component: BookingDetailComponent },
  { path: 'tour/:id/gallery', component: TourGalleryComponent },
  {
    path: 'checkout',
    component: CheckoutComponent,
    children: [
      { path: '', redirectTo: 'details', pathMatch: 'full' },
      { path: 'details', component: CustomerDetailsComponent },
      { path: 'payment', component: PaymentComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];