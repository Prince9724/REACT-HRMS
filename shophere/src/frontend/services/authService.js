import api from './api';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      // URL: /users (NOT /api/users)
      const existing = await api.get(`/users?email=${userData.email}`);
      if (existing.data.length > 0) {
        return { success: false, error: 'User already exists with this email' };
      }
      
      const response = await api.post('/users', {
        ...userData,
        isActive: true,
        createdAt: new Date().toISOString()
      });
      
      const { password, ...user } = response.data;
      return { success: true, user };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Login user
  login: async (email, password) => {
    try {
      // URL: /users (NOT /api/users)
      const response = await api.get(`/users?email=${email}&password=${password}`);
      const users = response.data;
      
      if (users.length === 0) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      const user = users[0];
      
      if (!user.isActive) {
        return { success: false, error: 'Account is blocked. Contact admin.' };
      }
      
      const token = `token-${user.id}-${Date.now()}`;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    return JSON.parse(userStr);
  },
  
  // Check if logged in
  isAuthenticated: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY) !== null;
  },
  
  // Check role
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    if (Array.isArray(role)) return role.includes(user.role);
    return user.role === role;
  }
};