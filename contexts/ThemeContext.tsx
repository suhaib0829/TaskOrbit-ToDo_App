import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeContextType, ThemeMode } from '../types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Premium Galaxy Background as default
const DEFAULT_BG = "https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?q=80&w=3272&auto=format&fit=crop";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    // Load from local storage
    const savedMode = localStorage.getItem('app_theme') as ThemeMode;
    const savedBg = localStorage.getItem('app_bg');
    
    if (savedMode) setMode(savedMode);
    if (savedBg) setBackgroundImage(savedBg);
    else setBackgroundImage(DEFAULT_BG); // Default to premium background
  }, []);

  useEffect(() => {
    // Apply class to HTML element for Tailwind Dark Mode
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app_theme', mode);
  }, [mode]);

  useEffect(() => {
    if (backgroundImage) {
      localStorage.setItem('app_bg', backgroundImage);
    }
  }, [backgroundImage]);

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, backgroundImage, setBackgroundImage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
