# Customer Details Component Integration

## Overview
The `customer-details` component has been updated to receive and display real tour information from the `booking-detail` component, replacing the previously hardcoded data.

## Key Changes

### 1. Data Flow
- **From**: `booking-detail.component.ts` → Router State → `customer-details.component.ts`
- **Data**: Tour information, selected date/time, participants, and pricing

### 2. New Interfaces
```typescript
interface TourParticipant {
  type: string;
  name: string;
  price: number;
  fee: number;
  quantity: number;
}

interface OrderState {
  tourId: number;
  tourName: string;
  imageUrl: string;
  selectedDate: string;
  selectedSession: string;
  participants: TourParticipant[];
  addOn?: {
    name: string;
    price: number;
    quantity: number;
  };
  totalPrice: number;
}
```

### 3. Currency Conversion
- **Input**: Prices in USD from booking-detail
- **Conversion**: USD → VND (rate: 1 USD = 24,500 VND)
- **Display**: Both USD and VND in the order summary

### 4. Dynamic Content
The component now displays:
- **Tour Name**: Real tour name from booking
- **Tour Image**: Actual tour image URL
- **Date & Time**: Selected date and session from booking
- **Participants**: Real participant count and types
- **Pricing**: Calculated total in both currencies

### 5. Fallback System
- **Primary**: Data from router state (when navigating from booking)
- **Fallback**: Default tour information for direct access
- **Demo**: Simulated data for testing purposes

## Usage Examples

### From Booking Detail
```typescript
// In booking-detail.component.ts
const orderState = {
  tourId: this.tour?.id || 0,
  tourName: this.tour?.name || 'Tour',
  imageUrl: this.tour?.imageUrl,
  selectedDate: this.selectedDate.toDateString(),
  selectedSession: this.selectedSession,
  participants: this.tickets.map(t => ({
    type: t.id,
    name: t.name,
    price: t.price,
    fee: t.bookingFee,
    quantity: t.quantity
  })).filter(t => t.quantity > 0),
  totalPrice: this.getTotalPriceVND() // Converted to VND
};

this.router.navigate(['/checkout/details'], { state: orderState });
```

### In Customer Details
```typescript
// Automatically receives data from router state
ngOnInit(): void {
  const navigation = this.router.getCurrentNavigation();
  if (navigation?.extras.state) {
    this.tourInfo = navigation.extras.state as OrderState;
    this.loadTourInformation();
  } else {
    this.loadDefaultTourInformation();
    this.simulateTourData(); // For demo
  }
}
```

## Benefits

1. **Real-time Data**: No more hardcoded tour information
2. **Accurate Pricing**: Real calculations based on actual selections
3. **Currency Support**: Automatic USD ↔ VND conversion
4. **Flexible Display**: Dynamic content based on booking selections
5. **Fallback Support**: Graceful handling of missing data
6. **Demo Mode**: Easy testing without full booking flow

## Testing

### Direct Access
- Navigate directly to `/checkout/details`
- Component will show default/demo data

### Full Flow
1. Go to tour detail page
2. Select date, time, and tickets
3. Click "Book Now"
4. Navigate to customer details
5. Verify real tour data is displayed

## Future Enhancements

- Add more currency options
- Integrate with real tour API
- Add booking validation
- Support for multiple tours
- Enhanced error handling 