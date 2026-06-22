import { useState } from 'react';
import { CheckCircle2, Play, Lock, FileText, ExternalLink, List, FileQuestion, ChevronRight, BookOpen, Clock, Plus, Trash2, Target, ArrowRight } from 'lucide-react';
import { useSubjectStore } from '../store/useSubjectStore';
import AddTopicModal from './AddTopicModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import toast from 'react-hot-toast';

export default function SubjectOverviewTab({ setActiveTab }) {
  const { topics, notes, resources, pyqs, activeSubject, deleteTopic, completeTopic } = useSubjectStore();
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);

  const completedTopics = topics?.filter(t => t.completed).length || 0;
  const totalTopics = topics?.length || 1;
  const progressPercent = topics?.length > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Sorting items descending by createdAt and taking top 3
  const sortedResources = [...(resources || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  const sortedNotes = [...(notes || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  const sortedPyqs = [...(pyqs || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

  const handleDeleteClick = (e, topic) => {
    e.stopPropagation();
    setTopicToDelete(topic);
  };

  const handleConfirmDelete = async () => {
    if (!topicToDelete) return;
    try {
      await deleteTopic(topicToDelete._id, activeSubject._id);
      toast.success('Topic deleted successfully');
    } catch (error) {
      toast.error('Failed to delete topic');
    }
  };

  const handleComplete = async (e, topicId) => {
    e.stopPropagation();
    await completeTopic(topicId, activeSubject._id);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Left Column (Main Content) */}
      <div className="flex-1 flex flex-col gap-8 min-w-0" data-purpose="main-column">
        {/* Curriculum Progress Card */}
        <div className="bg-white dark:bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFF5E6] dark:bg-primary-container/30 flex items-center justify-center text-[#D97706] dark:text-primary shrink-0">
                <Target className="w-4 h-4" />
              </div>
              Curriculum Progress
            </h2>
            <span className="text-[#D97706] dark:text-primary font-bold text-[11px] uppercase tracking-wider">
              {progressPercent}% Completed
            </span>
          </div>
          <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[#D97706] dark:bg-primary rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-[13px] text-secondary font-medium">You have completed {completedTopics} out of {topics?.length || 0} topics.</p>
        </div>

        {/* Modules Section */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-on-surface">Modules</h2>
            <button 
              onClick={() => setIsAddTopicModalOpen(true)}
              className="flex items-center gap-1 text-[14px] font-bold text-[#D97706] dark:text-primary hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add Topic
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {topics?.length > 0 ? topics.map((topic, index) => (
              <div key={topic._id || index} className={`bg-white dark:bg-surface-container-lowest border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col group ${topic.completed ? 'border-outline-variant/30' : 'border-outline-variant/30'}`}>
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${topic.completed ? 'bg-surface-container border border-outline-variant/30 text-secondary group-hover:text-primary' : 'bg-[#FFF5E6] dark:bg-primary-container/20 text-[#D97706] dark:text-primary'}`}>
                    {topic.completed ? <BookOpen className="w-6 h-6" /> : <Play className="w-6 h-6 fill-[#D97706] dark:fill-primary ml-1" />}
                  </div>
                  <div className="flex items-center gap-3">
                    {topic.completed ? (
                      <span className="bg-[#DCFCE7] dark:bg-[#16A34A]/20 text-[#16A34A] dark:text-[#4ade80] px-2.5 py-1 rounded font-bold text-[10px] uppercase tracking-wider">Completed</span>
                    ) : (
                      <span className="bg-[#DCFCE7] dark:bg-[#16A34A]/20 text-[#16A34A] dark:text-[#4ade80] px-2.5 py-1 rounded font-bold text-[10px] uppercase tracking-wider">In Progress</span>
                    )}
                    <button 
                      onClick={(e) => handleDeleteClick(e, topic)}
                      className="text-secondary hover:text-error transition-colors"
                      title="Delete Topic"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-[16px] font-bold text-on-surface mb-2">{topic.title}</h3>
                <p className="text-[13px] text-secondary mb-6 flex-1 leading-relaxed line-clamp-4">{topic.description || 'No description available.'}</p>
                <div className="flex items-center justify-between pt-2">
                  <div className={`flex items-center gap-2 text-[12px] font-bold ${topic.completed ? 'text-[#16A34A] dark:text-[#4ade80]' : 'text-[#D97706] dark:text-primary'}`}>
                    {topic.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {topic.completed ? 'Finished' : 'Pending'}
                  </div>
                  <label 
                    className="flex items-center gap-2 text-[13px] font-semibold text-on-surface cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      checked={topic.completed}
                      onChange={(e) => handleComplete(e, topic._id)}
                      className="w-4 h-4 rounded cursor-pointer accent-[#D97706] dark:accent-primary shrink-0 border-gray-300 dark:border-gray-600"
                    />
                    Mark Complete
                  </label>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-secondary text-center py-8">No topics found for this subject.</div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column (Widgets) */}
      <aside className="w-full xl:w-[320px] flex-shrink-0 flex flex-col gap-6" data-purpose="side-widgets">
        {/* Quick Resources Widget */}
        <div className="bg-white dark:bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm flex flex-col hover:border-[#D97706]/30 dark:hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] dark:bg-[#9333EA]/20 text-[#9333EA] dark:text-[#c084fc] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-[13px] font-bold text-secondary uppercase tracking-wider">Quick Resources</h3>
          </div>
          <div className="space-y-4 overflow-y-auto custom-scrollbar max-h-[300px] pr-2 mb-4">
            {sortedResources.length > 0 ? sortedResources.map((resource, index) => (
              <a key={resource._id || index} className="flex items-start gap-3 group cursor-pointer" href={resource.link || "#"} target="_blank" rel="noreferrer">
                <div className="w-8 h-8 rounded bg-[#e3f2fd] dark:bg-[#2563EB]/20 text-[#1976d2] dark:text-[#60a5fa] flex items-center justify-center shrink-0 mt-0.5 border border-[#bbdefb] dark:border-[#2563EB]/20">
                  {resource.type === 'pdf' ? <FileText className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-on-surface group-hover:text-primary transition-colors">{resource.title}</h4>
                  <p className="text-[11px] text-secondary mt-0.5">{new Date(resource.createdAt).toLocaleDateString()}</p>
                </div>
              </a>
            )) : (
              <div className="text-[13px] text-secondary font-medium">No resources yet.</div>
            )}
          </div>
          <button 
            onClick={() => setActiveTab('Resources')}
            className="text-[13px] font-bold text-[#D97706] dark:text-primary flex items-center gap-1 hover:underline mt-auto"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Notes Widget */}
        <div className="bg-white dark:bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm flex flex-col hover:border-[#D97706]/30 dark:hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] dark:bg-[#16A34A]/20 text-[#16A34A] dark:text-[#4ade80] flex items-center justify-center shrink-0">
              <List className="w-5 h-5" />
            </div>
            <h3 className="text-[13px] font-bold text-secondary uppercase tracking-wider">Recent Notes</h3>
          </div>
          <div className="space-y-3 overflow-y-auto custom-scrollbar max-h-[300px] pr-2 mb-4">
            {sortedNotes.length > 0 ? sortedNotes.map((note, index) => (
              <a key={note._id || index} className="block bg-surface-container border border-outline-variant/30 rounded-lg p-3 hover:bg-surface-container-high transition-colors cursor-pointer" href={note.fileUrl || "#"} target="_blank" rel="noreferrer">
                <h4 className="text-[13px] font-medium text-on-surface line-clamp-2 leading-tight mb-2">{note.title}</h4>
                <p className="text-[10px] text-secondary font-medium">{new Date(note.createdAt).toLocaleDateString()}</p>
              </a>
            )) : (
              <div className="text-[13px] text-secondary font-medium">No notes yet.</div>
            )}
          </div>
          <button 
            onClick={() => setActiveTab('Notes')}
            className="text-[13px] font-bold text-[#D97706] dark:text-primary flex items-center gap-1 hover:underline mt-auto"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Latest PYQs Widget */}
        <div className="bg-white dark:bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm flex flex-col hover:border-[#D97706]/30 dark:hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60a5fa] flex items-center justify-center shrink-0">
              <FileQuestion className="w-5 h-5" />
            </div>
            <h3 className="text-[13px] font-bold text-secondary uppercase tracking-wider">Latest PYQs</h3>
          </div>
          <div className="flex flex-col overflow-y-auto custom-scrollbar max-h-[300px] pr-2 mb-4">
            {sortedPyqs.length > 0 ? sortedPyqs.map((pyq, index) => (
              <a key={pyq._id || index} className="flex justify-between items-center py-3 border-b border-outline-variant/30 group cursor-pointer" href={pyq.fileUrl || "#"} target="_blank" rel="noreferrer">
                <span className="text-[13px] text-on-surface font-medium group-hover:text-primary transition-colors">{pyq.title}</span>
                <ChevronRight className="w-4 h-4 text-secondary group-hover:text-primary transition-colors shrink-0" />
              </a>
            )) : (
              <div className="text-[13px] text-secondary font-medium">No PYQs yet.</div>
            )}
          </div>
          <button 
            onClick={() => setActiveTab('PYQs')}
            className="text-[13px] font-bold text-[#D97706] dark:text-primary flex items-center gap-1 hover:underline mt-auto"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </aside>
      
      <AddTopicModal 
        isOpen={isAddTopicModalOpen} 
        onClose={() => setIsAddTopicModalOpen(false)} 
        subjectId={activeSubject?._id}
      />
      <ConfirmDeleteModal 
        isOpen={!!topicToDelete}
        onClose={() => setTopicToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Topic"
        message={`Are you sure you want to delete "${topicToDelete?.title}"?`}
      />
    </div>
  );
}
