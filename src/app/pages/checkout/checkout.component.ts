import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  order?: CheckoutState;
  personalForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    const nav = this.router.getCurrentNavigation();
    this.order = (nav?.extras?.state as CheckoutState) || undefined;

    this.personalForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['Vietnam (+84)', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  goToPayment(): void {
    if (this.personalForm.invalid) return;
    // For demo purpose, just alert success
    alert('Proceeding to payment...');
  }

  getParticipantsCount(): number {
    if (!this.order || !this.order.participants) return 0;
    return this.order.participants.reduce((sum, p) => sum + p.quantity, 0);
  }
}
