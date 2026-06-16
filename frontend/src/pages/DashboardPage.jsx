import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSubjectStore } from '../store/useSubjectStore';
import DashboardLayout from '../layouts/DashboardLayout';
import { FileText, Plus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddSubjectModal from '../components/AddSubjectModal';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { subjects, fetchSubjects, isLoading, fetchAllTopics, allTopics, setActiveSubject } = useSubjectStore();
  const navigate = useNavigate();
  const userName = user?.name?.split(' ')[0] || 'Student';
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchAllTopics();
  }, [fetchSubjects, fetchAllTopics]);

  // Format today's date
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-stack_lg gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface mb-1">Good morning, {userName}</h2>
          <p className="font-body-md text-body-md text-secondary">Here is your academic overview for today.</p>
        </div>
        <div className="font-body-md text-body-md text-secondary flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {today}
        </div>
      </div>

      {/* Section 1: My Subjects */}
      <section className="mb-stack_lg">
        <div className="flex justify-between items-center mb-stack_md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">My Subjects</h3>
          <div className="flex gap-4 items-center">
            <button className="font-label-md text-label-md text-primary hover:underline cursor-pointer" onClick={() => navigate('/subjects')}>View All</button>
            <button 
              className="font-label-md text-label-md text-on-background bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-1.5 hover:bg-surface-container-low transition-colors flex items-center gap-1 cursor-pointer"
              onClick={() => setIsAddSubjectModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-secondary">Loading subjects...</div>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack_md">
            {subjects.slice(0, 6).map((sub) => {
              // Calculate completion percentage based on topics if available
              const completedTopics = sub.topics?.filter(t => t.completed).length || 0;
              const totalTopics = sub.topics?.length || 1;
              const completion = sub.topics?.length > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

              return (
                <div key={sub._id} className="bg-surface-container-lowest border border-surface-variant rounded-lg p-stack_md flex flex-col hover:shadow-md hover:border-outline-variant transition-all duration-150 cursor-pointer min-h-[140px]" onClick={() => { setActiveSubject(sub); navigate('/subjects'); }}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface leading-tight">{sub.name}</h4>
                    <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-full whitespace-nowrap ml-2">{sub.courseCode || 'Course'}</span>
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-label-sm text-label-sm text-secondary">Syllabus Completion</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{completion}%</span>
                    </div>
                    <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${completion}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-secondary bg-surface-container-lowest p-6 rounded-lg border border-outline-variant text-center">
            No subjects found. Let's add some to your workspace!
          </div>
        )}
      </section>

      {/* Section 2: Modules */}
      <section>
        <div className="flex justify-between items-center mb-stack_md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Modules</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack_sm">
          
          {allTopics.length > 0 ? allTopics.slice(0, 8).map((topicItem, idx) => (
            <button 
              key={topicItem._id || idx} 
              onClick={() => navigate('/module-chat')}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack_md text-left hover:shadow-sm hover:border-primary/50 transition-all duration-200 group flex flex-col h-full"
            >
              <div className="w-10 h-10 rounded bg-secondary-container/30 flex items-center justify-center text-primary group-hover:bg-primary-container/20 transition-colors shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="mb-4 mt-2">
                <h5 className="font-label-md text-label-md text-on-surface truncate w-full">{topicItem.title}</h5>
                <p className="font-label-sm text-label-sm text-secondary mt-0.5">{topicItem.subject?.name || 'Topic'}</p>
              </div>
            </button>
          )) : (
            <div className="col-span-full text-secondary text-center py-4 bg-surface-container-lowest rounded-lg border border-outline-variant">
              No modules or topics found yet.
            </div>
          )}

        </div>
      </section>

      {/* Add Subject Modal */}
      <AddSubjectModal 
        isOpen={isAddSubjectModalOpen} 
        onClose={() => setIsAddSubjectModalOpen(false)} 
      />
    </DashboardLayout>
  );
}
