// Frontend API Test - Run this in browser console to test API connectivity
console.log('🧪 Testing Frontend API Connectivity...');

// Test the API call that the Events page should be making
fetch('http://localhost:3010/api/events')
  .then(response => {
    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response OK:', response.ok);
    return response.json();
  })
  .then(data => {
    console.log('✅ API Data received:', data.length, 'events');
    console.log('📊 First event:', data[0]);
    
    // Test specific event structure
    const event = data[0];
    const requiredFields = ['id', 'title', 'description', 'date', 'time', 'location', 'price'];
    const missingFields = requiredFields.filter(field => !event.hasOwnProperty(field));
    
    if (missingFields.length === 0) {
      console.log('✅ Event structure is correct');
    } else {
      console.log('❌ Missing fields:', missingFields);
    }
  })
  .catch(error => {
    console.error('❌ API Error:', error);
    console.log('🔧 Troubleshooting:');
    console.log('- Check if mock API server is running on port 3010');
    console.log('- Check browser network tab for CORS errors');
    console.log('- Verify API endpoint is accessible');
  });

// Also test the exact same call that React Query would make
import('http://localhost:3010/api/events')
  .then(() => console.log('✅ Module import test passed'))
  .catch(() => console.log('ℹ️ Module import test failed (expected)'));

console.log('🔍 Open Network tab to see API requests...');
