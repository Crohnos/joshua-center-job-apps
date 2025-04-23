import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FormHeader from '../components/FormHeader';
import useFormStore from '../store/formStore';

// List of US states
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

function FormStep2() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: formData.name || '',
      address: formData.address || '',
      city: formData.city || '',
      state: formData.state || '',
      zip: formData.zip || '',
      phone: formData.phone || ''
    }
  });

  const onSubmit = (data) => {
    setFormData(data);
    navigate('/form/step3');
  };

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

  return (
    <div className="container">
      <FormHeader />
      
      <Breadcrumbs />
      
      <main>
        <h1 className="page-title">Contact Information</h1>
        <p className="page-description">Step 2 of 9: Please provide your contact details so we can reach you.</p>
        
        <div className="card">
          <div className="form-section">
            <h2 className="form-section-heading">Contact Details</h2>
            <p>Please provide your current contact details. All communications regarding your application will be sent to these addresses.</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-section">
              <div className="form-field">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  placeholder="John Doe"
                  aria-invalid={errors.name ? "true" : "false"}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <small className="error-message">{errors.name.message}</small>}
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="form-section-heading">Address</h3>
              
              <div className="form-field">
                <label htmlFor="address">Street Address</label>
                <input 
                  type="text" 
                  id="address" 
                  placeholder="123 Main St"
                  aria-invalid={errors.address ? "true" : "false"}
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && <small className="error-message">{errors.address.message}</small>}
              </div>
              
              <div className="address-fields">
                <div className="form-field city-field">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    placeholder="Anytown"
                    aria-invalid={errors.city ? "true" : "false"}
                    {...register('city', { required: 'City is required' })}
                  />
                  {errors.city && <small className="error-message">{errors.city.message}</small>}
                </div>
                
                <div className="form-field state-field">
                  <label htmlFor="state">State</label>
                  <select 
                    id="state" 
                    aria-invalid={errors.state ? "true" : "false"}
                    {...register('state', { required: 'State is required' })}
                  >
                    <option value="">Select</option>
                    {US_STATES.map((state) => (
                      <option key={state.abbr} value={state.abbr}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <small className="error-message">{errors.state.message}</small>}
                </div>
                
                <div className="form-field zip-field">
                  <label htmlFor="zip">ZIP Code</label>
                  <input 
                    type="text" 
                    id="zip" 
                    placeholder="12345"
                    maxLength={5}
                    aria-invalid={errors.zip ? "true" : "false"}
                    {...register('zip', { 
                      required: 'ZIP is required',
                      pattern: {
                        value: /^\d{5}$/,
                        message: 'Please enter a valid 5-digit ZIP code'
                      }
                    })}
                  />
                  {errors.zip && <small className="error-message">{errors.zip.message}</small>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-field">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  placeholder="(123) 456-7890"
                  aria-invalid={errors.phone ? "true" : "false"}
                  onInput={(e) => {
                    e.target.value = formatPhoneNumber(e.target.value);
                  }}
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                />
                {errors.phone && <small className="error-message">{errors.phone.message}</small>}
              </div>
            </div>
            
            <div className="form-footer">
              <button type="button" className="button secondary" onClick={() => navigate('/form/step1')}>Back</button>
              <button type="submit" className="button primary">Continue to Next Step</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default FormStep2;