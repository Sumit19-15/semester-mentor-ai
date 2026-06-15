import { CheckCircle2, Play, Lock, FileText, ExternalLink, List, FileQuestion, ChevronRight, BookOpen, Clock } from 'lucide-react';

export default function SubjectOverviewTab() {
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Left Column (Main Content) */}
      <div className="flex-1 flex flex-col gap-8 min-w-0" data-purpose="main-column">
        {/* Curriculum Progress Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Curriculum Progress</h2>
            <span className="bg-primary-container/20 text-primary border border-primary/20 px-2.5 py-1 rounded-md font-label-sm text-[10px] font-bold uppercase tracking-wide">
              45% Completed
            </span>
          </div>
          <div className="w-full h-2.5 bg-surface-variant rounded-full overflow-hidden mb-3">
            <div className="h-full bg-primary rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="font-body-sm text-[13px] text-secondary font-medium">You are on track. Next milestone: Relational Algebra.</p>
        </div>

        {/* Modules Section */}
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-5">Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Module Card 1: Completed */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="bg-[#e8f5e9] text-[#2e7d32] px-2 py-1 rounded font-label-sm text-[10px] font-bold uppercase tracking-wider">Completed</span>
              </div>
              <h3 className="font-headline-sm text-[16px] font-bold text-on-surface mb-1">Relational Model</h3>
              <p className="font-body-sm text-[13px] text-secondary mb-6 flex-1 leading-relaxed">Entities, attributes, relationships, and ER diagrams.</p>
              <div className="flex items-center gap-2 font-label-sm text-[12px] font-semibold text-secondary border-t border-outline-variant pt-3 mt-auto">
                <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
                4/4 Topics
              </div>
            </div>

            {/* Module Card 2: In Progress */}
            <div className="bg-surface-container-lowest border-2 border-primary/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-container/20 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary-container/40 transition-colors">
                  <Play className="w-5 h-5 fill-primary" />
                </div>
                <span className="bg-surface-container text-secondary px-2 py-1 rounded font-label-sm text-[10px] font-bold uppercase tracking-wider">In Progress</span>
              </div>
              <h3 className="font-headline-sm text-[16px] font-bold text-on-surface mb-1">SQL Basics</h3>
              <p className="font-body-sm text-[13px] text-secondary mb-6 flex-1 leading-relaxed">DQL, DML, DDL commands and basic queries.</p>
              <div className="flex items-center gap-2 font-label-sm text-[12px] font-semibold text-secondary border-t border-outline-variant pt-3 mt-auto">
                <Clock className="w-4 h-4" />
                2/5 Topics
              </div>
            </div>

            {/* Module Card 3: Locked */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-5 shadow-sm flex flex-col opacity-70">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-secondary">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="bg-surface-variant text-secondary px-2 py-1 rounded font-label-sm text-[10px] font-bold uppercase tracking-wider">Locked</span>
              </div>
              <h3 className="font-headline-sm text-[16px] font-bold text-secondary mb-1">Normalization</h3>
              <p className="font-body-sm text-[13px] text-secondary mb-6 flex-1 leading-relaxed">1NF, 2NF, 3NF, BCNF and loss-less decomposition.</p>
              <div className="flex items-center gap-2 font-label-sm text-[12px] font-semibold text-secondary border-t border-outline-variant pt-3 mt-auto">
                <Clock className="w-4 h-4" />
                0/3 Topics
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Widgets) */}
      <aside className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-6" data-purpose="side-widgets">
        {/* Quick Resources Widget */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
          <h3 className="font-label-sm text-[12px] font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Quick Resources
          </h3>
          <div className="space-y-4">
            <a className="flex items-start gap-3 group cursor-pointer" href="#">
              <div className="w-10 h-10 rounded bg-[#ffebee] text-[#d32f2f] flex items-center justify-center shrink-0 mt-0.5 border border-[#ffcdd2]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-label-md text-[14px] font-semibold text-on-surface group-hover:text-primary transition-colors">Korth Chapter 3</h4>
                <p className="font-label-sm text-[11px] text-secondary mt-0.5">PDF • 2.4 MB</p>
              </div>
            </a>
            <a className="flex items-start gap-3 group cursor-pointer" href="#">
              <div className="w-10 h-10 rounded bg-[#e3f2fd] text-[#1976d2] flex items-center justify-center shrink-0 mt-0.5 border border-[#bbdefb]">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-label-md text-[14px] font-semibold text-on-surface group-hover:text-primary transition-colors">SQL Practice Platform</h4>
                <p className="font-label-sm text-[11px] text-secondary mt-0.5">External Link</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Notes Widget */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-label-sm text-[12px] font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
              <List className="w-4 h-4" />
              Recent Notes
            </h3>
            <button className="text-primary hover:text-primary/80 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <a className="block bg-primary-container/10 border border-primary/20 rounded-lg p-3 hover:border-primary/40 transition-colors cursor-pointer" href="#">
              <h4 className="font-label-md text-[14px] font-semibold text-on-surface line-clamp-2 leading-tight mb-2">Difference between Weak and Strong Entities...</h4>
              <p className="font-label-sm text-[10px] text-primary font-medium">Updated 2h ago</p>
            </a>
            <a className="block bg-surface-container border border-outline-variant rounded-lg p-3 hover:bg-surface-container-high transition-colors cursor-pointer" href="#">
              <h4 className="font-label-md text-[14px] font-medium text-on-surface-variant line-clamp-2 leading-tight mb-2">Key constraints definitions.</h4>
              <p className="font-label-sm text-[10px] text-secondary font-medium">Updated 1d ago</p>
            </a>
          </div>
        </div>

        {/* Latest PYQs Widget */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
          <h3 className="font-label-sm text-[12px] font-bold text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileQuestion className="w-4 h-4" />
            Latest PYQs
          </h3>
          <div className="flex flex-col">
            <a className="flex justify-between items-center py-3 border-b border-outline-variant group cursor-pointer" href="#">
              <span className="font-label-md text-[14px] text-on-surface font-medium group-hover:text-primary transition-colors">2023 End Semester</span>
              <ChevronRight className="w-4 h-4 text-secondary group-hover:text-primary transition-colors" />
            </a>
            <a className="flex justify-between items-center py-3 border-b border-outline-variant group cursor-pointer" href="#">
              <span className="font-label-md text-[14px] text-on-surface font-medium group-hover:text-primary transition-colors">2022 Mid Semester</span>
              <ChevronRight className="w-4 h-4 text-secondary group-hover:text-primary transition-colors" />
            </a>
            <a className="flex justify-between items-center py-3 group cursor-pointer" href="#">
              <span className="font-label-md text-[14px] text-on-surface font-medium group-hover:text-primary transition-colors">2021 End Semester</span>
              <ChevronRight className="w-4 h-4 text-secondary group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
