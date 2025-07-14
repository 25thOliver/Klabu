const { body, param, query, validationResult } = require('express-validator');

// Generic validation handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('role')
    .optional()
    .isIn(['member', 'admin'])
    .withMessage('Role must be either member or admin'),
  
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Event validation
const validateEvent = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  
  body('maxAttendees')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Max attendees must be between 1 and 1000'),
  
  handleValidationErrors
];

// Facility validation
const validateFacility = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Facility name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  handleValidationErrors
];

// Booking validation
const validateBooking = [
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  
  handleValidationErrors
];

// Forum post validation
const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('body')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Post body must be between 10 and 2000 characters'),
  
  handleValidationErrors
];

// Reply validation
const validateReply = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Reply must be between 1 and 500 characters'),
  
  handleValidationErrors
];

// Payment validation
const validatePayment = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  
  body('method')
    .isIn(['membership', 'facility-booking', 'event-payment'])
    .withMessage('Invalid payment method'),
  
  body('purpose')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Purpose must be between 5 and 100 characters'),
  
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

// Query parameter validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateEvent,
  validateFacility,
  validateBooking,
  validatePost,
  validateReply,
  validatePayment,
  validateId,
  validatePagination,
  handleValidationErrors
}; 