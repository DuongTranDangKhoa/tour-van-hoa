/**
 * Demo Data for Customer Details Component
 * This file contains sample data to test the component functionality
 */

export const DEMO_TOUR_DATA = {
  tourId: 1,
  tourName: 'Vietnam Art & Culture Tour – This Is Home',
  imageUrl: 'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=65,height=65/tour_img/5c9e27e2d47d4.jpeg',
  selectedDate: 'Saturday, September 6, 2025',
  selectedSession: '8:45 AM',
  participants: [
    {
      type: 'shared7',
      name: 'Shared 7',
      price: 37,
      fee: 0,
      quantity: 2
    },
    {
      type: 'shared16',
      name: 'Shared 16',
      price: 37,
      fee: 0,
      quantity: 1
    }
  ],
  addOn: {
    name: 'Photo Opportunity',
    price: 15,
    quantity: 1
  },
  totalPrice: 2715000 // (37 * 2 + 37 * 1) * 24500 VND
};

export const DEMO_CUSTOMER_DATA = {
  fullName: 'Nguyen Van A',
  email: 'nguyenvana@example.com',
  country: 'VN',
  phone: '+84 912345678',
  dietaryPreference: 'non-vegetarian',
  allergies: ['Hải sản', 'Đậu phộng'],
  specialRequest: 'Need wheelchair access and vegetarian meal for one person'
};

/**
 * How to test the component:
 * 
 * 1. Direct Access (Default/Demo Mode):
 *    - Navigate to /checkout/details
 *    - Component will show simulated tour data
 * 
 * 2. With Real Booking Data:
 *    - Navigate from booking-detail with router state
 *    - Component will show actual tour selection
 * 
 * 3. Test Currency Conversion:
 *    - USD prices are converted to VND
 *    - Both currencies are displayed in order summary
 * 
 * 4. Test Dynamic Content:
 *    - Tour name, image, date, time change based on selection
 *    - Participant count and types update automatically
 *    - Total price calculates correctly
 */ 