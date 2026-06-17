import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import { BookOpen, Search, Bell, HelpCircle, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function TopNavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isMarketingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboardPage = location.pathname === '/dashboard' || 
                          location.pathname.startsWith('/subjects') ||
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
        <div className="flex-1 hidden md:block">
          {/* Search bar removed as per requirements */}
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
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md ml-stack_sm cursor-pointer border border-surface-variant uppercase shadow-sm hover:opacity-90 transition-opacity"
              >
                {user?.name ? user.name[0] : 'S'}
              </button>
              
              {isProfileOpen && (
                <div className="absolute top-12 right-0 w-64 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden z-50">
                  <div className="p-4 border-b border-outline-variant/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm uppercase shrink-0 shadow-sm border border-primary/20">
                      {user?.name ? user.name[0] : 'S'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-headline-sm text-[14px] font-bold text-on-surface truncate">{user?.name}</p>
                      <p className="font-body-sm text-[12px] text-secondary truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link 
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface"
                    >
                      <Settings className="w-4 h-4 text-secondary" />
                      <span className="font-label-md text-[13px] font-medium">Settings</span>
                    </Link>
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-error/10 hover:text-error transition-colors text-on-surface mt-1"
                    >
                      <LogOut className="w-4 h-4 text-error/80" />
                      <span className="font-label-md text-[13px] font-medium text-error">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
