import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function SideNavBar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const userName = user?.name?.split(' ')[0] || 'Student';

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Subjects', icon: BookOpen, path: '/subjects' },
    { name: 'Chats', icon: GraduationCap, path: '/chats' },
  ];

  return (
    <nav className="w-64 h-screen fixed left-0 top-0 bg-[var(--color-sidebar-bg)] border-r border-[var(--color-sidebar-border)] flex flex-col pt-6 pb-6 z-20 transition-colors duration-200">
      {/* Brand area */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-[var(--color-sidebar-brand-bg)] flex items-center justify-center shrink-0 shadow-sm transition-colors duration-200">
          <GraduationCap className="w-6 h-6 text-[var(--color-sidebar-brand-icon)]" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-[16px] font-bold text-[var(--color-sidebar-brand-text)] tracking-tight leading-tight transition-colors duration-200">
            Semester Mentor
          </h1>
          <p className="text-[13px] text-[var(--color-sidebar-brand-sub)] leading-none mt-1 font-medium transition-colors duration-200">
            Academic Planner
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <ul className="flex-1 flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) => {
                const active = isActive ||
                  (item.path === '/chats' && location.pathname.startsWith('/chats')) ||
                  (item.path === '/subjects' && location.pathname.startsWith('/subjects'));
                
                return `group flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-[15px] transition-all duration-200 cursor-pointer relative overflow-hidden ${
                  active
                    ? 'bg-[var(--color-sidebar-active-bg)] text-[var(--color-sidebar-active-text)]'
                    : 'text-[var(--color-sidebar-link-text)] hover:bg-[var(--color-sidebar-link-hover-bg)] hover:text-[var(--color-sidebar-link-hover-text)]'
                }`;
              }}
            >
              {({ isActive }) => {
                const active = isActive ||
                  (item.path === '/chats' && location.pathname.startsWith('/chats')) ||
                  (item.path === '/subjects' && location.pathname.startsWith('/subjects'));
                
                return (
                  <>
                    {active && <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[var(--color-sidebar-active-border)]"></div>}
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </>
                );
              }}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Bottom User Area */}
      <div className="px-4 mt-auto flex flex-col gap-2">
        {/* Keep Going Card */}
        <div className="bg-[var(--color-sidebar-card-bg)] rounded-2xl p-5 relative overflow-hidden mb-2 transition-colors duration-200 border border-[var(--color-sidebar-card-border)]">
          <div className="relative z-10">
            <h4 className="text-[15px] font-bold text-[var(--color-sidebar-card-title)] mb-1.5 flex items-center gap-1.5 transition-colors duration-200">
              Keep going, {userName}! <span className="text-lg leading-none">👏</span>
            </h4>
            <p className="text-[13px] text-[var(--color-sidebar-card-text)] leading-relaxed max-w-[140px] font-medium transition-colors duration-200">
              Consistency today,<br />Success tomorrow.
            </p>
          </div>
          
          {/* Abstract mountains decoration */}
          <div className="absolute bottom-0 right-0 left-0 h-24 pointer-events-none">
            <svg viewBox="0 0 200 100" className="w-full h-full object-cover" preserveAspectRatio="none">
              {/* Left Mountain */}
              <path d="M10,100 L70,50 L120,100 Z" fill="var(--color-sidebar-mountain-1)" className="transition-colors duration-200" />
              <path d="M70,50 L120,100 L70,100 Z" fill="var(--color-sidebar-mountain-2)" className="transition-colors duration-200" />

              {/* Right Mountain */}
              <path d="M60,100 L140,25 L220,100 Z" fill="var(--color-sidebar-mountain-2)" className="transition-colors duration-200" />
              <path d="M140,25 L220,100 L140,100 Z" fill="var(--color-sidebar-mountain-3)" className="transition-colors duration-200" />

              {/* Flag pole */}
              <line x1="140" y1="25" x2="140" y2="5" stroke="var(--color-sidebar-flag-pole)" strokeWidth="2" className="transition-colors duration-200" />
              {/* Flag */}
              <path d="M140,5 L160,12 L140,19 Z" fill="var(--color-sidebar-flag)" className="transition-colors duration-200" />
            </svg>
          </div>
        </div>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-[15px] transition-all duration-200 cursor-pointer relative overflow-hidden ${
              isActive
                ? 'bg-[var(--color-sidebar-active-bg)] text-[var(--color-sidebar-active-text)]'
                : 'text-[var(--color-sidebar-link-text)] hover:bg-[var(--color-sidebar-link-hover-bg)] hover:text-[var(--color-sidebar-link-hover-text)]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[var(--color-sidebar-active-border)]"></div>}
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </>
          )}
        </NavLink>

        <button 
          onClick={async () => {
            const { useAuthStore } = await import('../store/authStore');
            await useAuthStore.getState().logout();
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[var(--color-sidebar-link-text)] hover:bg-[var(--color-sidebar-link-hover-bg)] hover:text-[var(--color-sidebar-link-hover-text)] transition-colors duration-200 cursor-pointer text-left font-medium text-[15px]"
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </nav>
  );
}