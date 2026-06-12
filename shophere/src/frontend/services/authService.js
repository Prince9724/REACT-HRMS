import api from './api';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

// SessionStorage based auth (har tab ke liye alag session)
export const authService = {
  register: async (userData) => {
    try {
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
      return { success: false, error: error.message };
    }
  },
  
  login: async (email, password) => {
    try {
      const response = await api.get(`/users?email=${email}&password=${password}`);
      const users = response.data;
      
      if (users.length === 0) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      const user = users[0];
      
      if (!user.isActive) {
        return { success: false, error: 'Account is blocked. Contact admin.' };
      }
      
      // Unique token per tab/session
      const token = `token-${user.id}-${Date.now()}-${Math.random()}`;
      
      // SessionStorage use karein (NOT localStorage)
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
      
      const { password: _, ...userWithoutPassword } = user;
      sessionStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  logout: () => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
  
  getCurrentUser: () => {
    const userStr = sessionStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  
  isAuthenticated: () => {
    return sessionStorage.getItem(AUTH_TOKEN_KEY) !== null;
  },
  
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    if (Array.isArray(role)) return role.includes(user.role);
    return user.role === role;
  }
};