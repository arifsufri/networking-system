import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigation = () => {
      const isAuthenticated = localStorage.getItem('currentUser');
      if (!isAuthenticated) {
        navigate('/sign-in', { replace: true });
      }
    };

    // Initial check
    handleNavigation();

    // Block back/forward navigation
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', () => {
      window.history.pushState(null, '', window.location.href);
      handleNavigation();
    });

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [navigate]);

  const isAuthenticated = localStorage.getItem('currentUser');
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
} 