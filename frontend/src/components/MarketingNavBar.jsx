import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { Moon, Sun } from 'lucide-react';

export default function MarketingNavBar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`w-full h-navbar_height fixed top-0 left-0 z-50 transition-all duration-300 border-b flex justify-between items-center px-gutter ${
        scrolled 
          ? 'bg-surface/95 backdrop-blur-sm shadow-sm border-outline-variant' 
          : 'bg-surface/90 border-transparent'
      }`}
    >
      <div className="flex items-center gap-stack_sm">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          menu_book
        </span>
        <span className="font-headline-sm text-headline-sm font-bold text-primary">
          Semester Mentor
        </span>
      </div>
      <div className="flex items-center gap-stack_md">
        <button 
          onClick={toggleTheme} 
          className="text-secondary hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-variant/50"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
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
      </div>
    </nav>
  );
}
