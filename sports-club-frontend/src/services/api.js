import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API service methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updatePassword: (data) => api.put('/user/password', data),
  getUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
};

export const eventAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  rsvp: (id) => api.post(`/events/${id}/rsvp`),
  cancelRsvp: (id) => api.delete(`/events/${id}/rsvp`),
};

export const facilityAPI = {
  getAll: () => api.get('/facilities'),
  getById: (id) => api.get(`/facilities/${id}`),
  create: (data) => api.post('/facilities', data),
  update: (id, data) => api.put(`/facilities/${id}`, data),
  delete: (id) => api.delete(`/facilities/${id}`),
  book: (id, data) => api.post(`/facilities/${id}/book`, data),
  getMyBookings: () => api.get('/facilities/my-bookings'),
};

export const paymentAPI = {
  getAll: () => api.get('/payments'),
  getMyPayments: () => api.get('/payments/mine'),
  create: (data) => api.post('/payments', data),
  getMembershipPayments: () => api.get('/payments/membership'),
  createMembershipPayment: () => api.post('/payments/membership'),
  checkMembership: () => api.get('/payments/membership/status'),
  activateMembership: (paymentMethod = 'manual') => api.post('/payments/membership', { method: paymentMethod }),
  getMembershipHistory: () => api.get('/payments/membership/history'),
};

export const forumAPI = {
  getAllPosts: () => api.get('/forum/posts'),
  getPost: (id) => api.get(`/forum/posts/${id}`),
  createPost: (data) => api.post('/forum/posts', data),
  updatePost: (id, data) => api.put(`/forum/posts/${id}`, data),
  deletePost: (id) => api.delete(`/forum/posts/${id}`),
  likePost: (id) => api.post(`/forum/posts/${id}/like`),
  getReplies: (id) => api.get(`/forum/posts/${id}/replies`),
  createReply: (id, data) => api.post(`/forum/posts/${id}/replies`, data),
};

export const teamAPI = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
  addMember: (id, userId) => api.post(`/teams/${id}/members`, { userId }),
  removeMember: (id, userId) => api.delete(`/teams/${id}/members/${userId}`),
  // Additional methods for team functionality
  requestJoin: (teamId) => api.post(`/teams/${teamId}/request-join`),
  leaveTeam: (teamId) => api.post(`/teams/${teamId}/leave`),
  approveUser: (teamId, userId) => api.post(`/teams/${teamId}/approve/${userId}`),
};

export const announcementAPI = {
  getAll: () => api.get('/announcements'),
  getById: (id) => api.get(`/announcements/${id}`),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
  markAsRead: (id) => api.post(`/announcements/${id}/read`),
  getUserReadStatus: (userId) => api.get(`/users/${userId}`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 