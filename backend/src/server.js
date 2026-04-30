require('dotenv').config();

const app = require('./app');
const { seedSuperAdmins } = require('./seeds/superadminSeeder');
const { initializeCronJobs } = require('./services/cronService');

const port = process.env.PORT || 4000;

/**
 * Start server with seeding and cron jobs
 */
async function startServer() {
  try {
    // Skip seeding in development if database is not available
    if (process.env.NODE_ENV !== 'production') {
      try {
        await seedSuperAdmins();
      } catch (seedError) {
        console.warn('⚠ Seeder failed (database not available?):', seedError.message);
        console.log('⚠ Continuing without seeding...');
      }
    } else {
      await seedSuperAdmins();
    }

    // Initialize cron jobs
    initializeCronJobs();

    // Start the server
    app.listen(port, () => {
      console.log(`✓ Backend running on port ${port}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
