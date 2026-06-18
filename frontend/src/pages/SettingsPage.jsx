import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../layouts/DashboardLayout';
import { User, Lock, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function SettingsPage() {
  const { user, login } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    collegeName: user?.collegeName || '',
    branch: user?.branch || '',
    semester: user?.semester || '',
    dailyFreeHours: user?.dailyFreeHours || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.put('/users/profile', profileData);
      // Update store user (using the login action to update user info without changing token)
      // Since login takes user and token, we need to preserve the token.
      const token = localStorage.getItem('token');
      if (token) {
        login({ ...user, ...response.data }, token);
      }
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.put('/users/profile', { 
        password: passwordData.newPassword,
        oldPassword: passwordData.currentPassword 
      });
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="font-display-lg text-[32px] font-bold text-on-surface mb-8">Settings</h1>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[500px]">
          
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 bg-surface-container-low border-r border-outline-variant/50 p-4 shrink-0 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-[14px] font-semibold transition-colors ${activeTab === 'profile' ? 'bg-primary-container text-on-primary-container' : 'text-secondary hover:bg-surface hover:text-on-surface'}`}
            >
              <User className="w-5 h-5" />
              Profile details
            </button>
            <button 
              onClick={() => setActiveTab('password')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-[14px] font-semibold transition-colors ${activeTab === 'password' ? 'bg-primary-container text-on-primary-container' : 'text-secondary hover:bg-surface hover:text-on-surface'}`}
            >
              <Lock className="w-5 h-5" />
              Password
            </button>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6 md:p-8">
            {activeTab === 'profile' && (
              <div>
                <h2 className="font-headline-sm text-[20px] font-bold text-on-surface mb-6">Profile Details</h2>
                <form onSubmit={handleProfileUpdate} className="flex flex-col gap-5 max-w-lg">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-[12px] font-semibold text-secondary uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-[12px] font-semibold text-secondary uppercase tracking-wider">College Name</label>
                    <input 
                      type="text"
                      value={profileData.collegeName}
                      onChange={(e) => setProfileData({...profileData, collegeName: e.target.value})}
                      className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-[12px] font-semibold text-secondary uppercase tracking-wider">Branch</label>
                      <input 
                        type="text"
                        value={profileData.branch}
                        onChange={(e) => setProfileData({...profileData, branch: e.target.value})}
                        className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-[12px] font-semibold text-secondary uppercase tracking-wider">Semester</label>
                      <input 
                        type="number"
                        min="1"
                        max="10"
                        value={profileData.semester}
                        onChange={(e) => setProfileData({...profileData, semester: e.target.value})}
                        className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-[12px] font-semibold text-secondary uppercase tracking-wider">Daily Free Hours</label>
                    <input 
                      type="number"
                      min="1"
                      max="24"
                      value={profileData.dailyFreeHours}
                      onChange={(e) => setProfileData({...profileData, dailyFreeHours: e.target.value})}
                      className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="mt-4 pt-6 border-t border-outline-variant flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-[14px] font-semibold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'password' && (
              <div>
                <h2 className="font-headline-sm text-[20px] font-bold text-on-surface mb-6">Change Password</h2>
                <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-5 max-w-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-[12px] font-semibold text-secondary uppercase tracking-wider">Current Password</label>
                    <input 
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-[12px] font-semibold text-secondary uppercase tracking-wider">New Password</label>
                    <input 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-[12px] font-semibold text-secondary uppercase tracking-wider">Confirm New Password</label>
                    <input 
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="mt-4 pt-6 border-t border-outline-variant flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-[14px] font-semibold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {isSubmitting ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
