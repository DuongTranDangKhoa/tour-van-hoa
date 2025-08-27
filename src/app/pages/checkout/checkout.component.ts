import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface CheckoutState {
  tourId: number;
  tourName: string;
  imageUrl?: string;
  selectedDate: string;
  selectedSession: string;
  participants: Array<{ type: string; name: string; price: number; fee: number; quantity: number }>;
  addOn?: { name: string; price: number; quantity: number };
  totalPrice: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  order?: CheckoutState;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.order = (nav?.extras?.state as CheckoutState) || undefined;
  }

  ngOnInit(): void {}

  getParticipantsCount(): number {
    if (!this.order || !this.order.participants) return 0;
    return this.order.participants.reduce((sum, p) => sum + p.quantity, 0);
  }
}
