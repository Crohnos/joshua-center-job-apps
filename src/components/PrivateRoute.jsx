import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuth } from '../services/api';

function PrivateRoute({ children, adminOnly = false }) {
  const [authState, setAuthState] = useState({ 
    loading: true, 
    authenticated: false,
    user: null,
    error: null 
  });
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    
    const verifyAuth = async () => {
      try {
        const result = await checkAuth();
        
        if (isMounted) {
          setAuthState({ 
            loading: false, 
            authenticated: result.authenticated,
            user: result.user || null,
            error: null
          });
        }
      } catch (error) {
        if (isMounted) {
          // Only set unauthenticated for 401/403 errors, otherwise it might be a network error
          const isAuthError = error.response?.status === 401 || error.response?.status === 403;
          
          setAuthState({ 
            loading: false, 
            authenticated: !isAuthError,
            user: null,
            error: error.message
          });
        }
      }
    };

    verifyAuth();
    
    // Clean up in case component unmounts before authentication completes
    return () => {
      isMounted = false;
    };
  }, []);

  if (authState.loading) {
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
        state={{ 
          from: location.pathname,
          error: authState.error
        }} 
        replace
      />
    );
  }
  
  // Check for admin access if required
  if (adminOnly && !authState.user?.isAdmin) {
    return (
      <div className="container">
        <article>
          <header>
            <h1>Access Denied</h1>
          </header>
          <p>You don't have admin privileges to access this page.</p>
          <footer>
            <a href="/" className="button">Return to Home</a>
          </footer>
        </article>
      </div>
    );
  }

  // Render the protected component
  return children;
}

export default PrivateRoute;