import { CheckCircle2, Play, Lock, FileText, ExternalLink, List, FileQuestion, ChevronRight, BookOpen, Clock } from 'lucide-react';
import { useSubjectStore } from '../store/useSubjectStore';

export default function SubjectOverviewTab() {
  const { topics, notes, resources, pyqs } = useSubjectStore();

  const completedTopics = topics?.filter(t => t.completed).length || 0;
  const totalTopics = topics?.length || 1;
  const progressPercent = topics?.length > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Left Column (Main Content) */}
      <div className="flex-1 flex flex-col gap-8 min-w-0" data-purpose="main-column">
        {/* Curriculum Progress Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Curriculum Progress</h2>
            <span className="bg-primary-container/20 text-primary border border-primary/20 px-2.5 py-1 rounded-md font-label-sm text-[10px] font-bold uppercase tracking-wide">
              {progressPercent}% Completed
            </span>
          </div>
          <div className="w-full h-2.5 bg-surface-variant rounded-full overflow-hidden mb-3">
            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="font-body-sm text-[13px] text-secondary font-medium">You have completed {completedTopics} out of {topics?.length || 0} topics.</p>
        </div>

        {/* Modules Section */}
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-5">Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {topics?.length > 0 ? topics.map((topic, index) => (
              <div key={topic._id || index} className={`bg-surface-container-lowest border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer group ${topic.completed ? 'border-outline-variant' : 'border-primary/40 border-2 relative overflow-hidden'}`}>
                {!topic.completed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${topic.completed ? 'bg-surface-container border border-outline-variant text-secondary group-hover:text-primary' : 'bg-primary-container/20 border border-primary/20 text-primary group-hover:bg-primary-container/40'}`}>
                    {topic.completed ? <BookOpen className="w-5 h-5" /> : <Play className="w-5 h-5 fill-primary" />}
                  </div>
                  {topic.completed ? (
                    <span className="bg-[#e8f5e9] text-[#2e7d32] px-2 py-1 rounded font-label-sm text-[10px] font-bold uppercase tracking-wider">Completed</span>
                  ) : (
                    <span className="bg-surface-container text-secondary px-2 py-1 rounded font-label-sm text-[10px] font-bold uppercase tracking-wider">In Progress</span>
                  )}
                </div>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface mb-1">{topic.title}</h3>
                <p className="font-body-sm text-[13px] text-secondary mb-6 flex-1 leading-relaxed">{topic.description || 'No description available.'}</p>
                <div className="flex items-center gap-2 font-label-sm text-[12px] font-semibold text-secondary border-t border-outline-variant pt-3 mt-auto">
                  {topic.completed ? <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" /> : <Clock className="w-4 h-4" />}
                  Topic Status
                </div>
              </div>
            )) : (
              <div className="col-span-full text-secondary text-center py-8">No topics found for this subject.</div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column (Widgets) */}
      <aside className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-6" data-purpose="side-widgets">
        {/* Quick Resources Widget */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm flex flex-col">
          <h3 className="font-label-sm text-[12px] font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2 shrink-0">
            <BookOpen className="w-4 h-4" />
            Quick Resources
          </h3>
          <div className="space-y-4 overflow-y-auto custom-scrollbar max-h-[300px] pr-2">
            {resources?.length > 0 ? resources.map((resource, index) => (
              <a key={resource._id || index} className="flex items-start gap-3 group cursor-pointer" href={resource.link || "#"} target="_blank" rel="noreferrer">
                <div className="w-10 h-10 rounded bg-[#e3f2fd] text-[#1976d2] flex items-center justify-center shrink-0 mt-0.5 border border-[#bbdefb]">
                  {resource.type === 'pdf' ? <FileText className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-label-md text-[14px] font-semibold text-on-surface group-hover:text-primary transition-colors">{resource.title}</h4>
                  <p className="font-label-sm text-[11px] text-secondary mt-0.5">{resource.type}</p>
                </div>
              </a>
            )) : (
              <div className="text-secondary text-sm">No resources yet.</div>
            )}
          </div>
        </div>

        {/* Recent Notes Widget */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="font-label-sm text-[12px] font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
              <List className="w-4 h-4" />
              Recent Notes
            </h3>
            <button className="text-primary hover:text-primary/80 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3 overflow-y-auto custom-scrollbar max-h-[300px] pr-2">
            {notes?.length > 0 ? notes.map((note, index) => (
              <a key={note._id || index} className="block bg-surface-container border border-outline-variant rounded-lg p-3 hover:bg-surface-container-high transition-colors cursor-pointer" href={note.fileUrl || "#"} target="_blank" rel="noreferrer">
                <h4 className="font-label-md text-[14px] font-medium text-on-surface line-clamp-2 leading-tight mb-2">{note.title}</h4>
                <p className="font-label-sm text-[10px] text-secondary font-medium">{new Date(note.createdAt).toLocaleDateString()}</p>
              </a>
            )) : (
              <div className="text-secondary text-sm">No notes yet.</div>
            )}
          </div>
        </div>

        {/* Latest PYQs Widget */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm flex flex-col">
          <h3 className="font-label-sm text-[12px] font-bold text-secondary uppercase tracking-wider mb-3 flex items-center gap-2 shrink-0">
            <FileQuestion className="w-4 h-4" />
            Latest PYQs
          </h3>
          <div className="flex flex-col overflow-y-auto custom-scrollbar max-h-[300px] pr-2">
            {pyqs?.length > 0 ? pyqs.map((pyq, index) => (
              <a key={pyq._id || index} className="flex justify-between items-center py-3 border-b border-outline-variant group cursor-pointer" href={pyq.fileUrl || "#"} target="_blank" rel="noreferrer">
                <span className="font-label-md text-[14px] text-on-surface font-medium group-hover:text-primary transition-colors">{pyq.year} - {pyq.subject?.name || 'PYQ'}</span>
                <ChevronRight className="w-4 h-4 text-secondary group-hover:text-primary transition-colors shrink-0" />
              </a>
            )) : (
              <div className="text-secondary text-sm">No PYQs yet.</div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
