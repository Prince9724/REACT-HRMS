import axios from '../../services/axiosInstance';

const login = async (email, password) => {
  // Fetch user by email
  const response = await axios.get(`/users?email=${email}`);
  const users = response.data;
  const user = users.find(u => u.password === password);
  
  if (!user) throw new Error('Invalid credentials');
  
  // ✅ Check if employee is on leave
  if (user.role === 'employee' && user.isOnLeave === true) {
    throw new Error('You are on leave. Please contact manager.');
  }
  
  const { password: _, ...safeUser } = user;
  return safeUser;
};

const authService = { login };
export default authService;