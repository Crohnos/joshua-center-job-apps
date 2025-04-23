import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FormHeader from '../components/FormHeader';
import useFormStore from '../store/formStore';

function FormStep5() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormStore();
  
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      educations: formData.educations?.length > 0 ? formData.educations : [
        { 
          level: '', 
          institution: '', 
          degree: '', 
          field: '', 
          yearCompleted: '', 
          inProgress: false 
        }
      ],
      certifications: formData.certifications?.length > 0 ? formData.certifications : [
        { 
          name: '', 
          issuer: '', 
          dateObtained: '', 
          expirationDate: '', 
          inProgress: false 
        }
      ]
    }
  });

  const { 
    fields: educationFields, 
    append: appendEducation, 
    remove: removeEducation 
  } = useFieldArray({
    control,
    name: 'educations'
  });

  const { 
    fields: certificationFields, 
    append: appendCertification, 
    remove: removeCertification 
  } = useFieldArray({
    control,
    name: 'certifications'
  });

  const onSubmit = (data) => {
    setFormData(data);
    navigate('/form/step6');
  };

  const educationLevels = [
    'High School',
    'Associate\'s Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctoral Degree',
    'Professional Degree',
    'Other'
  ];
  
  const degreeTypes = [
    'B.A. - Bachelor of Arts',
    'B.S. - Bachelor of Science',
    'B.S.W. - Bachelor of Social Work',
    'M.A. - Master of Arts',
    'M.S. - Master of Science',
    'M.S.W. - Master of Social Work',
    'M.Ed. - Master of Education',
    'M.C. - Master of Counseling',
    'M.MFT - Master of Marriage and Family Therapy',
    'M.Div. - Master of Divinity',
    'Ed.S. - Education Specialist',
    'Ph.D. - Doctor of Philosophy',
    'Psy.D. - Doctor of Psychology',
    'Ed.D. - Doctor of Education',
    'D.Min. - Doctor of Ministry',
    'M.D. - Doctor of Medicine',
    'Other'
  ];

  return (
    <div className="container">
      <FormHeader />
      
      <Breadcrumbs />
      
      <main>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Academic Education Section */}
            <div className="form-section">
              <h2 className="form-section-heading">Academic Education</h2>
              <p>Please provide details about your educational background.</p>
              
              {educationFields.map((field, index) => (
                <div key={field.id} className="education-entry">
                  <div className="entry-header">
                    <h3 className="entry-title">Education #{index + 1}</h3>
                    {educationFields.length > 1 && (
                      <button
                        type="button"
                        className="secondary outline"
                        onClick={() => removeEducation(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor={`educations.${index}.level`}>
                      Highest Level of Education
                      <select
                        id={`educations.${index}.level`}
                        {...register(`educations.${index}.level`, {
                          required: 'Education level is required'
                        })}
                      >
                        <option value="">Select education level</option>
                        {educationLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </label>
                    {errors.educations?.[index]?.level && 
                      <small className="error-message">{errors.educations[index].level.message}</small>}
                  </div>

                  <div className="form-field institution-field">
                    <label htmlFor={`educations.${index}.institution`}>
                      Institution Name
                      <input
                        type="text"
                        id={`educations.${index}.institution`}
                        placeholder="University or College Name"
                        {...register(`educations.${index}.institution`, {
                          required: 'Institution name is required'
                        })}
                      />
                    </label>
                    {errors.educations?.[index]?.institution && 
                      <small className="error-message">{errors.educations[index].institution.message}</small>}
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor={`educations.${index}.degree`}>
                        Degree
                        <select
                          id={`educations.${index}.degree`}
                          {...register(`educations.${index}.degree`)}
                        >
                          <option value="">Select a degree</option>
                          {degreeTypes.map(degree => (
                            <option key={degree} value={degree.split(' - ')[0]}>
                              {degree}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="form-field">
                      <label htmlFor={`educations.${index}.field`}>
                        Field of Study / Major
                        <input
                          type="text"
                          id={`educations.${index}.field`}
                          placeholder="Psychology, Computer Science, etc."
                          {...register(`educations.${index}.field`)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor={`educations.${index}.yearCompleted`}>
                        Year Completed
                        <input
                          type="text"
                          id={`educations.${index}.yearCompleted`}
                          placeholder="YYYY"
                          {...register(`educations.${index}.yearCompleted`)}
                        />
                      </label>
                    </div>
                    <div className="form-field checkbox-item">
                      <label 
                        htmlFor={`educations.${index}.inProgress`} 
                        className="checkbox-label"
                      >
                        <input
                          type="checkbox"
                          id={`educations.${index}.inProgress`}
                          {...register(`educations.${index}.inProgress`)}
                        />
                        <span>Currently In Progress</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="secondary outline"
                onClick={() => appendEducation({ 
                  level: '', 
                  institution: '', 
                  degree: '', 
                  field: '', 
                  yearCompleted: '', 
                  inProgress: false 
                })}
              >
                + Add Another Education
              </button>
            </div>

            {/* Licenses & Certifications Section */}
            <div className="form-section">
              <h2 className="form-section-heading">Licenses & Certifications</h2>
              <p>Please provide details about any professional licenses or certifications you hold.</p>
              
              {certificationFields.map((field, index) => (
                <div key={field.id} className="certification-entry">
                  <div className="entry-header">
                    <h3 className="entry-title">License/Certification #{index + 1}</h3>
                    {certificationFields.length > 1 && (
                      <button
                        type="button"
                        className="secondary outline"
                        onClick={() => removeCertification(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="form-field certification-field">
                    <label htmlFor={`certifications.${index}.name`}>
                      License / Certification Name
                      <input
                        type="text"
                        id={`certifications.${index}.name`}
                        placeholder="Licensed Mental Health Counselor, EMDR Certification, etc."
                        {...register(`certifications.${index}.name`)}
                      />
                    </label>
                  </div>

                  <div className="form-field certification-field">
                    <label htmlFor={`certifications.${index}.issuer`}>
                      Issuing Organization
                      <input
                        type="text"
                        id={`certifications.${index}.issuer`}
                        placeholder="State of Washington, EMDR International Association, etc."
                        {...register(`certifications.${index}.issuer`)}
                      />
                    </label>
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor={`certifications.${index}.dateObtained`}>
                        Date Obtained
                        <input
                          type="text"
                          id={`certifications.${index}.dateObtained`}
                          placeholder="MM/YYYY"
                          {...register(`certifications.${index}.dateObtained`)}
                        />
                      </label>
                    </div>
                    <div className="form-field">
                      <label htmlFor={`certifications.${index}.expirationDate`}>
                        Expiration Date (if applicable)
                        <input
                          type="text"
                          id={`certifications.${index}.expirationDate`}
                          placeholder="MM/YYYY"
                          {...register(`certifications.${index}.expirationDate`)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="form-field checkbox-item">
                    <label 
                      htmlFor={`certifications.${index}.inProgress`} 
                      className="checkbox-label"
                    >
                      <input
                        type="checkbox"
                        id={`certifications.${index}.inProgress`}
                        {...register(`certifications.${index}.inProgress`)}
                      />
                      <span>Currently In Progress</span>
                    </label>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="secondary outline"
                onClick={() => appendCertification({ 
                  name: '', 
                  issuer: '', 
                  dateObtained: '', 
                  expirationDate: '', 
                  inProgress: false 
                })}
              >
                + Add Another License/Certification
              </button>
            </div>
            
            {/* Navigation Buttons */}
            <div className="form-footer">
              <button 
                type="button" 
                className="secondary outline" 
                onClick={() => navigate('/form/step4')}
              >
                Back
              </button>
              <button type="submit" className="primary">Next</button>
            </div>
          </form>
        </div>
      </main>

      <style jsx>{`
        .education-entry, .certification-entry {
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
          margin-bottom: 0.75rem;
        }
        
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
        
        .checkbox-item {
          display: flex;
          align-items: center;
          margin-top: 1.75rem;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          user-select: none;
          margin-bottom: 0;
          font-weight: 500;
        }
        
        .institution-field input, 
        .certification-field input {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        
        /* Ensure long placeholder text doesn't cause input to expand */
        input, select {
          width: 100%;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export default FormStep5;