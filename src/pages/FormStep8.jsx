import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import useFormStore from '../store/formStore';

function FormStep8() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      languages: formData.languages || '',
      gender: formData.gender || '',
      raceEthnicity: formData.raceEthnicity || ''
    }
  });

  const onSubmit = (data) => {
    setFormData(data);
    navigate('/form/submit');
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">Demographics</h1>
      </header>
      
      <Breadcrumbs />
      
      <main>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-section">
              <h2 className="form-section-heading">Optional Demographic Information</h2>
              <p>
                This information is collected for diversity and inclusion purposes. 
                Your responses are voluntary and will not affect your employment eligibility.
              </p>
              
              <div className="form-field field-with-limit">
                <label htmlFor="languages">Languages Spoken (other than English)</label>
                <input 
                  type="text" 
                  id="languages" 
                  placeholder="Spanish, French, etc. (Enter 'None' if not applicable)"
                  aria-invalid={errors.languages ? "true" : "false"}
                  {...register('languages', { required: 'Please list languages or enter "None"' })}
                />
                {errors.languages && <small className="error-message">{errors.languages.message}</small>}
              </div>
              
              <div className="form-field field-with-limit">
                <label htmlFor="gender">Gender Identity</label>
                <select 
                  id="gender"
                  aria-invalid={errors.gender ? "true" : "false"}
                  {...register('gender', { required: 'Please select your gender identity' })}
                >
                  <option value="">-- Select --</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="transgender">Transgender</option>
                  <option value="self-describe">Prefer to self-describe</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
                {errors.gender && <small className="error-message">{errors.gender.message}</small>}
                <small className="helper-text">This information helps us track our commitment to gender diversity.</small>
              </div>
              
              <div className="form-field field-with-limit">
                <label htmlFor="raceEthnicity">Race/Ethnicity</label>
                <select 
                  id="raceEthnicity"
                  aria-invalid={errors.raceEthnicity ? "true" : "false"}
                  {...register('raceEthnicity', { required: 'Please select your race/ethnicity' })}
                >
                  <option value="">-- Select --</option>
                  <option value="american-indian">American Indian or Alaska Native</option>
                  <option value="asian">Asian</option>
                  <option value="black">Black or African American</option>
                  <option value="hispanic">Hispanic or Latino</option>
                  <option value="native-hawaiian">Native Hawaiian or Other Pacific Islander</option>
                  <option value="white">White</option>
                  <option value="multiracial">Two or more races</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
                {errors.raceEthnicity && <small className="error-message">{errors.raceEthnicity.message}</small>}
                <small className="helper-text">This information helps us track our commitment to ethnic diversity.</small>
              </div>
            </div>
            
            <div className="form-footer">
              <button 
                type="button" 
                className="secondary outline" 
                onClick={() => navigate('/form/step7')}
              >
                Back
              </button>
              <button type="submit" className="primary">Review & Submit</button>
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
        
        .helper-text {
          color: var(--gray-600);
          font-size: 0.875rem;
          margin-top: 0.5rem;
          font-style: italic;
        }
        
        .form-field {
          margin-bottom: 1.5rem;
        }
        
        .form-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--gray-200);
        }
      `}</style>
    </div>
  );
}

export default FormStep8;