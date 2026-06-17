import { useState } from 'react';
import { Search, FileText, ExternalLink, Download, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubjectStore } from '../store/useSubjectStore';
import UploadFileModal from './UploadFileModal';
import toast from 'react-hot-toast';

export default function SubjectPyqsTab() {
  const { pyqs, activeSubject, deletePyq } = useSubjectStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deletePyq(id);
      toast.success('PYQ deleted successfully');
    } catch (error) {
      toast.error('Failed to delete PYQ');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tab Actions Header */}
      <div className="flex justify-end mb-2">
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-primary-container text-on-primary-container font-label-md text-[14px] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary hover:text-on-primary transition-colors shadow-sm font-semibold"
        >
          <Upload className="w-4 h-4" />
          Upload Paper
        </button>
      </div>

      {/* Content Area: PYQs List */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {/* List */}
        <div className="divide-y divide-outline-variant">
          <AnimatePresence>
          {pyqs?.length > 0 ? pyqs.map((pyq, idx) => (
            <motion.div 
              key={pyq._id || idx} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-surface-container transition-colors group gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-10 h-10 shrink-0 rounded bg-primary-container/20 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary-container/40 transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-headline-sm text-[16px] font-bold text-on-surface truncate">{pyq.title || `PYQ ${pyq.year}`}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="font-label-sm text-[10px] uppercase font-bold text-secondary bg-surface-variant px-2 py-0.5 rounded tracking-wide">{pyq.year}</span>
                    <span className="font-body-md text-[12px] text-secondary truncate">Added on {new Date(pyq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-14 sm:ml-0 focus-within:opacity-100">
                <a href={pyq.fileUrl || '#'} target="_blank" rel="noreferrer" className="p-2 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors block" title={pyq.uploadType === 'upload' ? 'Download' : 'Open Link'}>
                  {pyq.uploadType === 'upload' ? <Download className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                </a>
                <button onClick={(e) => handleDelete(e, pyq._id)} className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors block" title="Delete PYQ">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="p-8 text-center text-secondary">
              No PYQs found for this subject. Upload one above!
            </div>
          )}
          </AnimatePresence>
        </div>
      </div>

      <UploadFileModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        subjectId={activeSubject?._id}
        uploadType="pyqs"
      />
    </div>
  );
}
