import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Library, MessageSquare, Settings } from 'lucide-react';

export default function SideNavBar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Subjects', path: '/subjects', icon: Library },
    { name: 'Chats', path: '/chats', icon: MessageSquare },
  ];

  return (
    <nav className="w-[240px] h-screen fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant hidden md:flex flex-col py-stack_md z-20">
      <div className="px-gutter mb-stack_lg flex items-center gap-2">
        <BookOpen className="text-primary w-6 h-6 shrink-0" />
        <div>
          <h1 className="font-headline-sm text-[16px] leading-[20px] font-bold text-primary">Semester Mentor</h1>
          <p className="font-label-sm text-[11px] text-secondary">Academic Planner</p>
        </div>
      </div>
      
      <ul className="flex flex-col w-full font-body-md text-body-md flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <li key={item.name}>
              <Link 
                to={item.path}
                className={`flex items-center gap-3 px-gutter py-2 cursor-pointer active:scale-95 transition-colors duration-150 border-l-[3px] ${
                  isActive 
                    ? 'bg-primary-container/10 text-primary font-semibold border-primary' 
                    : 'text-secondary hover:bg-secondary-container/50 border-transparent'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.name}
              </Link>
            </li>
          );
        })}
        
        <li className="mt-auto">
          <Link 
            to="/settings"
            className={`flex items-center gap-3 px-gutter py-2 cursor-pointer active:scale-95 transition-colors duration-150 border-l-[3px] ${
              location.pathname === '/settings'
                ? 'bg-primary-container/10 text-primary font-semibold border-primary'
                : 'text-secondary hover:bg-secondary-container/50 border-transparent'
            }`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
