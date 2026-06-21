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
    set({ 
      activeSubject: subject, 
      activeTopic: null, 
      activeStudyPlan: null,
      topics: subject?.topics || [],
      // We can also optimistically set others if they were cached on the subject object,
      // but topics is the most important one that causes layout shifts.
    });
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
      // Update the subject's topics in the array, activeSubject, and topics state
      set((state) => {
        const updatedSubjects = state.subjects.map(sub => 
          sub._id === subjectId ? { ...sub, topics: response.data } : sub
        );
        const updatedActiveSubject = state.activeSubject?._id === subjectId
          ? { ...state.activeSubject, topics: response.data }
          : state.activeSubject;
          
        return {
          topics: response.data,
          subjects: updatedSubjects,
          activeSubject: updatedActiveSubject,
          isLoading: false
        };
      });
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
  },

  // Create a new subject
  createSubject: async (subjectData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/subjects', subjectData);
      set((state) => ({ 
        subjects: [...state.subjects, response.data],
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create subject', isLoading: false });
      throw error;
    }
  },

  // Delete a subject
  deleteSubject: async (subjectId) => {
    try {
      await api.delete(`/subjects/${subjectId}`);
      set((state) => {
        const newSubjects = state.subjects.filter(sub => sub._id !== subjectId);
        const newActiveSubject = state.activeSubject?._id === subjectId 
          ? (newSubjects.length > 0 ? newSubjects[0] : null) 
          : state.activeSubject;
          
        return {
          subjects: newSubjects,
          activeSubject: newActiveSubject,
          allTopics: state.allTopics ? state.allTopics.filter(t => {
            const topicSubjectId = typeof t.subject === 'object' ? t.subject?._id : t.subject;
            return topicSubjectId !== subjectId;
          }) : []
        };
      });
    } catch (error) {
      throw error;
    }
  },

  studyPlans: [],
  activeStudyPlan: null,

  fetchStudyPlansForSubject: async (subjectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/study-plans/${subjectId}`);
      set({ studyPlans: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch study plans', isLoading: false });
    }
  },

  setActiveStudyPlan: (plan) => {
    set({ activeStudyPlan: plan });
  },

  toggleStudyPlanDay: async (planId, dayIndex) => {
    try {
      const response = await api.put(`/study-plans/${planId}/day/${dayIndex}/toggle`);
      set((state) => ({
        activeStudyPlan: response.data,
        studyPlans: state.studyPlans.map(p => p._id === planId ? response.data : p)
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTopic: async (topicData) => {
    try {
      const response = await api.post('/topics', topicData);
      set((state) => ({
        topics: [...state.topics, response.data],
        subjects: state.subjects.map(sub => 
          sub._id === topicData.subject ? { ...sub, topics: [...(sub.topics || []), response.data] } : sub
        )
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTopic: async (topicId, subjectId) => {
    try {
      await api.delete(`/topics/${topicId}`);
      set((state) => {
        const updatedSubjects = state.subjects.map(sub => 
          sub._id === subjectId ? { ...sub, topics: (sub.topics || []).filter(t => t._id !== topicId) } : sub
        );
        const updatedActiveSubject = state.activeSubject?._id === subjectId
          ? { ...state.activeSubject, topics: state.activeSubject.topics?.filter(t => t._id !== topicId) || [] }
          : state.activeSubject;

        return {
          topics: (state.topics || []).filter(t => t._id !== topicId),
          allTopics: state.allTopics ? state.allTopics.filter(t => t._id !== topicId) : [],
          subjects: updatedSubjects,
          activeSubject: updatedActiveSubject
        };
      });
    } catch (error) {
      throw error;
    }
  },

  deleteAllTopicsForSubject: async (subjectId) => {
    try {
      await api.delete(`/topics/subject/${subjectId}`);
      set((state) => ({
        topics: [],
        subjects: state.subjects.map(sub => 
          sub._id === subjectId ? { ...sub, topics: [] } : sub
        )
      }));
    } catch (error) {
      throw error;
    }
  },

  completeTopic: async (topicId, subjectId) => {
    try {
      const response = await api.put(`/topics/${topicId}/complete`);
      set((state) => ({
        topics: state.topics.map(t => t._id === topicId ? response.data : t),
        subjects: state.subjects.map(sub => 
          sub._id === subjectId ? { ...sub, topics: (sub.topics || []).map(t => t._id === topicId ? response.data : t) } : sub
        ),
        allTopics: state.allTopics ? state.allTopics.map(t => t._id === topicId ? response.data : t) : []
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteResource: async (resourceId) => {
    try {
      await api.delete(`/resources/${resourceId}`);
      set((state) => ({
        resources: state.resources.filter(r => r._id !== resourceId)
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteNote: async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`);
      set((state) => ({
        notes: state.notes.filter(n => n._id !== noteId)
      }));
    } catch (error) {
      throw error;
    }
  },

  deletePyq: async (pyqId) => {
    try {
      await api.delete(`/pyqs/${pyqId}`);
      set((state) => ({
        pyqs: state.pyqs.filter(p => p._id !== pyqId)
      }));
    } catch (error) {
      throw error;
    }
  }
}));
