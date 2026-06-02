import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAppSelector((state) => state.auth);
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles.length && !allowedRoles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;