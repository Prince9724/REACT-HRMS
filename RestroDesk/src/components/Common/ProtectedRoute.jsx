import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // If Redux has user, we're ready
    if (user) {
      setIsReady(true);
      return;
    }
    
    // If still loading, wait
    if (isLoading) {
      return;
    }
    
    // If no user and not loading, check localStorage directly
    const stored = localStorage.getItem('reduxState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.auth?.user) {
          // User exists in storage, give Redux time to rehydrate
          setTimeout(() => setIsReady(true), 200);
          return;
        }
      } catch(e) {}
    }
    
    // No user found anywhere
    setIsReady(true);
  }, [user, isLoading]);
  
  // Show loading while checking
  if (isLoading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Final user check (with localStorage fallback)
  let currentUser = user;
  if (!currentUser) {
    const stored = localStorage.getItem('reduxState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        currentUser = parsed.auth?.user;
      } catch(e) {}
    }
  }
  
  if (!currentUser) return <Navigate to="/login" />;
  if (allowedRoles.length && !allowedRoles.includes(currentUser.role)) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;