import axiosInstance from '../../services/axiosInstance';

const login = async (email, password) => {
  try {
    console.log('🔐 Login attempt:', email);
    
    const response = await axiosInstance.get(`/users?email=${email}`);
    const users = response.data;
    
    console.log('👥 Users found:', users.length);
    
    const user = users.find(u => u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // ✅ Check if employee is on leave
    if (user.role === 'employee' && user.isOnLeave === true) {
      throw new Error('You are on leave. Please contact manager.');
    }
    
    const { password: _, ...safeUser } = user;
    console.log('✅ Login successful:', safeUser.name);
    return safeUser;
    
  } catch (error) {
    console.error('❌ Login error:', error.message);
    throw error;
  }
};

const authService = { login };
export default authService;