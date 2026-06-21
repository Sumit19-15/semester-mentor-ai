import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle2, Hourglass, BookOpen, Calendar, MoreHorizontal, FileText } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-background text-on-background min-h-screen flex flex-col antialiased"
    >
      <main className="flex-grow flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full px-gutter pt-24 pb-16 flex flex-col items-center text-center max-w-[900px] mx-auto mt-16">
          <h1 className="font-display-lg text-[56px] leading-[64px] tracking-tight font-bold mb-6 text-on-surface">
            Your Entire Semester.<br />Unified and AI-Powered.
          </h1>
          <p className="font-body-lg text-body-lg text-secondary mb-10 max-w-[700px]">
            Stop scattering your progress and study plans. Semester Mentor brings your curriculum, modules, and an intelligent dual-mode AI tutor into one clean, desktop workspace.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-primary-container text-on-primary-container font-headline-sm text-headline-sm py-4 px-10 rounded-lg hover:bg-primary hover:text-on-primary transition-colors duration-150 active:scale-95 shadow-[0px_4px_6px_rgba(0,0,0,0.05)] border border-[#c78618] dark:border-primary/50"
          >
            Start for Free
          </button>
        </section>

        {/* App Window Mockup */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="w-full px-gutter mb-32 max-w-[1024px] mx-auto"
        >
          <div className="bg-surface-container-lowest rounded-xl border border-secondary-fixed shadow-[0px_12px_24px_rgba(0,0,0,0.06)] dark:shadow-[0px_12px_24px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col mx-auto">
            <div className="bg-surface-container h-12 border-b border-secondary-fixed flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-error"></div>
              <div className="w-3 h-3 rounded-full bg-primary-container"></div>
              <div className="w-3 h-3 rounded-full bg-tertiary-container"></div>
            </div>
            <div className="p-10 bg-surface-bright flex-grow">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-8">Welcome back, Sumit.</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Subject Card 1 */}
                <div className="bg-surface-container-lowest border border-secondary-fixed rounded-lg p-6 shadow-[0px_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-body-md text-body-md font-semibold text-on-surface">Data Structures &amp; Algorithms</span>
                    <span className="font-label-sm text-label-sm text-secondary">66%</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div className="bg-primary-container h-2 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>
                {/* Subject Card 2 */}
                <div className="bg-surface-container-lowest border border-secondary-fixed rounded-lg p-6 shadow-[0px_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-body-md text-body-md font-semibold text-on-surface">Operating Systems</span>
                    <span className="font-label-sm text-label-sm text-secondary">40%</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div className="bg-primary-container h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                {/* Subject Card 3 */}
                <div className="bg-surface-container-lowest border border-secondary-fixed rounded-lg p-6 shadow-[0px_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-body-md text-body-md font-semibold text-on-surface">Database Management Systems</span>
                    <span className="font-label-sm text-label-sm text-secondary">15%</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div className="bg-primary-container h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <section className="w-full bg-surface py-24 px-gutter border-t border-secondary-fixed">
          <div className="max-w-container_max_width mx-auto flex flex-col gap-24">

            {/* Feature 1: Workspace */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row items-center gap-16"
            >
              <div className="flex-1 order-2 lg:order-1 w-full">
                <div className="bg-surface-container-lowest rounded-xl border border-secondary-fixed shadow-[0px_8px_16px_rgba(0,0,0,0.04)] dark:shadow-[0px_8px_16px_rgba(0,0,0,0.2)] overflow-hidden flex h-[360px]">
                  <div className="w-64 bg-surface-container border-r border-secondary-fixed p-4 flex flex-col gap-2">
                    <div className="font-label-md text-label-md font-semibold text-secondary mb-2 uppercase tracking-wider">Subjects</div>
                    <div className="px-3 py-2 bg-surface-container-lowest rounded border border-secondary-fixed font-body-md font-medium text-on-surface shadow-sm">DSA</div>
                    <div className="px-3 py-2 text-secondary font-body-md hover:bg-surface-container-low rounded cursor-pointer transition-colors">OS</div>
                    <div className="px-3 py-2 text-secondary font-body-md hover:bg-surface-container-low rounded cursor-pointer transition-colors">DBMS</div>
                  </div>
                  <div className="flex-1 p-8 bg-surface-bright flex flex-col justify-center">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface mb-6 border-b border-secondary-fixed pb-2">DSA Modules</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <CheckCircle2 className="w-5 h-5 text-primary-container shrink-0" />
                        <span className="font-body-md text-body-md text-secondary line-through">Intro to Pointers</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <CheckCircle2 className="w-5 h-5 text-primary-container shrink-0" />
                        <span className="font-body-md text-body-md text-secondary line-through">Linked Lists</span>
                      </div>
                      <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded -mx-2 border border-secondary-fixed">
                        <Hourglass className="w-5 h-5 text-on-surface shrink-0" />
                        <span className="font-body-md text-body-md text-on-surface font-medium">Trees</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 lg:order-2">
                <h3 className="font-display-lg text-[32px] leading-[40px] font-bold text-on-surface mb-4">The Subject Workspace</h3>
                <p className="font-body-lg text-body-lg text-secondary">Track exactly where you stand. Our sidebar-driven workspace keeps your curriculum organized and your progress visible.</p>
              </div>
            </motion.div>

            {/* Feature 2: AI Mentor */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row items-center gap-16"
            >
              <div className="flex-1">
                <h3 className="font-display-lg text-[32px] leading-[40px] font-bold text-on-surface mb-4">Dual-Mode AI Mentor</h3>
                <p className="font-body-lg text-body-lg text-secondary">An AI tutor that knows your pace. Switch between subject-specific deep dives and general study planning seamlessly.</p>
              </div>
              <div className="flex-1 w-full">
                <div className="bg-surface-container-lowest rounded-xl border border-secondary-fixed shadow-[0px_8px_16px_rgba(0,0,0,0.04)] dark:shadow-[0px_8px_16px_rgba(0,0,0,0.2)] overflow-hidden flex h-[360px]">
                  <div className="flex-1 border-r border-secondary-fixed flex flex-col bg-surface-bright">
                    <div className="p-4 border-b border-secondary-fixed bg-surface-container font-label-md font-semibold text-on-surface flex items-center gap-2">
                      <BookOpen className="w-[18px] h-[18px]" /> Subject Chat
                    </div>
                    <div className="p-6 flex flex-col justify-end h-full gap-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-bright via-transparent to-transparent z-10 pointer-events-none h-1/2 bottom-0"></div>
                      <div className="flex justify-end relative z-20">
                        <div className="bg-surface-container rounded-lg p-3 max-w-[85%] rounded-tr-none border border-secondary-fixed">
                          <p className="font-body-md text-sm text-on-surface">I'm struggling with Trees.</p>
                        </div>
                      </div>
                      <div className="flex justify-start relative z-20">
                        <div className="bg-primary-container/10 dark:bg-primary-container/20 rounded-lg p-3 max-w-[95%] rounded-tl-none border border-primary-container/30">
                          <p className="font-body-md text-sm text-primary dark:text-on-primary-container">I see you've completed 2/5 modules! Since you mastered Linked Lists, let's connect that...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col bg-surface-bright opacity-60 grayscale-[50%]">
                    <div className="p-4 border-b border-secondary-fixed bg-surface-container font-label-md font-semibold text-secondary flex items-center gap-2">
                      <Calendar className="w-[18px] h-[18px]" /> General Chat
                    </div>
                    <div className="p-6 flex flex-col justify-end h-full gap-4">
                      <div className="flex justify-end">
                        <div className="bg-surface-container rounded-lg p-3 max-w-[85%] rounded-tr-none border border-secondary-fixed">
                          <p className="font-body-md text-sm text-secondary">Build a study plan for finals.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Academic Vault */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row items-center gap-16"
            >
              <div className="flex-1 order-2 lg:order-1 w-full">
                <div className="bg-surface-container-lowest rounded-xl border border-secondary-fixed shadow-[0px_8px_16px_rgba(0,0,0,0.04)] dark:shadow-[0px_8px_16px_rgba(0,0,0,0.2)] overflow-hidden h-[360px] flex flex-col">
                  <div className="p-6 border-b border-secondary-fixed bg-surface-bright">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-headline-sm text-headline-sm text-on-surface">Operating Systems Vault</h4>
                      <button className="text-secondary hover:text-on-surface">
                        <MoreHorizontal className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest flex-1 p-6">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-secondary-fixed">
                          <th className="pb-3 font-label-md font-medium text-secondary w-[60%]">File Name</th>
                          <th className="pb-3 font-label-md font-medium text-secondary">Date Added</th>
                          <th className="pb-3 font-label-md font-medium text-secondary text-right">Size</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-secondary-container hover:bg-surface-container-low transition-colors group cursor-pointer">
                          <td className="py-4 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-secondary group-hover:text-primary-container transition-colors shrink-0" />
                            <span className="font-body-md text-on-surface">Unit_3_Notes.pdf</span>
                          </td>
                          <td className="py-4 font-body-md text-secondary">Oct 12, 2025</td>
                          <td className="py-4 font-body-md text-secondary text-right">2.4 MB</td>
                        </tr>
                        <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                          <td className="py-4 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-secondary group-hover:text-primary-container transition-colors shrink-0" />
                            <span className="font-body-md text-on-surface">2023_Midterm_PYQ.pdf</span>
                          </td>
                          <td className="py-4 font-body-md text-secondary">Oct 05, 2025</td>
                          <td className="py-4 font-body-md text-secondary text-right">1.1 MB</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 lg:order-2">
                <h3 className="font-display-lg text-[32px] leading-[40px] font-bold text-on-surface mb-4">Your Academic Vault</h3>
                <p className="font-body-lg text-body-lg text-secondary">Store your resources, notes, and PYQs in an organized, easily accessible table list.</p>
              </div>
            </motion.div>

          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
}
