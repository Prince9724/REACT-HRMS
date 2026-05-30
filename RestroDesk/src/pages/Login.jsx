import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Common/Spinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.payload?.role) {
      navigate(result.payload.role === 'manager' ? '/manager' : '/employee');
    }
  };

  if (isLoading) return <Spinner />;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Restaurant POS Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border mb-2" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border mb-4" required />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">Login</button>
        <p className="text-sm mt-2">Manager: manager@resto.com / 123 | Waiter: waiter@resto.com / 123</p>
      </form>
    </div>
  );
};

export default Login;