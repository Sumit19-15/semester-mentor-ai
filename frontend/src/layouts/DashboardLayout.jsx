import SideNavBar from '../components/SideNavBar';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chats') || 
                     location.pathname.startsWith('/module-chat') || 
                     location.pathname.startsWith('/subjects');

  return (
    <div className={`bg-background pt-[56px] ${isChatPage ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <SideNavBar />
      <main className={`md:ml-64 transition-all duration-300 ${isChatPage ? 'h-full flex flex-col' : 'p-stack_lg'}`}>
        <div className={`w-full ${isChatPage ? 'flex-1 h-full relative' : 'max-w-container_max_width mx-auto'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
