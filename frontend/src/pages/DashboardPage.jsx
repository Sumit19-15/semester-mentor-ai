import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSubjectStore } from '../store/useSubjectStore';
import DashboardLayout from '../layouts/DashboardLayout';
import { FileText, Plus, Calendar, Trash2, GraduationCap, BookOpen, Clock, Target, Bell, Moon, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AddSubjectModal from '../components/AddSubjectModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { subjects, fetchSubjects, isLoading, fetchAllTopics, allTopics, setActiveSubject, deleteSubject, deleteTopic } = useSubjectStore();
  const navigate = useNavigate();
  const userName = user?.name?.split(' ')[0] || 'Student';
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [topicToDelete, setTopicToDelete] = useState(null);

  const handleConfirmDeleteSubject = async () => {
    if (!subjectToDelete) return;
    try {
      await deleteSubject(subjectToDelete._id);
      toast.success('Subject deleted successfully');
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  const handleConfirmDeleteTopic = async () => {
    if (!topicToDelete) return;
    try {
      const subjectId = typeof topicToDelete.subject === 'object' ? topicToDelete.subject?._id : topicToDelete.subject;
      await deleteTopic(topicToDelete._id, subjectId);
      toast.success('Module deleted successfully');
    } catch (error) {
      toast.error('Failed to delete module');
    }
  };



  const [totalStudyPlans, setTotalStudyPlans] = useState(0);

  useEffect(() => {
    fetchSubjects();
    fetchAllTopics();

    // Fetch total study plans
    import('../services/api').then(({ default: api }) => {
      api.get('/study-plans/all')
        .then(res => setTotalStudyPlans(res.data.length))
        .catch(err => console.error('Failed to fetch study plans:', err));
    });
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
    return "Ready to conquer your goals today?";
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

  // Calculations for Stats
  const totalSubjects = subjects.length;
  const totalModules = allTopics.length;

  // Calculate completed subjects
  const fullyCompletedSubjects = subjects.filter(sub => {
    const subjectTopics = allTopics.filter(t => t.subject?._id === sub._id || t.subject === sub._id);
    const totalSubjectTopics = subjectTopics.length;
    const completedSubjectTopics = subjectTopics.filter(t => t.completed).length;
    return totalSubjectTopics > 0 && totalSubjectTopics === completedSubjectTopics;
  }).length;

  return (
    <DashboardLayout>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4 pt-4">
          <div>
            <h2 className="text-3xl font-bold text-on-surface mb-2 flex items-center gap-2">
              {getGreeting()}, {userName} <span className="text-2xl">👋</span>
            </h2>
            <p className="text-secondary">{getMotivation()}</p>
          </div>
        </motion.div>

        {/* Top Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Subjects */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#FFF5E6] dark:bg-primary-container/30 border border-[#FFE0B2] dark:border-primary/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-7 h-7 text-[#D97706] dark:text-primary" />
            </div>
            <div>
              <p className="text-sm text-secondary font-medium mb-1">Total Subjects</p>
              <h3 className="text-2xl font-bold text-on-surface mb-1">{totalSubjects}</h3>
              <p className="text-xs text-secondary">Active Courses</p>
            </div>
          </div>

          {/* Modules */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#F0FDF4] dark:bg-[#16A34A]/20 border border-[#BBF7D0] dark:border-[#16A34A]/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7 text-[#16A34A] dark:text-[#4ade80]" />
            </div>
            <div>
              <p className="text-sm text-secondary font-medium mb-1">Modules</p>
              <h3 className="text-2xl font-bold text-on-surface mb-1">{totalModules}</h3>
              <p className="text-xs text-secondary">Across All Subjects</p>
            </div>
          </div>

          {/* Study Plans */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#EFF6FF] dark:bg-[#2563EB]/20 border border-[#BFDBFE] dark:border-[#2563EB]/20 flex items-center justify-center shrink-0">
              <Calendar className="w-7 h-7 text-[#2563EB] dark:text-[#60a5fa]" />
            </div>
            <div>
              <p className="text-sm text-secondary font-medium mb-1">Study Plans</p>
              <h3 className="text-2xl font-bold text-on-surface mb-1">{totalStudyPlans}</h3>
              <p className="text-xs text-secondary">Plans Generated</p>
            </div>
          </div>

          {/* Completed Subjects */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#FAF5FF] dark:bg-[#9333EA]/20 border border-[#E9D5FF] dark:border-[#9333EA]/20 flex items-center justify-center shrink-0">
              <Target className="w-7 h-7 text-[#9333EA] dark:text-[#c084fc]" />
            </div>
            <div>
              <p className="text-sm text-secondary font-medium mb-1">Completed</p>
              <h3 className="text-2xl font-bold text-on-surface mb-1">{fullyCompletedSubjects}</h3>
              <p className="text-xs text-secondary">Subjects Finished</p>
            </div>
          </div>
        </motion.div>

        {/* Section 1: My Subjects */}
        <motion.section variants={itemVariants} className="mb-10 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              My Subjects
            </h3>
            <div className="flex gap-4 items-center">
              <button className="text-sm font-semibold text-primary hover:underline cursor-pointer" onClick={() => navigate('/subjects')}>View All</button>
              <button
                className="text-sm font-medium text-white bg-[#D97706] dark:bg-primary rounded-lg px-4 py-2 hover:bg-[#B45309] dark:hover:bg-primary/80 transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                onClick={() => setIsAddSubjectModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Subject
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-secondary text-center py-8">Loading subjects...</div>
          ) : subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                      className="border border-outline-variant/30 rounded-xl p-5 flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer min-h-[150px] group bg-white dark:bg-surface-container-lowest"
                      onClick={() => { setActiveSubject(sub); navigate('/subjects'); }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-on-surface leading-tight pr-3 text-[15px]">{sub.name}</h4>
                        <div className="flex items-center gap-2 shrink-0">
                          {sub.courseCode && (
                            <span className="text-[#D97706] dark:text-primary font-bold text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-[#FFF5E6] dark:bg-primary-container/20">
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
                      <div className="mt-auto pt-4 border-t border-outline-variant/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-medium text-secondary">Syllabus Completion</span>
                          <span className="text-[11px] font-bold text-on-surface">{completion}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${completion}%` }}></div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-secondary bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 text-center">
              No subjects found. Let's add some to your workspace!
            </div>
          )}
        </motion.section>

        {/* Section 2: Modules */}
        <motion.section variants={itemVariants} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Modules
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {allTopics.length > 0 ? allTopics.slice(0, 8).map((topicItem, idx) => (
              <div
                key={topicItem._id || idx}
                className="border border-outline-variant/30 rounded-xl p-5 text-left hover:shadow-md transition-all duration-200 group flex flex-col h-full bg-white dark:bg-surface-container-lowest relative cursor-pointer"
                onClick={() => {
                  if (topicItem.subject) {
                    setActiveSubject(topicItem.subject);
                  }
                  navigate('/subjects');
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTopicToDelete(topicItem);
                  }}
                  className="absolute top-2 right-2 text-secondary opacity-0 group-hover:opacity-100 transition-opacity hover:text-error p-1.5 rounded-md hover:bg-error/10 z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="w-10 h-10 rounded-lg bg-[#FFF5E6] dark:bg-primary-container/20 flex items-center justify-center text-[#D97706] dark:text-primary mb-3 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="mt-1">
                  <h5 className="font-bold text-[14px] text-on-surface mb-1 line-clamp-2 leading-tight pr-4">{topicItem.title}</h5>
                  <p className="text-[11px] text-secondary font-medium">{topicItem.subject?.name || 'Topic'}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-secondary text-center py-8 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
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
        onConfirm={handleConfirmDeleteSubject}
        title="Delete Subject"
        message={`Are you sure you want to delete "${subjectToDelete?.name}"? This action cannot be undone.`}
      />
      <ConfirmDeleteModal
        isOpen={!!topicToDelete}
        onClose={() => setTopicToDelete(null)}
        onConfirm={handleConfirmDeleteTopic}
        title="Delete Module"
        message={`Are you sure you want to delete "${topicToDelete?.title}"? This action cannot be undone.`}
      />
    </DashboardLayout>
  );
}
