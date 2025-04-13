import { Link } from 'react-router-dom';

function ThankYouPage() {
  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">The Joshua Center</h1>
        <p className="app-subtitle">Job Application Portal</p>
      </header>
      
      <main>
        <div className="card">
          <div className="form-section" style={{ textAlign: 'center' }}>
            <div style={{ 
              margin: '1rem auto 2.5rem', 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'var(--success)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            
            <h2 className="form-section-heading" style={{ justifyContent: 'center' }}>
              Application Successfully Submitted!
            </h2>
            
            <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: '2rem' }}>
              Thank you for applying to The Joshua Center
            </p>
            
            <div className="alert success" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
              <div className="alert-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div className="alert-content">
                <div className="alert-title">What happens next?</div>
                <p>Our hiring team will review your application and contact you if we'd like to schedule an interview. Please allow 1-2 weeks for processing.</p>
              </div>
            </div>
            
            <p style={{ marginBottom: '1.5rem' }}>
              If you have any questions in the meantime, please contact our HR department at{' '}
              <a href="mailto:hr@thejoshuacenter.com" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                hr@thejoshuacenter.com
              </a>
            </p>
            
            <Link 
              to="/form/step1" 
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
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ThankYouPage;