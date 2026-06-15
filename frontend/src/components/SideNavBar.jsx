import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
  Folder,
} from 'lucide-react';

export default function SideNavBar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Subjects', icon: BookOpen, path: '/subjects' },
    { name: 'Modules', icon: Folder, path: '/module-chat' },
    { name: 'Chats', icon: GraduationCap, path: '/chats' },
  ];

  return (
    <nav className="w-64 h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant flex flex-col pt-6 pb-4 z-20">
      {/* Brand area */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-on-primary-container" />
        </div>

        <div>
          <h1 className="font-headline-sm text-[18px] font-bold text-primary tracking-tight leading-tight">
            Semester Mentor
          </h1>
          <p className="font-label-sm text-[11px] text-secondary leading-none mt-1">
            Academic Planner
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <ul className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-3 py-2 rounded-lg font-body-md text-[14px] transition-colors duration-150 cursor-pointer ${isActive ||
                  (item.path === '/module-chat' && location.pathname.startsWith('/module-chat')) ||
                  (item.path === '/chats' && location.pathname.startsWith('/chats')) ||
                  (item.path === '/subjects' && location.pathname.startsWith('/subjects'))
                  ? 'bg-primary-container/20 text-primary font-semibold border-l-[3px] border-primary rounded-l-none'
                  : 'text-secondary hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Bottom User Area */}
      <div className="px-3 mt-auto pt-4 border-t border-outline-variant/50 flex flex-col gap-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `w-full flex items-center gap-4 px-3 py-2 rounded-lg font-body-md text-[14px] transition-colors duration-150 cursor-pointer ${isActive
              ? 'bg-primary-container/20 text-primary font-semibold border-l-[3px] border-primary rounded-l-none'
              : 'text-secondary hover:bg-surface-container hover:text-on-surface'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          Settings
        </NavLink>

        <button className="w-full flex items-center gap-4 px-3 py-2 rounded-lg text-secondary hover:bg-error-container hover:text-on-error-container transition-colors duration-150 cursor-pointer text-left">
          <LogOut className="w-5 h-5" />
          <span className="font-body-md text-[14px] font-medium">
            Log out
          </span>
        </button>
      </div>
    </nav>
  );
}