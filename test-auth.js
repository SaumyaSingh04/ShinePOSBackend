// Simple auth test script
const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/auth';

async function testAuth() {
  try {
    console.log('Testing Authentication APIs...\n');

    // Test Registration
    console.log('1. Testing Registration...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'RESTAURANT'
    };

    const registerResponse = await axios.post(`${BASE_URL}/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data);
    
    const token = registerResponse.data.token;

    // Test Login
    console.log('\n2. Testing Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data);

    // Test Profile
    console.log('\n3. Testing Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile fetch successful:', profileResponse.data);

    console.log('\n🎉 All auth tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run test if server is running
testAuth();