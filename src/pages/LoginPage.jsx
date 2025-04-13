import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { checkAuth } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = location.state?.from || '/admin/applicants';
  const [errorMessage, setErrorMessage] = useState(
    searchParams.get('error') || location.state?.error || ''
  );
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if already authenticated
    const verifyAuth = async () => {
      try {
        setLoading(true);
        const result = await checkAuth();
        
        if (result.authenticated) {
          navigate(from, { replace: true });
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        setErrorMessage(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    
    verifyAuth();
  }, [from, navigate]);
  
  // Redirect to auth with return URL as query parameter
  const handleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    // Always force admin redirect path for admin login
    const redirectPath = '/#/admin/applicants';
    
    console.log(`Login redirectPath: ${redirectPath}`);
    window.location.href = `${apiUrl}/auth/google?redirectTo=${encodeURIComponent(redirectPath)}`;
  };

  return (
    <div className="container">
      <article className="grid">
        <div>
          <hgroup>
            <h1>Admin Login</h1>
            <h2>Joshua Center Application Manager</h2>
          </hgroup>
          
          {errorMessage && (
            <div className="error-container" style={{
              backgroundColor: '#fbe9e7',
              color: '#c62828',
              padding: '10px 15px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {errorMessage}
            </div>
          )}
          
          <p>
            Please sign in with your Google account to access the admin dashboard.
            Only authorized users can access this area.
          </p>
          
          {loading ? (
            <div aria-busy="true">
              Checking authentication status...
            </div>
          ) : (
            <button 
              onClick={handleLogin} 
              className="primary outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Sign in with Google</span>
            </button>
          )}
          
          <div style={{marginTop: '20px', fontSize: '0.9em', opacity: 0.8}}>
            <p>You must use a pre-authorized Google account to access the admin area.</p>
          </div>
        </div>
      </article>
    </div>
  );
}

export default LoginPage;