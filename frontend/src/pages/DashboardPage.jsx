import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSubjectStore } from '../store/useSubjectStore';
import DashboardLayout from '../layouts/DashboardLayout';
import { FileText, Plus, Calendar, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AddSubjectModal from '../components/AddSubjectModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { subjects, fetchSubjects, isLoading, fetchAllTopics, allTopics, setActiveSubject, deleteSubject } = useSubjectStore();
  const navigate = useNavigate();
  const userName = user?.name?.split(' ')[0] || 'Student';
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const handleConfirmDelete = async () => {
    if (!subjectToDelete) return;
    try {
      await deleteSubject(subjectToDelete._id);
      toast.success('Subject deleted successfully');
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivation = () => {
    const quotes = [
      "Here is your academic overview for today.",
      "Ready to conquer your goals today?",
      "Every small step brings you closer to success.",
      "Focus, learn, and grow. Let's get started!",
      "Knowledge is power. Let's gain some today."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <DashboardLayout>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:justify-between md:items-end mb-stack_lg gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface mb-1">{getGreeting()}, {userName}</h2>
          <p className="font-body-md text-body-md text-secondary">{getMotivation()}</p>
        </div>
        <div className="font-body-md text-body-md text-secondary flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {today}
        </div>
      </motion.div>

      {/* Section 1: My Subjects */}
      <motion.section variants={itemVariants} className="mb-stack_lg">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {subjects.map((sub) => {
                const subjectTopics = allTopics.filter(t => t.subject?._id === sub._id || t.subject === sub._id);
                const totalTopics = subjectTopics.length;
                const completedTopics = subjectTopics.filter(t => t.completed).length;
                const completion = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

                return (
                  <motion.div 
                    key={sub._id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                    transition={{ duration: 0.2 }}
                    className="bg-surface-container-lowest border border-surface-variant rounded-lg p-stack_md flex flex-col hover:shadow-md hover:border-outline-variant transition-all duration-150 cursor-pointer min-h-[140px] group" 
                    onClick={() => { setActiveSubject(sub); navigate('/subjects'); }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-headline-sm text-headline-sm text-on-surface leading-tight pr-3">{sub.name}</h4>
                      <div className="flex items-center gap-2 shrink-0">
                        {sub.courseCode && (
                          <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-full whitespace-nowrap">
                            {sub.courseCode}
                          </span>
                        )}
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSubjectToDelete(sub);
                          }}
                          className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity hover:text-error p-1 rounded-md hover:bg-error/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-auto pt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-label-sm text-label-sm text-secondary">Syllabus Completion</span>
                        <span className="font-label-sm text-label-sm font-semibold text-on-surface">{completion}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${completion}%` }}></div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {/* Add Subject Card */}
          </div>
        ) : (
          <div className="text-secondary bg-surface-container-lowest p-6 rounded-lg border border-outline-variant text-center">
            No subjects found. Let's add some to your workspace!
          </div>
        )}
      </motion.section>

      {/* Section 2: Modules */}
      <motion.section variants={itemVariants}>
        <div className="flex justify-between items-center mb-stack_md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Modules</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack_sm">
          
          {allTopics.length > 0 ? allTopics.slice(0, 8).map((topicItem, idx) => (
            <button 
              key={topicItem._id || idx} 
              onClick={() => {
                if (topicItem.subject) {
                  setActiveSubject(topicItem.subject);
                }
                navigate('/subjects');
              }}
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
      </motion.section>
      </motion.div>

      {/* Add Subject Modal */}
      <AddSubjectModal 
        isOpen={isAddSubjectModalOpen} 
        onClose={() => setIsAddSubjectModalOpen(false)} 
      />
      <ConfirmDeleteModal 
        isOpen={!!subjectToDelete}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Subject"
        message={`Are you sure you want to delete "${subjectToDelete?.name}"? This action cannot be undone.`}
      />
    </DashboardLayout>
  );
}
