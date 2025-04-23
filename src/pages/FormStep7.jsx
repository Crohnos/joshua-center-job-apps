import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FormHeader from '../components/FormHeader';
import useFormStore from '../store/formStore';

function FormStep7() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormStore();
  
  // Initialize with at least 3 references if there are none - one of each required type
  const defaultReferences = formData.references?.length > 0 
    ? formData.references 
    : [
        { name: '', relationship: '', phone: '', email: '', type: 'professional' },
        { name: '', relationship: '', phone: '', email: '', type: 'character' },
        { name: '', relationship: '', phone: '', email: '', type: 'academic' }
      ];
  
  const { register, control, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { 
      references: defaultReferences
    }
  });
  
  const { fields, append, remove } = useFieldArray({ 
    control, 
    name: 'references' 
  });

  // Format phone number while typing
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    
    // Remove all non-digit characters
    const phoneNumber = value.replace(/[^\d]/g, '');
    
    // Format based on length
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const onSubmit = (data) => {
    // Validate at least 3 references
    if (data.references.length < 3) {
      alert('Please provide at least 3 references');
      return;
    }
    
    // Check if we have at least one of each required reference type
    const referenceTypes = data.references.map(ref => ref.type);
    const hasProfessional = referenceTypes.includes('professional');
    const hasCharacter = referenceTypes.includes('character');
    const hasAcademic = referenceTypes.includes('academic');
    
    if (!hasProfessional || !hasCharacter || !hasAcademic) {
      alert('You must include at least one professional, one character, and one academic reference.');
      return;
    }
    
    setFormData(data);
    navigate('/form/step8');
  };

  return (
    <div className="container">
      <FormHeader />
      
      <Breadcrumbs />
      
      <main>
        <h1 className="page-title">References Information</h1>
        <p className="page-description">Step 7 of 9: Provide contact information for your references.</p>
        
        <div className="disclaimer-container">
          <div className="disclaimer">
            <div className="disclaimer-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="disclaimer-content">
              <h3>Email Notification</h3>
              <p><strong>IMPORTANT:</strong> An email will be sent to each reference to confirm their information when your application is submitted. Please ensure all email addresses are correct.</p>
            </div>
          </div>
          
          <div className="disclaimer">
            <div className="disclaimer-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="disclaimer-content">
              <h3>Required Reference Types</h3>
              <p><strong>REQUIRED:</strong> You must provide three different types of references:</p>
              <ul>
                <li>One <strong>Professional</strong> reference (supervisor, manager, colleague)</li>
                <li>One <strong>Character</strong> reference (personal reference, not a family member)</li>
                <li>One <strong>Academic</strong> reference (professor, advisor, teacher)</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-section">
              <h2 className="form-section-heading">Reference Details</h2>
              <p>Please provide at least three references as specified above.</p>
              
              {fields.map((field, index) => (
                <div key={field.id} className="reference-entry form-subsection">
                  <div className="entry-header">
                    <h3 className="entry-title">Reference #{index + 1}</h3>
                    {fields.length > 3 && (
                      <button 
                        type="button" 
                        className="secondary outline remove-button" 
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-field field-with-limit">
                      <label htmlFor={`references.${index}.name`}>Full Name</label>
                      <input 
                        type="text" 
                        id={`references.${index}.name`}
                        placeholder="John Smith"
                        aria-invalid={errors.references?.[index]?.name ? "true" : "false"}
                        {...register(`references.${index}.name`, { required: 'Name is required' })}
                      />
                      {errors.references?.[index]?.name && 
                        <small className="error-message">{errors.references[index].name.message}</small>}
                    </div>
                    
                    <div className="form-field field-with-limit">
                      <label htmlFor={`references.${index}.relationship`}>Relationship/Title</label>
                      <input 
                        type="text" 
                        id={`references.${index}.relationship`}
                        placeholder="Supervisor, Colleague, Professor, etc."
                        aria-invalid={errors.references?.[index]?.relationship ? "true" : "false"}
                        {...register(`references.${index}.relationship`, { required: 'Relationship is required' })}
                      />
                      {errors.references?.[index]?.relationship && 
                        <small className="error-message">{errors.references[index].relationship.message}</small>}
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-field field-with-limit">
                      <label htmlFor={`references.${index}.phone`}>Phone Number</label>
                      <input 
                        type="tel" 
                        id={`references.${index}.phone`}
                        placeholder="(123) 456-7890"
                        aria-invalid={errors.references?.[index]?.phone ? "true" : "false"}
                        onInput={(e) => {
                          e.target.value = formatPhoneNumber(e.target.value);
                        }}
                        {...register(`references.${index}.phone`, { 
                          required: 'Phone is required',
                          pattern: {
                            value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                            message: 'Please enter a valid phone number'
                          }
                        })}
                      />
                      {errors.references?.[index]?.phone && 
                        <small className="error-message">{errors.references[index].phone.message}</small>}
                    </div>
                    
                    <div className="form-field field-with-limit">
                      <label htmlFor={`references.${index}.email`}>Email Address</label>
                      <input 
                        type="email" 
                        id={`references.${index}.email`}
                        placeholder="email@example.com"
                        aria-invalid={errors.references?.[index]?.email ? "true" : "false"}
                        {...register(`references.${index}.email`, { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Please enter a valid email address'
                          }
                        })}
                      />
                      {errors.references?.[index]?.email && 
                        <small className="error-message">{errors.references[index].email.message}</small>}
                    </div>
                  </div>
                  
                  <div className="form-field field-with-limit">
                    <label htmlFor={`references.${index}.type`}>Reference Type</label>
                    <select 
                      id={`references.${index}.type`}
                      aria-invalid={errors.references?.[index]?.type ? "true" : "false"}
                      {...register(`references.${index}.type`, { required: 'Reference type is required' })}
                    >
                      <option value="professional">Professional (Supervisor, Colleague)</option>
                      <option value="character">Character (Personal Reference)</option>
                      <option value="academic">Academic (Professor, Advisor)</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.references?.[index]?.type && 
                      <small className="error-message">{errors.references[index].type.message}</small>}
                  </div>
                </div>
              ))}
              
              <button 
                type="button" 
                className="secondary outline add-button" 
                onClick={() => append({ name: '', relationship: '', phone: '', email: '', type: 'professional' })}
              >
                + Add Another Reference
              </button>
            </div>
            
            <div className="form-footer">
              <button 
                type="button" 
                className="secondary outline" 
                onClick={() => navigate('/form/step6')}
              >
                Back
              </button>
              <button type="submit" className="primary">Next</button>
            </div>
          </form>
        </div>
      </main>

      <style jsx>{`
        .reference-entry {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--gray-600);
        }
        
        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        
        .entry-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--gray-100);
          margin: 0;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
        }
        
        .field-with-limit input,
        .field-with-limit textarea,
        .field-with-limit select {
          width: 100%;
          box-sizing: border-box;
          max-width: 100%;
        }
        
        .add-button {
          margin: 1rem auto 2rem;
          display: block;
        }
        
        .remove-button {
          padding: 0.4rem 0.8rem;
          font-size: 0.875rem;
        }
        
        .form-subsection {
          margin-bottom: 2rem;
        }
        
        /* Disclaimer styles */
        .disclaimer-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .disclaimer {
          background-color: var(--gray-800);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          border-left: 4px solid var(--primary);
          box-shadow: var(--shadow-md);
        }
        
        .disclaimer:nth-child(2) {
          border-left-color: var(--danger);
        }
        
        .disclaimer-icon {
          flex-shrink: 0;
          color: var(--primary);
          margin-top: 0.2rem;
        }
        
        .disclaimer:nth-child(2) .disclaimer-icon {
          color: var(--danger);
        }
        
        .disclaimer-content {
          flex: 1;
        }
        
        .disclaimer h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: var(--gray-100);
        }
        
        .disclaimer p {
          margin: 0 0 0.5rem 0;
          color: var(--gray-300);
        }
        
        .disclaimer ul {
          margin: 0.5rem 0 0 1.5rem;
          padding: 0;
          color: var(--gray-300);
        }
        
        .disclaimer li {
          margin-bottom: 0.5rem;
        }
        
        .disclaimer strong {
          color: var(--gray-100);
        }
        
        @media (max-width: 768px) {
          .disclaimer {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .disclaimer-icon {
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default FormStep7;