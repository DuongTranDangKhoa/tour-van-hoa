// src/app/components/checkout-stepper/checkout-stepper.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  number: number;
  title: string;
  status: 'pending' | 'active' | 'completed';
}

@Component({
  selector: 'app-checkout-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkout-stepper">
      <div class="stepper-header">
        <div class="logo">
          <span class="logo-text">GET YOUR GUIDE</span>
        </div>
        <div class="progress-steps">
          <div class="step" 
               *ngFor="let step of steps" 
               [class.active]="step.status === 'active'"
               [class.completed]="step.status === 'completed'"
               [class.pending]="step.status === 'pending'"
               [class.clickable]="step.status === 'completed'"
               (click)="onStepClick(step)">
            <div class="step-number">
              <span *ngIf="step.status === 'completed'">✓</span>
              <span *ngIf="step.status !== 'completed'">{{ step.number }}</span>
            </div>
            <span class="step-title">{{ step.title }}</span>
          </div>
        </div>
      </div>
      
      <!-- Timer Section -->
      <div class="timer-section" *ngIf="showTimer">
        <div class="timer-icon">⏰</div>
        <span>We'll hold your spot for {{ remainingTime }} minutes.</span>
      </div>

      <!-- Security Badge -->
      <div class="security-badge" *ngIf="showSecurity">
        <div class="security-icon">🔒</div>
        <span>Checkout is fast and secure</span>
      </div>
    </div>
  `,
  styles: [`
    .checkout-stepper {
      background: white;
    }

    .stepper-header {
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e0e0e0;
    }

    .logo-text {
      font-weight: bold;
      color: #ff6b35;
      font-size: 1.2rem;
    }

    .progress-steps {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
      transition: color 0.3s ease;
    }

    .step.clickable {
      cursor: pointer;
    }

    .step.active {
      color: #007bff;
      font-weight: 500;
    }

    .step.completed {
      color: #28a745;
    }

    .step.pending {
      color: #6c757d;
    }

    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .step.active .step-number {
      background: #007bff;
      color: white;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
    }

    .step.completed .step-number {
      background: #28a745;
      color: white;
    }

    .step.pending .step-number {
      background: #f8f9fa;
      color: #6c757d;
      border: 2px solid #e0e0e0;
    }

    .step-title {
      font-weight: inherit;
    }

    .timer-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      color: #856404;
      font-size: 0.9rem;
    }

    .timer-icon {
      font-size: 1.1rem;
    }

    .security-badge {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #28a745;
      padding: 0.75rem 2rem;
      font-size: 0.9rem;
      background: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
    }

    .security-icon {
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .stepper-header {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .progress-steps {
        gap: 1rem;
      }
      
      .step {
        flex-direction: column;
        gap: 0.25rem;
        text-align: center;
      }
      
      .step-title {
        font-size: 0.8rem;
      }
      
      .timer-section,
      .security-badge {
        padding: 0.75rem 1rem;
      }
    }

    @media (max-width: 480px) {
      .progress-steps {
        gap: 0.5rem;
      }
      
      .step-title {
        display: none;
      }
      
      .step-number {
        width: 24px;
        height: 24px;
        font-size: 0.8rem;
      }
    }
  `]
})
export class CheckoutStepperComponent {
  @Input() currentStep: number = 1;
  @Input() showTimer: boolean = true;
  @Input() showSecurity: boolean = true;
  @Input() remainingTime: string = '29:43';
  @Output() stepChange = new EventEmitter<number>();

  steps: Step[] = [
    { number: 1, title: 'Activity', status: 'pending' },
    { number: 2, title: 'Contact', status: 'pending' },
    { number: 3, title: 'Payment', status: 'pending' }
  ];

  ngOnInit() {
    this.updateStepStatus();
  }

  ngOnChanges() {
    this.updateStepStatus();
  }

  private updateStepStatus() {
    this.steps = this.steps.map(step => {
      if (step.number < this.currentStep) {
        return { ...step, status: 'completed' };
      } else if (step.number === this.currentStep) {
        return { ...step, status: 'active' };
      } else {
        return { ...step, status: 'pending' };
      }
    });
  }

  onStepClick(step: Step): void {
    // Chỉ cho phép điều hướng về các bước đã hoàn thành.
    if (step.status === 'completed') {
      this.stepChange.emit(step.number);
    }
  }
}