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
        <h1 className="app-title">The Joshua Center</h1>
        <p className="app-subtitle">Job Application Portal</p>
      </header>
      
      <Breadcrumbs />
      
      <main>
        <h1 className="page-title">Demographics</h1>
        <p className="page-description">Step 8 of 9: Share demographic information to support our diversity initiatives.</p>
        
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-section">
              <h2 className="form-section-heading">Diversity Information</h2>
              <p>
                This information is collected for diversity and inclusion purposes. 
                Your responses are voluntary and will not affect your employment eligibility.
              </p>
              
              <div className="form-field field-with-limit">
                <label htmlFor="languages" className="question-label">Languages Spoken (other than English)</label>
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
                <label htmlFor="gender" className="question-label">Gender Identity</label>
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
                <label htmlFor="raceEthnicity" className="question-label">Race/Ethnicity</label>
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
                className="button secondary" 
                onClick={() => navigate('/form/step7')}
              >
                Back
              </button>
              <button type="submit" className="button primary">Review & Submit</button>
            </div>
          </form>
        </div>
      </main>
      
    </div>
  );
}

export default FormStep8;