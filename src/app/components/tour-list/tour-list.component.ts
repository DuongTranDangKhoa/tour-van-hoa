import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tour } from '../../models/tour';
import { TourService } from '../../services/tour.service';
import { TourCardComponent } from '../tour-card/tour-card.component';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TourCardComponent],
  templateUrl: './tour-list.component.html',
  styleUrl: './tour-list.component.scss'
})
export class TourListComponent implements OnInit {
  @Output() bookTour = new EventEmitter<Tour>();
  
  tours: Tour[] = [];
  filteredTours: Tour[] = [];
  
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedDifficulty: string = '';
  maxPrice: number = 5000000;

  constructor(private tourService: TourService) {}

  ngOnInit() {
    this.loadTours();
  }

  loadTours() {
    this.tourService.getTours().subscribe(tours => {
      this.tours = tours;
      this.filteredTours = tours;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onDifficultyChange() {
    this.applyFilters();
  }

  onPriceChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.tours;

    // Search filter
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(tour => 
        tour.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        tour.destination.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(tour => tour.category === this.selectedCategory);
    }

    // Difficulty filter
    if (this.selectedDifficulty) {
      filtered = filtered.filter(tour => tour.difficulty === this.selectedDifficulty);
    }

    // Price filter
    filtered = filtered.filter(tour => tour.price <= this.maxPrice);

    this.filteredTours = filtered;
  }

  onBookTour(tour: Tour) {
    this.bookTour.emit(tour);
  }
}
