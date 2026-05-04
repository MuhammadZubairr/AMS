require('dotenv').config();

const app = require('./app');
const { seedSuperAdmins } = require('./seeds/superadminSeeder');
const { initializeCronJobs } = require('./services/cronService');

const port = process.env.PORT || 4000;
const logger = require('./utils/logger');

// Basic environment validation
if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'development') {
  logger.error('FATAL: JWT_SECRET is not set. Please set JWT_SECRET in environment and restart.');
  process.exit(1);
}

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
    const server = app.listen(port, () => {
      console.log(`✓ Backend running on port ${port}`);
    });

    server.on('error', (error) => {
      if (error && error.code === 'EADDRINUSE') {
        logger.error(`Port ${port} is already in use. Another backend instance may already be running.`);
        if (process.env.NODE_ENV !== 'production') {
          console.log(`ℹ Backend already running on port ${port}. Stop the other process before starting a new one.`);
          process.exit(0);
        }
      }

      throw error;
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
