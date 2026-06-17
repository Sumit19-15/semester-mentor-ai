import { useState } from 'react';
import { Calendar, Clock, CheckCircle2, Target, BookOpen, AlertCircle, Sparkles, ChevronRight, ChevronDown } from 'lucide-react';
import { useSubjectStore } from '../store/useSubjectStore';
import { motion, AnimatePresence } from 'framer-motion';
import GeneratePlanModal from './GeneratePlanModal';

export default function SubjectStudyPlanTab() {
  const { activeStudyPlan, studyPlans, setActiveStudyPlan, activeSubject, toggleStudyPlanDay } = useSubjectStore();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm mt-6">
      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 text-secondary">
        <Calendar className="w-8 h-8" />
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No Study Plan Selected</h3>
      <p className="font-body-md text-secondary max-w-md">
        Select an existing plan from above or generate a new one to view your schedule.
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Plans List & Generate Button Header */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-headline-sm text-[18px] font-bold text-on-surface flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Your Study Plans
          </h3>
          <button 
            onClick={() => setIsGenerateModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-on-primary font-label-md text-[14px] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            Generate New Plan
          </button>
        </div>
        
        {studyPlans && studyPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyPlans.map(plan => (
              <button 
                key={plan._id}
                onClick={() => setActiveStudyPlan(activeStudyPlan?._id === plan._id ? null : plan)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left group ${activeStudyPlan?._id === plan._id ? 'border-primary bg-primary-container/10 ring-1 ring-primary/20' : 'border-outline-variant hover:border-primary/50 bg-surface'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${activeStudyPlan?._id === plan._id ? 'bg-primary text-on-primary' : 'bg-surface-container text-secondary group-hover:text-primary transition-colors'}`}>
                    {plan.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className={`font-label-md text-[14px] font-bold ${activeStudyPlan?._id === plan._id ? 'text-primary' : 'text-on-surface'}`}>
                      {plan.name || "Study Plan"}
                    </h4>
                    <p className="font-label-sm text-[11px] text-secondary mt-0.5">
                      {new Date(plan.startDate).toLocaleDateString()} • {plan.dailyHours} hrs/day
                    </p>
                  </div>
                </div>
                {activeStudyPlan?._id === plan._id ? (
                  <ChevronDown className="w-5 h-5 transition-colors text-primary" />
                ) : (
                  <ChevronRight className="w-5 h-5 transition-colors text-outline group-hover:text-primary" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-secondary font-body-sm text-[14px]">No study plans generated yet. Click the button above to start planning!</p>
        )}
      </div>

      {!activeStudyPlan ? renderEmptyState() : (() => {
        const { planData, startDate, endDate } = activeStudyPlan;
        const plan = planData?.plan || planData;
        const summary = plan?.summary || "Study Plan";
        const dailyPlans = plan?.daily || [];
        const weeklyPlans = plan?.weekly || [];
        const completedDaysCount = activeStudyPlan.completedDays?.length || 0;
        const totalDays = dailyPlans.length || 1;
        const progressPercent = Math.round((completedDaysCount / totalDays) * 100);

        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8"
          >
            {/* Header Info */}
      <div className="bg-gradient-to-br from-primary-container/40 to-surface-container-lowest rounded-2xl border border-primary/20 p-6 sm:p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row mb-4">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-2 flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Your Study Strategy
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-3xl leading-relaxed">
              {summary}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm w-full sm:w-auto">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-variant stroke-current"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  className="text-primary stroke-current"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercent}, 100`}
                  fill="none"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${progressPercent}, 100` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-bold text-[12px] text-on-surface">{progressPercent}%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider font-bold">Progress</span>
              <span className="font-label-md text-[12px] font-semibold text-on-surface">
                {completedDaysCount} / {totalDays} Days
              </span>
            </div>
          </div>
        </div>
        
        {plan?.assumptions && plan.assumptions.length > 0 && (
          <div className="mt-6 bg-surface-container/50 rounded-xl p-4 border border-outline-variant/50">
            <h4 className="font-label-sm font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Keep in mind
            </h4>
            <ul className="list-disc pl-5 font-body-sm text-secondary space-y-1">
              {plan.assumptions.map((assumption, idx) => (
                <li key={idx}>{assumption}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Daily Plan */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 border-b border-outline-variant pb-3">
            <Clock className="w-5 h-5 text-primary" />
            Daily Breakdown
          </h3>
          
          <div className="flex flex-col gap-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
            {dailyPlans.map((day, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-primary-container text-primary font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {idx + 1}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow hover:border-primary/30">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-label-md text-primary font-bold">{day.date}</span>
                    <span className="bg-secondary-container/30 text-on-surface px-2 py-0.5 rounded font-label-sm text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {day.durationHours} hrs
                    </span>
                  </div>
                  
                  {day.topics && day.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {day.topics.map((t, i) => (
                        <span key={i} className="bg-surface-variant text-on-surface-variant text-[11px] px-2 py-0.5 rounded-full font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul className="space-y-2 mb-4">
                    {day.tasks?.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 font-body-sm text-on-surface">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="leading-tight">{task}</span>
                      </li>
                    ))}
                  </ul>

                  {day.revision && (
                    <div className="bg-primary-container/20 border-l-2 border-primary p-2.5 rounded-r-lg mb-4">
                      <p className="font-label-sm font-bold text-primary mb-0.5 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> Revision
                      </p>
                      <p className="font-body-sm text-[12px] text-on-surface-variant leading-tight">{day.revision}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-outline-variant pt-3 mt-auto">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStudyPlanDay(activeStudyPlan._id, idx);
                      }}
                      className={`flex items-center gap-2 font-label-sm text-[12px] font-semibold px-3 py-1.5 rounded-md transition-colors ${
                        activeStudyPlan.completedDays?.includes(idx) 
                          ? 'bg-primary/10 text-primary border border-primary/30' 
                          : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        activeStudyPlan.completedDays?.includes(idx)
                          ? 'bg-primary border-primary text-on-primary'
                          : 'border-outline-variant bg-surface'
                      }`}>
                        {activeStudyPlan.completedDays?.includes(idx) && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      {activeStudyPlan.completedDays?.includes(idx) ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Weekly Highlights */}
        <div className="flex flex-col gap-6">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 border-b border-outline-variant pb-3">
            <Target className="w-5 h-5 text-secondary" />
            Weekly Goals
          </h3>
          
          <div className="flex flex-col gap-4">
            {weeklyPlans.map((week, idx) => (
              <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
                <h4 className="font-label-md font-bold text-on-surface mb-1">{week.week}</h4>
                <p className="font-body-sm text-secondary mb-3">{week.focus}</p>
                
                {week.deliverables && week.deliverables.length > 0 && (
                  <div className="mt-3">
                    <h5 className="font-label-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Deliverables</h5>
                    <ul className="space-y-1.5">
                      {week.deliverables.map((del, i) => (
                        <li key={i} className="flex items-start gap-2 font-body-sm text-on-surface-variant text-[13px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5"></span>
                          {del}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
})()}

      <GeneratePlanModal
        isOpen={isGenerateModalOpen}
        onClose={(newPlan) => {
          setIsGenerateModalOpen(false);
          if (newPlan) setActiveStudyPlan(newPlan);
        }}
        subjectId={activeSubject?._id}
      />
    </div>
  );
}
