import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @Output() bookTour = new EventEmitter<Tour>();

  onBookTour() {
    this.bookTour.emit(this.tour);
  }
}
