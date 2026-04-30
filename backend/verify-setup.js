#!/usr/bin/env node

/**
 * Super Admin System - Setup Verification Script
 * Run this script to verify all components are properly set up
 * 
 * Usage: node backend/verify-setup.js
 */

const fs = require('fs');
const path = require('path');
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    log(`✓ ${description}`, 'green');
    return true;
  } else {
    log(`✗ ${description} - NOT FOUND: ${filePath}`, 'red');
    return false;
  }
}

function checkFileContent(filePath, searchString, description) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    log(`✗ ${description} - File not found`, 'red');
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes(searchString)) {
    log(`✓ ${description}`, 'green');
    return true;
  } else {
    log(`✗ ${description} - Content not found`, 'red');
    return false;
  }
}

log('\n🔍 DevFlx Super Admin System - Verification', 'blue');
log('='.repeat(50), 'blue');

let passed = 0;
let total = 0;

log('\n📂 Checking Core Files...', 'blue');

const files = [
  ['src/middleware/roleMiddleware.js', 'Role-based access middleware'],
  ['src/middleware/authMiddleware.js', 'Authentication middleware'],
  ['src/seeds/superadminSeeder.js', 'Super admin seeder'],
  ['src/utils/passwordValidator.js', 'Password validator'],
  ['src/controllers/superadminController.js', 'Super admin controller'],
  ['src/routes/superadminRoutes.js', 'Super admin routes'],
  ['src/models/userModel.js', 'User model'],
  ['src/services/authService.js', 'Auth service'],
  ['src/app.js', 'Main app config'],
  ['src/server.js', 'Server entry point'],
  ['migrations/sqls/20260429000000-create-users-up.sql', 'Users migration'],
];

files.forEach(([file, desc]) => {
  total++;
  if (checkFile(file, desc)) passed++;
});

log('\n📝 Checking File Contents...', 'blue');

const contentChecks = [
  ['src/middleware/roleMiddleware.js', 'requireRole', 'requireRole middleware exported'],
  ['src/seeds/superadminSeeder.js', 'seedSuperAdmins', 'seedSuperAdmins function exists'],
  ['src/utils/passwordValidator.js', 'validatePassword', 'validatePassword function exists'],
  ['src/controllers/superadminController.js', 'getDashboard', 'getDashboard controller exists'],
  ['src/routes/superadminRoutes.js', '/api/superadmin', 'Routes configured'],
  ['src/app.js', 'superadminRoutes', 'Super admin routes mounted in app'],
  ['src/server.js', 'seedSuperAdmins', 'Seeder called in server.js'],
  ['src/models/userModel.js', 'countByRole', 'User model has countByRole function'],
  ['src/services/authService.js', 'createUserByAdmin', 'Auth service has createUserByAdmin'],
  ['migrations/sqls/20260429000000-create-users-up.sql', 'created_by', 'created_by field in migration'],
];

contentChecks.forEach(([file, search, desc]) => {
  total++;
  if (checkFileContent(file, search, desc)) passed++;
});

log('\n📚 Checking Documentation...', 'blue');

const docFiles = [
  ['README.md', 'Backend README updated'],
  ['SUPERADMIN_SYSTEM.md', 'Full system documentation'],
  ['SUPERADMIN_API_REFERENCE.md', 'API reference guide'],
  ['SUPERADMIN_TESTING_GUIDE.md', 'Testing guide'],
  ['IMPLEMENTATION_SUMMARY.md', 'Implementation summary'],
  ['QUICK_START.md', 'Quick start guide'],
];

docFiles.forEach(([file, desc]) => {
  total++;
  if (checkFile(file, desc)) passed++;
});

log('\n📋 Environment Variables Checklist...', 'blue');

const envFile = path.join(__dirname, '.env.example');
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'PORT',
    'NODE_ENV',
    'FRONTEND_ORIGIN',
  ];

  requiredVars.forEach((varName) => {
    total++;
    if (envContent.includes(varName)) {
      log(`✓ ${varName} documented in .env.example`, 'green');
      passed++;
    } else {
      log(`✗ ${varName} not found in .env.example`, 'red');
    }
  });
} else {
  log('✗ .env.example file not found', 'red');
  total += 5;
}

log('\n📊 Verification Results', 'blue');
log('='.repeat(50), 'blue');
log(`Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
log('='.repeat(50), 'blue');

if (passed === total) {
  log('\n✅ All checks passed! Your super admin system is ready.', 'green');
  log('\nNext steps:', 'blue');
  log('1. Run: npm run migrate up', 'blue');
  log('2. Run: npm run dev', 'blue');
  log('3. Check seeder output for account creation', 'blue');
  log('4. Login with: saqib.mustafa@gmail.com / Saqib@123', 'blue');
  process.exit(0);
} else {
  log(`\n⚠️  ${total - passed} checks failed. Please review above.`, 'red');
  log('\nFor help, see: QUICK_START.md or SUPERADMIN_SYSTEM.md', 'yellow');
  process.exit(1);
}
