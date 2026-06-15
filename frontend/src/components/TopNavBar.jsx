import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { BookOpen, Search, Bell, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function TopNavBar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMarketingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboardPage = location.pathname === '/dashboard' || 
                          location.pathname.startsWith('/module-chat') || 
                          location.pathname.startsWith('/chats') || 
                          location.pathname.startsWith('/settings');

  // If dashboard, it shifts right by 240px on desktop
  const navClasses = isDashboardPage
    ? `h-navbar_height fixed top-0 right-0 left-0 md:left-[240px] z-10 bg-surface border-b border-outline-variant flex justify-between items-center px-gutter transition-all duration-300`
    : `w-full h-navbar_height fixed top-0 left-0 z-50 transition-all duration-300 border-b flex justify-between items-center px-gutter ${
        scrolled || isAuthPage
          ? 'bg-surface/95 backdrop-blur-sm shadow-sm border-outline-variant' 
          : 'bg-surface/90 border-transparent'
      }`;

  return (
    <nav className={navClasses}>
      {/* Left Side */}
      {isDashboardPage ? (
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center text-secondary focus-within:text-primary">
            <Search className="absolute left-3 w-5 h-5 pointer-events-none" />
            <input 
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg py-1.5 pl-10 pr-4 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150 placeholder:text-secondary-fixed-dim" 
              placeholder="Search resources..." 
              type="text" 
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-stack_sm">
          <Link to="/" className="flex items-center gap-stack_sm">
            <BookOpen className="text-primary w-6 h-6" />
            <span className="font-headline-sm text-[18px] leading-[24px] font-bold text-primary">
              Semester Mentor
            </span>
          </Link>
        </div>
      )}

      {/* Right Side */}
      <div className="flex items-center gap-stack_md ml-auto">
        <ThemeToggle />
        
        {isMarketingPage && !user && (
          <>
            <Link
              to="/login"
              className="font-label-md text-label-md text-secondary hover:text-on-surface transition-colors duration-150"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary-container text-on-primary-container font-label-md text-label-md px-stack_md py-[8px] rounded-lg hover:bg-primary hover:text-on-primary transition-all duration-150 active:scale-95 shadow-sm"
            >
              Get Started
            </Link>
          </>
        )}
        
        {isMarketingPage && user && (
          <Link
            to="/dashboard"
            className="bg-primary-container text-on-primary-container font-label-md text-label-md px-stack_md py-[8px] rounded-lg hover:bg-primary hover:text-on-primary transition-all duration-150 active:scale-95 shadow-sm"
          >
            Go to Dashboard
          </Link>
        )}

        {isDashboardPage && (
          <>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-secondary hover:bg-secondary-container/50 hover:text-primary transition-colors duration-150 cursor-pointer active:scale-95">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-secondary hover:bg-secondary-container/50 hover:text-primary transition-colors duration-150 cursor-pointer active:scale-95">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md ml-stack_sm cursor-pointer border border-surface-variant uppercase shadow-sm">
              {user?.name ? user.name[0] : 'S'}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
