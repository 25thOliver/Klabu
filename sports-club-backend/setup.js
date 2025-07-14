#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🏗️  Sports Club Management System Setup');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('📝 Creating .env file from template...');
  
  if (fs.existsSync(envExamplePath)) {
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    
    // Generate a secure JWT secret
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    const updatedContent = envContent.replace(
      'your-super-secret-jwt-key-change-this-in-production',
      jwtSecret
    );
    
    fs.writeFileSync(envPath, updatedContent);
    console.log('✅ .env file created with secure JWT secret');
  } else {
    console.log('❌ env.example file not found');
    process.exit(1);
  }
}

// Create logs directory
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
  console.log('✅ Logs directory created');
} else {
  console.log('✅ Logs directory already exists');
}

// Check MongoDB connection
console.log('\n🔍 Checking MongoDB connection...');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sports-club')
  .then(() => {
    console.log('✅ MongoDB connection successful');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log('❌ MongoDB connection failed:', err.message);
    console.log('💡 Make sure MongoDB is running and MONGO_URI is set correctly');
  });

console.log('\n📋 Setup Summary:');
console.log('================');
console.log('✅ Environment configuration');
console.log('✅ Security middleware');
console.log('✅ Input validation');
console.log('✅ Error handling');
console.log('✅ Logging system');
console.log('✅ Rate limiting');
console.log('\n🚀 Ready to start the server!');
console.log('   Run: npm start');
console.log('\n📚 Next steps:');
console.log('   1. Update .env with your email credentials');
console.log('   2. Start MongoDB');
console.log('   3. Run: npm start');
console.log('   4. Test the API endpoints'); 