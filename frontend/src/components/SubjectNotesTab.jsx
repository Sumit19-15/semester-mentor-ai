import { useState } from 'react';
import { Search, Plus, FileText, Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubjectStore } from '../store/useSubjectStore';
import UploadFileModal from './UploadFileModal';

export default function SubjectNotesTab() {
  const { notes, activeSubject } = useSubjectStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
              className="p-4 hover:bg-surface-container-low transition-colors duration-150 group flex items-center justify-between"
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
                  <a href={note.fileUrl || '#'} target="_blank" rel="noreferrer" className="p-2 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors block" title={note.uploadType === 'upload' ? "Download" : "Open Link"}>
                    {note.uploadType === 'upload' ? <Download className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                  </a>
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
