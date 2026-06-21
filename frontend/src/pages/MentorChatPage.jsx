import { useState, useEffect, useRef } from 'react';
import { GraduationCap, Clock, FileText, Paperclip, ArrowUp, Plus, BrainCircuit, Trash2, Square, Loader2, Edit2, Check, X, Folder, MessageSquare, Pin, MoreVertical, Sparkles, Calendar, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../store/useChatStore';
import { useStudyPlanStore } from '../store/useStudyPlanStore';
import { useSubjectStore } from '../store/useSubjectStore';
import TypewriterText from '../components/TypewriterText';

export default function MentorChatPage() {
  const [inputText, setInputText] = useState('');
  const { 
    sessions, 
    activeSession, 
    activeMessages, 
    isSending, 
    error,
    fetchSessions, 
    createSession, 
    setActiveSession, 
    sendMessage,
    deleteSession,
    cancelGeneration,
    renameSession
  } = useChatStore();

  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  const { generatePlan, isLoading: isGeneratingPlan } = useStudyPlanStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isSending]);

  useEffect(() => {
    fetchSessions();
    if (subjects.length === 0) fetchSubjects();
    setActiveSession(null);
  }, [fetchSessions, fetchSubjects, subjects.length, setActiveSession]);

  const handleSend = async (forcedText, forcedSubjectId = null) => {
    const textToSend = forcedText || inputText.trim();
    if (!textToSend) return;
    
    setInputText('');

    if (!activeSession) {
      const subjectId = forcedSubjectId || (selectedSubject ? selectedSubject._id : null);
      await createSession({
        title: textToSend.substring(0, 30) + (textToSend.length > 30 ? '...' : ''),
        type: subjectId ? 'SUBJECT' : 'GLOBAL',
        subjectId: subjectId
      });
      await sendMessage(textToSend);
    } else {
      await sendMessage(textToSend);
    }
  };

  const handleGeneratePlan = async () => {
    if (!selectedSubject) {
      alert("Please select a specific Subject from the sidebar first to generate its study plan.");
      return;
    }

    try {
      const subjectIds = [selectedSubject._id];
      const promptText = `Create a study schedule for finals week based on ${selectedSubject.name}.`;
      
      if (!activeSession) {
        await createSession({
          title: "Study Schedule Planning",
          type: 'SUBJECT',
          subjectId: selectedSubject._id
        });
      }
      
      await sendMessage(promptText);
      const planData = await generatePlan({ subjectIds });
      
    } catch (error) {
      console.error(error);
      alert("Failed to generate study plan");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setActiveSession(null);
    setSelectedSubject(null);
  };

  const handleDeleteChat = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await deleteSession(sessionId);
      setOpenMenuId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (e, session) => {
    e.stopPropagation();
    setEditingSessionId(session._id);
    setEditTitle(session.title);
    setOpenMenuId(null);
  };

  const handleRenameSubmit = async (e, sessionId) => {
    if (e) e.stopPropagation();
    if (!editTitle.trim()) {
      setEditingSessionId(null);
      return;
    }
    try {
      await renameSession(sessionId, editTitle);
      setEditingSessionId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameKeyDown = (e, sessionId) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(e, sessionId);
    } else if (e.key === 'Escape') {
      setEditingSessionId(null);
    }
  };

  return (
    <div className="flex w-full h-full overflow-hidden bg-[#FDFBF7] dark:bg-background">
      {/* Inner Sidebar for Chat History */}
      <aside className="w-[300px] h-full bg-transparent flex flex-col shrink-0 relative z-20 pt-6">
        <div className="px-5 mb-6 shrink-0">
          <button 
            onClick={handleNewChat}
            className="w-full bg-[#D97706] dark:bg-primary hover:bg-[#B45309] dark:hover:bg-primary/90 text-white dark:text-on-primary font-bold text-[14px] py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 flex flex-col gap-1 pb-6">
          {subjects.length > 0 && (
            <div className="mb-6">
              <div className="px-3 flex items-center gap-2 mb-3">
                <Pin className="w-4 h-4 text-[#D97706] dark:text-primary" />
                <span className="font-bold text-[11px] text-[#D97706] dark:text-primary uppercase tracking-widest">Pinned Subjects</span>
              </div>
              <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                {subjects.map(subject => (
                  <div
                    key={subject._id}
                    onClick={() => {
                      setActiveSession(null);
                      setSelectedSubject(subject);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between cursor-pointer group ${selectedSubject?._id === subject._id && !activeSession ? 'bg-white dark:bg-surface-container-lowest border border-[#D97706]/20 dark:border-primary/20 shadow-sm' : 'border border-transparent hover:bg-white/50 dark:hover:bg-surface-container-lowest'}`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Folder className={`w-4 h-4 shrink-0 ${selectedSubject?._id === subject._id && !activeSession ? 'text-[#D97706] dark:text-primary fill-[#FFF5E6] dark:fill-primary-container/30' : 'text-secondary/70'}`} />
                      <span className={`font-semibold text-[13px] truncate ${selectedSubject?._id === subject._id && !activeSession ? 'text-on-surface' : 'text-secondary group-hover:text-on-surface transition-colors'}`}>
                        {subject.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="px-3 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#D97706] dark:text-primary" />
                <span className="font-bold text-[11px] text-[#D97706] dark:text-primary uppercase tracking-widest">Your Conversations</span>
              </div>
              <button 
                className="text-[#D97706] dark:text-primary text-[10px] font-bold hover:underline"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all global conversations?')) {
                    const globalSessions = sessions.filter(s => s.type === 'GLOBAL' || !s.subject);
                    globalSessions.forEach(s => deleteSession(s._id));
                  }
                }}
              >
                Clear all
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              {sessions.filter(s => s.type === 'GLOBAL' || !s.subject).map((session) => (
                <div 
                  key={session._id}
                  onClick={() => {
                    if (editingSessionId !== session._id) {
                      setActiveSession(session);
                      setSelectedSubject(null);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-start justify-between group cursor-pointer relative ${activeSession?._id === session._id ? 'bg-[#FFF5E6] dark:bg-primary-container/20 border border-[#FFE8CC] dark:border-primary/20 shadow-sm' : 'bg-white dark:bg-surface-container-lowest border border-outline-variant/30 hover:border-outline-variant/50'}`}
                >
                  {editingSessionId === session._id ? (
                    <div className="flex flex-col gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => handleRenameKeyDown(e, session._id)}
                        className="w-full bg-surface border border-[#D97706] dark:border-primary rounded px-2 py-1 text-[13px] font-semibold text-on-surface focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={(e) => handleRenameSubmit(e, session._id)} className="px-2 py-1 bg-[#D97706] text-white rounded text-[11px] font-bold">Save</button>
                        <button onClick={() => setEditingSessionId(null)} className="px-2 py-1 bg-surface-variant text-on-surface rounded text-[11px] font-bold">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-1 overflow-hidden pr-6">
                        <span className={`font-semibold text-[13px] truncate transition-colors ${activeSession?._id === session._id ? 'text-[#D97706] dark:text-primary' : 'text-on-surface'}`}>
                          {session.title}
                        </span>
                        <span className="font-medium text-[11px] text-secondary/60">
                          {new Date(session.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleEditClick(e, session)}
                          className="p-1.5 text-secondary hover:text-[#D97706] dark:hover:text-primary rounded-md hover:bg-[#FFF5E6] dark:hover:bg-primary-container/30 transition-colors"
                          title="Rename"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteChat(e, session._id)}
                          className="p-1.5 text-secondary hover:text-error rounded-md hover:bg-error/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full w-full relative z-10">
        <div className="flex-1 flex flex-col items-center px-8 overflow-y-auto pb-[180px] relative">
          
          {/* Glowing background blob for empty state */}
          {(!activeSession && !selectedSubject) && (
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FFE8CC] dark:bg-primary-container/20 rounded-full blur-[100px] opacity-60 pointer-events-none -z-10" />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSession?._id || selectedSubject?._id || 'empty'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center h-full"
            >
              {activeSession ? (
                <div className="max-w-[800px] w-full flex flex-col gap-8 pt-10 pb-8 h-full">
                  {activeMessages.map((msg) => (
                    <div key={msg._id} className={`flex ${msg.role === 'user' ? 'flex-col gap-1 self-end max-w-[80%]' : 'gap-5 self-start w-full'}`}>
                      {msg.role === 'ai' && (
                        <div className="w-10 h-10 rounded-xl bg-[#FFF5E6] dark:bg-primary-container/30 text-[#D97706] dark:text-primary flex items-center justify-center shrink-0 border border-[#FFE8CC] dark:border-primary/20 shadow-sm">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                      )}
                      <div className={`rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-[#D97706] dark:bg-primary text-white dark:text-on-primary px-5 py-3.5 ml-auto font-medium rounded-tr-sm' : 'bg-white dark:bg-surface-container-lowest text-on-surface px-6 py-5 w-full max-w-[calc(100%-3rem)] border border-outline-variant/30 rounded-tl-sm'}`}>
                        <p className={`text-[15px] leading-[1.6] whitespace-pre-wrap ${msg.role === 'ai' ? 'text-on-surface font-body-lg' : 'text-white dark:text-on-primary font-body-md'}`}>
                          {msg.role === 'ai' && msg.isNew ? (
                            <TypewriterText text={msg.content} isNew={true} speed={15} />
                          ) : (
                            msg.content
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isSending && (
                    <div className="flex gap-5 self-start w-full">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF5E6] dark:bg-primary-container/30 text-[#D97706] dark:text-primary flex items-center justify-center shrink-0 border border-[#FFE8CC] dark:border-primary/20 shadow-sm">
                        <GraduationCap className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="bg-white dark:bg-surface-container-lowest border border-outline-variant/30 rounded-2xl rounded-tl-sm px-6 py-5 w-fit shadow-sm flex items-center h-[58px]">
                        <div className="flex gap-2 items-center">
                          <span className="w-2 h-2 rounded-full bg-[#D97706]/60 dark:bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[#D97706]/60 dark:bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[#D97706]/60 dark:bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl text-[14px] font-medium flex items-center gap-2">
                      <X className="w-4 h-4" /> {error}
                    </div>
                  )}

                  <div ref={messagesEndRef} className="h-4" />
                </div>
              ) : selectedSubject ? (
                <div className="flex flex-col h-full w-full max-w-[800px] mx-auto pt-10">
                  <div className="flex items-center gap-5 mb-10 pb-8 border-b border-outline-variant/30">
                    <div className="w-16 h-16 rounded-[20px] bg-white dark:bg-surface-container-lowest text-[#D97706] dark:text-primary flex items-center justify-center border border-outline-variant/30 shadow-md relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#D97706]/5 dark:bg-primary/10"></div>
                      <Folder className="w-8 h-8 fill-current opacity-20 absolute" />
                      <Folder className="w-8 h-8 relative z-10" />
                    </div>
                    <div>
                      <h2 className="text-[32px] font-bold text-on-surface tracking-tight leading-tight">{selectedSubject.name}</h2>
                      <p className="text-secondary font-medium text-[15px] mt-1">Subject Workspace Chats</p>
                    </div>
                  </div>

                  <h3 className="font-bold text-[12px] mb-4 text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Previous Discussions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sessions.filter(session => session.subject === selectedSubject._id).map(session => (
                      <div 
                        key={session._id} 
                        onClick={() => {
                           setActiveSession(session);
                        }}
                        className="bg-white dark:bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 cursor-pointer hover:border-[#D97706]/40 dark:hover:border-primary/40 hover:shadow-md transition-all flex flex-col gap-3 group relative"
                      >
                        <div className="flex items-start justify-between w-full gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] dark:bg-surface-variant flex items-center justify-center shrink-0 border border-outline-variant/30 group-hover:bg-[#FFF5E6] dark:group-hover:bg-primary-container/20 group-hover:border-[#FFE8CC] dark:group-hover:border-primary/20 transition-colors">
                            <MessageSquare className="w-5 h-5 text-secondary group-hover:text-[#D97706] dark:group-hover:text-primary transition-colors" />
                          </div>
                          
                          <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleEditClick(e, session)}
                              className="p-1.5 text-secondary hover:text-[#D97706] dark:hover:text-primary rounded-lg hover:bg-[#FFF5E6] dark:hover:bg-primary-container/30 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteChat(e, session._id)}
                              className="p-1.5 text-secondary hover:text-error rounded-lg hover:bg-error/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {editingSessionId === session._id ? (
                          <div className="flex flex-col gap-2 w-full mt-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              autoFocus
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => handleRenameKeyDown(e, session._id)}
                              className="w-full bg-surface border border-[#D97706] dark:border-primary rounded px-3 py-2 text-[14px] font-semibold text-on-surface focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <button onClick={(e) => handleRenameSubmit(e, session._id)} className="px-3 py-1.5 bg-[#D97706] text-white rounded-lg text-[12px] font-bold">Save</button>
                              <button onClick={() => setEditingSessionId(null)} className="px-3 py-1.5 bg-surface-variant text-on-surface rounded-lg text-[12px] font-bold">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 min-w-0 mt-1">
                             <div className="font-bold text-[15px] text-on-surface line-clamp-2 leading-snug mb-1 group-hover:text-[#D97706] dark:group-hover:text-primary transition-colors pr-12">{session.title}</div>
                             <div className="font-medium text-[12px] text-secondary">{new Date(session.updatedAt).toLocaleDateString()}</div>
                          </div>
                        )}
                      </div>
                    ))}
                    {sessions.filter(session => session.subject === selectedSubject._id).length === 0 && (
                      <div className="col-span-2 flex flex-col items-center justify-center py-16 bg-white/50 dark:bg-surface-variant/10 rounded-3xl border border-dashed border-outline-variant/50">
                        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
                          <MessageSquare className="w-8 h-8 text-secondary/40" />
                        </div>
                        <p className="text-secondary font-medium text-[15px]">No discussions found for this subject.</p>
                        <p className="text-secondary/60 text-[13px] mt-1">Start a new chat below!</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center max-w-[800px] w-full mt-16 relative">
                  {/* Floating sparkles */}
                  <div className="absolute top-[10%] left-[20%] text-[#FCD34D] animate-pulse">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="absolute top-[5%] right-[25%] text-[#FCD34D] animate-pulse delay-300">
                    <Sparkles className="w-6 h-6" />
                  </div>

                  {/* Main Logo Container */}
                  <div className="w-24 h-24 rounded-[28px] bg-[#FFF5E6] dark:bg-primary-container/30 flex items-center justify-center mb-8 shadow-[0_0_40px_-10px_rgba(217,119,6,0.3)] border border-[#FFE8CC] dark:border-primary/20 relative">
                    <GraduationCap className="text-[#D97706] dark:text-primary w-12 h-12" />
                  </div>
                  
                  <h2 className="text-[42px] leading-tight font-bold text-on-surface mb-3 tracking-tight text-center">Semester Mentor</h2>
                  <p className="text-[16px] text-secondary font-medium max-w-[500px] text-center mb-12">
                    Ask anything about your semester, subjects, modules, or study plans.
                  </p>

                  {/* Quick Start Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    {/* Card 1 */}
                    <button 
                      onClick={handleGeneratePlan}
                      disabled={isGeneratingPlan}
                      className="text-left bg-white dark:bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 hover:border-[#D97706]/30 dark:hover:border-primary/30 transition-all duration-300 group disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#FFF5E6] dark:bg-[#D97706]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Calendar className="text-[#D97706] w-5 h-5" />
                        </div>
                        <span className="font-bold text-[12px] text-[#D97706] uppercase tracking-widest">
                          {isGeneratingPlan ? 'Planning...' : 'Planning'}
                        </span>
                      </div>
                      <p className="font-medium text-[15px] text-on-surface leading-relaxed pr-4">
                        Create a study schedule for finals week based on my subjects.
                      </p>
                    </button>
                    
                    {/* Card 2 */}
                    <button 
                      onClick={() => handleSend("Help me brainstorm an outline for my research paper.")}
                      className="text-left bg-white dark:bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 hover:border-[#9333EA]/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#F3E8FF] dark:bg-[#9333EA]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <FileText className="text-[#9333EA] dark:text-[#c084fc] w-5 h-5" />
                        </div>
                        <span className="font-bold text-[12px] text-[#9333EA] dark:text-[#c084fc] uppercase tracking-widest">
                          Writing
                        </span>
                      </div>
                      <p className="font-medium text-[15px] text-on-surface leading-relaxed pr-4">
                        Help me brainstorm an outline for my research paper.
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#FDFBF7] dark:from-background via-[#FDFBF7] dark:via-background to-transparent pt-12 pb-6 px-8 flex flex-col items-center z-30 pointer-events-none">
          <div className="w-full max-w-[800px] relative bg-white dark:bg-surface-container-lowest border border-outline-variant/40 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] focus-within:border-[#D97706] dark:focus-within:border-primary focus-within:shadow-[0_8px_30px_rgba(217,119,6,0.1)] transition-all duration-300 pointer-events-auto overflow-hidden">
            <div className="flex items-center px-2 py-2 min-h-[64px]">
              <button className="text-secondary/70 hover:text-on-surface w-12 h-12 flex items-center justify-center transition-colors rounded-full hover:bg-surface-container shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                }}
                disabled={isSending}
                className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface font-medium text-[15px] px-2 py-3 placeholder:text-secondary-fixed-dim outline-none resize-none custom-scrollbar my-auto h-auto" 
                placeholder={activeSession ? "Message Mentor..." : "Ask anything..."} 
                rows={1}
                style={{ maxHeight: '200px' }}
              />
              {isSending ? (
                <button 
                  onClick={cancelGeneration}
                  className="w-12 h-12 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high transition-colors ml-2 group shrink-0"
                  title="Stop Generating"
                >
                  <Square className="w-4 h-4 fill-current hidden group-hover:block" />
                  <Loader2 className="w-5 h-5 animate-spin text-primary group-hover:hidden" />
                </button>
              ) : (
                <button 
                  onClick={() => handleSend()}
                  disabled={!inputText.trim()}
                  className="bg-[#D97706] dark:bg-primary hover:bg-[#B45309] dark:hover:bg-primary/90 disabled:opacity-50 text-white dark:text-on-primary w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ml-2 disabled:shadow-none shadow-sm"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 pointer-events-auto text-secondary/70">
            <ShieldCheck className="w-3.5 h-3.5" />
            <p className="font-medium text-[11px] tracking-wide">
              AI can make mistakes. Consider verifying important academic information.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
