import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BookingDetailComponent } from './booking-detail.component';
import { TourService } from '../../services/tour.service';
import { Tour } from '../../models/tour';

describe('BookingDetailComponent', () => {
  let component: BookingDetailComponent;
  let fixture: ComponentFixture<BookingDetailComponent>;
  let mockTourService: jasmine.SpyObj<TourService>;
  let mockActivatedRoute: any;

  const mockTour: Tour = {
    id: 1,
    name: 'Test Tour',
    description: 'Test Description',
    duration: '2 days',
    price: 1000000,
    imageUrl: 'test.jpg',
    destination: 'Test Destination',
    rating: 4.5,
    maxGroupSize: 10,
    difficulty: 'Easy',
    category: 'Cultural',
    highlights: ['Highlight 1', 'Highlight 2'],
    included: ['Included 1'],
    notIncluded: ['Not included 1']
  };

  beforeEach(async () => {
    mockTourService = jasmine.createSpyObj('TourService', ['getTourById']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [BookingDetailComponent],
      providers: [
        { provide: TourService, useValue: mockTourService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    mockTourService.getTourById.and.returnValue(of(mockTour));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tour data on init', () => {
    expect(mockTourService.getTourById).toHaveBeenCalledWith(1);
    expect(component.tour).toEqual(mockTour);
  });

  it('should generate available months', () => {
    expect(component.availableMonths.length).toBeGreaterThan(0);
  });

  it('should generate available sessions', () => {
    expect(component.availableSessions.length).toBeGreaterThan(0);
  });

  it('should set default selections', () => {
    expect(component.selectedDate).toBeNull();
    expect(component.selectedSession).toBe('16:00');
  });

  it('should adjust ticket quantity', () => {
    const initialQuantity = component.getTicketQuantity('adult');
    component.adjustQuantity('adult', 1);
    expect(component.getTicketQuantity('adult')).toBe(initialQuantity + 1);
  });

  it('should not decrease ticket quantity below 0', () => {
    component.adjustQuantity('adult', 2);
    component.adjustQuantity('adult', -5);
    expect(component.getTicketQuantity('adult')).toBe(0);
  });

  it('should calculate total price correctly', () => {
    component.adjustQuantity('adult', 2);
    expect(component.getTotalPrice()).toBeGreaterThan(0);
  });

  it('should generate calendar', () => {
    expect(component.days.length).toBeGreaterThan(0);
  });
});
