/**
 * Super Admin Seeder
 * Creates hardcoded super admin accounts if they don't exist
 * Runs on server startup
 */

const bcrypt = require('bcrypt');
const db = require('../config/database');

const SUPERADMIN_ACCOUNTS = [
  {
    email: 'saqib.mustafa@gmail.com',
    password: 'Saqib@123',
    name: 'Saqib Mustafa',
  },
  {
    email: 'ghualam.abbas@gmail.com',
    password: 'Ghulam@123',
    name: 'Ghulam Abbas',
  },
];

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '12', 10);

/**
 * Seeds super admin accounts
 * @returns {Promise<void>}
 */
async function seedSuperAdmins() {
  try {
    console.log('[Seeder] Starting super admin seeding...');

    for (const account of SUPERADMIN_ACCOUNTS) {
      // Check if super admin already exists
      const existingUser = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [account.email]
      );

      if (existingUser.rows.length > 0) {
        console.log(`[Seeder] Super admin already exists: ${account.email}`);
        continue;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(account.password, SALT_ROUNDS);

      // Create super admin
      const ROLES = require('../constants/roles');
      const result = await db.query(
        `INSERT INTO users (name, email, password_hash, role, created_at)
         VALUES ($1, $2, $3, $4, now())
         RETURNING id, email, name, role, created_at`,
        [account.name, account.email, passwordHash, ROLES.SUPERADMIN]
      );

      console.log(`[Seeder] ✓ Super admin created: ${account.email}`);
    }

    console.log('[Seeder] Super admin seeding completed');
  } catch (error) {
    console.error('[Seeder] Error seeding super admins:', error.message);
    throw error;
  }
}

module.exports = { seedSuperAdmins };
