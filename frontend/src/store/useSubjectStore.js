import { create } from 'zustand';
import api from '../services/api';

export const useSubjectStore = create((set, get) => ({
  subjects: [],
  activeSubject: null,
  activeTopic: null,
  allTopics: [],
  topics: [],
  notes: [],
  resources: [],
  pyqs: [],
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

  // Fetch all topics (for dashboard)
  fetchAllTopics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/topics');
      set({ allTopics: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch topics', isLoading: false });
    }
  },

  // Fetch topics for a specific subject
  fetchTopicsForSubject: async (subjectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/topics?subject=${subjectId}`);
      // Update the subject's topics in the array and the topics state
      set((state) => ({
        topics: response.data,
        subjects: state.subjects.map(sub => 
          sub._id === subjectId ? { ...sub, topics: response.data } : sub
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch topics', isLoading: false });
    }
  },

  // Fetch notes for a specific subject
  fetchNotesForSubject: async (subjectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/notes?subject=${subjectId}`);
      set({ notes: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch notes', isLoading: false });
    }
  },

  // Fetch resources for a specific subject
  fetchResourcesForSubject: async (subjectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/resources?subject=${subjectId}`);
      set({ resources: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch resources', isLoading: false });
    }
  },

  // Fetch PYQs for a specific subject
  fetchPyqsForSubject: async (subjectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/pyqs?subject=${subjectId}`);
      set({ pyqs: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch pyqs', isLoading: false });
    }
  }
}));
