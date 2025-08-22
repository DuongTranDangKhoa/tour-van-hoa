import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { Tour } from '../../models/tour';

@Component({
  selector: 'app-dietary-preferences',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dietary-preferences.component.html',
  styleUrls: ['./dietary-preferences.component.scss']
})
export class DietaryPreferencesComponent implements OnInit, OnDestroy {
  @Input() tour: Tour | null = null;
  @Input() bookingData: any = null;
  @Output() next = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();

  dietaryForm: FormGroup;
  timeLeft = 29 * 60 + 43; // 29:43 minutes in seconds
  private timer: any;

  // Common allergies list
  commonAllergies = [
    'Tôm cua',
    'Sữa',
    'Trứng',
    'Cá',
    'Đậu phộng',
    'Các loại hạt',
    'Đậu nành',
    'Lúa mì',
    'Mè',
    'Sulfit'
  ];

  constructor(private fb: FormBuilder) {
    // Initialize the form
    this.dietaryForm = this.fb.group({
      dietaryType: ['meat', Validators.required],
      selectedAllergies: this.fb.array([]),
      customAllergy: [''],
      additionalNotes: ['']
    });

    // Initialize allergy checkboxes
    this.initializeAllergies();
  }

  ngOnInit() {
    this.startTimer();
    this.prefillFormData();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  get selectedAllergiesArray() {
    return this.dietaryForm.get('selectedAllergies') as FormArray;
  }

  // Helper method to get FormControl at specific index
  getAllergyControlAt(index: number): FormControl {
    return this.selectedAllergiesArray.at(index) as FormControl;
  }

  private initializeAllergies() {
    const allergiesFormArray = this.fb.array([]);
    this.commonAllergies.forEach(() => {
      allergiesFormArray.push(new FormControl(false));
    });
    this.dietaryForm.setControl('selectedAllergies', allergiesFormArray);
  }

  private startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        // Handle timeout - could navigate back or show warning
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  private prefillFormData() {
    // Pre-fill with existing data if available
    if (this.bookingData?.dietaryPreferences) {
      this.dietaryForm.patchValue({
        dietaryType: this.bookingData.dietaryPreferences.dietaryType || 'meat',
        additionalNotes: this.bookingData.dietaryPreferences.additionalNotes || ''
      });

      // Set allergies if they exist
      if (this.bookingData.dietaryPreferences.allergies) {
        this.bookingData.dietaryPreferences.allergies.forEach((allergy: string) => {
          const index = this.commonAllergies.indexOf(allergy);
          if (index >= 0) {
            this.getAllergyControlAt(index).setValue(true);
          }
        });
      }
    }
  }

  addCustomAllergy() {
    const customAllergyValue = this.dietaryForm.get('customAllergy')?.value?.trim();
    if (customAllergyValue && !this.commonAllergies.includes(customAllergyValue)) {
      // Add to common allergies list
      this.commonAllergies.push(customAllergyValue);
      
      // Add new FormControl to the array
      this.selectedAllergiesArray.push(new FormControl(true));
      
      // Clear the custom input
      this.dietaryForm.get('customAllergy')?.setValue('');
    }
  }

  onNext() {
    if (this.dietaryForm.valid) {
      // Collect selected allergies
      const selectedAllergies: string[] = [];
      this.selectedAllergiesArray.controls.forEach((control, index) => {
        if (control.value) {
          selectedAllergies.push(this.commonAllergies[index]);
        }
      });

      const formData = {
        dietaryType: this.dietaryForm.get('dietaryType')?.value,
        allergies: selectedAllergies,
        additionalNotes: this.dietaryForm.get('additionalNotes')?.value || '',
        timestamp: new Date()
      };

      this.next.emit(formData);
    }
  }

  onBack() {
    this.back.emit();
  }

  // Helper method to check if form is valid
  isFormValid(): boolean {
    return this.dietaryForm.get('dietaryType')?.valid || false;
  }

  // Helper method to get selected allergies count
  getSelectedAllergiesCount(): number {
    return this.selectedAllergiesArray.controls.filter(control => control.value).length;
  }
}