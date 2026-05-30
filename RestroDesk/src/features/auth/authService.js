import axios from '../../services/axiosInstance';

const login = async (email, password) => {
  // json-server ke liye: find user by email
  const response = await axios.get(`/users?email=${email}`);
  const users = response.data;
  const user = users.find(u => u.password === password);
  if (!user) throw new Error('Invalid credentials');
  const { password: _, ...safeUser } = user;
  return safeUser;
};

const authService = { login };
export default authService;