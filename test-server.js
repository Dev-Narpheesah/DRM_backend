// Test server.js syntax and basic functionality
console.log('Testing server.js...');

try {
  // Test 1: Check if server.js can be parsed
  require('./server.js');
  console.log('✓ server.js syntax is valid');
} catch (error) {
  console.error('✗ server.js has syntax errors:', error.message);
  process.exit(1);
}

// Test 2: Check if all required modules can be loaded
const requiredModules = [
  './routes/userRoute',
  './routes/adminRoute', 
  './routes/uploadRoute',
  './routes/paymentRoute',
  './routes/likeRoute',
  './routes/ratingRoute',
  './controllers/commentController'
];

console.log('\nTesting module imports...');
for (const module of requiredModules) {
  try {
    require(module);
    console.log(`✓ ${module} loaded successfully`);
  } catch (error) {
    console.error(`✗ ${module} failed to load:`, error.message);
  }
}

console.log('\n✓ Server.js test completed');

