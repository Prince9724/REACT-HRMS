import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  
  // Wait until auth is initialized
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles.length && !allowedRoles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;