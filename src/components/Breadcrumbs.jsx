import { Link, useLocation } from 'react-router-dom';

const steps = [
  { path: '/form/step1', label: 'Sign In' },
  { path: '/form/step2', label: 'Contact' },
  { path: '/form/step3', label: 'Qualifications' },
  { path: '/form/step4', label: 'Interests' },
  { path: '/form/step5', label: 'Education' },
  { path: '/form/step6', label: 'Employment' },
  { path: '/form/step7', label: 'References' },
  { path: '/form/step8', label: 'Demographics' },
  { path: '/form/submit', label: 'Resume & Submit' }
];

function Breadcrumbs() {
  const location = useLocation();
  const currentStep = steps.findIndex(step => step.path === location.pathname);
  
  return (
    <div>
      <nav aria-label="breadcrumb">
        <ul className="breadcrumbs">
          {steps.map((step, index) => {
            const isActive = location.pathname === step.path;
            const isCompleted = index < currentStep;
            const isPending = index > currentStep;
            
            // Determine class based on status
            let className = 'breadcrumbs-item';
            if (isActive) className += ' active';
            else if (isCompleted) className += ' completed';
            else if (isPending) className += ' pending';
            
            return (
              <li key={step.path} className={className}>
                <div className="breadcrumbs-item-inner">
                  <span className="step-number">{index + 1}</span>
                  {isCompleted ? (
                    <Link to={step.path}>{step.label}</Link>
                  ) : (
                    <span className="step-label">{step.label}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Admin Link - Always visible */}
      <div style={{ textAlign: 'right', padding: '10px 20px', fontSize: '0.8rem' }}>
        <Link to="/admin/applicants" style={{ color: 'var(--gray-200)', textDecoration: 'underline', fontWeight: 'bold' }}>
          Admin Dashboard →
        </Link>
      </div>
    </div>
  );
}

export default Breadcrumbs;