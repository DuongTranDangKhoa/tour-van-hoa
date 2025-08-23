# Vietnam Art & Culture Tour - This Is Home

> **Language Note:** This tour is now displayed 100% in English for international audiences.

## Tour Information

**Tour ID:** 4  
**Name:** Vietnam Art & Culture Tour – This Is Home  
**Category:** Cultural  
**Destination:** Da Nang - Hoi An  
**Duration:** 1 ngày (9 giờ)  
**Price:** 296,000,000 VND (approximately SGD $296)  
**Rating:** 4.9/5  
**Max Group Size:** 16 people  
**Difficulty:** Easy  
**Departure Date:** Daily  
**Languages:** Vietnamese, English  
**Tour Program:** Detailed tour program will be provided upon booking confirmation  

## Tour Description

Step into the heart of Vietnam with the Vietnam Art & Culture Tour by This Is Home — an immersive cultural journey designed to connect you with the country's authentic heritage. From traditional craft workshops to wandering the lantern-lit streets of Hoi An, every moment reveals the timeless beauty of Vietnam's traditions. Guided by passionate locals, this full-day adventure blends creativity, cuisine, and community, leaving you with unforgettable memories of Vietnam's soul.

### 💰 Pricing
- **Package 1:** 7-seater – $307/tour | 16-seater – $635/tour
- **Package 2:** 7-seater – $42/tour | 16-seater – $35/tour
- **Full program:** SGD $296 per person (excludes international flights)

### 🏨 Accommodation (Multi-day Option)
- 3–4 star hotels
- Double rooms (single available upon request)
- Wi-Fi & TV included

### 🍴 Meals Included
- Hotel breakfast
- 4 lunches
- 3 dinners (including Welcome Dinner & Gala Dinner)

### 🦽 Accessibility
- Wheelchair-friendly venues

### 📌 What's Included
- Entrance fees
- English-speaking guides
- All workshops
- Transportation
- Meals
- Gift set

### ❌ What's Not Included
- Personal expenses
- Shopping
- Phone calls
- Additional drinks/meals
- International flights

### 📲 Booking & Contact
- **Website:** tih.nhi.sg
- **Email:** danh@nhi.sg
- **WhatsApp:** +84 367666618

## Highlights

- 🌏 Authentic cultural immersion with local artisans
- ☕ Hands-on coffee brewing workshop at Hush Workspace
- 🏺 Pottery-making at Le Duc Ha Terra Cotta Studio, including lunch
- 🪵 Wood carving workshop at Au Lac with master artisans
- 🏮 Explore the enchanting lantern-lit Hoi An Ancient Town
- 🏖️ Relax and discover Vietnam's stunning beaches
- 🍲 Savor authentic local cuisine, rich in flavor
- 🎁 Receive a special keepsake gift set from This Is Home

## What's Included

- Phí vào cửa (Entrance fees)
- Hướng dẫn viên nói tiếng Anh (English-speaking guides)
- Tất cả các workshop (All workshops)
- Vận chuyển (Transportation)
- Bữa ăn (Meals)
- Bộ quà tặng (Gift set)
- Đón và trả khách tại khách sạn/văn phòng (Hotel/office pick-up & drop-off)

## What's Not Included

- Chi phí cá nhân (Personal expenses)
- Mua sắm (Shopping)
- Điện thoại (Phone calls)
- Đồ uống/bữa ăn bổ sung (Additional drinks/meals)
- Vé máy bay quốc tế (International flights)

## General Information

- **Destination:** Da Nang - Hoi An
- **Duration:** 1 day (9 hours)
- **Max Group Size:** 16 people
- **Price:** ₫296,000,000
- **Departure Date:** Daily
- **Languages:** Vietnamese, English
- **Difficulty:** Easy
- **Date & Time:** Departure at 08:45 AM – Return at 5:30 PM (full-day tour)
- **Location:** Hotel/office pick-up & drop-off in the Da Nang – Hoi An area
- **Age requirement:** Suitable for all ages; children under 16 must be accompanied by an adult
- **Transportation:** Private coach (7-seater or 16-seater), air-conditioned
- **Accessibility:** Wheelchair-friendly venues

