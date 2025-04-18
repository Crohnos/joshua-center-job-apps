import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import useFormStore from '../store/formStore';
import { submitApplication } from '../services/api';

function FormSubmit() {
  const navigate = useNavigate();
  const { formData, resetForm } = useFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // Make sure we have a resume file
    if (!data.resume || data.resume.length === 0) {
      setSubmitError('Please upload your resume as a PDF');
      return;
    }
    
    // Check if at least one location is selected
    if (!formData.locations || formData.locations.length === 0) {
      setSubmitError('Please select at least one location you are applying for');
      return;
    }
    
    // Check if we have at least 3 references
    if (!formData.references || formData.references.length < 3) {
      setSubmitError('Please provide at least three references');
      return;
    }
    
    // Make sure we have email set - for testing, use the dev email if missing
    let emailToUse = formData.email;
    if (!emailToUse) {
      // For development only - in production, we'd want to fail here
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Email is missing, using dev@example.com for testing');
        emailToUse = 'dev@example.com';
      } else {
        setSubmitError('Email is missing. Please restart the application process.');
        return;
      }
    }
  
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Prepare data for submission
      const processedFormData = {
        ...formData,
        // Ensure email is set
        email: emailToUse,
        // Convert the educations array to a string format expected by the backend
        education: formData.educations ? 
          formData.educations.map(edu => 
            `${edu.level} in ${edu.field} from ${edu.institution} (${edu.inProgress ? 'In Progress' : edu.yearCompleted || 'Completed'})${edu.degree ? `, ${edu.degree}` : ''}`
          ).join('\n\n') : ''
      };
      
      // Add certifications if they exist
      if (formData.certifications && formData.certifications.length > 0) {
        processedFormData.education += '\n\nCertifications/Licenses:\n' + 
          formData.certifications.map(cert => 
            `${cert.name} from ${cert.issuer} (${cert.inProgress ? 'In Progress' : 'Obtained ' + cert.dateObtained})${cert.expirationDate ? `, Expires: ${cert.expirationDate}` : ''}`
          ).join('\n');
      }
      
      // Submit application with resume file
      await submitApplication(processedFormData, data.resume[0]);
      
      // Success - reset form and redirect to thank you page
      resetForm();
      navigate('/thank-you');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(
        error.response?.data || 
        'There was an error submitting your application. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">The Joshua Center</h1>
        <p className="app-subtitle">Job Application Portal</p>
      </header>
      
      <Breadcrumbs />
      
      <main>
        <h1 className="page-title">Resume & Final Submission</h1>
        <p className="page-description">Step 9 of 9: Upload your resume and submit your application.</p>
        
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-section">
              <h2 className="form-section-heading">Resume & Final Submission</h2>
              <p>Please upload your resume (PDF format only) and review your application before submitting.</p>
              
              {submitError && (
                <div className="alert danger" role="alert">
                  <div className="alert-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <div className="alert-content">
                    <div className="alert-title">Error</div>
                    <p>{submitError}</p>
                  </div>
                </div>
              )}
              
              <div className="form-field field-with-limit">
                <label htmlFor="resume">Upload Resume (PDF)</label>
                <input 
                  type="file" 
                  id="resume" 
                  accept="application/pdf" 
                  aria-invalid={errors.resume ? "true" : "false"}
                  className="file-input"
                  {...register('resume', { required: 'Resume is required' })}
                />
                {errors.resume && <small className="error-message">{errors.resume.message}</small>}
                <small className="helper-text">Please upload your current resume in PDF format. Maximum file size: 10MB.</small>
              </div>
              
              <div className="form-field field-with-limit">
                <label htmlFor="comments">Additional Comments (Optional)</label>
                <textarea 
                  id="comments" 
                  rows="4"
                  placeholder="Any additional information you'd like to share..."
                  {...register('comments')}
                />
                <small className="helper-text">If there are any additional details that weren't covered in the application form, please add them here.</small>
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="form-section-heading">Review & Confirmation</h2>
              <p>By clicking "Submit Application" below, you confirm that all information provided is accurate and complete to the best of your knowledge.</p>
              
              <div className="confirmation-box">
                <p>Please double-check that you've completed all required sections:</p>
                <ul className="confirmation-checklist">
                  <li>Contact Information</li>
                  <li>Initial Qualifications</li>
                  <li>Professional Interests</li>
                  <li>Education & Credentials</li>
                  <li>Employment History</li>
                  <li>References (minimum 3)</li>
                  <li>Demographics</li>
                  <li>Resume Upload</li>
                </ul>
              </div>
            </div>
            
            <div className="form-footer">
              <button 
                type="button" 
                className="button secondary" 
                onClick={() => navigate('/form/step8')}
              >
                Back
              </button>
              
              <button 
                type="submit" 
                className="button primary submit-button" 
                aria-busy={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <style jsx>{`
        .field-with-limit input,
        .field-with-limit select,
        .field-with-limit textarea {
          width: 100%;
          box-sizing: border-box;
          max-width: 100%;
        }
        
        .form-field {
          margin-bottom: 1.5rem;
        }
        
        .file-input {
          padding: 1rem;
          border: 2px dashed var(--gray-600);
          border-radius: 0.5rem;
          width: 100%;
          box-sizing: border-box;
          background-color: var(--gray-800);
          cursor: pointer;
          color: var(--gray-300);
        }
        
        .file-input:hover {
          border-color: var(--primary);
          background-color: rgba(67, 97, 238, 0.1);
        }
        
        .helper-text {
          color: var(--gray-400);
          font-size: var(--font-size-sm);
          margin-top: 0.5rem;
          font-style: italic;
        }
        
        .alert {
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          gap: 1rem;
        }
        
        .alert.danger {
          background-color: rgba(239, 68, 68, 0.1);
          border-left: 4px solid var(--danger);
          color: var(--gray-100);
        }
        
        .alert-icon {
          display: flex;
          align-items: flex-start;
          color: var(--danger);
        }
        
        .alert-content {
          flex: 1;
        }
        
        .alert-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--danger);
        }
        
        .alert-content p {
          margin: 0;
          color: var(--gray-300);
        }
        
        .confirmation-box {
          background-color: var(--gray-700);
          border: 1px solid var(--gray-600);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          margin: 1.5rem 0;
          box-shadow: var(--shadow-sm);
        }
        
        .confirmation-box p {
          color: var(--gray-300);
          margin-top: 0;
        }
        
        .confirmation-checklist {
          margin-top: 1rem;
          padding-left: 1.5rem;
          color: var(--gray-300);
        }
        
        .confirmation-checklist li {
          margin-bottom: 0.75rem;
        }
        
        .form-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--gray-700);
        }
        
        .form-footer button {
          width: 100%;
        }
        
        @media (min-width: 480px) {
          .form-footer {
            flex-direction: row;
            justify-content: space-between;
          }
          
          .form-footer button {
            width: auto;
          }
          
          .submit-button {
            min-width: 180px;
          }
        }
      `}</style>
    </div>
  );
}

export default FormSubmit;