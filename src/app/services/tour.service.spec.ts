import { TestBed } from '@angular/core/testing';

import { TourService } from './tour.service';

describe('TourService', () => {
  let service: TourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return Vietnam Art & Culture Tour', (done) => {
    service.getTours().subscribe(tours => {
      const vietnamTour = tours.find(tour => tour.name.includes('Vietnam Art & Culture Tour'));
      expect(vietnamTour).toBeTruthy();
      expect(vietnamTour?.id).toBe(4);
      expect(vietnamTour?.category).toBe('Cultural');
      expect(vietnamTour?.destination).toBe('Da Nang - Hoi An');
      done();
    });
  });

  it('should filter tours by destination', (done) => {
    service.filterToursByDestination('Da Nang').subscribe(tours => {
      expect(tours.length).toBeGreaterThan(0);
      expect(tours.some(tour => tour.destination.includes('Da Nang'))).toBeTruthy();
      done();
    });
  });
});
