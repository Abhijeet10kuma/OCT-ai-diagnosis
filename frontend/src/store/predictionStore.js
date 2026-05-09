import { create } from 'zustand';
import api from '../services/api';

const usePredictionStore = create((set) => ({
  currentResult: null,
  history: [],
  isLoading: false,
  error: null,

  predict: async (file) => {
    set({ isLoading: true, error: null, currentResult: null });
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      set({ currentResult: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Prediction failed', 
        isLoading: false 
      });
      return null;
    }
  },

  fetchHistory: async (skip = 0, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/history?skip=${skip}&limit=${limit}`);
      set({ history: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch history', 
        isLoading: false 
      });
    }
  },

  generateReport: async (predictionId, doctorNotes) => {
    try {
      const response = await api.post('/report/generate', 
        { prediction_id: predictionId, doctor_notes: doctorNotes },
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `OCT_Report_${predictionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      return true;
    } catch (error) {
      console.error("Failed to generate report", error);
      return false;
    }
  },

  clearResult: () => set({ currentResult: null })
}));

export default usePredictionStore;
