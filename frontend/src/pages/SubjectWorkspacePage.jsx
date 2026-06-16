import { useState, useEffect, useRef } from 'react';
import { Share2, PlayCircle, BookOpen, Plus, Upload, Loader2, Sparkles, Calendar, ChevronRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import SubjectOverviewTab from '../components/SubjectOverviewTab';
import SubjectNotesTab from '../components/SubjectNotesTab';
import SubjectResourcesTab from '../components/SubjectResourcesTab';
import SubjectPyqsTab from '../components/SubjectPyqsTab';
import SubjectStudyPlanTab from '../components/SubjectStudyPlanTab';
import AddSubjectModal from '../components/AddSubjectModal';
import GeneratePlanModal from '../components/GeneratePlanModal';
import { useSubjectStore } from '../store/useSubjectStore';
import api from '../services/api';

export default function SubjectWorkspacePage() {
  const [activeTab, setActiveTab] = useState('Topics');
  const [isParsing, setIsParsing] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isGeneratePlanModalOpen, setIsGeneratePlanModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  
  const { 
    subjects, activeSubject, setActiveSubject, fetchSubjects, 
    fetchTopicsForSubject, fetchNotesForSubject, fetchResourcesForSubject, 
    fetchPyqsForSubject, isLoading,
    studyPlans, fetchStudyPlansForSubject, activeStudyPlan, setActiveStudyPlan
  } = useSubjectStore();

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

    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      await api.post(`/topics/${activeSubject._id}/parse-topics`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Refresh topics
      if (fetchTopicsForSubject) {
        await fetchTopicsForSubject(activeSubject._id);
      }
      setActiveTab('Topics');
    } catch (error) {
      console.error("Failed to parse topics", error);
      alert("Failed to parse topics from syllabus.");
    } finally {
      setIsParsing(false);
      e.target.value = null; // Reset input
    }
  };

  const handleResumeLearning = () => {
    if (studyPlans && studyPlans.length > 0) {
      setActiveStudyPlan(studyPlans[0]);
      setActiveTab('Study Plan');
    } else {
      alert("No study plan generated yet. Please generate one first.");
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
              onClick={() => setIsGeneratePlanModalOpen(true)}
            >
              <Sparkles className="w-4 h-4" />
              Generate Plan
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
            <div className="px-3 py-2 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mt-2 mb-1 font-semibold flex justify-between items-center">
              <span>Study Plans</span>
            </div>
            
            {studyPlans && studyPlans.length > 0 ? (
              studyPlans.map((plan) => (
                <button 
                  key={plan._id}
                  onClick={() => {
                    setActiveStudyPlan(plan);
                    setActiveTab('Study Plan');
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group ${activeTab === 'Study Plan' && activeStudyPlan?._id === plan._id ? 'bg-surface-container-high' : 'hover:bg-surface-container'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded bg-primary-container/30 flex items-center justify-center text-primary shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <span className={`font-label-md text-[13px] font-semibold truncate transition-colors ${activeTab === 'Study Plan' && activeStudyPlan?._id === plan._id ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                        {new Date(plan.startDate).toLocaleDateString()}
                      </span>
                      <span className="font-label-sm text-[10px] text-on-surface-variant truncate">{plan.dailyHours} hrs/day</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-secondary group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-secondary">No plans generated yet.</div>
            )}

            <div className="px-3 py-2 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mt-4 mb-1 font-semibold border-t border-outline-variant/30 pt-4">All Subjects</div>
            
            {subjects.map((sub) => (
              <button 
                key={sub._id}
                onClick={() => setActiveSubject(sub)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group ${activeSubject._id === sub._id ? 'bg-surface-container-high' : 'hover:bg-surface-container'}`}
              >
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className={`font-label-md text-[14px] font-semibold truncate transition-colors ${activeSubject._id === sub._id ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>{sub.name}</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant truncate">{sub.courseCode || 'Course'}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-full flex flex-col bg-background relative overflow-y-auto custom-scrollbar">
          <div className="p-stack_lg max-w-container_max_width mx-auto w-full">
            {/* Page Header */}
            <div className="mb-8" data-purpose="workspace-header">
              <div className="flex items-center font-label-sm text-[12px] text-secondary uppercase tracking-widest mb-3 font-semibold">
                <span>{activeSubject.courseCode || 'Course'}</span>
              </div>
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
                    {isParsing ? 'Parsing...' : 'Upload Syllabus'}
                  </button>
                  <button 
                    onClick={handleResumeLearning}
                    className="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-lg font-label-md text-[14px] font-semibold hover:opacity-90 transition-all shadow-sm"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Resume Learning
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
            {activeTab === 'Topics' && <SubjectOverviewTab />}
            {activeTab === 'Study Plan' && <SubjectStudyPlanTab />}
            {activeTab === 'Notes' && <SubjectNotesTab />}
            {activeTab === 'Resources' && <SubjectResourcesTab />}
            {activeTab === 'PYQs' && <SubjectPyqsTab />}

          </div>
        </main>
      </div>

      <AddSubjectModal 
        isOpen={isAddSubjectModalOpen} 
        onClose={() => setIsAddSubjectModalOpen(false)} 
      />
      <GeneratePlanModal
        isOpen={isGeneratePlanModalOpen}
        onClose={handlePlanGenerated}
        subjectId={activeSubject._id}
      />
    </DashboardLayout>
  );
}
