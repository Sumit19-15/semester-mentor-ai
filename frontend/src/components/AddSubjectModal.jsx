import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useSubjectStore } from '../store/useSubjectStore';

export default function AddSubjectModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createSubject } = useSubjectStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createSubject({ name, courseCode });
      setName('');
      setCourseCode('');
      onClose();
    } catch (error) {
      console.error("Failed to create subject", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col border border-outline-variant">
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/50">
          <h2 className="font-headline-sm text-[18px] font-bold text-on-surface">Add New Subject</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-[14px] font-semibold text-on-surface">Subject Name *</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Object Oriented System Design"
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-[14px] font-semibold text-on-surface">Course Code (Optional)</label>
            <input 
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="e.g. CS201"
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-label-md text-[14px] font-semibold text-secondary hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || !name.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-lg font-label-md text-[14px] font-semibold hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Adding...' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
