import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { BookOpen } from 'lucide-react';

export default function TopNavBar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMarketingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav
      className={`w-full h-navbar_height fixed top-0 left-0 z-50 transition-all duration-300 border-b flex justify-between items-center px-gutter ${
        scrolled || isAuthPage
          ? 'bg-surface/95 backdrop-blur-sm shadow-sm border-outline-variant' 
          : 'bg-surface/90 border-transparent'
      }`}
    >
      <div className="flex items-center gap-stack_sm">
        <Link to="/" className="flex items-center gap-stack_sm">
          <BookOpen className="text-primary w-6 h-6" />
          <span className="font-headline-sm text-[18px] leading-[24px] font-bold text-primary">
            Semester Mentor
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-stack_md">
        <ThemeToggle />
        
        {isMarketingPage && (
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
      </div>
    </nav>
  );
}
