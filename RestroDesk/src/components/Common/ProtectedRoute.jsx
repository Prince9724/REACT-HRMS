import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  
  // ✅ Wait for auth to initialize (prevents premature redirect)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles.length && !allowedRoles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;