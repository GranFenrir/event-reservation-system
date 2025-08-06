const axios = require('axios');

const EVENT_SERVICE_URL = 'http://localhost:3001/api/v1';

// First, let's create a venue
const createVenue = async () => {
  const venue = {
    name: 'Central Park Amphitheater',
    address: '1234 Park Ave',
    city: 'New York',
    country: 'USA',
    postalCode: '10001',
    capacity: 5000,
    description: 'Beautiful outdoor amphitheater in Central Park',
  };

  try {
    const response = await axios.post(`${EVENT_SERVICE_URL}/venues`, venue);
    console.log('✅ Venue created:', response.data.data.name);
    return response.data.data;
  } catch (error) {
    console.log('❌ Venue creation failed:', error.response?.data || error.message);
    return null;
  }
};

// Create events with the venue
const createEvents = async (venueId) => {
  const events = [
    {
      title: 'Summer Music Festival 2025',
      description: 'An amazing outdoor music festival featuring top artists from around the world.',
      imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500',
      startDate: '2025-07-15T18:00:00Z',
      endDate: '2025-07-15T23:00:00Z',
      saleStartDate: '2025-01-01T00:00:00Z',
      saleEndDate: '2025-07-14T23:59:59Z',
      category: 'Music',
      status: 'published',
      totalSeats: 5000,
      venueId: venueId,
      ticketPrices: [
        {
          type: 'standard',
          name: 'Standard Admission',
          price: 89.99,
          description: 'Standard admission',
        },
        {
          type: 'vip',
          name: 'VIP Package',
          price: 199.99,
          description: 'VIP package with premium seating',
        }
      ]
    },
    {
      title: 'Tech Innovation Conference',
      description: 'Join industry leaders for a day of insights into the future of technology.',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500',
      startDate: '2025-08-22T09:00:00Z',
      endDate: '2025-08-22T17:00:00Z',
      saleStartDate: '2025-01-01T00:00:00Z',
      saleEndDate: '2025-08-21T23:59:59Z',
      category: 'Conference',
      status: 'published',
      totalSeats: 800,
      venueId: venueId,
      ticketPrices: [
        {
          type: 'standard',
          name: 'Conference Ticket',
          price: 149.99,
          description: 'Standard conference ticket',
        }
      ]
    },
    {
      title: 'Comedy Night Live',
      description: 'Laugh out loud with our featured comedians in an intimate setting.',
      imageUrl: 'https://images.unsplash.com/photo-1558618043-97dcb4851c8c?w=500',
      startDate: '2025-07-08T20:00:00Z',
      endDate: '2025-07-08T22:00:00Z',
      saleStartDate: '2025-01-01T00:00:00Z',
      saleEndDate: '2025-07-07T23:59:59Z',
      category: 'Comedy',
      status: 'published',
      totalSeats: 200,
      venueId: venueId,
      ticketPrices: [
        {
          type: 'standard',
          name: 'Comedy Show Ticket',
          price: 35.00,
          description: 'Standard seating',
        }
      ]
    }
  ];

  for (const event of events) {
    try {
      const response = await axios.post(`${EVENT_SERVICE_URL}/events`, event);
      console.log('✅ Event created:', response.data.data.title);
    } catch (error) {
      console.log('❌ Event creation failed:', error.response?.data || error.message);
    }
  }
};

// Main function
const seedData = async () => {
  console.log('🌱 Seeding Event Service with sample data...\n');
  
  try {
    // Test connection
    const healthResponse = await axios.get(`${EVENT_SERVICE_URL}/health`);
    console.log('✅ Event Service is healthy\n');
    
    // Create venue
    const venue = await createVenue();
    if (!venue) return;
    
    console.log('');
    
    // Create events
    await createEvents(venue.id);
    
    console.log('\n🎉 Seeding completed successfully!');
    console.log('🔗 Test the API: curl http://localhost:3001/api/v1/events');
    
  } catch (error) {
    console.log('❌ Seeding failed:', error.message);
    console.log('💡 Make sure the Event Service is running on port 3001');
  }
};

seedData();
