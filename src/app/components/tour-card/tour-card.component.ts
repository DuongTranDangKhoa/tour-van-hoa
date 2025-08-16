import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Tour } from '../../models/tour';

@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-card.component.html',
  styleUrl: './tour-card.component.scss'
})
export class TourCardComponent {
  @Input() tour!: Tour;

  constructor(private router: Router) {}

  onBookTour() {
    this.router.navigate(['/tour', this.tour.id, 'book']);
  }
}
