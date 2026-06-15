import { GraduationCap, Clock, FileText, Paperclip, ArrowUp, Plus } from 'lucide-react';

export default function MentorChatPage() {
  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Inner Sidebar for Chat History */}
      <aside className="w-[280px] h-full bg-surface border-r border-outline-variant flex flex-col shrink-0 relative z-20">
        <div className="p-4 border-b border-outline-variant/50 shrink-0">
          <button className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-md text-[14px] py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors duration-150 shadow-sm font-semibold">
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
          <div className="px-3 py-2 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mt-2 mb-1 font-semibold">Recent</div>
          <button className="w-full text-left p-2.5 rounded-lg border border-transparent hover:bg-surface-container transition-colors flex flex-col gap-1 group">
            <span className="font-label-md text-[13px] text-on-surface font-medium truncate group-hover:text-primary transition-colors">Exam prep schedule</span>
            <span className="font-label-sm text-[10px] text-on-surface-variant">Today, 2:30 PM</span>
          </button>
          <button className="w-full text-left p-2.5 rounded-lg border border-transparent hover:bg-surface-container transition-colors flex flex-col gap-1 group">
            <span className="font-label-md text-[13px] text-on-surface font-medium truncate group-hover:text-primary transition-colors">Understanding React Hooks</span>
            <span className="font-label-sm text-[10px] text-on-surface-variant">Yesterday</span>
          </button>
          <div className="px-3 py-2 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mt-4 mb-1 font-semibold">Previous 7 Days</div>
          <button className="w-full text-left p-2.5 rounded-lg border border-transparent hover:bg-surface-container transition-colors flex flex-col gap-1 group">
            <span className="font-label-md text-[13px] text-on-surface font-medium truncate group-hover:text-primary transition-colors">How to write a literature review</span>
            <span className="font-label-sm text-[10px] text-on-surface-variant">Oct 24, 2023</span>
          </button>
          <button className="w-full text-left p-2.5 rounded-lg border border-transparent hover:bg-surface-container transition-colors flex flex-col gap-1 group">
            <span className="font-label-md text-[13px] text-on-surface font-medium truncate group-hover:text-primary transition-colors">Calculus III help</span>
            <span className="font-label-sm text-[10px] text-on-surface-variant">Oct 22, 2023</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full w-full relative">
        <div className="flex-1 flex flex-col items-center justify-center px-gutter overflow-y-auto pb-[140px]">
          <div className="flex flex-col items-center text-center max-w-[600px] mb-stack_lg w-full">
            <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center mb-stack_md shadow-sm border border-outline-variant/30">
              <GraduationCap className="text-[32px] w-8 h-8 text-on-primary-container" />
            </div>
            <h2 className="font-display-lg text-[32px] leading-[40px] font-bold text-on-surface mb-2">Semester Mentor</h2>
            <p className="font-body-lg text-[16px] text-secondary max-w-[500px]">
              Ask anything about your semester, subjects, projects, or study plans.
            </p>
          </div>
          
          {/* Quick Start Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-[768px]">
            {/* Card 1 */}
            <button className="text-left bg-surface-container-lowest border border-outline-variant rounded-lg p-4 hover:shadow-sm hover:border-primary/30 hover:bg-surface transition-all duration-150 group">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="text-secondary w-[18px] h-[18px] group-hover:text-primary transition-colors" />
                <span className="font-label-sm text-[11px] font-semibold text-secondary uppercase tracking-wider group-hover:text-primary transition-colors">
                  Planning
                </span>
              </div>
              <p className="font-body-md text-[14px] text-on-surface">
                Create a study schedule for finals week based on 4 subjects.
              </p>
            </button>
            
            {/* Card 2 */}
            <button className="text-left bg-surface-container-lowest border border-outline-variant rounded-lg p-4 hover:shadow-sm hover:border-primary/30 hover:bg-surface transition-all duration-150 group">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="text-secondary w-[18px] h-[18px] group-hover:text-primary transition-colors" />
                <span className="font-label-sm text-[11px] font-semibold text-secondary uppercase tracking-wider group-hover:text-primary transition-colors">
                  Writing
                </span>
              </div>
              <p className="font-body-md text-[14px] text-on-surface">
                Help me brainstorm an outline for my History 202 research paper.
              </p>
            </button>
          </div>
        </div>

        {/* Bottom Input Area (Fixed Bottom) */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-8 pb-6 px-gutter flex flex-col items-center z-30">
          <div className="w-full max-w-[768px] relative bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:border-primary/50 transition-colors duration-150 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <div className="flex items-center px-4 py-3 min-h-[56px]">
              <button className="text-secondary hover:text-on-surface p-1 transition-colors rounded-full hover:bg-surface-container">
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-body-md text-[14px] px-3 placeholder:text-secondary-fixed-dim outline-none" 
                placeholder="Message Semester Mentor..." 
                type="text" 
              />
              <button className="bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 shrink-0 ml-2 shadow-sm">
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="mt-3 font-label-sm text-[11px] text-secondary text-center max-w-[768px]">
            AI can make mistakes. Consider verifying important academic information.
          </p>
        </div>
      </main>
    </div>
  );
}