## Tour Program

Detailed tour program will be provided upon booking confirmation.

## Pricing Options

- **Package 1:** 7-seater – $307/tour | 16-seater – $635/tour
- **Package 2:** 7-seater – $42/tour | 16-seater – $35/tour
- **Full program:** SGD $296 per person (excludes international flights)

## Accommodation (Multi-day Option)

- 3–4 star hotels
- Double rooms (single available upon request)
- Wi-Fi & TV included
- **Meals included:** Hotel breakfast, 4 lunches, 3 dinners (including Welcome Dinner & Gala Dinner)

## Contact Information

- **Website:** tih.nhi.sg
- **Email:** danh@nhi.sg
- **WhatsApp:** +84 367666618

## How to Use This Tour in the Application

### 1. View All Tours
The tour will automatically appear in the tour list on the home page.

### 2. Filter by Category
Use the "Cultural" category filter to see only cultural tours including this one.

### 3. Search by Destination
Search for "Da Nang" or "Hoi An" to find this tour.

### 4. Filter by Price
The tour is priced at 296,000,000 VND, so it will appear when filtering by higher price ranges.

### 5. View Tour Details
Click on the tour card to see detailed information and proceed to booking.

**Highlights Display:** The tour highlights are now displayed as a properly formatted list with line breaks, making them easy to read.

## Technical Implementation

The tour has been added to the `TourService` with the following structure:

```typescript
{
  id: 4,
  name: 'Vietnam Art & Culture Tour – This Is Home',
  description: '...',
  duration: '1 ngày (9 giờ)',
  price: 296000000,
  imageUrl: '/city-image/da-nang.jpg',
  destination: 'Da Nang - Hoi An',
  rating: 4.9,
  maxGroupSize: 16,
  difficulty: 'Easy',
  category: 'Cultural',
  departureDate: 'Daily',
  languages: ['Vietnamese', 'English'],
  tourProgram: '💰 Pricing:\nPackage 1: 7-seater – $307/tour | 16-seater – $635/tour.\nPackage 2: 7-seater – $42/tour | 16-seater – $35/tour.\nFull program: SGD $296 per person (excludes international flights).\n\n🏨 Accommodation (multi-day option): 3–4 star hotels, double rooms (single available upon request), with Wi-Fi & TV.\n🍴 Meals included: Hotel breakfast, 4 lunches, 3 dinners (including Welcome Dinner & Gala Dinner).\n🦽 Accessibility: Wheelchair-friendly venues.\n📌 Included: Entrance fees, English-speaking guides, all workshops, transportation, meals, and gift set.\n❌ Not included: Personal expenses, shopping, phone calls, additional drinks/meals, international flights.\n📲 Booking & Contact:\nWebsite: tih.nhi.sg\nEmail: danh@nhi.sg\nWhatsApp: +84 367666618',
  highlights: [...],
  included: [...],
  notIncluded: [...]
}
```

## Features Added

1. **New Tour:** Vietnam Art & Culture Tour with complete information
2. **Enhanced Service:** Added `filterToursByDestination()` method
3. **Local Image:** Uses the existing Da Nang city image
4. **Comprehensive Details:** Includes all highlights, inclusions, and exclusions
5. **Proper Categorization:** Marked as Cultural tour for easy filtering
6. **Additional Information:** Departure dates, languages, and tour program details
7. **Enhanced Model:** Extended Tour interface with new optional fields

## Testing

The tour can be tested by:
1. Starting the application (`ng serve`)
2. Navigating to the home page
3. Looking for the new tour in the tour list
4. Testing filters and search functionality
5. Verifying tour details and booking flow

## Notes

- The tour price is set in VND for consistency with other tours
- The image uses the existing Da Nang city image from the public folder
- **All tour information is now 100% in English** for international audiences
- The tour follows the same data structure as existing tours
- Additional filtering methods have been added for better tour discovery
