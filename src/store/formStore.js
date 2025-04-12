import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFormStore = create(
  persist(
    (set) => ({
      formData: {
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
      },
      setFormData: (data) => set((state) => ({ 
        formData: { ...state.formData, ...data } 
      })),
      updateReference: (index, data) => set((state) => {
        const references = [...state.formData.references];
        references[index] = { ...references[index], ...data };
        return { 
          formData: { ...state.formData, references } 
        };
      }),
      addReference: () => set((state) => ({ 
        formData: { 
          ...state.formData, 
          references: [
            ...state.formData.references, 
            { name: '', relationship: '', phone: '', email: '', type: 'professional' }
          ] 
        } 
      })),
      removeReference: (index) => set((state) => {
        const references = [...state.formData.references];
        references.splice(index, 1);
        return { 
          formData: { ...state.formData, references } 
        };
      }),
      resetForm: () => set({ 
        formData: {} 
      }),
    }),
    {
      name: 'job-application-form',
      getStorage: () => localStorage,
    }
  )
);

export default useFormStore;