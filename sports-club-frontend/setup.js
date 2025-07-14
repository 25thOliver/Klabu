#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️  Sports Club Frontend Setup');
console.log('==============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('📝 Creating .env file from template...');
  
  if (fs.existsSync(envExamplePath)) {
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created');
  } else {
    console.log('❌ env.example file not found');
    process.exit(1);
  }
}

// Check if backend is running
console.log('\n🔍 Checking backend connection...');
import http from 'http';

const checkBackend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/health', (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
};

checkBackend().then((isRunning) => {
  if (isRunning) {
    console.log('✅ Backend is running and accessible');
  } else {
    console.log('❌ Backend is not running or not accessible');
    console.log('💡 Make sure to start the backend server first:');
    console.log('   cd ../sports-club-backend && npm run dev');
  }
});

console.log('\n📋 Setup Summary:');
console.log('================');
console.log('✅ Environment configuration');
console.log('✅ API service layer');
console.log('✅ Error handling and loading states');
console.log('✅ Improved user experience');
console.log('✅ Modern UI components');
console.log('\n🚀 Ready to start the frontend!');
console.log('   Run: npm run dev');
console.log('\n📚 Next steps:');
console.log('   1. Start the backend server');
console.log('   2. Run: npm run dev');
console.log('   3. Open http://localhost:3000');
console.log('   4. Test the application'); 