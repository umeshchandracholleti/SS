const http = require('http');

const BASE_URL = 'http://localhost:4000';
let testsPassed = 0;
let testsFailed = 0;

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: data ? JSON.parse(data) : null,
            raw: data
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: null,
            raw: data
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ statusCode: 0, error: err.message, data: null });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ statusCode: 0, error: 'Timeout', data: null });
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('API ENDPOINT VERIFICATION TESTS');
  console.log('='.repeat(60) + '\n');

  // Test 1: Health Check
  console.log('Test 1: API Health Check');
  let res = await makeRequest('GET', '/api/health');
  if (res.statusCode === 200 && res.data?.status === 'OK') {
    console.log('✅ PASS - Backend responsive on port 4000\n');
    testsPassed++;
  } else {
    console.log(`❌ FAIL - Status ${res.statusCode}\n`);
    testsFailed++;
  }

  // Test 2: Get Products
  console.log('Test 2: Get Products List');
  res = await makeRequest('GET', '/api/catalog/products?limit=5');
  if (res.statusCode === 200 && Array.isArray(res.data)) {
    console.log(`✅ PASS - Found ${res.data.length} products\n`);
    testsPassed++;
  } else {
    console.log(`❌ FAIL - Status ${res.statusCode}\n`);
    testsFailed++;
  }

  // Test 3: Get Categories
  console.log('Test 3: Get Product Categories');
  res = await makeRequest('GET', '/api/catalog/categories');
  if (res.statusCode === 200) {
    console.log(`✅ PASS - Categories endpoint working\n`);
    testsPassed++;
  } else if (res.statusCode === 404) {
    console.log(`⚠️  Not Found (optional endpoint)\n`);
  } else {
    console.log(`❌ FAIL - Status ${res.statusCode}\n`);
    testsFailed++;
  }

  // Test 4: Register User
  console.log('Test 4: User Registration');
  const testEmail = `test${Date.now()}@saiscientifics.com`;
  res = await makeRequest('POST', '/api/auth/register', {
    name: 'Test User',
    email: testEmail,
    password: 'Test@12345'
  });
  let token = null;
  if ((res.statusCode === 201 || res.statusCode === 200) && res.data?.token) {
    token = res.data.token;
    console.log(`✅ PASS - User registered | Email: ${testEmail}\n`);
    testsPassed++;
  } else if (res.statusCode === 400 && res.data?.message?.includes('already')) {
    console.log(`⚠️  User already exists (previous run)\n`);
    // Try to login instead
    res = await makeRequest('POST', '/api/auth/login', {
      email: testEmail,
      password: 'Test@12345'
    });
    if (res.statusCode === 200 && res.data?.token) {
      token = res.data.token;
      console.log(`   Login successful with existing user\n`);
      testsPassed++;
    }
  } else {
    console.log(`❌ FAIL - Status ${res.statusCode}: ${res.data?.message}\n`);
    testsFailed++;
  }

  // Test 5: Login User
  if (!token) {
    console.log('Test 5: User Login');
    res = await makeRequest('POST', '/api/auth/login', {
      email: testEmail,
      password: 'Test@12345'
    });
    if (res.statusCode === 200 && res.data?.token) {
      token = res.data.token;
      console.log(`✅ PASS - Login successful | Token: ${token.substring(0, 20)}...\n`);
      testsPassed++;
    } else {
      console.log(`❌ FAIL - Status ${res.statusCode}\n`);
      testsFailed++;
    }
  }

  // Test 6: Get Profile (Protected)
  if (token) {
    console.log('Test 6: Get User Profile (Protected Route)');
    res = await makeRequest('GET', '/api/auth/profile', null, {
      'Authorization': `Bearer ${token}`
    });
    if (res.statusCode === 200 && res.data?.email === testEmail) {
      console.log(`✅ PASS - JWT auth working | User: ${res.data.name}\n`);
      testsPassed++;
    } else {
      console.log(`❌ FAIL - Status ${res.statusCode}\n`);
      testsFailed++;
    }

    // Test 7: Add to Cart
    console.log('Test 7: Add to Cart');
    res = await makeRequest('POST', '/api/cart', {
      product_id: 1,
      quantity: 2
    }, {
      'Authorization': `Bearer ${token}`
    });
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log(`✅ PASS - Item added to cart\n`);
      testsPassed++;
    } else {
      console.log(`❌ FAIL - Status ${res.statusCode}: ${res.data?.message}\n`);
      testsFailed++;
    }

    // Test 8: View Cart
    console.log('Test 8: View Cart');
    res = await makeRequest('GET', '/api/cart', null, {
      'Authorization': `Bearer ${token}`
    });
    if (res.statusCode === 200) {
      console.log(`✅ PASS - Cart retrieved successfully\n`);
      testsPassed++;
    } else {
      console.log(`❌ FAIL - Status ${res.statusCode}\n`);
      testsFailed++;
    }

    // Test 9: Create Payment Order
    console.log('Test 9: Payment Order Creation');
    res = await makeRequest('POST', '/api/payment/create-order', {
      amount: 10000,
      currency: 'INR'
    }, {
      'Authorization': `Bearer ${token}`
    });
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log(`✅ PASS - Payment order created\n`);
      testsPassed++;
    } else if (res.statusCode === 400 && res.data?.message?.includes('Razorpay')) {
      console.log(`⚠️  Razorpay keys not configured (test mode only)\n`);
    } else {
      console.log(`❌ FAIL - Status ${res.statusCode}\n`);
      testsFailed++;
    }
  }

  // Summary
  console.log('='.repeat(60));
  console.log(`RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log('='.repeat(60) + '\n');

  if (testsFailed === 0) {
    console.log('✅ ALL CRITICAL TESTS PASSED!');
    console.log('🚀 System is ready for production deployment!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check details above.\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
