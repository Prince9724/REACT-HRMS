import axiosInstance from '../../services/axiosInstance';  // ✅ Default import

const login = async (email, password) => {
  const response = await axiosInstance.get(`/users?email=${email}`);
  const users = response.data;
  const user = users.find(u => u.password === password);
  
  if (!user) throw new Error('Invalid credentials');
  
  if (user.role === 'employee' && user.isOnLeave === true) {
    throw new Error('You are on leave. Please contact manager.');
  }
  
  const { password: _, ...safeUser } = user;
  return safeUser;
};

const authService = { login };
export default authService;