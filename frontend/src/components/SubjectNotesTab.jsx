import { useState } from 'react';
import { Search, Plus, FileText, Download, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubjectStore } from '../store/useSubjectStore';
import UploadFileModal from './UploadFileModal';
import toast from 'react-hot-toast';

export default function SubjectNotesTab() {
  const { notes, activeSubject, deleteNote } = useSubjectStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (e, note) => {
    if (e) e.stopPropagation();
    if (note.uploadType === 'link') {
      window.open(note.fileUrl || note.link, '_blank');
      return;
    }

    if (e) e.preventDefault();
    setDownloadingId(note._id);
    try {
      let url = note.fileUrl || note.link;
      
      // If it's a Cloudinary URL, inject fl_attachment to force download via browser
      if (url.includes('cloudinary.com')) {
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex !== -1 && !url.includes('fl_attachment')) {
          url = url.slice(0, uploadIndex + 8) + 'fl_attachment/' + url.slice(uploadIndex + 8);
        }
        
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = note.title || 'download';
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        // Slight delay to show loader
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network error');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        const ext = url.split('.').pop() || 'pdf';
        link.download = `${note.title || 'Note'}.${ext}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error('Download failed', error);
      window.open(note.fileUrl || note.link, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNote(id);
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div>
      <div className="flex justify-end items-center mb-stack_md">
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-md text-[14px] font-semibold flex items-center gap-2 hover:bg-primary hover:text-on-primary transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Note
        </button>
      </div>

      {/* Notes List */}
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <div className="divide-y divide-outline-variant">
          <AnimatePresence>
          {notes?.length > 0 ? notes.map((note, idx) => (
            <motion.div 
              key={note._id || idx} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => window.open(note.fileUrl || note.link, '_blank')}
              className="p-4 hover:bg-surface-container-low transition-colors duration-150 group flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1 text-primary shrink-0 w-10 h-10 rounded bg-primary-container/20 flex items-center justify-center border border-primary/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline-sm text-[16px] font-bold text-on-surface transition-colors">{note.title}</h3>
                  <p className="font-body-md text-[14px] text-secondary mt-1">{note.description || 'No description available.'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-2 mr-2 hidden sm:flex">
                  <span className="font-label-sm text-[11px] text-outline">{new Date(note.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-1">
                    {note.topic && <span className="px-2 py-0.5 rounded-sm bg-surface-container-high text-secondary font-label-sm text-[11px] font-semibold">{note.topic?.title || 'Topic'}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleDownload(e, note)} 
                    className="p-2 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors block" 
                    title={note.uploadType === 'upload' ? "Download" : "Open Link"}
                    disabled={downloadingId === note._id}
                  >
                    {downloadingId === note._id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    ) : note.uploadType === 'upload' ? (
                      <Download className="w-5 h-5" />
                    ) : (
                      <ExternalLink className="w-5 h-5" />
                    )}
                  </button>
                  <button onClick={(e) => handleDelete(e, note._id)} className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors block" title="Delete Note">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="p-8 text-center text-secondary">
              No notes found. Create your first note above!
            </div>
          )}
          </AnimatePresence>
        </div>
      </div>

      <UploadFileModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        subjectId={activeSubject?._id}
        uploadType="notes"
      />
    </div>
  );
}
