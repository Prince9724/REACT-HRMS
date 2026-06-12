import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Common/Spinner';
import {
  UserCircleIcon,
  KeyIcon,
  ArrowRightStartOnRectangleIcon,
  ExclamationCircleIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("1. Login button clicked");
    console.log("2. Email:", email, "Password:", password);

    const result = await dispatch(loginUser({ email, password }));
    console.log("3. Result payload:", result.payload);
    console.log("4. Result error:", result.error);

    if (result.payload?.role) {
      console.log("5. Navigating to:", result.payload.role === 'manager' ? '/manager' : '/employee');
      navigate(result.payload.role === 'manager' ? '/manager' : '/employee');
    } else {
      console.log("5. Login failed - no role in payload");
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=900&fit=crop')`,
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Login Card - Matching Manager Dashboard Colors */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-96 overflow-hidden">
        {/* Header Gradient - Blue to Purple like Manager Dashboard */}
        <div className="bg-gradient-to-r from-[#1a237e] to-[#4a148c] p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-3">
            <BuildingStorefrontIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Restaurant POS</h2>
          <p className="text-blue-100 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form Section */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/30 outline-none transition"
                required
              />
            </div>

            <div className="relative">
              <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/30 outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white font-semibold py-3 rounded-xl hover:from-[#1a237e]/90 hover:to-[#4a148c]/90 transition duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-gray-500 text-center text-sm font-medium">
              Demo Credentials
            </p>
            <div className="mt-2 space-y-1 text-xs text-gray-400 text-center">
              <p>🍽️ Manager: manager@resto.com / 123</p>
              <p>👨‍🍳 Waiter: waiter@resto.com / 123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;