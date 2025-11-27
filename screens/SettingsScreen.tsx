import React from 'react';
import { Screen, Header, Card, Toggle, Button } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';
import { ScreenName } from '../types';
import { ChevronLeft, User, Bell, Shield, Cloud, Smartphone, Image, Globe, HelpCircle } from 'lucide-react';

export const SettingsScreen = ({ navigate }: { navigate: (s: ScreenName) => void }) => {
  const { mode, toggleTheme, setBackgroundImage } = useTheme();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Screen>
      <Header 
        title="Settings" 
        leftIcon={<ChevronLeft className="w-6 h-6 text-slate-800 dark:text-white" />}
        onLeftPress={() => navigate('Home')}
      />
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-10">
        
        {/* Account Section */}
        <section className="space-y-3 animate-slide-up">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Account</h3>
            <Card className="space-y-4">
                <SettingRow icon={<User />} label="Edit Profile" />
                <SettingRow icon={<Shield />} label="Change Password" />
                <SettingRow icon={<Bell />} label="Notifications" hasToggle />
            </Card>
        </section>

        {/* Appearance Section */}
        <section className="space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Appearance</h3>
            <Card className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600"><Smartphone className="w-5 h-5"/></div>
                        <span className="font-medium">Dark Mode</span>
                    </div>
                    <Toggle checked={mode === 'dark'} onChange={toggleTheme} />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 mb-2">
                         <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600"><Image className="w-5 h-5"/></div>
                         <span className="font-medium">Custom Background</span>
                    </div>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Cloud className="w-8 h-8 mb-2 text-slate-400" />
                            <p className="text-xs text-slate-500">Tap to upload wallpaper</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                </div>
            </Card>
        </section>

         {/* General Section */}
         <section className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">General</h3>
            <Card className="space-y-4">
                <SettingRow icon={<Globe />} label="Language" value="English" />
                <SettingRow icon={<Cloud />} label="Backup & Restore" />
                <SettingRow icon={<HelpCircle />} label="About & Help" />
            </Card>
        </section>

        <div className="pt-4 text-center">
            <p className="text-xs text-slate-400">Nexus CRUD v1.0.2 (Build 240)</p>
        </div>
      </div>
    </Screen>
  );
};

const SettingRow = ({ icon, label, value, hasToggle }: { icon: any, label: string, value?: string, hasToggle?: boolean }) => (
    <div className="flex items-center justify-between py-1 hover:bg-slate-50 dark:hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors cursor-pointer">
        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
            <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-slate-500 dark:text-slate-400">
                {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            <span className="font-medium">{label}</span>
        </div>
        {hasToggle ? (
            <Toggle checked={true} onChange={() => {}} />
        ) : (
            <div className="flex items-center gap-2">
                {value && <span className="text-sm text-slate-400">{value}</span>}
                <ChevronLeft className="w-4 h-4 text-slate-400 rotate-180" />
            </div>
        )}
    </div>
);
