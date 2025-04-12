import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import useFormStore from '../store/formStore';

function FormStep7() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormStore();
  
  // Initialize with at least 3 references if there are none
  const defaultReferences = formData.references?.length > 0 
    ? formData.references 
    : [
        { name: '', relationship: '', phone: '', email: '', type: 'professional' },
        { name: '', relationship: '', phone: '', email: '', type: 'professional' },
        { name: '', relationship: '', phone: '', email: '', type: 'character' }
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
    
    setFormData(data);
    navigate('/form/step8');
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">References</h1>
      </header>
      
      <Breadcrumbs />
      
      <main>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-section">
              <h2 className="form-section-heading">Professional & Character References</h2>
              <p>Please provide at least three references. At least one must be a professional reference (e.g., supervisor, colleague).</p>
              
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
          border-bottom: 1px solid var(--gray-200);
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
          color: var(--gray-800);
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
      `}</style>
    </div>
  );
}

export default FormStep7;