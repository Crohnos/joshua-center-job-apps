import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
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
import LoginPage from '../pages/LoginPage';

// Admin pages
import ApplicantList from '../pages/admin/ApplicantList';
import ApplicantDetail from '../pages/admin/ApplicantDetail';
import UserManagement from '../pages/admin/UserManagement';
import LocationManagement from '../pages/admin/LocationManagement';

function App() {
  return (
    <>
      {/* Background pattern */}
      <div className="app-bg"></div>
      
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/form/step1" replace />} />
          <Route path="/login" element={<LoginPage />} />
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
          
          {/* Protected admin routes */}
          <Route 
            path="/admin/applicants" 
            element={
              <PrivateRoute>
                <ApplicantList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/applicants/:id" 
            element={
              <PrivateRoute>
                <ApplicantDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/locations" 
            element={
              <PrivateRoute>
                <LocationManagement />
              </PrivateRoute>
            } 
          />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
