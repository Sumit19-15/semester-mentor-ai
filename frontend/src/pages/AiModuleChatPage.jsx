import { useState } from 'react';
import { Folder, Plus, Share2, MoreVertical, BrainCircuit, Copy, ThumbsUp, Paperclip, Library, ArrowUp, ChevronDown, ChevronRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function AiModuleChatPage() {
  const [expandedModule, setExpandedModule] = useState('Data Structures Final');

  const modules = [
    {
      name: 'Data Structures Final',
      recent: [
        { title: 'Graph Algorithm Options', time: 'Today, 10:42 AM' },
        { title: 'Big O Notation Review', time: 'Yesterday, 3:15 PM' },
        { title: 'Dijkstra vs A* Pathfinding', time: 'Oct 24, 2023' }
      ]
    },
    {
      name: 'Algorithm Analysis Paper',
      recent: [
        { title: 'Sorting Algorithms Comparison', time: '2 days ago' },
        { title: 'Dynamic Programming approach', time: 'Last week' }
      ]
    },
    {
      name: 'Usability Study Results',
      recent: [
        { title: 'A/B Testing Analysis', time: 'Oct 15, 2023' }
      ]
    }
  ];
  const [activeModule, setActiveModule] = useState(modules[0]);

  const handleModuleClick = (mod) => {
    setActiveModule(mod);
    setExpandedModule(expandedModule === mod.name ? null : mod.name);
  };

  return (
    <DashboardLayout>
      <div className="flex w-full h-full overflow-hidden">
        {/* Inner Sidebar for Module Navigation */}
        <aside className="w-[280px] h-full bg-surface border-r border-outline-variant flex flex-col shrink-0 relative z-20">
          <div className="p-4 border-b border-outline-variant/50 shrink-0 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-secondary">
              <Folder className="w-[18px] h-[18px]" />
              <span className="font-label-sm text-[11px] font-semibold uppercase tracking-wider">Module</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-bold text-on-surface leading-tight">
              {activeModule.name}
            </h3>
            <button className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-md text-[14px] py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors duration-150 shadow-sm font-semibold mt-1">
              <Plus className="w-4 h-4" />
              New Conversation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
            <div className="px-3 py-2 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mt-2 mb-1 font-semibold">All Modules</div>
            
            {modules.map((mod) => (
              <div key={mod.name} className="flex flex-col gap-1">
                <button 
                  onClick={() => handleModuleClick(mod)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group ${expandedModule === mod.name ? 'bg-surface-container-high' : 'hover:bg-surface-container'}`}
                >
                  <span className={`font-label-md text-[14px] font-semibold truncate transition-colors ${expandedModule === mod.name ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>{mod.name}</span>
                  {expandedModule === mod.name ? (
                    <ChevronDown className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-secondary group-hover:text-primary shrink-0" />
                  )}
                </button>
                
                {expandedModule === mod.name && (
                  <div className="flex flex-col gap-1 pl-4 pb-2">
                    {mod.recent.map((chat, idx) => (
                      <button key={idx} className={`w-full text-left p-2.5 rounded-lg border flex flex-col gap-1 hover:bg-surface-container transition-colors group ${mod.name === 'Data Structures Final' && idx === 0 ? 'bg-surface-variant border-outline-variant/50' : 'border-transparent'}`}>
                        <span className="font-label-md text-[13px] text-on-surface font-medium truncate group-hover:text-primary transition-colors">{chat.title}</span>
                        <span className="font-label-sm text-[10px] text-on-surface-variant">{chat.time}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <hr className="my-4 border-outline-variant/50 mx-2" />
            <div className="px-3 py-2 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">History Chats</div>
            <div className="flex flex-col gap-1">
              <button className="w-full text-left p-2.5 rounded-lg border border-transparent hover:bg-surface-container transition-colors flex flex-col gap-1 group">
                <span className="font-label-md text-[13px] text-on-surface font-medium truncate group-hover:text-primary transition-colors">Structuring the final report</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant">Oct 21, 2023</span>
              </button>
              <button className="w-full text-left p-2.5 rounded-lg border border-transparent hover:bg-surface-container transition-colors flex flex-col gap-1 group">
                <span className="font-label-md text-[13px] text-on-surface font-medium truncate group-hover:text-primary transition-colors">Finding valid datasets</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant">Oct 20, 2023</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 h-full flex flex-col bg-background relative">
          <header className="h-[56px] px-6 border-b border-outline-variant/30 flex items-center justify-between shrink-0 bg-surface/50 backdrop-blur-sm z-10 absolute top-0 w-full">
            <div className="flex items-center gap-2">
              <h3 className="font-body-lg text-[16px] text-on-surface font-semibold">Graph Algorithm Options</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-variant transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-variant transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar pt-[72px] pb-[160px] px-6">
            <div className="max-w-[720px] mx-auto w-full flex flex-col gap-8">
              
              {/* User Message */}
              <div className="flex flex-col gap-1 self-end max-w-[85%] group">
                <div className="bg-surface-container text-on-surface p-4 rounded-xl rounded-tr-sm border border-outline-variant/20 shadow-sm">
                  <p className="font-body-md text-[14px] leading-relaxed">I need to implement a graph search algorithm for the final module. We are simulating traffic routing across a city grid. What are the core differences I should consider between Dijkstra's and A*?</p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex gap-4 self-start max-w-[90%]">
                <div className="w-8 h-8 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center shrink-0 mt-1 border border-primary/20">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="bg-surface-container-lowest border border-outline-variant text-on-surface p-5 rounded-xl rounded-tl-sm shadow-sm">
                    <p className="font-body-md text-[14px] leading-relaxed mb-4">Both algorithms are excellent choices for pathfinding, but they serve slightly different use cases. Here is a structural breakdown:</p>
                    <h4 className="font-label-md text-[14px] font-bold mb-2">Dijkstra's Algorithm</h4>
                    <ul className="list-disc pl-5 mb-4 font-body-md text-[14px] leading-relaxed text-secondary space-y-1">
                      <li><strong>Mechanism:</strong> Explores all possible paths equally in all directions until it finds the target. It guarantees the shortest path.</li>
                      <li><strong>Best for:</strong> Scenarios where you don't know exactly where the target is, or if there are multiple targets.</li>
                      <li><strong>Drawback:</strong> It can be computationally expensive (slow) because it searches exhaustively, which might be an issue for a massive city grid.</li>
                    </ul>
                    <h4 className="font-label-md text-[14px] font-bold mb-2">A* (A-Star) Search</h4>
                    <ul className="list-disc pl-5 font-body-md text-[14px] leading-relaxed text-secondary space-y-1">
                      <li><strong>Mechanism:</strong> Uses a <em>heuristic</em> (an educated guess, like a straight-line distance to the goal) to guide the search towards the target, prioritizing paths that seem closer.</li>
                      <li><strong>Best for:</strong> Point-A to Point-B routing where the exact destination coordinates are known (like traffic routing).</li>
                      <li><strong>Advantage:</strong> Significantly faster than Dijkstra's in most practical grid layouts because it avoids exploring obvious wrong directions.</li>
                    </ul>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-surface-variant transition-colors" title="Copy">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-surface-variant transition-colors" title="Good response">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* User Message */}
              <div className="flex flex-col gap-1 self-end max-w-[85%] group">
                <div className="bg-surface-container text-on-surface p-4 rounded-xl rounded-tr-sm border border-outline-variant/20 shadow-sm">
                  <p className="font-body-md text-[14px] leading-relaxed">Okay, since it's traffic routing from specific starting points to specific destinations, A* sounds significantly better for performance. How should I define the heuristic for a standard 2D grid city layout?</p>
                </div>
              </div>

              {/* AI Loading State */}
              <div className="flex gap-4 self-start max-w-[90%]">
                <div className="w-8 h-8 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center shrink-0 mt-1 border border-primary/20">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="bg-surface-container-lowest border border-outline-variant text-on-surface p-4 rounded-xl rounded-tl-sm shadow-sm flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <p className="font-body-md text-[14px] text-secondary">Analyzing grid heuristics...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input Area */}
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-6 pb-4 px-6">
            <div className="max-w-[720px] mx-auto w-full relative">
              
              {/* Suggestions */}
              <div className="absolute -top-10 left-0 flex gap-2">
                <button className="bg-surface-container-lowest border border-outline-variant text-secondary font-label-sm text-[12px] font-semibold px-4 py-1.5 rounded-full hover:bg-surface-variant hover:text-on-surface transition-colors shadow-sm">
                  Suggest Manhattan Distance
                </button>
                <button className="bg-surface-container-lowest border border-outline-variant text-secondary font-label-sm text-[12px] font-semibold px-4 py-1.5 rounded-full hover:bg-surface-variant hover:text-on-surface transition-colors shadow-sm">
                  Explain Heuristic Admissibility
                </button>
              </div>

              {/* Input Box */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all duration-200 flex flex-col relative overflow-hidden">
                <textarea 
                  className="w-full bg-transparent border-none resize-none font-body-md text-[14px] text-on-surface placeholder:text-secondary focus:ring-0 px-4 py-4 max-h-[200px] overflow-y-auto custom-scrollbar" 
                  placeholder="Message Semester Mentor..." 
                  rows={1}
                ></textarea>
                <div className="flex items-center justify-between px-3 py-2 border-t border-outline-variant/30 bg-surface">
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-surface-container transition-colors" title="Attach file">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-surface-container transition-colors" title="Reference Notes">
                      <Library className="w-5 h-5" />
                    </button>
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm">
                    <ArrowUp className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="font-label-sm text-[10px] text-secondary">AI can make mistakes. Verify important academic information.</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
