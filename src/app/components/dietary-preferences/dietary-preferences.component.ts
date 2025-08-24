import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-dietary-preferences',
  templateUrl: './dietary-preferences.component.html',
  styleUrls: ['./dietary-preferences.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule // Thêm CommonModule vào đây
  ]
})
export class DietaryPreferencesComponent {
  dietaryPreference: string = '';
  allergyInput: string = '';
  selectedAllergies: string[] = [];
  showSuggestions: boolean = false;
  
  // Mock data cho autocomplete
  allergySuggestions: string[] = [
    'Hải sản',
    'Tôm',
    'Cua',
    'Ốc',
    'Đậu phộng',
    'Sữa',
    'Trứng',
    'Đậu nành',
    'Gluten',
    'Đậu xanh',
    'Thịt bò',
    'Thịt heo',
    'Gà',
    'Cá hồi',
    'Cá ngừ'
  ];
  
  filteredSuggestions: string[] = [];

  constructor(private router: Router) {}

  onAllergyInput() {
    if (this.allergyInput.length > 0) {
      this.showSuggestions = true;
      this.filteredSuggestions = this.allergySuggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(this.allergyInput.toLowerCase())
      );
    } else {
      this.showSuggestions = false;
      this.filteredSuggestions = [];
    }
  }

  selectAllergy(allergy: string) {
    if (!this.selectedAllergies.includes(allergy)) {
      this.selectedAllergies.push(allergy);
    }
    this.allergyInput = '';
    this.showSuggestions = false;
  }

  removeAllergy(allergy: string) {
    this.selectedAllergies = this.selectedAllergies.filter(item => item !== allergy);
  }

  goToNextStep() {
    // Lưu dữ liệu vào service nếu cần
    console.log('Dietary Preference:', this.dietaryPreference);
    console.log('Allergies:', this.selectedAllergies);
    
    // Điều hướng đến trang Customer Details
    this.router.navigate(['/checkout/customer-details']);
  }
}