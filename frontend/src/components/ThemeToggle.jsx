import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button 
      onClick={toggleTheme} 
      className="text-secondary hover:text-on-surface transition-colors p-[8px] rounded-full hover:bg-surface-variant/50 cursor-pointer"
      aria-label="Toggle dark mode"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
