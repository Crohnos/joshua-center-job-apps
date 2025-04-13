import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Initial form state schema
const initialFormState = {
  // Step 1: Email (from Google Auth)
  email: '',
  // Step 2: Contact Info
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  // Step 3: Initial Qualifications
  usCitizen: false,
  felonyConviction: false,
  felonyExplanation: '',
  dualRelationships: 'no',
  dualRelationshipsExplanation: '',
  // Step 4: Interests
  interests: '',
  whyJoshuaCenter: '',
  ethicalFrameworkThoughts: '',
  populations: [],
  // Step 5: Education
  educations: [],
  certifications: [],
  // Step 6: Employment History
  previousEmployer: '',
  previousEmployerAddress: '',
  previousEmployerCity: '',
  previousEmployerState: '',
  previousEmployerZip: '',
  previousEmployerPhone: '',
  previousEmployerTitle: '',
  previousEmployerLength: '',
  previousEmployerReasonLeaving: '',
  otherEmployment: '',
  // Step 7: References
  references: [],
  // Step 8: Demographics
  languages: '',
  gender: '',
  raceEthnicity: '',
  // Locations
  locations: [],
  // Form meta data
  formProgress: {
    lastCompletedStep: 0,
    startTime: null,
    lastUpdate: null
  }
};

// Custom storage with validation
const customStorage = {
  getItem: (name) => {
    try {
      const value = localStorage.getItem(name);
      if (!value) return null;
      
      const parsed = JSON.parse(value);
      
      // Check for old schema or corrupted data
      if (!parsed?.state?.formData) {
        console.warn('Invalid form data found in storage, resetting');
        return null;
      }
      
      // Check for stale data (older than 7 days)
      const lastUpdate = parsed?.state?.formData?.formProgress?.lastUpdate;
      if (lastUpdate) {
        const staleTime = 7 * 24 * 60 * 60 * 1000; // 7 days
        if (Date.now() - lastUpdate > staleTime) {
          console.warn('Stale form data found in storage, resetting');
          return null;
        }
      }
      
      return value;
    } catch (error) {
      console.error('Error parsing stored form data:', error);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.error('Error storing form data:', error);
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing form data:', error);
    }
  }
};

const useFormStore = create(
  persist(
    (set) => ({
      formData: initialFormState,
      
      // Update form data with timestamp
      setFormData: (data) => set((state) => ({ 
        formData: { 
          ...state.formData, 
          ...data,
          formProgress: {
            ...state.formData.formProgress,
            lastUpdate: Date.now()
          }
        } 
      })),
      
      // Mark step as completed
      completeStep: (step) => set((state) => {
        const currentProgress = state.formData.formProgress;
        const lastCompletedStep = Math.max(currentProgress.lastCompletedStep || 0, step);
        
        return { 
          formData: { 
            ...state.formData,
            formProgress: {
              ...currentProgress,
              lastCompletedStep,
              lastUpdate: Date.now(),
              startTime: currentProgress.startTime || Date.now()
            }
          }
        };
      }),
      
      // Reference management
      updateReference: (index, data) => set((state) => {
        const references = [...state.formData.references];
        references[index] = { ...references[index], ...data };
        return { 
          formData: { 
            ...state.formData, 
            references,
            formProgress: {
              ...state.formData.formProgress,
              lastUpdate: Date.now()
            }
          } 
        };
      }),
      
      addReference: () => set((state) => ({ 
        formData: { 
          ...state.formData, 
          references: [
            ...state.formData.references, 
            { name: '', relationship: '', phone: '', email: '', type: 'professional' }
          ],
          formProgress: {
            ...state.formData.formProgress,
            lastUpdate: Date.now()
          }
        } 
      })),
      
      removeReference: (index) => set((state) => {
        const references = [...state.formData.references];
        references.splice(index, 1);
        return { 
          formData: { 
            ...state.formData, 
            references,
            formProgress: {
              ...state.formData.formProgress,
              lastUpdate: Date.now()
            }
          } 
        };
      }),
      
      // Education management 
      addEducation: () => set((state) => ({ 
        formData: { 
          ...state.formData, 
          educations: [
            ...state.formData.educations, 
            { school: '', degree: '', year: '' }
          ],
          formProgress: {
            ...state.formData.formProgress,
            lastUpdate: Date.now()
          }
        } 
      })),
      
      updateEducation: (index, data) => set((state) => {
        const educations = [...state.formData.educations];
        educations[index] = { ...educations[index], ...data };
        return { 
          formData: { 
            ...state.formData, 
            educations,
            formProgress: {
              ...state.formData.formProgress,
              lastUpdate: Date.now()
            }
          } 
        };
      }),
      
      removeEducation: (index) => set((state) => {
        const educations = [...state.formData.educations];
        educations.splice(index, 1);
        return { 
          formData: { 
            ...state.formData, 
            educations,
            formProgress: {
              ...state.formData.formProgress,
              lastUpdate: Date.now()
            }
          } 
        };
      }),
      
      // Complete form reset
      resetForm: () => set({ 
        formData: initialFormState
      }),
    }),
    {
      name: 'job-application-form',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        formData: state.formData
      }),
    }
  )
);

export default useFormStore;