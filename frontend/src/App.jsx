import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/themeStore';
import TopNavBar from './components/TopNavBar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import MentorChatPage from './pages/MentorChatPage';
import SubjectWorkspacePage from './pages/SubjectWorkspacePage';
import AiModuleChatPage from './pages/AiModuleChatPage';
import SettingsPage from './pages/SettingsPage';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <Toaster position="top-right" />
      <TopNavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<OnboardingPage />} />
        
        {/* Dashboard routes nested inside layout manually for now */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/subjects" element={<SubjectWorkspacePage />} />
        <Route path="/module-chat" element={<AiModuleChatPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/chats" element={
          <DashboardLayout>
            <MentorChatPage />
          </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
