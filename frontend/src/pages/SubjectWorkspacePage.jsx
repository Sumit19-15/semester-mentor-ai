import { useState, useEffect, useRef } from 'react';
import { Share2, PlayCircle, BookOpen, Plus, Upload, Loader2, Sparkles, Calendar, ChevronRight, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import SubjectOverviewTab from '../components/SubjectOverviewTab';
import SubjectNotesTab from '../components/SubjectNotesTab';
import SubjectResourcesTab from '../components/SubjectResourcesTab';
import SubjectPyqsTab from '../components/SubjectPyqsTab';
import SubjectStudyPlanTab from '../components/SubjectStudyPlanTab';
import AddSubjectModal from '../components/AddSubjectModal';
import GeneratePlanModal from '../components/GeneratePlanModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { useSubjectStore } from '../store/useSubjectStore';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubjectWorkspacePage() {
  const [activeTab, setActiveTab] = useState('Topics');
  const [isParsing, setIsParsing] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isGeneratePlanModalOpen, setIsGeneratePlanModalOpen] = useState(false);
  const [isReuploadModalOpen, setIsReuploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const fileInputRef = useRef(null);
  
  const { 
    subjects, activeSubject, setActiveSubject, fetchSubjects, 
    fetchTopicsForSubject, fetchNotesForSubject, fetchResourcesForSubject, 
    fetchPyqsForSubject, isLoading,
    studyPlans, fetchStudyPlansForSubject, activeStudyPlan, setActiveStudyPlan, deleteSubject
  } = useSubjectStore();

  const handleConfirmDelete = async () => {
    if (!subjectToDelete) return;
    try {
      await deleteSubject(subjectToDelete._id);
      toast.success('Subject deleted successfully');
      // If we deleted the currently active subject, the store automatically sets activeSubject to null.
      // The component handles this naturally by showing "No subjects found".
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  useEffect(() => {
    if (subjects.length === 0) {
      fetchSubjects();
    }
  }, [subjects.length, fetchSubjects]);

  useEffect(() => {
    if (activeSubject?._id) {
      fetchTopicsForSubject(activeSubject._id);
      fetchNotesForSubject(activeSubject._id);
      fetchResourcesForSubject(activeSubject._id);
      fetchPyqsForSubject(activeSubject._id);
      fetchStudyPlansForSubject(activeSubject._id);
      setActiveTab('Topics');
    }
  }, [activeSubject?._id, fetchTopicsForSubject, fetchNotesForSubject, fetchResourcesForSubject, fetchPyqsForSubject, fetchStudyPlansForSubject]);

  if (isLoading && !activeSubject) {
    return (
      <DashboardLayout>
        <div className="flex w-full h-full items-center justify-center">
          <span className="text-secondary">Loading workspace...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!activeSubject) {
    return (
      <DashboardLayout>
        <div className="flex w-full h-full items-center justify-center">
          <span className="text-secondary">No subjects found. Please add a subject first.</span>
        </div>
      </DashboardLayout>
    );
  }

  const handleSyllabusUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (activeSubject.topics && activeSubject.topics.length > 0) {
      setSelectedFile(file);
      setIsReuploadModalOpen(true);
      e.target.value = null;
      return;
    }

    await processSyllabusFile(file);
    e.target.value = null; // Reset input
  };

  const processSyllabusFile = async (file) => {
    setIsParsing(true);
    try {
      if (activeSubject.topics && activeSubject.topics.length > 0) {
        await useSubjectStore.getState().deleteAllTopicsForSubject(activeSubject._id);
      }
      const formData = new FormData();
      formData.append("file", file);
      
      await api.post(`/topics/${activeSubject._id}/parse-topics`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (fetchTopicsForSubject) {
        await fetchTopicsForSubject(activeSubject._id);
      }
      setActiveTab('Topics');
      toast.success("Syllabus uploaded and topics extracted successfully.");
    } catch (error) {
      console.error("Failed to parse topics", error);
      toast.error("Failed to parse topics from syllabus.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleResumeLearning = () => {
    if (studyPlans && studyPlans.length > 0) {
      setActiveStudyPlan(studyPlans[0]);
      setActiveTab('Study Plan');
    } else {
      setActiveTab('Study Plan'); // Redirect to study plan tab where they can click generate
    }
  };

  const handlePlanGenerated = (newPlan) => {
    setIsGeneratePlanModalOpen(false);
    if (newPlan) {
      setActiveStudyPlan(newPlan);
      setActiveTab('Study Plan');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex w-full h-full overflow-hidden">
        
        {/* Inner Sidebar for Subjects */}
        <aside className="w-[280px] h-full bg-surface border-r border-outline-variant flex flex-col shrink-0 relative z-20">
          <div className="p-4 border-b border-outline-variant/50 shrink-0 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-secondary">
              <BookOpen className="w-[18px] h-[18px]" />
              <span className="font-label-sm text-[11px] font-semibold uppercase tracking-wider">Subject</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-bold text-on-surface leading-tight">
              {activeSubject.name}
            </h3>
            
            <button 
              className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-md text-[14px] py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors duration-150 shadow-sm font-semibold mt-1"
              onClick={() => setIsAddSubjectModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
            <div className="px-3 py-2 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mt-2 mb-1 font-semibold border-t border-outline-variant/30 pt-2">All Subjects</div>
            
            <AnimatePresence>
              {subjects.map((sub) => (
                <motion.button 
                  key={sub._id}
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95, margin: 0, padding: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActiveSubject(sub)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group ${activeSubject._id === sub._id ? 'bg-surface-container-high' : 'hover:bg-surface-container'}`}
                >
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className={`font-label-md text-[14px] font-semibold truncate transition-colors ${activeSubject._id === sub._id ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>{sub.name}</span>
                    {sub.courseCode && <span className="font-label-sm text-[10px] text-on-surface-variant truncate">{sub.courseCode}</span>}
                  </div>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSubjectToDelete(sub);
                    }}
                    className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity hover:text-error p-1 rounded-md hover:bg-error/10 ml-2 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-full flex flex-col bg-background relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeSubject._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-stack_lg max-w-container_max_width ml-12 mr-auto w-full h-full overflow-y-auto custom-scrollbar"
            >
            {/* Page Header */}
            <div className="mb-8" data-purpose="workspace-header">
              {activeSubject.courseCode && (
                <div className="flex items-center font-label-sm text-[12px] text-secondary uppercase tracking-widest mb-3 font-semibold">
                  <span>{activeSubject.courseCode}</span>
                </div>
              )}
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <h1 className="font-display-lg text-[32px] font-bold text-on-surface tracking-tight max-w-2xl leading-tight">
                  {activeSubject.name}
                </h1>
                <div className="flex gap-3 shrink-0">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleSyllabusUpload}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isParsing}
                    className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container-lowest rounded-lg font-label-md text-[14px] font-semibold text-on-surface hover:bg-surface-container transition-all shadow-sm disabled:opacity-50"
                  >
                    {isParsing ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> : <Upload className="w-4 h-4 text-primary" />}
                    {isParsing ? 'Parsing...' : (activeSubject.topics && activeSubject.topics.length > 0 ? 'Re-upload Syllabus' : 'Upload Syllabus')}
                  </button>
                  <button 
                    onClick={handleResumeLearning}
                    className="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-lg font-label-md text-[14px] font-semibold hover:opacity-90 transition-all shadow-sm"
                  >
                    <PlayCircle className="w-4 h-4" />
                    {studyPlans && studyPlans.length > 0 ? 'Resume Learning' : 'Start Learning'}
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-outline-variant mb-8" data-purpose="workspace-tabs">
              <nav className="flex gap-8 overflow-x-auto custom-scrollbar">
                {['Topics', 'Study Plan', 'Resources', 'Notes', 'PYQs'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-label-md text-[14px] uppercase tracking-wider whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'font-bold text-primary border-b-2 border-primary'
                        : 'font-semibold text-secondary hover:text-on-surface border-b-2 border-transparent hover:border-outline-variant'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Render Active Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'Topics' && <SubjectOverviewTab setActiveTab={setActiveTab} />}
                {activeTab === 'Study Plan' && <SubjectStudyPlanTab />}
                {activeTab === 'Notes' && <SubjectNotesTab />}
                {activeTab === 'Resources' && <SubjectResourcesTab />}
                {activeTab === 'PYQs' && <SubjectPyqsTab />}
              </motion.div>
            </AnimatePresence>

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {isReuploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col border border-outline-variant p-5">
            <h2 className="font-headline-sm text-lg font-bold text-error mb-2">Warning: Re-upload Syllabus</h2>
            <p className="font-body-md text-on-surface mb-6">
              Re-uploading will delete all your existing topics. It's usually better to add missing topics manually. Are you absolutely sure you want to proceed?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsReuploadModalOpen(false);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 rounded-lg font-label-md font-semibold text-secondary hover:bg-surface-container"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setIsReuploadModalOpen(false);
                  if (selectedFile) await processSyllabusFile(selectedFile);
                }}
                className="px-5 py-2 bg-error text-onError rounded-lg font-label-md font-semibold hover:opacity-90"
              >
                Yes, Delete and Re-upload
              </button>
            </div>
          </div>
        </div>
      )}

      <AddSubjectModal 
        isOpen={isAddSubjectModalOpen} 
        onClose={() => setIsAddSubjectModalOpen(false)} 
      />
      <GeneratePlanModal
        isOpen={isGeneratePlanModalOpen}
        onClose={handlePlanGenerated}
        subjectId={activeSubject._id}
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
