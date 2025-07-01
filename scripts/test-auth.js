#!/usr/bin/env node

/**
 * Authentication System Test Runner
 * Runs the authentication test suite to verify all auth features
 * 
 * Usage: npm run test:auth
 */

const path = require('path');
const { execSync } = require('child_process');

// Set environment to test mode
process.env.NODE_ENV = 'test';

console.log('📋 GastroHub Authentication Test Runner');
console.log('=======================================');
console.log('Running authentication system tests...');

try {
  // Execute the auth test module
  const result = execSync(
    `npx tsx ${path.join(__dirname, '../src/utils/authTest.ts')}`,
    { stdio: 'inherit' }
  );
  
  console.log('🏁 Test execution complete');
} catch (error) {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
}
