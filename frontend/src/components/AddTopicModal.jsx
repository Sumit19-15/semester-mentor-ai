import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useSubjectStore } from '../store/useSubjectStore';

export default function AddTopicModal({ isOpen, onClose, subjectId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTopic } = useSubjectStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    setIsSubmitting(true);
    try {
      await createTopic({ subject: subjectId, title, description });
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error("Failed to add topic", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col border border-outline-variant">
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/50">
          <h2 className="font-headline-sm text-[18px] font-bold text-on-surface">Add New Topic</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-[14px] font-semibold text-on-surface">Topic Title *</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction to OOPs"
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-[14px] font-semibold text-on-surface">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the topic..."
              rows={3}
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
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
              disabled={isSubmitting || !title.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-lg font-label-md text-[14px] font-semibold hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Adding...' : 'Add Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
