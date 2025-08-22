import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { BookingDetailComponent } from './pages/booking-detail/booking-detail.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'booking-detail/:id', component: BookingDetailComponent },
  
  // Checkout main page
  { path: 'checkout/:tourId', component: CheckoutComponent },
  
  // Checkout flow routes - 3 steps
  {
    path: 'checkout/:tourId/dietary',
    loadComponent: () => import('./components/dietary-preferences/dietary-preferences.component').then(m => m.DietaryPreferencesComponent),
    data: { step: 1, title: 'Thông tin ẩm thực' }
  },
  {
    path: 'checkout/:tourId/customer-details',
    loadComponent: () => import('./components/customer-details/customer-details.component').then(m => m.CustomerDetailsComponent),
    data: { step: 2, title: 'Thông tin khách hàng' }
  },
  {
    path: 'checkout/:tourId/payment',
    loadComponent: () => import('./components/payment/payment.component').then(m => m.PaymentComponent),
    data: { step: 3, title: 'Thanh toán' }
  },
  
  // Redirect shortcuts
  { path: 'tour/:id/book', redirectTo: '/checkout/:id/dietary', pathMatch: 'full' },
  
  // Fallback route
  { path: '**', redirectTo: '' }
];