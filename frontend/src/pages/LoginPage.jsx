import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await api.post('/users/login', { email, password });
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-surface-container-low min-h-screen flex items-center justify-center p-gutter font-body-md text-on-surface transition-colors duration-300"
    >
      <main className="w-full max-w-[440px]">
        {/* Brand Header Context */}
        <div className="text-center mb-stack_lg">
          <h1 className="font-display-lg text-display-lg text-primary mb-stack_sm">Semester Mentor</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Academic Planner</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-lg border border-surface-variant shadow-[0px_2px_4px_rgba(0,0,0,0.04)] p-[40px] transition-colors duration-300">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-stack_lg text-center">Welcome Back</h2>

          {error && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-stack_md">
            {/* Email Field */}
            <div className="flex flex-col gap-stack_sm">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-stack_md top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
                <input
                  className="w-full h-[48px] pl-[48px] pr-stack_md bg-surface-container-lowest border border-surface-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/20 transition-all duration-150"
                  id="email"
                  name="email"
                  placeholder="name@university.edu"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-stack_sm">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
                <Link className="font-label-md text-label-md text-primary hover:text-primary-fixed-dim transition-colors duration-150" to="/forgot-password">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-stack_md top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
                <input
                  className="w-full h-[48px] pl-[48px] pr-stack_md bg-surface-container-lowest border border-surface-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-fixed-dim focus:ring-2 focus:ring-primary-fixed-dim/20 transition-all duration-150"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-stack_sm mt-stack_sm">
              <input
                className="w-4 h-4 rounded-[4px] border-surface-variant text-primary-fixed-dim focus:ring-primary-fixed-dim/20 cursor-pointer"
                id="remember"
                name="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label className="font-body-md text-body-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Remember me for 30 days</label>
            </div>

            {/* Login Button */}
            <button
              className="w-full h-[48px] mt-stack_md bg-primary-fixed-dim hover:bg-[#ffc66b] text-[#291800] rounded-lg font-headline-sm text-headline-sm flex items-center justify-center gap-2 transition-colors duration-150 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-stack_lg text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don't have an account?
              <Link className="text-primary font-semibold hover:text-primary-fixed-dim transition-colors duration-150 ml-1" to="/register">Register</Link>
            </p>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
