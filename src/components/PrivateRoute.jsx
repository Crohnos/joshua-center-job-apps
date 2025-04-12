import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuth } from '../services/api';

function PrivateRoute({ children }) {
  const [authState, setAuthState] = useState({ 
    loading: true, 
    authenticated: false 
  });
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const result = await checkAuth();
        setAuthState({ 
          loading: false, 
          authenticated: result.authenticated 
        });
      } catch (error) {
        setAuthState({ 
          loading: false, 
          authenticated: false 
        });
      }
    };

    verifyAuth();
  }, []);

  if (authState.loading) {
    // Show loading state
    return (
      <div className="container text-center">
        <div aria-busy="true">Loading...</div>
      </div>
    );
  }

  if (!authState.authenticated) {
    // Redirect to login with return URL
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace
      />
    );
  }

  // Render the protected component
  return children;
}

export default PrivateRoute;