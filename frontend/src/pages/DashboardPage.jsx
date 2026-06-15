import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../layouts/DashboardLayout';
import { FileText, Plus, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const userName = user?.name?.split(' ')[0] || 'Student';

  // Format today's date
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-stack_lg gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface mb-1">Good morning, {userName}</h2>
          <p className="font-body-md text-body-md text-secondary">Here is your academic overview for today.</p>
        </div>
        <div className="font-body-md text-body-md text-secondary flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {today}
        </div>
      </div>

      {/* Section 1: My Subjects */}
      <section className="mb-stack_lg">
        <div className="flex justify-between items-center mb-stack_md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">My Subjects</h3>
          <button className="font-label-md text-label-md text-primary hover:underline cursor-pointer">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack_md">
          {/* Subject Card 1 */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-stack_md flex flex-col hover:shadow-md hover:border-outline-variant transition-all duration-150 cursor-pointer min-h-[140px]">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-headline-sm text-headline-sm text-on-surface leading-tight">Data Structures & Algorithms</h4>
              <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-full whitespace-nowrap ml-2">Fall '23</span>
            </div>
            <div className="mt-auto pt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-label-sm text-label-sm text-secondary">Syllabus Completion</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">65%</span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
          
          {/* Subject Card 2 */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-stack_md flex flex-col hover:shadow-md hover:border-outline-variant transition-all duration-150 cursor-pointer min-h-[140px]">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-headline-sm text-headline-sm text-on-surface leading-tight">Linear Algebra</h4>
              <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-full whitespace-nowrap ml-2">Fall '23</span>
            </div>
            <div className="mt-auto pt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-label-sm text-label-sm text-secondary">Syllabus Completion</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">42%</span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>

          {/* Subject Card 3 */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-stack_md flex flex-col hover:shadow-md hover:border-outline-variant transition-all duration-150 cursor-pointer min-h-[140px]">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-headline-sm text-headline-sm text-on-surface leading-tight">Human-Computer Interaction</h4>
              <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-full whitespace-nowrap ml-2">Fall '23</span>
            </div>
            <div className="mt-auto pt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-label-sm text-label-sm text-secondary">Syllabus Completion</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">88%</span>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Mentor Projects */}
      <section>
        <div className="flex justify-between items-center mb-stack_md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Mentor Projects</h3>
          <button className="font-label-md text-label-md text-on-background bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-1.5 hover:bg-surface-container-low transition-colors flex items-center gap-1 cursor-pointer">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack_sm">
          
          {[
            { title: "Final Year Thesis Draft", time: "Last active 2 days ago" },
            { title: "Algorithm Analysis Paper", time: "Last active 4 days ago" },
            { title: "Usability Study Results", time: "Last active 1 week ago" },
            { title: "Semester Reading List", time: "Last active 2 weeks ago" }
          ].map((project, idx) => (
            <div key={idx} className="bg-surface-container-lowest border border-surface-variant rounded-lg p-stack_sm flex items-start gap-3 hover:shadow-md hover:border-outline-variant transition-all duration-150 cursor-pointer group">
              <div className="w-10 h-10 rounded bg-secondary-container/30 flex items-center justify-center text-primary group-hover:bg-primary-container/20 transition-colors shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col justify-center min-h-[40px] overflow-hidden">
                <h5 className="font-label-md text-label-md text-on-surface truncate w-full">{project.title}</h5>
                <p className="font-label-sm text-label-sm text-secondary mt-0.5">{project.time}</p>
              </div>
            </div>
          ))}

        </div>
      </section>
    </DashboardLayout>
  );
}
