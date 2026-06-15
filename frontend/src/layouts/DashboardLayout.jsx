import SideNavBar from '../components/SideNavBar';
import { useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chats');

  return (
    <div className={`bg-background ${isChatPage ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <SideNavBar />
      <main className={`md:ml-[240px] pt-[56px] transition-all duration-300 ${isChatPage ? 'h-full flex flex-col' : 'p-stack_lg'}`}>
        <div className={`w-full ${isChatPage ? 'flex-1 h-[calc(100vh-56px)] relative' : 'max-w-container_max_width mx-auto'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
