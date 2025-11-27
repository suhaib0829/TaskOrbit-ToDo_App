import React, { useState, useEffect, useCallback } from 'react';
import { User, ScreenName, Item } from './types';
import { AuthService } from './services/auth';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ItemEditorScreen } from './screens/ItemEditorScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { Loader2 } from 'lucide-react';

// Wrapper to consume ThemeContext for Background
const AppContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Login');
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
  
  const { backgroundImage } = useTheme();

  useEffect(() => {
    const unsubscribe = AuthService.onStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({ 
            uid: firebaseUser.uid, 
            email: firebaseUser.email, 
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] 
        });
        // Only redirect to Home if we are currently on an Auth screen
        if (['Login', 'Register', 'ForgotPassword'].includes(currentScreen)) {
            setCurrentScreen('Home');
        }
      } else {
        setUser(null);
        setCurrentScreen('Login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentScreen]);

  const navigate = useCallback((screen: ScreenName, params?: any) => {
    if (screen === 'EditItem' && params?.item) {
      setEditingItem(params.item);
    } else if (screen === 'AddItem') {
      setEditingItem(undefined);
    }
    setCurrentScreen(screen);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[420px] h-[100dvh] shadow-2xl overflow-hidden sm:rounded-[40px] sm:h-[880px] sm:border-[8px] sm:border-slate-900 border-x-0 border-y-0 transition-all duration-300">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ 
            backgroundImage: `url(${backgroundImage})`,
        }} 
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 transition-colors duration-500 backdrop-blur-[2px]" />

      {/* Status Bar Simulation */}
      <div className="hidden sm:block absolute top-0 left-0 right-0 h-8 bg-black z-50 rounded-t-[30px] flex justify-center items-center">
        <div className="w-24 h-5 bg-black rounded-b-xl"></div>
      </div>
      
      {/* Screen Render Logic */}
      <div className="relative h-full w-full pt-0 sm:pt-6">
        {currentScreen === 'Login' && <LoginScreen navigate={navigate} />}
        {currentScreen === 'Register' && <RegisterScreen navigate={navigate} />}
        {currentScreen === 'ForgotPassword' && <ForgotPasswordScreen navigate={navigate} />}
        {currentScreen === 'Settings' && <SettingsScreen navigate={navigate} />}
        {currentScreen === 'Home' && user && <HomeScreen user={user} navigate={navigate} />}
        {(currentScreen === 'AddItem' || currentScreen === 'EditItem') && user && (
          <ItemEditorScreen 
            user={user} 
            navigate={navigate} 
            mode={currentScreen === 'AddItem' ? 'create' : 'edit'}
            initialItem={editingItem}
          />
        )}
      </div>
    </div>
  );
};

export default function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}
