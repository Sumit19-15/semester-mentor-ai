import { useState } from 'react';
import { Search, Plus, FileText } from 'lucide-react';
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
          
          {notes?.length > 0 ? notes.map((note, idx) => (
            <div key={note._id || idx} className="p-4 hover:bg-surface-container-low transition-colors duration-150 cursor-pointer group flex items-center justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1 text-primary">
                  <FileText className="w-6 h-6 fill-primary/20" />
                </div>
                <div>
                  <a href={note.fileUrl || '#'} target="_blank" rel="noreferrer" className="block">
                    <h3 className="font-headline-sm text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors">{note.title}</h3>
                  </a>
                  <p className="font-body-md text-[14px] text-secondary truncate max-w-xl mt-1">{note.description || 'No description available.'}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-label-sm text-[11px] text-outline">{new Date(note.createdAt).toLocaleDateString()}</span>
                <div className="flex gap-1">
                  {note.topic && <span className="px-2 py-0.5 rounded-sm bg-surface-container-high text-secondary font-label-sm text-[11px] font-semibold">{note.topic?.title || 'Topic'}</span>}
                </div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-secondary">
              No notes found. Create your first note above!
            </div>
          )}

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
