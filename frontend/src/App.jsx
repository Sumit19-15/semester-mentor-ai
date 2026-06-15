import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import LandingPage from './pages/LandingPage';

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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Placeholder routes to avoid errors when clicking links on LandingPage */}
        <Route path="/login" element={<div>Login Page (WIP)</div>} />
        <Route path="/register" element={<div>Register Page (WIP)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
