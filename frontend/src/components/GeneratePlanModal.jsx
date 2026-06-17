import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useSubjectStore } from '../store/useSubjectStore';

export default function GeneratePlanModal({ isOpen, onClose, subjectId }) {
  const [name, setName] = useState('');
  const [dailyStudyHours, setDailyStudyHours] = useState(4);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchStudyPlansForSubject, setActiveStudyPlan, setActiveTab } = useSubjectStore(); // Wait, activeTab is local in SubjectWorkspacePage. We'll handle it via callback.

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post('/study-plans/generate', {
        subjectIds: [subjectId],
        name: name || 'Study Plan',
        startDate,
        endDate,
        dailyStudyHours: Number(dailyStudyHours)
      });
      
      await fetchStudyPlansForSubject(subjectId);
      // Try to find the new plan to set as active
      const newPlan = response.data;
      // We will handle navigation/setting active tab in the parent component via onClose
      onClose(newPlan);
    } catch (error) {
      console.error("Failed to generate plan", error);
      toast.error(error.response?.data?.message || "Failed to generate study plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col border border-outline-variant">
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/50">
          <h2 className="font-headline-sm text-[18px] font-bold text-on-surface">Generate Study Plan</h2>
          <button 
            onClick={() => onClose(null)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-[14px] font-semibold text-on-surface">Plan Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Finals Prep Plan"
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-[14px] font-semibold text-on-surface">Daily Study Hours</label>
            <input 
              type="number"
              min="1"
              max="24"
              value={dailyStudyHours}
              onChange={(e) => setDailyStudyHours(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-[14px] font-semibold text-on-surface">Start Date</label>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-[14px] font-semibold text-on-surface">End Date</label>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button 
              type="button" 
              onClick={() => onClose(null)}
              className="px-4 py-2 rounded-lg font-label-md text-[14px] font-semibold text-secondary hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || !endDate}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-lg font-label-md text-[14px] font-semibold hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Generating...' : 'Generate Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
