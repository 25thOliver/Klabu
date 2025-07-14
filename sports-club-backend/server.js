const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { logger, requestLogger } = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const {
  corsOptions,
  helmetConfig,
  securityHeaders,
  sanitizeInput,
  requestSizeLimiter,
  apiLimiter,
  authLimiter
} = require('./middleware/security');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(requestSizeLimiter);
app.use(sanitizeInput);

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/user', require('./routes/user'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/facilities', require('./routes/facilityRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));

// Reminder service endpoint (protected)
const sendReminders = require('./utils/reminderService');
app.get('/send-reminders', async (req, res) => {
  try {
    await sendReminders();
    res.json({ message: 'Reminders sent successfully' });
  } catch (error) {
    logger.error('Failed to send reminders', { error: error.message });
    res.status(500).json({ message: 'Failed to send reminders' });
  }
});

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

module.exports = app;
