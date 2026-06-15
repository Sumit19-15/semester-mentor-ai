import SideNavBar from '../components/SideNavBar';
import { useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chats') || 
                     location.pathname.startsWith('/project-chat') || 
                     location.pathname.startsWith('/subjects');

  return (
    <div className={`bg-background pt-[56px] ${isChatPage ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <SideNavBar />
      <main className={`md:ml-[240px] transition-all duration-300 ${isChatPage ? 'h-full flex flex-col' : 'p-stack_lg'}`}>
        <div className={`w-full ${isChatPage ? 'flex-1 h-full relative' : 'max-w-container_max_width mx-auto'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
