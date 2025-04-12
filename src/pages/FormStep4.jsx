import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLocations } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import useFormStore from '../store/formStore';

function FormStep4() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormStore();
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch available locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const locationData = await getLocations();
        setLocations(locationData);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLocations();
  }, []);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      interests: formData.interests || '',
      whyJoshuaCenter: formData.whyJoshuaCenter || '',
      ethicalFrameworkThoughts: formData.ethicalFrameworkThoughts || '',
      populations: formData.populations || [],
      locations: formData.locations || []
    }
  });

  const populationOptions = [
    'Children (0-12)',
    'Adolescents (13-17)',
    'Young Adults (18-25)',
    'Adults (26-64)',
    'Seniors (65+)',
    'Families',
    'Couples',
    'LGBTQ+',
    'Veterans',
    'Religious Communities',
    'Cultural/Ethnic Minorities'
  ];

  const onSubmit = (data) => {
    setFormData(data);
    navigate('/form/step5');
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">The Joshua Center</h1>
        <p className="app-subtitle">Job Application Portal</p>
      </header>
      
      <Breadcrumbs />
      
      <main>
        <div className="card">
          <div className="form-section">
            <h2 className="form-section-heading">Interests & Preferences</h2>
            <p>Please tell us about your professional interests and preferences to help us find the best match for your skills.</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Professional interests */}
            <div className="form-section">
              <div className="form-field">
                <label htmlFor="interests" className="question-label">
                  What are your professional interests in counseling/therapy?
                </label>
                <textarea 
                  id="interests" 
                  rows="4"
                  placeholder="Describe your interests, specializations, and therapeutic approaches..."
                  aria-invalid={errors.interests ? "true" : "false"}
                  {...register('interests', { required: 'Please describe your professional interests' })}
                />
                {errors.interests && <small className="error-message">{errors.interests.message}</small>}
              </div>
            </div>
            
            {/* Why Joshua Center */}
            <div className="form-section">
              <div className="form-field">
                <label htmlFor="whyJoshuaCenter" className="question-label">
                  Why do you want to work with The Joshua Center specifically?
                </label>
                <textarea 
                  id="whyJoshuaCenter" 
                  rows="4"
                  placeholder="Tell us what attracts you to our organization..."
                  aria-invalid={errors.whyJoshuaCenter ? "true" : "false"}
                  {...register('whyJoshuaCenter', { required: 'Please explain why you want to work with us' })}
                />
                {errors.whyJoshuaCenter && <small className="error-message">{errors.whyJoshuaCenter.message}</small>}
              </div>
            </div>
            
            {/* Ethical framework */}
            <div className="form-section">
              <div className="form-field">
                <label htmlFor="ethicalFrameworkThoughts" className="question-label">
                  What are your thoughts on ethical frameworks in counseling/therapy?
                </label>
                <textarea 
                  id="ethicalFrameworkThoughts" 
                  rows="4"
                  placeholder="Share your perspectives on ethics in therapeutic practice..."
                  aria-invalid={errors.ethicalFrameworkThoughts ? "true" : "false"}
                  {...register('ethicalFrameworkThoughts', { 
                    required: 'Please share your thoughts on ethical frameworks' 
                  })}
                />
                {errors.ethicalFrameworkThoughts && 
                  <small className="error-message">{errors.ethicalFrameworkThoughts.message}</small>}
              </div>
            </div>
            
            {/* Population checkboxes */}
            <div className="form-section">
              <fieldset className="checkbox-fieldset">
                <legend className="fieldset-legend">What populations are you interested in working with?</legend>
                <small className="helper-text">Select all that apply</small>
                
                <div className="checkbox-grid">
                  {populationOptions.map(population => (
                    <div key={population} className="checkbox-item">
                      <input 
                        type="checkbox" 
                        id={`population-${population}`} 
                        value={population}
                        {...register('populations', { 
                          required: 'Please select at least one population'
                        })}
                      />
                      <label htmlFor={`population-${population}`}>
                        {population}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.populations && <small className="error-message">{errors.populations.message}</small>}
              </fieldset>
            </div>
            
            {/* Location checkboxes */}
            <div className="form-section">
              <fieldset className="checkbox-fieldset">
                <legend className="fieldset-legend">Which locations are you interested in working at?</legend>
                <small className="helper-text">Select all that apply</small>
                
                {isLoading ? (
                  <div className="loader-container">
                    <div aria-busy="true" className="loader">Loading locations...</div>
                  </div>
                ) : (
                  <div className="checkbox-grid">
                    {locations.map(location => (
                      <div key={location.id} className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id={`location-${location.id}`} 
                          value={location.id}
                          {...register('locations', { 
                            required: 'Please select at least one location'
                          })}
                        />
                        <label htmlFor={`location-${location.id}`}>
                          {location.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {errors.locations && <small className="error-message">{errors.locations.message}</small>}
              </fieldset>
            </div>
            
            <div className="form-footer">
              <button 
                type="button" 
                className="button secondary" 
                onClick={() => navigate('/form/step3')}
              >
                Back
              </button>
              <button type="submit" className="button primary">Continue to Next Step</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default FormStep4;