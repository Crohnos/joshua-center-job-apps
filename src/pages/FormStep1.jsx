import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import useFormStore from '../store/formStore';
import { sendVerificationCode, verifyCode, checkEmailExists } from '../services/api';

function FormStep1() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormStore();
  const [step, setStep] = useState('email'); // email, verification, or completed
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showExistingAlert, setShowExistingAlert] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  // Handle email submission and request verification code
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First check if the email has already been used for an application
      const checkResult = await checkEmailExists(email);
      
      if (checkResult.exists) {
        setExistingApplication(checkResult.applicant);
        setShowExistingAlert(true);
        setIsLoading(false);
        return;
      }
      
      // Request verification code
      const result = await sendVerificationCode(email);
      
      if (result.message) {
        setStep('verification');
        startCountdown();
        
        // Auto-fill the code for the demo version
        if (result.code) {
          setVerificationCode(result.code);
        }
      }
    } catch (error) {
      console.error('Error during email verification:', error);
      setError('Error sending verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle verification code submission
  const handleSubmitCode = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!verificationCode) {
      setError('Verification code is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Verify the code
      const result = await verifyCode(email, verificationCode);
      
      if (result.verified) {
        // Store the verified email in form data
        setFormData({ email: result.email });
        
        // Move to next step
        navigate('/form/step2');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setError(error.response?.data?.error || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Resend verification code
  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await sendVerificationCode(email);
      
      if (result.message) {
        startCountdown();
        
        // Auto-fill the code for the demo version
        if (result.code) {
          setVerificationCode(result.code);
        }
      }
    } catch (error) {
      console.error('Error resending code:', error);
      setError('Error sending verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Start countdown for resend button
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Check if the verification code is from the URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">The Joshua Center</h1>
        <p className="app-subtitle">Job Application Portal</p>
      </header>
      
      <Breadcrumbs />
      
      <main>
        {isLoading ? (
          <div className="card">
            <div className="form-section" style={{ textAlign: 'center' }}>
              <div className="loader-container">
                <div className="loader">
                  <span>Processing...</span>
                </div>
              </div>
            </div>
          </div>
        ) : showExistingAlert && existingApplication ? (
          <div className="card">
            <div className="form-section">
              <h2 className="form-section-heading">Existing Application Found</h2>
              
              <div className="alert warning" style={{ marginBottom: '2rem' }}>
                <div className="alert-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className="alert-content">
                  <div className="alert-title">You've already submitted an application</div>
                  <p>We found an existing application for <strong>{existingApplication.name}</strong> using this email address.</p>
                  <p>Your application status is: <strong>{existingApplication.status.replace(/_/g, ' ')}</strong></p>
                </div>
              </div>
              
              <p>Our staff will review your application and contact you if we'd like to schedule an interview. Please allow 1-2 weeks for processing.</p>
              <p>If you need to update your application or have questions, please contact our HR department at <a href="mailto:hr@thejoshuacenter.com">hr@thejoshuacenter.com</a>.</p>
              
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                <a 
                  href="/" 
                  className="button primary"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Return to Homepage
                </a>
              </div>
              
            </div>
          </div>
        ) : step === 'email' ? (
          <div className="card">
            <div className="form-section">
              <h2 className="form-section-heading">Welcome to Our Application Process</h2>
              <p>To begin your journey with The Joshua Center, please verify your email address. This helps us keep your application secure and allows you to return to complete it later if needed.</p>
              
              <form id="email-form" onSubmit={handleSubmitEmail}>
                {error && (
                  <div className="alert danger" style={{ marginBottom: '1rem' }}>
                    <div className="alert-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">Error</div>
                      <p>{error}</p>
                    </div>
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                  <small>We'll send a verification code to this email</small>
                </div>
                
                <div className="form-action">
                  <button
                    type="submit"
                    className="button primary"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                    Send Verification Code
                  </button>
                </div>
              </form>
              
              <div className="alert info" style={{ marginTop: '2rem' }}>
                <div className="alert-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <div className="alert-content">
                  <div className="alert-title">Contact Information</div>
                  <p>If you have questions about the application process, please contact: <strong>Chad Imhoff</strong> - Email: <a href="mailto:chad@thejoshuacenter.com">chad@thejoshuacenter.com</a></p>
                </div>
              </div>
              
            </div>
          </div>
        ) : step === 'verification' && (
          <div className="card">
            <div className="form-section">
              <h2 className="form-section-heading">Verify Your Email</h2>
              <p>We've sent a verification code to <strong>{email}</strong>. Please enter the code below.</p>
              <div className="alert info" style={{ marginBottom: '1.5rem' }}>
                <div className="alert-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <div className="alert-content">
                  <div className="alert-title">Verification Code</div>
                  <p>For this demo version, the verification code is automatically prefilled.</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmitCode}>
                {error && (
                  <div className="alert danger" style={{ marginBottom: '1rem' }}>
                    <div className="alert-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">Error</div>
                      <p>{error}</p>
                    </div>
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="verification-code">Verification Code</label>
                  <input
                    id="verification-code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                    style={{ letterSpacing: '0.2em', fontWeight: 'bold' }}
                  />
                  <small>The code is valid for 15 minutes</small>
                </div>
                
                <div className="form-action" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button
                    type="submit"
                    className="button primary"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 12l2 2 6-6"></path>
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    Verify & Continue
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="button outline"
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>
                
                <div style={{ marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="link"
                    style={{ border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0 }}
                  >
                    ← Change email address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default FormStep1;