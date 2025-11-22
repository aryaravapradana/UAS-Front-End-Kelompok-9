// API Configuration for Frontend
// This centralizes all API endpoints and uses environment variables

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to build API URLs
export const buildApiUrl = (path) => `${API_URL}${path}`;

// All API endpoints
export const API = {
  // Auth endpoints
  auth: {
    login: () => buildApiUrl('/api/auth/login'),
    register: () => buildApiUrl('/api/auth/register'),
    forgotPassword: () => buildApiUrl('/api/auth/forgot-password'),
    resetPassword: () => buildApiUrl('/api/auth/reset-password'),
    resendVerification: () => buildApiUrl('/api/auth/resend-verification'),
  },
  
  // Profile endpoints
  profile: {
    get: () => buildApiUrl('/api/profile'),
    picture: () => buildApiUrl('/api/profile/picture'),
    lombas: () => buildApiUrl('/api/profile/lombas'),
    beasiswas: () => buildApiUrl('/api/profile/beasiswas'),
    talks: () => buildApiUrl('/api/profile/talks'),
    bootcamps: () => buildApiUrl('/api/profile/bootcamps'),
  },
  
  // Events endpoints
  lombas: {
    list: () => buildApiUrl('/api/lombas'),
    detail: (id) => buildApiUrl(`/api/lombas/${id}`),
    registerSolo: (id) => buildApiUrl(`/api/lombas/${id}/register-solo`),
    createTeam: (id) => buildApiUrl(`/api/lombas/${id}/create-team`),
    joinTeam: (id) => buildApiUrl(`/api/lombas/${id}/join-team`),
  },
  
  beasiswas: {
    list: () => buildApiUrl('/api/beasiswas'),
    detail: (id) => buildApiUrl(`/api/beasiswas/${id}`),
    poster: (id) => buildApiUrl(`/api/beasiswas/${id}/poster`),
  },
  
  talks: {
    list: () => buildApiUrl('/api/talks'),
    detail: (id) => buildApiUrl(`/api/talks/${id}`),
  },
  
  bootcamps: {
    list: () => buildApiUrl('/api/bootcamps'),
    detail: (id) => buildApiUrl(`/api/bootcamps/${id}`),
    register: (id) => buildApiUrl(`/api/bootcamps/${id}/register`),
  },
  
  // Notifications
  notifications: {
    list: (page = 1, limit = 5) => buildApiUrl(`/api/notifications?page=${page}&limit=${limit}`),
    markRead: (id) => buildApiUrl(`/api/notifications/${id}/read`),
    create: () => buildApiUrl('/api/notifications'),
    delete: (id) => buildApiUrl(`/api/notifications/${id}`),
  },
  
  // Users (Admin)
  users: {
    list: () => buildApiUrl('/api/users'),
    detail: (nim) => buildApiUrl(`/api/users/${nim}`),
    delete: (nim) => buildApiUrl(`/api/users/${nim}`),
    update: (nim) => buildApiUrl(`/api/users/${nim}`),
    email: (nim) => buildApiUrl(`/api/users/${nim}/email`),
    details: (nim) => buildApiUrl(`/api/users/${nim}/details`),
  },
  
  // Events (for team info)
  events: {
    team: (type, id) => buildApiUrl(`/api/events/${type}/${id}/team`),
  },
};

// Export API_URL for direct use if needed
export { API_URL };

// Default export
export default API;
