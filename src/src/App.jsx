import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';

// Form pages
import FormStep1 from '../pages/FormStep1';
import FormStep2 from '../pages/FormStep2';
import FormStep3 from '../pages/FormStep3';
import FormStep4 from '../pages/FormStep4';
import FormStep5 from '../pages/FormStep5';
import FormStep6 from '../pages/FormStep6';
import FormStep7 from '../pages/FormStep7';
import FormStep8 from '../pages/FormStep8';
import FormSubmit from '../pages/FormSubmit';
import ThankYouPage from '../pages/ThankYouPage';

// Admin pages
import ApplicantList from '../pages/admin/ApplicantList';
import ApplicantDetail from '../pages/admin/ApplicantDetail';
import UserManagement from '../pages/admin/UserManagement';
import LocationManagement from '../pages/admin/LocationManagement';

// ScrollToTop component to handle scrolling to top on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      {/* Background pattern */}
      <div className="app-bg"></div>
      
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/form/step1" replace />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          
          {/* Form steps */}
          <Route path="/form/step1" element={<FormStep1 />} />
          <Route path="/form/step2" element={<FormStep2 />} />
          <Route path="/form/step3" element={<FormStep3 />} />
          <Route path="/form/step4" element={<FormStep4 />} />
          <Route path="/form/step5" element={<FormStep5 />} />
          <Route path="/form/step6" element={<FormStep6 />} />
          <Route path="/form/step7" element={<FormStep7 />} />
          <Route path="/form/step8" element={<FormStep8 />} />
          <Route path="/form/submit" element={<FormSubmit />} />
          
          {/* Admin routes (no longer protected) */}
          <Route path="/admin/applicants" element={<ApplicantList />} />
          <Route path="/admin/applicants/:id" element={<ApplicantDetail />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/locations" element={<LocationManagement />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;