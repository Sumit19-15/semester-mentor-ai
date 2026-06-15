import { Link } from 'react-router-dom';
import MarketingNavBar from '../components/MarketingNavBar';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
      <MarketingNavBar />
      
      <main className="flex-grow pt-[120px] pb-stack_lg px-gutter max-w-container_max_width mx-auto w-full flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section className="text-center w-full max-w-3xl flex flex-col items-center gap-stack_lg mb-[80px]">
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-tight">
            Organize your semester.<br/>
            <span className="text-primary">Study smarter.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto">
            A rigorous, distraction-free academic workspace designed for serious students. Track subjects, manage projects, and maintain control over your entire semester.
          </p>
          <div className="flex items-center justify-center gap-stack_md mt-stack_sm">
            <Link
              to="/register"
              className="bg-primary-container text-on-primary-container font-label-md text-label-md px-stack_lg py-stack_sm rounded-lg hover:bg-primary hover:text-on-primary transition-all duration-150 active:scale-95 shadow-sm border border-transparent"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-transparent text-secondary font-label-md text-label-md px-stack_lg py-stack_sm rounded-lg hover:bg-surface-variant hover:text-on-surface transition-all duration-150 active:scale-95"
            >
              Login
            </Link>
          </div>
        </section>

        {/* Product Interface Preview (Bento Style Suggestion) */}
        <div className="w-full relative mb-[120px] rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low shadow-sm aspect-[16/9] group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-variant/20 z-10 pointer-events-none"></div>
          
          {/* Mock UI Elements to suggest the app's look */}
          <div className="w-full h-full p-stack_md flex gap-stack_md relative z-0">
            {/* Mock Sidebar */}
            <div className="w-[200px] h-full bg-surface rounded-lg border border-outline-variant/50 hidden md:flex flex-col gap-stack_sm p-stack_sm opacity-80 transition-opacity group-hover:opacity-100">
              <div className="h-8 bg-surface-variant rounded mb-4"></div>
              <div className="h-6 bg-surface-variant/50 rounded w-3/4"></div>
              <div className="h-6 bg-surface-variant/50 rounded w-full"></div>
              <div className="h-6 bg-primary-container/30 rounded w-5/6"></div>
              <div className="h-6 bg-surface-variant/50 rounded w-2/3"></div>
            </div>
            
            {/* Mock Main Content */}
            <div className="flex-1 h-full flex flex-col gap-stack_md opacity-80 transition-opacity group-hover:opacity-100">
              <div className="h-12 bg-surface rounded-lg border border-outline-variant/50 w-full"></div>
              <div className="flex-1 flex gap-stack_md">
                <div className="flex-1 bg-surface rounded-lg border border-outline-variant/50 p-stack_sm flex flex-col gap-stack_sm">
                  <div className="h-4 bg-surface-variant/50 rounded w-1/3 mb-2"></div>
                  <div className="h-16 bg-surface-variant/20 rounded w-full border border-outline-variant/30"></div>
                  <div className="h-16 bg-surface-variant/20 rounded w-full border border-outline-variant/30"></div>
                </div>
                <div className="w-[30%] bg-surface rounded-lg border border-outline-variant/50 p-stack_sm hidden lg:block">
                  <div className="h-4 bg-surface-variant/50 rounded w-1/2 mb-4"></div>
                  <div className="h-32 bg-primary-container/10 rounded w-full border border-primary-container/30"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Interactive glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-container/20 to-tertiary-container/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
        </div>

        {/* Features Grid */}
        <section className="w-full max-w-5xl">
          <h2 className="font-headline-md text-headline-md text-center mb-stack_lg text-on-surface">Systematic Academic Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack_lg">
            
            {/* Feature 1 */}
            <div className="bg-surface-container-low rounded-lg p-stack_lg border border-outline-variant hover:border-primary/30 hover:bg-surface-container transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-stack_md group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack_sm">Central Dashboard</h3>
              <p className="font-body-md text-body-md text-secondary">
                A unified view of your entire semester. Instantly see upcoming deadlines, current progress, and priority tasks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface-container-low rounded-lg p-stack_lg border border-outline-variant hover:border-primary/30 hover:bg-surface-container transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center mb-stack_md group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack_sm">Subject Tracking</h3>
              <p className="font-body-md text-body-md text-secondary">
                Isolate and manage individual courses. Keep syllabus details, reading lists, and specific notes securely organized.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-container-low rounded-lg p-stack_lg border border-outline-variant hover:border-primary/30 hover:bg-surface-container transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-stack_md group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack_sm">Project Planning</h3>
              <p className="font-body-md text-body-md text-secondary">
                Break down major assignments into actionable steps. Track progress with rigorous status indicators and deadlines.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
