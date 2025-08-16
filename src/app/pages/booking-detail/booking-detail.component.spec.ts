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

  it('should generate available dates', () => {
    expect(component.availableDates.length).toBeGreaterThan(0);
  });

  it('should set default selections', () => {
    expect(component.selectedDate).toBeTruthy();
    expect(component.selectedTime).toBeTruthy();
    expect(component.selectedZone).toBeTruthy();
  });

  it('should increase ticket quantity', () => {
    const initialQuantity = component.ticketQuantity;
    component.increaseQuantity();
    expect(component.ticketQuantity).toBe(initialQuantity + 1);
  });

  it('should decrease ticket quantity but not below 1', () => {
    component.ticketQuantity = 2;
    component.decreaseQuantity();
    expect(component.ticketQuantity).toBe(1);
    
    component.decreaseQuantity();
    expect(component.ticketQuantity).toBe(1);
  });

  it('should calculate total price correctly', () => {
    component.selectedZone = 'Zone A';
    component.ticketQuantity = 2;
    expect(component.getTotalPrice()).toBe(2000000);
  });
});
