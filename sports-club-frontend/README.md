# Sports Club Frontend

A modern React-based frontend for the Sports Club Management System with comprehensive state management and user experience features.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure login/logout with role-based access
- **Event Management** - Create, edit, delete, and RSVP to events
- **Facility Booking** - Book sports facilities with availability tracking
- **Payment Processing** - Membership payments and receipt generation
- **Team Management** - Create and manage sports teams
- **Forum System** - Community discussions and announcements
- **Calendar Integration** - Visual event calendar with RSVP tracking

### Advanced Features
- **Global State Management** - Centralized state with React Context
- **Real-time Notifications** - Toast notifications with auto-dismiss
- **Loading States** - Global loading management with spinners
- **Theme Support** - Light/dark mode with persistent preferences
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Error Handling** - Comprehensive error boundaries and user feedback
- **API Integration** - Centralized API service layer with interceptors

## 🏗️ Architecture

### State Management
The application uses a layered state management approach:

```
App.jsx
├── AuthProvider (Authentication state)
├── NotificationProvider (Toast notifications)
├── LoadingProvider (Loading states)
└── ThemeProvider (UI theming)
```

### Context Providers

#### AuthContext
- User authentication state
- Login/logout functionality
- Role-based access control
- Token management

#### NotificationContext
- Toast notifications
- Success/error/warning/info messages
- Auto-dismiss functionality
- Customizable duration

#### LoadingContext
- Global loading states
- Component-specific loading
- Loading spinners
- Async operation management

#### ThemeContext
- Light/dark mode toggle
- Persistent theme preferences
- Sidebar collapse state
- Theme configuration

### API Layer
Centralized API service with:
- Axios interceptors for authentication
- Error handling and retry logic
- Request/response logging
- Base URL configuration

## 🛠️ Setup & Installation

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your backend URL

# Start development server
npm run dev
```

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Sports Club
```

## 📁 Project Structure

```
src/
├── auth/                 # Authentication context and utilities
├── components/           # Reusable UI components
├── context/             # Global state contexts
├── pages/               # Page components
├── routes/              # Route protection components
├── services/            # API services and utilities
├── styles/              # Global styles and CSS
└── utils/               # Utility functions
```

## 🎨 UI Components

### Core Components
- `LoadingSpinner` - Reusable loading indicator
- `NotificationToast` - Toast notification system
- `Layout` - Page layout wrapper
- `Sidebar` - Navigation sidebar

### Form Components
- Input fields with validation
- Form submission handling
- Error state management
- Loading states

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run setup        # Run setup script
```

### Code Style
- ESLint configuration for React
- Prettier formatting
- Consistent naming conventions
- Component documentation

### State Management Patterns
```javascript
// Using contexts
const { user, login, logout } = useAuth();
const { success, error } = useNotification();
const { isLoading, withLoading } = useLoading();
const { theme, toggleTheme } = useTheme();

// Loading with async operations
const result = await withLoading('fetchData', async () => {
  return await api.getData();
});
```

## 🔒 Security Features

- JWT token management
- Role-based route protection
- Input validation
- XSS protection
- Secure API communication

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS utilities
- Flexible grid system
- Touch-friendly interfaces

## 🧪 Testing

### Manual Testing Checklist
- [ ] User authentication flow
- [ ] Role-based access control
- [ ] Form validation and submission
- [ ] Error handling and notifications
- [ ] Loading states and spinners
- [ ] Theme switching
- [ ] Responsive design
- [ ] API integration

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
Ensure all environment variables are configured for production:
- API base URL
- Authentication settings
- Feature flags

## 📈 Performance

### Optimizations
- Code splitting with React.lazy()
- Memoized components
- Efficient re-renders
- Optimized bundle size

### Monitoring
- Error tracking
- Performance metrics
- User analytics

## 🤝 Contributing

1. Follow the established code style
2. Add tests for new features
3. Update documentation
4. Use conventional commits

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details
4. Contact the development team
