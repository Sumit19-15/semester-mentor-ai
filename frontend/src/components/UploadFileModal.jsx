import { useState } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useSubjectStore } from '../store/useSubjectStore';

export default function UploadFileModal({ isOpen, onClose, subjectId, uploadType }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputType, setInputType] = useState('file'); // 'file' or 'link'
  
  const { fetchNotesForSubject, fetchPyqsForSubject, fetchResourcesForSubject } = useSubjectStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let payload = null;
      let isMultipart = false;

      if (inputType === 'link') {
        payload = {
          subject: subjectId,
          title,
          description,
          uploadType: 'link'
        };
        if (uploadType === 'resources') {
          payload.link = link;
          payload.type = link.includes('.pdf') ? 'pdf' : (link.includes('youtube.com') || link.includes('youtu.be') ? 'youtube video' : 'article');
        } else {
          payload.fileUrl = link;
        }
        if (uploadType === 'pyqs') {
          payload.year = year;
        }
      } else {
        payload = new FormData();
        payload.append('subject', subjectId);
        payload.append('uploadType', 'upload');
        if (file) payload.append('file', file);
        if (title) payload.append('title', title);
        if (description) payload.append('description', description);
        
        if (uploadType === 'resources') {
          payload.append('type', file?.type?.includes('pdf') ? 'pdf' : 'article');
        }
        if (uploadType === 'pyqs') {
          payload.append('year', year);
        }
        isMultipart = true;
      }

      const endpoint = `/${uploadType}`; // '/resources', '/notes', or '/pyqs'
      
      await api.post(endpoint, payload, isMultipart ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {});

      if (uploadType === 'resources' && fetchResourcesForSubject) await fetchResourcesForSubject(subjectId);
      if (uploadType === 'notes' && fetchNotesForSubject) await fetchNotesForSubject(subjectId);
      if (uploadType === 'pyqs' && fetchPyqsForSubject) await fetchPyqsForSubject(subjectId);
      
      toast.success(`${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} uploaded successfully!`);

      // Reset form
      setTitle('');
      setDescription('');
      setYear('');
      setLink('');
      setFile(null);
      onClose();
    } catch (error) {
      console.error(`Failed to upload ${uploadType}`, error);
      toast.error(error.response?.data?.message || `Failed to upload ${uploadType}`);
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
          
          <div className="flex bg-surface-container-low rounded-lg p-1 mb-2">
            <button
              type="button"
              className={`flex-1 py-1.5 text-[13px] font-semibold rounded-md transition-colors ${inputType === 'file' ? 'bg-surface shadow-sm text-primary' : 'text-secondary hover:text-on-surface'}`}
              onClick={() => setInputType('file')}
            >
              Upload File
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-[13px] font-semibold rounded-md transition-colors ${inputType === 'link' ? 'bg-surface shadow-sm text-primary' : 'text-secondary hover:text-on-surface'}`}
              onClick={() => setInputType('link')}
            >
              Provide Link
            </button>
          </div>

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

          {inputType === 'link' && (
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-[14px] font-semibold text-on-surface">URL Link *</label>
              <input 
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/..."
                className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
          )}

          {inputType === 'file' && (
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-[14px] font-semibold text-on-surface">File *</label>
              <input 
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-primary hover:file:bg-primary/20"
                required
              />
              <p className="text-[11px] text-secondary mt-1">Supported formats: PDF, Word, Images. Max 10MB.</p>
            </div>
          )}

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
              disabled={isSubmitting || !title || (uploadType === 'pyqs' && !year) || (inputType === 'link' && !link) || (inputType === 'file' && !file)}
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
