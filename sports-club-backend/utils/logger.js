const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Simple logger implementation
const logger = {
  info: (message, meta = {}) => {
    const logEntry = {
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    };
    console.log('\x1b[36m%s\x1b[0m', JSON.stringify(logEntry));
    writeToFile('info.log', logEntry);
  },

  error: (message, meta = {}) => {
    const logEntry = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    };
    console.error('\x1b[31m%s\x1b[0m', JSON.stringify(logEntry));
    writeToFile('error.log', logEntry);
  },

  warn: (message, meta = {}) => {
    const logEntry = {
      level: 'WARN',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    };
    console.warn('\x1b[33m%s\x1b[0m', JSON.stringify(logEntry));
    writeToFile('warn.log', logEntry);
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const logEntry = {
        level: 'DEBUG',
        timestamp: new Date().toISOString(),
        message,
        ...meta
      };
      console.debug('\x1b[35m%s\x1b[0m', JSON.stringify(logEntry));
      writeToFile('debug.log', logEntry);
    }
  }
};

// Write log to file
const writeToFile = (filename, logEntry) => {
  const logPath = path.join(logsDir, filename);
  const logLine = JSON.stringify(logEntry) + '\n';
  
  fs.appendFile(logPath, logLine, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

// Request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    };

    if (res.statusCode >= 400) {
      logger.error('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });

  next();
};

module.exports = {
  logger,
  requestLogger
}; 