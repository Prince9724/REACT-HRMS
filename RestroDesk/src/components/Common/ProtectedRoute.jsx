import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles.length && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;