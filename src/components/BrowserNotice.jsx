import { useState, useEffect } from 'react';

function BrowserNotice() {
  const [isSafari, setIsSafari] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if browser is Safari
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsSafari(isSafariBrowser);
    
    // Check if user already dismissed the notice
    const dismissed = localStorage.getItem('safari-notice-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const dismissNotice = () => {
    localStorage.setItem('safari-notice-dismissed', 'true');
    setIsDismissed(true);
  };

  if (!isSafari || isDismissed) {
    return null;
  }

  return (
    <div className="browser-notice">
      <div className="browser-notice-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>For the best experience, please use Chrome, Firefox, or Edge instead of Safari.</span>
      </div>
      <button onClick={dismissNotice} className="browser-notice-close" aria-label="Dismiss notice">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}

export default BrowserNotice;