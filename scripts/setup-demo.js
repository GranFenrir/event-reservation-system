#!/usr/bin/env node

/**
 * Demo Data Setup Script
 * Creates sample venues, events, and tickets for demonstration
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

const sampleData = {
  venues: [
    {
      name: "Grand Concert Hall",
      description: "A magnificent concert hall with perfect acoustics",
      address: "123 Symphony Street",
      city: "Music City",
      country: "United States",
      capacity: 2000
    },
    {
      name: "Outdoor Festival Grounds",
      description: "Large outdoor venue perfect for festivals and concerts",
      address: "456 Festival Avenue",
      city: "Festival Town",
      country: "United States",
      capacity: 5000
    },
    {
      name: "Intimate Jazz Club",
      description: "Cozy venue with intimate atmosphere for jazz performances",
      address: "789 Jazz Lane",
      city: "Blues City",
      country: "United States",
      capacity: 200
    }
  ],
  events: [
    {
      title: "Summer Music Festival 2025",
      description: "The biggest music festival of the summer featuring top artists from around the world",
      startDate: "2025-08-15T18:00:00.000Z",
      endDate: "2025-08-17T23:00:00.000Z",
      saleStartDate: "2025-07-01T00:00:00.000Z",
      saleEndDate: "2025-08-15T12:00:00.000Z",
      category: "Music",
      totalSeats: 5000,
      ticketPrices: [
        { type: "vip", name: "VIP Experience", price: 299.99, maxQuantity: 100 },
        { type: "premium", name: "Premium Seating", price: 149.99, maxQuantity: 500 },
        { type: "standard", name: "General Admission", price: 89.99, maxQuantity: 4000 },
        { type: "economy", name: "Early Bird", price: 59.99, maxQuantity: 400 }
      ]
    },
    {
      title: "Classical Evening with Symphony Orchestra",
      description: "An enchanting evening of classical music performed by the renowned Symphony Orchestra",
      startDate: "2025-09-20T19:30:00.000Z",
      endDate: "2025-09-20T22:00:00.000Z",
      saleStartDate: "2025-08-01T00:00:00.000Z",
      saleEndDate: "2025-09-20T18:00:00.000Z",
      category: "Classical",
      totalSeats: 2000,
      ticketPrices: [
        { type: "premium", name: "Orchestra Seating", price: 120.00, maxQuantity: 300 },
        { type: "standard", name: "Mezzanine", price: 85.00, maxQuantity: 800 },
        { type: "economy", name: "Balcony", price: 45.00, maxQuantity: 900 }
      ]
    },
    {
      title: "Jazz Night: Legends Live",
      description: "Intimate jazz performance featuring legendary artists in an exclusive setting",
      startDate: "2025-10-12T20:00:00.000Z",
      endDate: "2025-10-12T23:30:00.000Z",
      saleStartDate: "2025-09-01T00:00:00.000Z",
      saleEndDate: "2025-10-12T19:00:00.000Z",
      category: "Jazz",
      totalSeats: 200,
      ticketPrices: [
        { type: "vip", name: "Front Row Experience", price: 180.00, maxQuantity: 20 },
        { type: "premium", name: "Reserved Table", price: 120.00, maxQuantity: 80 },
        { type: "standard", name: "General Seating", price: 75.00, maxQuantity: 100 }
      ]
    },
    {
      title: "Rock Concert: Electric Nights",
      description: "High-energy rock concert featuring the hottest bands",
      startDate: "2025-11-05T19:00:00.000Z",
      endDate: "2025-11-05T23:00:00.000Z",
      saleStartDate: "2025-10-01T00:00:00.000Z",
      saleEndDate: "2025-11-05T18:00:00.000Z",
      category: "Rock",
      totalSeats: 2000,
      ticketPrices: [
        { type: "vip", name: "Backstage Pass", price: 250.00, maxQuantity: 50 },
        { type: "premium", name: "Pit Access", price: 150.00, maxQuantity: 200 },
        { type: "standard", name: "General Admission", price: 95.00, maxQuantity: 1500 },
        { type: "economy", name: "Student Discount", price: 65.00, maxQuantity: 250 }
      ]
    }
  ]
};

async function createVenues() {
  console.log('🏢 Creating venues...');
  const venues = [];
  
  for (const venue of sampleData.venues) {
    try {
      const response = await axios.post(`${BASE_URL}/venues`, venue);
      venues.push(response.data.data);
      console.log(`✅ Created venue: ${venue.name}`);
    } catch (error) {
      console.error(`❌ Failed to create venue ${venue.name}:`, error.response?.data?.message || error.message);
    }
  }
  
  return venues;
}

async function createEvents(venues) {
  console.log('🎪 Creating events...');
  
  for (let i = 0; i < sampleData.events.length && i < venues.length; i++) {
    const event = sampleData.events[i];
    const venue = venues[i % venues.length]; // Cycle through venues
    
    try {
      const eventData = {
        ...event,
        venueId: venue.id
      };
      
      const response = await axios.post(`${BASE_URL}/events`, eventData);
      console.log(`✅ Created event: ${event.title}`);
    } catch (error) {
      console.error(`❌ Failed to create event ${event.title}:`, error.response?.data?.message || error.message);
    }
  }
}

async function setupDemo() {
  console.log('🚀 Setting up demo data for Event Reservation System...\n');
  
  // Check if services are running
  try {
    await axios.get(`${BASE_URL}/health`);
    console.log('✅ Services are running\n');
  } catch (error) {
    console.error('❌ Services are not running. Please start the microservices first.');
    console.error('Run: npm run start:services\n');
    process.exit(1);
  }
  
  try {
    // Create venues
    const venues = await createVenues();
    console.log(`\n✅ Created ${venues.length} venues\n`);
    
    // Wait a moment for venues to be saved
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create events
    await createEvents(venues);
    console.log(`\n✅ Created ${sampleData.events.length} events\n`);
    
    console.log('🎉 Demo setup complete!\n');
    console.log('📍 You can now visit:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Admin Panel: http://localhost:3010\n');
    console.log('📊 Sample data includes:');
    console.log(`   - ${venues.length} venues`);
    console.log(`   - ${sampleData.events.length} events with multiple ticket types`);
    console.log('   - Various categories: Music, Classical, Jazz, Rock\n');
    
  } catch (error) {
    console.error('❌ Demo setup failed:', error.message);
    process.exit(1);
  }
}

// Run the demo setup
if (require.main === module) {
  setupDemo();
}

module.exports = { setupDemo, sampleData };
