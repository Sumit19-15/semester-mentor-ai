import { create } from 'zustand';
import api from '../services/api';

export const useSubjectStore = create((set, get) => ({
  subjects: [],
  activeSubject: null,
  activeTopic: null,
  isLoading: false,
  error: null,

  // Fetch all subjects for the user
  fetchSubjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/subjects');
      set({ subjects: response.data, isLoading: false });
      
      // If we have subjects but no active subject, optionally set the first one
      const { activeSubject } = get();
      if (!activeSubject && response.data.length > 0) {
        set({ activeSubject: response.data[0] });
      }
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch subjects', isLoading: false });
    }
  },

  // Set active subject (which will be used to filter views in the workspace)
  setActiveSubject: (subject) => {
    set({ activeSubject: subject, activeTopic: null });
  },

  // Set active topic (useful for AiModuleChatPage tracking)
  setActiveTopic: (topic) => {
    set({ activeTopic: topic });
  },

  // We could add fetchTopics if topics are fetched separately from subjects
  // For now, assume topics are populated on the subject or fetched via another endpoint
  fetchTopicsForSubject: async (subjectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/subjects/${subjectId}/topics`);
      // Update the subject's topics in the array
      set((state) => ({
        subjects: state.subjects.map(sub => 
          sub._id === subjectId ? { ...sub, topics: response.data } : sub
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch topics', isLoading: false });
    }
  }
}));
