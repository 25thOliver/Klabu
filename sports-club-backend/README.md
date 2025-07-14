# Sports Club Management System - Backend

A robust, secure, and scalable backend API for managing sports club operations.

## 🚀 Features

- **User Management**: Registration, authentication, and role-based access control
- **Event Management**: Create, manage, and RSVP to events
- **Facility Booking**: Book and manage sports facilities
- **Payment System**: Handle membership and facility payments
- **Forum System**: Community discussions and announcements
- **Team Management**: Organize members into teams
- **Email Notifications**: Automated reminders and announcements

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with configurable salt rounds
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **Input Sanitization**: Automatic input cleaning and validation

## 📋 Prerequisites

- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm >= 8.0.0

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd sports-club-backend
npm install
```

### 2. Environment Setup

```bash
# Run the setup script
npm run setup

# Or manually create .env file from env.example
cp env.example .env
```

### 3. Configure Environment Variables

Edit `.env` file with your configuration:

```env
# Database
MONGO_URI=mongodb://localhost:27017/sports-club

# JWT
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES_IN=7d

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Security
BCRYPT_ROUNDS=12
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Event Endpoints

- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `POST /api/events/:id/rsvp` - RSVP to event

### Facility Endpoints

- `GET /api/facilities` - Get all facilities
- `POST /api/facilities` - Create facility (admin only)
- `POST /api/facilities/:id/book` - Book facility
- `DELETE /api/facilities/:id` - Delete facility (admin only)

### Payment Endpoints

- `GET /api/payments` - Get user payments
- `POST /api/payments` - Create payment
- `GET /api/payments/membership` - Get membership payments

### Forum Endpoints

- `GET /api/forum/posts` - Get all forum posts
- `POST /api/forum/posts` - Create new post
- `GET /api/forum/posts/:id` - Get specific post
- `DELETE /api/forum/posts/:id` - Delete post (admin only)

## 🔧 Development

### Project Structure

```
sports-club-backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
├── logs/            # Application logs
├── server.js        # Main server file
└── setup.js         # Setup script
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run setup` - Run initial setup
- `npm test` - Run tests (not implemented yet)

### Logging

The application uses a custom logging system that writes to both console and files:

- `logs/info.log` - Information logs
- `logs/error.log` - Error logs
- `logs/warn.log` - Warning logs
- `logs/debug.log` - Debug logs (development only)

### Error Handling

The application includes comprehensive error handling:

- Custom `AppError` class for operational errors
- Centralized error handling middleware
- Proper HTTP status codes
- Detailed error messages in development
- Sanitized error messages in production

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, unique secret
3. **Database**: Use strong passwords and enable authentication
4. **Email**: Use app passwords for Gmail
5. **Rate Limiting**: Configure appropriate limits for your use case
6. **CORS**: Restrict origins to your frontend domain

## 🧪 Testing

Testing framework not yet implemented. Planned features:

- Unit tests with Jest
- Integration tests
- API endpoint testing
- Security testing

## 📦 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Recommended Deployment Platforms

- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

1. Check the logs in the `logs/` directory
2. Verify your environment configuration
3. Ensure MongoDB is running
4. Check network connectivity

## 🔄 Recent Improvements

### Phase 1: Critical Fixes ✅
- ✅ Removed duplicate code from frontend
- ✅ Added comprehensive input validation
- ✅ Implemented centralized error handling
- ✅ Added security middleware (rate limiting, CORS, headers)
- ✅ Created proper environment configuration
- ✅ Added logging system
- ✅ Improved authentication flow

### Phase 2: Architecture Improvements (Next)
- [ ] Add comprehensive testing
- [ ] Implement caching layer
- [ ] Add API documentation with Swagger
- [ ] Optimize database queries
- [ ] Add monitoring and health checks

### Phase 3: Quality & Performance (Future)
- [ ] Add TypeScript support
- [ ] Implement microservices architecture
- [ ] Add real-time features with WebSockets
- [ ] Implement advanced caching strategies 