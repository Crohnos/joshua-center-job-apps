import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import useFormStore from '../store/formStore';

function FormStep3() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormStore();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      usCitizen: formData.usCitizen || '',
      felonyConviction: formData.felonyConviction || '',
      felonyExplanation: formData.felonyExplanation || '',
      dualRelationships: formData.dualRelationships || 'no',
      dualRelationshipsExplanation: formData.dualRelationshipsExplanation || ''
    }
  });

  // Watch fields for conditional rendering
  const watchFelony = watch('felonyConviction') === 'yes';
  const watchDualRel = watch('dualRelationships');

  const onSubmit = (data) => {
    setFormData(data);
    navigate('/form/step4');
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
            <h2 className="form-section-heading">Qualifications</h2>
            <p>Please provide information about your eligibility and qualifications for this position.</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* US Citizen */}
            <div className="form-section">
              <div className="form-field">
                <label className="question-label">Are you a U.S. citizen or legally authorized to work in the United States?</label>
                <div className="radio-group horizontal">
                  <div className="radio-item">
                    <input 
                      type="radio" 
                      id="usCitizenYes" 
                      value="yes"
                      {...register('usCitizen', { required: 'Please answer this question' })}
                    />
                    <label htmlFor="usCitizenYes">Yes</label>
                  </div>
                  <div className="radio-item">
                    <input 
                      type="radio" 
                      id="usCitizenNo" 
                      value="no"
                      {...register('usCitizen', { required: 'Please answer this question' })}
                    />
                    <label htmlFor="usCitizenNo">No</label>
                  </div>
                </div>
                {errors.usCitizen && <small className="error-message">{errors.usCitizen.message}</small>}
              </div>
            </div>
            
            {/* Felony */}
            <div className="form-section">
              <div className="form-field">
                <label className="question-label">Have you ever been convicted of a felony?</label>
                <small className="helper-text">A felony conviction does not automatically disqualify you from employment.</small>
                <div className="radio-group horizontal">
                  <div className="radio-item">
                    <input 
                      type="radio" 
                      id="felonyConvictionYes" 
                      value="yes"
                      {...register('felonyConviction', { required: 'Please answer this question' })}
                    />
                    <label htmlFor="felonyConvictionYes">Yes</label>
                  </div>
                  <div className="radio-item">
                    <input 
                      type="radio" 
                      id="felonyConvictionNo" 
                      value="no"
                      {...register('felonyConviction', { required: 'Please answer this question' })}
                    />
                    <label htmlFor="felonyConvictionNo">No</label>
                  </div>
                </div>
                {errors.felonyConviction && <small className="error-message">{errors.felonyConviction.message}</small>}
              </div>
              
              {/* Conditional felony explanation */}
              {watchFelony && (
                <div className="form-field">
                  <label htmlFor="felonyExplanation">Please provide details about your conviction:</label>
                  <textarea 
                    id="felonyExplanation" 
                    placeholder="Please explain the circumstances..."
                    rows="4"
                    aria-invalid={errors.felonyExplanation ? "true" : "false"}
                    {...register('felonyExplanation', { 
                      required: 'Please provide details about your conviction'
                    })}
                  />
                  {errors.felonyExplanation && 
                    <small className="error-message">{errors.felonyExplanation.message}</small>}
                </div>
              )}
            </div>
            
            {/* Dual Relationships */}
            <div className="form-section">
              <div className="form-field">
                <label className="question-label">Do you have any dual relationships with The Joshua Center?</label>
                <small className="helper-text">For example, are you related to or have a personal relationship with any current employees?</small>
                
                <div className="radio-group">
                  <div className="radio-item">
                    <input 
                      type="radio" 
                      id="dualRelationshipsNo" 
                      value="no"
                      {...register('dualRelationships', { required: 'Please select an option' })}
                    />
                    <label htmlFor="dualRelationshipsNo">No</label>
                  </div>
                  
                  <div className="radio-item">
                    <input 
                      type="radio" 
                      id="dualRelationshipsYes" 
                      value="yes"
                      {...register('dualRelationships', { required: 'Please select an option' })}
                    />
                    <label htmlFor="dualRelationshipsYes">Yes</label>
                  </div>
                  
                  <div className="radio-item">
                    <input 
                      type="radio" 
                      id="dualRelationshipsUnsure" 
                      value="unsure"
                      {...register('dualRelationships', { required: 'Please select an option' })}
                    />
                    <label htmlFor="dualRelationshipsUnsure">Unsure</label>
                  </div>
                </div>
                {errors.dualRelationships && <small className="error-message">{errors.dualRelationships.message}</small>}
              </div>
              
              {/* Conditional dual relationships explanation */}
              {(watchDualRel === 'yes' || watchDualRel === 'unsure') && (
                <div className="form-field">
                  <label htmlFor="dualRelationshipsExplanation">Please provide details about your relationship:</label>
                  <textarea 
                    id="dualRelationshipsExplanation" 
                    placeholder="Please explain your relationship..."
                    rows="4"
                    aria-invalid={errors.dualRelationshipsExplanation ? "true" : "false"}
                    {...register('dualRelationshipsExplanation', { 
                      required: 'Please provide details about your relationship'
                    })}
                  />
                  {errors.dualRelationshipsExplanation && 
                    <small className="error-message">{errors.dualRelationshipsExplanation.message}</small>}
                </div>
              )}
            </div>
            
            <div className="form-footer">
              <button 
                type="button" 
                className="button secondary" 
                onClick={() => navigate('/form/step2')}
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

export default FormStep3;