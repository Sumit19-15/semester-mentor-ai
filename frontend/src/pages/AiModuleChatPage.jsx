import { useState, useEffect } from 'react';
import { Folder, Plus, Share2, MoreVertical, BrainCircuit, Copy, ThumbsUp, Paperclip, Library, ArrowUp, ChevronDown, ChevronRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useSubjectStore } from '../store/useSubjectStore';
import { useChatStore } from '../store/useChatStore';

export default function AiModuleChatPage() {
  const { activeSubject, subjects, fetchSubjects, fetchTopicsForSubject } = useSubjectStore();
  const { 
    sessions, 
    activeSession, 
    activeMessages, 
    isSending, 
    fetchSessions, 
    createSession, 
    setActiveSession, 
    sendMessage 
  } = useChatStore();

  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [inputText, setInputText] = useState('');

  // Fetch subjects if none exist
  useEffect(() => {
    if (subjects.length === 0) {
      fetchSubjects();
    }
  }, [subjects.length, fetchSubjects]);

  // Fetch topics for the active subject if they are missing
  useEffect(() => {
    if (activeSubject && !activeSubject.topics) {
      fetchTopicsForSubject(activeSubject._id);
    }
  }, [activeSubject, fetchTopicsForSubject]);

  // Whenever the active topic changes, fetch its sessions
  useEffect(() => {
    if (activeTopic && activeSubject) {
      fetchSessions({ type: 'MODULE', subjectId: activeSubject._id, topicId: activeTopic._id });
      setActiveSession(null);
    }
  }, [activeTopic, activeSubject, fetchSessions, setActiveSession]);

  const handleTopicClick = (topic) => {
    setActiveTopic(topic);
    setExpandedTopicId(expandedTopicId === topic._id ? null : topic._id);
  };

  const handleChatClick = (session) => {
    setActiveSession(session);
  };

  const handleNewConversation = () => {
    setActiveSession(null);
  };

  const handleSend = async () => {
    if (!inputText.trim() || !activeTopic || !activeSubject) return;
    const text = inputText.trim();
    setInputText('');

    if (!activeSession) {
      // Create new session
      await createSession({
        title: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
        type: 'MODULE',
        subjectId: activeSubject._id,
        topicId: activeTopic._id
      });
      await sendMessage(text);
    } else {
      await sendMessage(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeSubject) {
    return (
      <DashboardLayout>
        <div className="flex w-full h-full items-center justify-center">
          <span className="text-secondary">Please select a subject from the Dashboard first.</span>
        </div>
      </DashboardLayout>
    );
  }

  const topics = activeSubject.topics || [];

  return (
    <DashboardLayout>
      <div className="flex w-full h-full overflow-hidden">
        {/* Inner Sidebar for Module Navigation */}
        <aside className="w-[280px] h-full bg-surface border-r border-outline-variant flex flex-col shrink-0 relative z-20">
          <div className="p-4 border-b border-outline-variant/50 shrink-0 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-secondary">
              <Folder className="w-[18px] h-[18px]" />
              <span className="font-label-sm text-[11px] font-semibold uppercase tracking-wider">Subject Workspace</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-bold text-on-surface leading-tight">
              {activeSubject.name}
            </h3>
            <button 
              onClick={handleNewConversation}
              disabled={!activeTopic}
              className="w-full bg-primary hover:bg-primary/90 text-on-primary disabled:opacity-50 font-label-md text-[14px] py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors duration-150 shadow-sm font-semibold mt-1"
            >
              <Plus className="w-4 h-4" />
              New Conversation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
            <div className="px-3 py-2 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider mt-2 mb-1 font-semibold">Topics (Modules)</div>

            {topics.length === 0 ? (
              <p className="px-3 text-secondary text-[12px]">No topics found.</p>
            ) : (
              topics.map((topic) => (
                <div key={topic._id} className="flex flex-col gap-1">
                  <button
                    onClick={() => handleTopicClick(topic)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group ${activeTopic?._id === topic._id ? 'bg-surface-container-high' : 'hover:bg-surface-container'}`}
                  >
                    <span className={`font-label-md text-[14px] font-semibold truncate transition-colors ${activeTopic?._id === topic._id ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>{topic.title}</span>
                    {expandedTopicId === topic._id ? (
                      <ChevronDown className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-secondary group-hover:text-primary shrink-0" />
                    )}
                  </button>

                  {/* Show sessions if this topic is expanded */}
                  {expandedTopicId === topic._id && (
                    <div className="flex flex-col gap-1 pl-4 pb-2">
                      {sessions.length === 0 ? (
                        <span className="text-[11px] text-secondary px-2">No chats yet</span>
                      ) : (
                        sessions.map((session) => (
                          <button
                            key={session._id}
                            onClick={() => handleChatClick(session)}
                            className={`w-full text-left p-2.5 rounded-lg border flex flex-col gap-1 hover:bg-surface-container transition-colors group ${activeSession?._id === session._id ? 'bg-surface-variant border-outline-variant/50' : 'border-transparent'}`}
                          >
                            <span className="font-label-md text-[13px] text-on-surface font-medium truncate group-hover:text-primary transition-colors">{session.title}</span>
                            <span className="font-label-sm text-[10px] text-on-surface-variant">{new Date(session.updatedAt).toLocaleDateString()}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 h-full flex flex-col bg-background relative">
          <header className="h-[56px] px-6 border-b border-outline-variant/30 flex items-center justify-between shrink-0 bg-surface/50 backdrop-blur-sm z-10 absolute top-0 w-full">
            <div className="flex items-center gap-2">
              <h3 className="font-body-lg text-[16px] text-on-surface font-semibold">
                {activeSession ? activeSession.title : (activeTopic ? `New chat about ${activeTopic.title}` : 'Select a topic to start')}
              </h3>
            </div>
            {activeSession && (
              <div className="flex items-center gap-2">
                <button className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-variant transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-variant transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            )}
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar pt-[72px] pb-[160px] px-6">
            {!activeSession || activeMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full max-w-[600px] mx-auto text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center mb-stack_md shadow-sm border border-outline-variant/30">
                  <BrainCircuit className="text-[32px] w-8 h-8 text-on-primary-container" />
                </div>
                <h2 className="font-display-lg text-[24px] font-bold text-on-surface mb-2">Module Mentor</h2>
                <p className="font-body-lg text-[16px] text-secondary mb-8">
                  I'm your dedicated AI tutor for the {activeSubject.name} course. Ask me anything about {activeTopic ? activeTopic.title : 'this module'}.
                </p>
                {activeTopic && (
                  <div className="flex gap-2">
                     <button onClick={() => setInputText(`Can you explain the core concepts of ${activeTopic.title}?`)} className="bg-surface-container-lowest border border-outline-variant text-secondary font-label-sm text-[12px] font-semibold px-4 py-1.5 rounded-full hover:bg-surface-variant hover:text-on-surface transition-colors shadow-sm">
                        Explain core concepts
                     </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-[720px] mx-auto w-full flex flex-col gap-8">
                {activeMessages.map((msg) => (
                  <div key={msg._id} className={`flex ${msg.role === 'user' ? 'flex-col gap-1 self-end max-w-[85%]' : 'gap-4 self-start max-w-[90%]'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center shrink-0 mt-1 border border-primary/20">
                        <BrainCircuit className="w-5 h-5" />
                      </div>
                    )}
                    <div className={`p-4 rounded-xl shadow-sm ${msg.role === 'user' ? 'bg-surface-container text-on-surface rounded-tr-sm border border-outline-variant/20' : 'bg-surface-container-lowest border border-outline-variant text-on-surface rounded-tl-sm w-full'}`}>
                      <p className="font-body-md text-[14px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className="flex gap-4 self-start max-w-[90%]">
                    <div className="w-8 h-8 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center shrink-0 mt-1 border border-primary/20">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant text-on-surface p-4 rounded-xl rounded-tl-sm shadow-sm flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <p className="font-body-md text-[14px] text-secondary">Analyzing context...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Input Area */}
          {activeTopic && (
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-6 pb-4 px-6 z-30">
              <div className="max-w-[720px] mx-auto w-full relative">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all duration-200 flex flex-col relative overflow-hidden">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSending}
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
                    <button 
                      onClick={handleSend}
                      disabled={isSending || !inputText.trim()}
                      className="w-8 h-8 rounded-lg bg-primary disabled:opacity-50 text-on-primary flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="font-label-sm text-[10px] text-secondary">AI can make mistakes. Verify important academic information.</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
