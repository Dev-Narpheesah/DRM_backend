// Simple test to verify backend setup
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing backend setup...');

// Test 1: Check if environment variables are loaded
console.log('Environment check:');
console.log('- MONGODB URI:', process.env.MONGODB ? '✓ Set' : '✗ Missing');
console.log('- JWT SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');

// Test 2: Test MongoDB connection
async function testMongoConnection() {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log('✓ MongoDB connection successful');
    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
  }
}

// Test 3: Test required modules can be loaded
function testModuleImports() {
  try {
    require('./models/LikeModel');
    require('./models/RatingModel');
    require('./models/CommentModel');
    require('./controllers/likeController');
    require('./controllers/ratingController');
    require('./controllers/commentController');
    console.log('✓ All modules loaded successfully');
  } catch (error) {
    console.error('✗ Module import failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('\n=== Backend Tests ===\n');
  
  testModuleImports();
  await testMongoConnection();
  
  console.log('\n=== Test Complete ===');
  process.exit(0);
}

runTests().catch(console.error);

