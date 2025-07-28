# Klabu Sports Club Management System

Klabu is a full-stack, modern sports club management platform designed to streamline club operations, enhance member engagement, and provide a seamless digital experience for both administrators and members.

---

## 🏗️ Project Structure

```
Klabu/
├── sports-club-frontend/   # Modern React frontend (Vite, Tailwind CSS, Shadcn UI)
└── sports-club-backend/    # Node.js/Express backend API (MongoDB)
```

---

## 🚀 Key Features

- **User Authentication & Authorization** (JWT, role-based)
- **Event Management** (create, RSVP, manage events)
- **Facility Booking** (real-time availability, booking)
- **Payment Processing** (membership, receipts)
- **Team Management** (create, join, manage teams)
- **Forum System** (community posts, announcements)
- **Calendar Integration** (visual event calendar)
- **Email Notifications** (reminders, alerts)
- **Responsive UI** (mobile-first, dark/light mode)
- **Security** (input validation, rate limiting, CORS, XSS protection)

---

## 🧩 Architecture Overview

### Frontend (sports-club-frontend)
- **React** (Vite) with `@tanstack/react-query` for data fetching and state management
- **Tailwind CSS** for modern, responsive design
- **Shadcn UI** for accessible and customizable UI components
- **React Router DOM** for navigation
- **Axios** for API communication
- **Role-based routing** and protected pages
- **Global notification, loading, and theme contexts**

### Backend (sports-club-backend)
- **Node.js/Express** REST API
- **MongoDB** for data storage
- **JWT authentication** and password hashing (bcrypt)
- **Express-validator** for input validation
- **Custom logging** and error handling
- **Email integration** for notifications
- **Comprehensive API endpoints** for all club operations

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/25thOliver/Klabu.git
cd Klabu
```

### 2. Setup Backend
```bash
cd sports-club-backend
npm install
cp env.example .env
# Edit .env with your MongoDB URI, JWT secret, email config, etc.
npm run setup   # Optional: runs initial setup script
npm run dev     # Start backend server (default: http://localhost:5000)
```

### 3. Setup Frontend
```bash
cd ../sports-club-frontend
npm install
cp .env.example .env.local
# Edit .env.local with your backend API URL (default: http://localhost:5000/api)
npm run dev     # Start frontend (default: http://localhost:5173 or similar Vite default)
```

---

## 🔗 How It Works Together
- The **frontend** communicates with the **backend** via RESTful API endpoints (see backend/README.md for full API docs).
- Authentication is managed with JWT tokens stored securely in the frontend and validated by the backend.
- All core features (events, bookings, payments, forum, teams) are accessible via the web UI and powered by backend APIs.
- Real-time feedback, notifications, and loading states provide a smooth user experience.

---

## 📚 Documentation
- For detailed setup, features, and API endpoints, see:
  - [sports-club-frontend/README.md](./sports-club-frontend/README.md)
  - [sports-club-backend/README.md](./sports-club-backend/README.md)

---

## 🛡️ Security & Best Practices
- Never commit `.env` files or secrets
- Use strong, unique JWT secrets and database credentials
- Restrict CORS origins to your frontend domain in production
- Regularly update dependencies

---

## 🤝 Contributing
1. Fork the repo and create a feature branch
2. Make your changes and add tests if applicable
3. Update documentation as needed
4. Submit a pull request

---

## 📄 License
This project is licensed under the ISC License.

---

## 🆘 Support
- For issues, open a GitHub issue or contact the maintainers
- See the frontend and backend READMEs for troubleshooting tips