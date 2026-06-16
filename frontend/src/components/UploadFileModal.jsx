import { useState } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import api from '../services/api';
import { useSubjectStore } from '../store/useSubjectStore';

export default function UploadFileModal({ isOpen, onClose, subjectId, uploadType }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { fetchNotesForSubject, fetchPyqsForSubject, fetchResourcesForSubject } = useSubjectStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (uploadType === 'resources') {
        // Resource doesn't take a file upload in current backend schema, just a link
        await api.post('/resources', {
          subject: subjectId,
          title,
          link,
          type: link.includes('.pdf') ? 'pdf' : 'link',
          description
        });
        if (fetchResourcesForSubject) await fetchResourcesForSubject(subjectId);
      } else {
        const formData = new FormData();
        formData.append('subject', subjectId);
        if (file) formData.append('file', file);

        if (uploadType === 'pyqs') {
          formData.append('year', year);
          await api.post('/pyqs', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (fetchPyqsForSubject) await fetchPyqsForSubject(subjectId);
        } else if (uploadType === 'notes') {
          formData.append('title', title);
          formData.append('description', description);
          await api.post('/notes', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (fetchNotesForSubject) await fetchNotesForSubject(subjectId);
        }
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setYear('');
      setLink('');
      setFile(null);
      onClose();
    } catch (error) {
      console.error(`Failed to upload ${uploadType}`, error);
      alert(error.response?.data?.message || `Failed to upload ${uploadType}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    switch (uploadType) {
      case 'notes': return 'Upload Note';
      case 'pyqs': return 'Upload PYQ';
      case 'resources': return 'Add Resource';
      default: return 'Upload';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col border border-outline-variant">
        <div className="flex justify-between items-center p-4 border-b border-outline-variant/50">
          <h2 className="font-headline-sm text-[18px] font-bold text-on-surface flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            {getModalTitle()}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          
          {(uploadType === 'notes' || uploadType === 'resources') && (
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-[14px] font-semibold text-on-surface">Title *</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 1 Summary"
                className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
          )}

          {uploadType === 'pyqs' && (
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-[14px] font-semibold text-on-surface">Year *</label>
              <input 
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2024"
                className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
          )}

          {uploadType === 'resources' && (
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-[14px] font-semibold text-on-surface">URL Link *</label>
              <input 
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/resource"
                className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
          )}

          {(uploadType === 'notes' || uploadType === 'resources') && (
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-[14px] font-semibold text-on-surface">Description (Optional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                rows={2}
                className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              />
            </div>
          )}

          {(uploadType === 'notes' || uploadType === 'pyqs') && (
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-[14px] font-semibold text-on-surface">File *</label>
              <input 
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-primary hover:file:bg-primary/20"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant/50">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-label-md text-[14px] font-semibold text-secondary hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || (uploadType === 'pyqs' && !year) || (uploadType === 'resources' && (!title || !link)) || (uploadType === 'notes' && !title) || ((uploadType === 'notes' || uploadType === 'pyqs') && !file)}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-lg font-label-md text-[14px] font-semibold hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
