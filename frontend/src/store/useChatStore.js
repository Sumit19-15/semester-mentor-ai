import { create } from 'zustand';
import axios from 'axios';
import api from '../services/api';

export const useChatStore = create((set, get) => ({
  sessions: [], // Array of ChatSession objects
  activeSession: null,
  activeMessages: [], // Messages for the active session
  isLoading: false,
  isSending: false,
  error: null,
  abortController: null,

  // Fetch chat sessions (can be filtered by type, subject, topic)
  fetchSessions: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { type, subjectId, topicId } = filters;
      let query = '?';
      if (type) query += `type=${type}&`;
      if (subjectId) query += `subjectId=${subjectId}&`;
      if (topicId) query += `topicId=${topicId}&`;

      const response = await api.get(`/chats${query}`);
      set({ sessions: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch sessions', isLoading: false });
    }
  },

  // Create a new chat session
  createSession: async (sessionData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/chats', sessionData);
      set((state) => ({
        sessions: [response.data, ...state.sessions],
        activeSession: response.data,
        activeMessages: [], // brand new session has no messages
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create session', isLoading: false });
      throw error;
    }
  },

  // Set the active session and fetch its messages
  setActiveSession: async (session) => {
    set({ activeSession: session, isLoading: true, error: null });
    if (!session) {
      set({ activeMessages: [], isLoading: false });
      return;
    }

    try {
      const response = await api.get(`/chats/${session._id}/messages`);
      set({ activeMessages: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch messages', isLoading: false });
    }
  },

  // Delete a chat session
  deleteSession: async (sessionId) => {
    try {
      await api.delete(`/chats/${sessionId}`);
      set((state) => ({
        sessions: state.sessions.filter(s => s._id !== sessionId),
        activeSession: state.activeSession?._id === sessionId ? null : state.activeSession,
        activeMessages: state.activeSession?._id === sessionId ? [] : state.activeMessages
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete session' });
      throw error;
    }
  },

  // Rename a chat session
  renameSession: async (sessionId, newTitle) => {
    try {
      const response = await api.put(`/chats/${sessionId}`, { title: newTitle });
      set((state) => ({
        sessions: state.sessions.map(s => s._id === sessionId ? response.data : s),
        activeSession: state.activeSession?._id === sessionId ? response.data : state.activeSession
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to rename session' });
      throw error;
    }
  },

  // Send a message in the active session
  sendMessage: async (content) => {
    const { activeSession, activeMessages } = get();
    if (!activeSession) return;

    // Optimistically add user message
    const tempId = Date.now().toString();
    const optimisticUserMsg = { _id: tempId, role: 'user', content, createdAt: new Date().toISOString() };
    const controller = new AbortController();

    set({
      activeMessages: [...activeMessages, optimisticUserMsg],
      isSending: true,
      error: null,
      abortController: controller
    });

    try {
      const response = await api.post(`/chats/${activeSession._id}/message`, { content }, {
        signal: controller.signal
      });

      // response.data contains { userMessage, aiMessage }
      // Replace optimistic message and append AI message
      set((state) => ({
        activeMessages: state.activeMessages.map(msg => msg._id === tempId ? response.data.userMessage : msg).concat({ ...response.data.aiMessage, isNew: true }),
        isSending: false,
        abortController: null
      }));
    } catch (error) {
      if (axios.isCancel(error) || error.name === 'CanceledError' || error.code === 'ERR_CANCELED' || error.message === 'canceled') {
        // Request was cancelled by the user. 
        // We do NOT remove the optimistic message here because it was likely already saved to the DB before generation started.
        // We will just clear the sending state.
        set({
          isSending: false,
          abortController: null
        });
        
        // Optionally, refetch messages to get the real DB ID for the user message
        const { activeSession } = get();
        if (activeSession) {
          get().setActiveSession(activeSession);
        }
        return;
      }

      // Remove optimistic message on failure
      set((state) => ({
        activeMessages: state.activeMessages.filter(msg => msg._id !== tempId),
        error: error.response?.data?.message || 'Failed to send message',
        isSending: false,
        abortController: null
      }));
    }
  },

  // Cancel ongoing AI generation
  cancelGeneration: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
    }
  }
}));
