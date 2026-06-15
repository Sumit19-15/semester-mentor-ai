import { create } from 'zustand';
import api from '../services/api';

export const useStudyPlanStore = create((set) => ({
  studyPlan: null,
  isLoading: false,
  error: null,

  // Generate a plan based on active subjects
  generatePlan: async (planData) => {
    set({ isLoading: true, error: null, studyPlan: null });
    try {
      // Default to next 14 days if not provided
      const startDate = planData.startDate || new Date().toISOString();
      const endDate = planData.endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      
      const payload = {
        subjectIds: planData.subjectIds || [],
        startDate,
        endDate,
        goal: planData.goal || 'Complete the syllabus with regular revision.'
      };

      const response = await api.post('/study-plans/generate', payload);
      set({ studyPlan: response.data.plan, isLoading: false });
      return response.data.plan;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to generate study plan', isLoading: false });
      throw error;
    }
  },
  
  clearPlan: () => set({ studyPlan: null, error: null })
}));
