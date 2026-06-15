import SideNavBar from '../components/SideNavBar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <SideNavBar />
      <main className="md:ml-[240px] pt-[56px] p-stack_lg transition-all duration-300">
        <div className="max-w-container_max_width mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
