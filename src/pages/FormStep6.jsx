import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import useFormStore from '../store/formStore';

function FormStep6() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      previousEmployer: formData.previousEmployer || '',
      previousEmployerAddress: formData.previousEmployerAddress || '',
      previousEmployerCity: formData.previousEmployerCity || '',
      previousEmployerState: formData.previousEmployerState || '',
      previousEmployerZip: formData.previousEmployerZip || '',
      previousEmployerPhone: formData.previousEmployerPhone || '',
      previousEmployerTitle: formData.previousEmployerTitle || '',
      previousEmployerLength: formData.previousEmployerLength || '',
      previousEmployerReasonLeaving: formData.previousEmployerReasonLeaving || '',
      otherEmployment: formData.otherEmployment || ''
    }
  });

  const onSubmit = (data) => {
    setFormData(data);
    navigate('/form/step7');
  };

  // Format phone number while typing
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // Common US state abbreviations
  const US_STATES = [
    { name: 'Alabama', abbr: 'AL' },
    { name: 'Alaska', abbr: 'AK' },
    { name: 'Arizona', abbr: 'AZ' },
    { name: 'Arkansas', abbr: 'AR' },
    { name: 'California', abbr: 'CA' },
    { name: 'Colorado', abbr: 'CO' },
    { name: 'Connecticut', abbr: 'CT' },
    { name: 'Delaware', abbr: 'DE' },
    { name: 'Florida', abbr: 'FL' },
    { name: 'Georgia', abbr: 'GA' },
    { name: 'Hawaii', abbr: 'HI' },
    { name: 'Idaho', abbr: 'ID' },
    { name: 'Illinois', abbr: 'IL' },
    { name: 'Indiana', abbr: 'IN' },
    { name: 'Iowa', abbr: 'IA' },
    { name: 'Kansas', abbr: 'KS' },
    { name: 'Kentucky', abbr: 'KY' },
    { name: 'Louisiana', abbr: 'LA' },
    { name: 'Maine', abbr: 'ME' },
    { name: 'Maryland', abbr: 'MD' },
    { name: 'Massachusetts', abbr: 'MA' },
    { name: 'Michigan', abbr: 'MI' },
    { name: 'Minnesota', abbr: 'MN' },
    { name: 'Mississippi', abbr: 'MS' },
    { name: 'Missouri', abbr: 'MO' },
    { name: 'Montana', abbr: 'MT' },
    { name: 'Nebraska', abbr: 'NE' },
    { name: 'Nevada', abbr: 'NV' },
    { name: 'New Hampshire', abbr: 'NH' },
    { name: 'New Jersey', abbr: 'NJ' },
    { name: 'New Mexico', abbr: 'NM' },
    { name: 'New York', abbr: 'NY' },
    { name: 'North Carolina', abbr: 'NC' },
    { name: 'North Dakota', abbr: 'ND' },
    { name: 'Ohio', abbr: 'OH' },
    { name: 'Oklahoma', abbr: 'OK' },
    { name: 'Oregon', abbr: 'OR' },
    { name: 'Pennsylvania', abbr: 'PA' },
    { name: 'Rhode Island', abbr: 'RI' },
    { name: 'South Carolina', abbr: 'SC' },
    { name: 'South Dakota', abbr: 'SD' },
    { name: 'Tennessee', abbr: 'TN' },
    { name: 'Texas', abbr: 'TX' },
    { name: 'Utah', abbr: 'UT' },
    { name: 'Vermont', abbr: 'VT' },
    { name: 'Virginia', abbr: 'VA' },
    { name: 'Washington', abbr: 'WA' },
    { name: 'West Virginia', abbr: 'WV' },
    { name: 'Wisconsin', abbr: 'WI' },
    { name: 'Wyoming', abbr: 'WY' }
  ];

  // Custom styles to prevent fields from extending beyond form boundaries
  const formStyles = {
    fieldWithLimit: {
      width: '100%',
      boxSizing: 'border-box',
      maxWidth: '100%'
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      maxWidth: '100%'
    },
    textarea: {
      width: '100%',
      boxSizing: 'border-box',
      maxWidth: '100%'
    }
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">Employment History</h1>
      </header>
      
      <Breadcrumbs />
      
      <main>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-section">
              <h2 className="form-section-heading">Most Recent Employment</h2>
              <p>Please provide information about your most recent job. This will help us understand your work experience and professional background.</p>
              
              <div className="form-field field-with-limit">
                <label htmlFor="previousEmployer">Employer Name</label>
                <input 
                  type="text" 
                  id="previousEmployer" 
                  placeholder="Company/Organization Name"
                  aria-invalid={errors.previousEmployer ? "true" : "false"}
                  style={formStyles.input}
                  {...register('previousEmployer', { required: 'Employer name is required' })}
                />
                {errors.previousEmployer && <small className="error-message">{errors.previousEmployer.message}</small>}
              </div>
              
              <div className="form-field field-with-limit">
                <label htmlFor="previousEmployerAddress">Street Address</label>
                <input 
                  type="text" 
                  id="previousEmployerAddress" 
                  placeholder="123 Main St"
                  aria-invalid={errors.previousEmployerAddress ? "true" : "false"}
                  {...register('previousEmployerAddress', { required: 'Address is required' })}
                />
                {errors.previousEmployerAddress && 
                  <small className="error-message">{errors.previousEmployerAddress.message}</small>}
              </div>
              
              <div className="address-fields">
                <div className="form-field city-field">
                  <label htmlFor="previousEmployerCity">City</label>
                  <input 
                    type="text" 
                    id="previousEmployerCity" 
                    placeholder="Anytown"
                    aria-invalid={errors.previousEmployerCity ? "true" : "false"}
                    {...register('previousEmployerCity', { required: 'City is required' })}
                  />
                  {errors.previousEmployerCity && 
                    <small className="error-message">{errors.previousEmployerCity.message}</small>}
                </div>
                
                <div className="form-field state-field">
                  <label htmlFor="previousEmployerState">State</label>
                  <select 
                    id="previousEmployerState" 
                    aria-invalid={errors.previousEmployerState ? "true" : "false"}
                    {...register('previousEmployerState', { required: 'State is required' })}
                  >
                    <option value="">Select</option>
                    {US_STATES.map((state) => (
                      <option key={state.abbr} value={state.abbr}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.previousEmployerState && 
                    <small className="error-message">{errors.previousEmployerState.message}</small>}
                </div>
                
                <div className="form-field zip-field">
                  <label htmlFor="previousEmployerZip">ZIP Code</label>
                  <input 
                    type="text" 
                    id="previousEmployerZip" 
                    placeholder="12345"
                    maxLength={10}
                    aria-invalid={errors.previousEmployerZip ? "true" : "false"}
                    {...register('previousEmployerZip', { 
                      required: 'ZIP is required',
                      pattern: {
                        value: /^\d{5}(-\d{4})?$/,
                        message: 'Please enter a valid ZIP code'
                      }
                    })}
                  />
                  {errors.previousEmployerZip && 
                    <small className="error-message">{errors.previousEmployerZip.message}</small>}
                </div>
              </div>
              
              <div className="form-field field-with-limit">
                <label htmlFor="previousEmployerPhone">Phone Number</label>
                <input 
                  type="tel" 
                  id="previousEmployerPhone" 
                  placeholder="(123) 456-7890"
                  aria-invalid={errors.previousEmployerPhone ? "true" : "false"}
                  onInput={(e) => {
                    e.target.value = formatPhoneNumber(e.target.value);
                  }}
                  {...register('previousEmployerPhone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                />
                {errors.previousEmployerPhone && 
                  <small className="error-message">{errors.previousEmployerPhone.message}</small>}
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="form-section-heading">Position Details</h2>
              
              <div className="form-field field-with-limit">
                <label htmlFor="previousEmployerTitle">Your Job Title</label>
                <input 
                  type="text" 
                  id="previousEmployerTitle" 
                  placeholder="Licensed Therapist"
                  aria-invalid={errors.previousEmployerTitle ? "true" : "false"}
                  {...register('previousEmployerTitle', { required: 'Job title is required' })}
                />
                {errors.previousEmployerTitle && 
                  <small className="error-message">{errors.previousEmployerTitle.message}</small>}
              </div>
              
              <div className="form-field field-with-limit">
                <label htmlFor="previousEmployerLength">Length of Employment</label>
                <input 
                  type="text" 
                  id="previousEmployerLength" 
                  placeholder="3 years, 2 months"
                  aria-invalid={errors.previousEmployerLength ? "true" : "false"}
                  {...register('previousEmployerLength', { required: 'Length of employment is required' })}
                />
                {errors.previousEmployerLength && 
                  <small className="error-message">{errors.previousEmployerLength.message}</small>}
              </div>
              
              <div className="form-field field-with-limit">
                <label htmlFor="previousEmployerReasonLeaving">Reason for Leaving</label>
                <textarea 
                  id="previousEmployerReasonLeaving" 
                  rows="3"
                  placeholder="Please explain why you left this position"
                  aria-invalid={errors.previousEmployerReasonLeaving ? "true" : "false"}
                  {...register('previousEmployerReasonLeaving', { 
                    required: 'Reason for leaving is required'
                  })}
                />
                {errors.previousEmployerReasonLeaving && 
                  <small className="error-message">{errors.previousEmployerReasonLeaving.message}</small>}
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="form-section-heading">Additional Employment History</h2>
              
              <div className="form-field field-with-limit">
                <label htmlFor="otherEmployment">Other Relevant Employment (Optional)</label>
                <textarea 
                  id="otherEmployment" 
                  rows="5"
                  placeholder="Please list other relevant positions, including employer name, job title, and dates of employment."
                  {...register('otherEmployment')}
                />
                <small className="helper-text">If you have other relevant work experience, please summarize it here. Include the organization name, your role, and employment dates.</small>
              </div>
            </div>
            
            <div className="form-footer">
              <button 
                type="button" 
                className="secondary outline" 
                onClick={() => navigate('/form/step5')}
              >
                Back
              </button>
              <button type="submit" className="primary">Next</button>
            </div>
          </form>
        </div>
      </main>

      <style jsx>{`
        .field-with-limit input,
        .field-with-limit textarea,
        .field-with-limit select {
          width: 100%;
          box-sizing: border-box;
          max-width: 100%;
        }
        
        .address-fields {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 0.5rem 0 1.5rem;
        }
        
        @media (max-width: 640px) {
          .address-fields {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default FormStep6;