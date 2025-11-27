import React from 'react';
import { User, ScreenName } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { AuthService } from '../services/auth';
import { getUsernameFromEmail, getAvatarInitials } from '../utils/helpers';
import { X, Moon, Sun, Settings, LogOut, User as UserIcon, List, PieChart } from 'lucide-react';
import { Toggle } from './ui';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  navigate: (screen: ScreenName) => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, user, navigate }) => {
  const { mode, toggleTheme } = useTheme();
  const username = getUsernameFromEmail(user.email);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            onClose();
            navigate('Login');
        }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl z-50 shadow-2xl animate-slide-in-left flex flex-col border-r border-white/20">
        
        {/* Profile Header */}
        <div className="p-6 pt-10 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-primary-500/10 to-transparent">
          <div className="flex justify-between items-start mb-4">
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xl font-bold text-primary-600">{getAvatarInitials(username)}</span>
                    )}
                </div>
             </div>
             <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                 <X className="w-6 h-6 text-slate-500" />
             </button>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{username}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
            <MenuItem icon={<PieChart />} label="Dashboard" onClick={() => { navigate('Home'); onClose(); }} active />
            <MenuItem icon={<List />} label="My Tasks" onClick={() => { navigate('Home'); onClose(); }} />
            <MenuItem icon={<Settings />} label="Settings" onClick={() => { navigate('Settings'); onClose(); }} />
            
            <div className="my-4 border-t border-slate-100 dark:border-slate-800 mx-4" />
            
            <div className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    {mode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <span className="font-medium">Dark Mode</span>
                </div>
                <Toggle checked={mode === 'dark'} onChange={toggleTheme} />
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
            <button 
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-500 font-medium hover:text-red-600 transition-colors w-full p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10"
            >
                <LogOut className="w-5 h-5" />
                Sign Out
            </button>
        </div>
      </div>
    </>
  );
};

const MenuItem = ({ icon, label, onClick, active }: { icon: React.ReactNode, label: string, onClick: () => void, active?: boolean }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
            active ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 border-r-4 border-primary-500' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
    >
        {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })}
        <span className="font-medium">{label}</span>
    </button>
);