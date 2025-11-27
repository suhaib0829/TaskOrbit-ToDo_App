import React from 'react';
import { Loader2 } from 'lucide-react';

// --- Screen ---
export const Screen: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`flex flex-col h-full w-full relative overflow-hidden ${className || ''}`}>
    {children}
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', isLoading, className, ...props 
}) => {
  const baseStyle = "w-full py-3.5 rounded-2xl font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none";
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50",
    secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700",
    danger: "bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600",
    ghost: "bg-transparent text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-white/5",
    glass: "bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 text-white shadow-lg",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => (
  <div className="space-y-2 w-full">
    {label && <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wide">{label}</label>}
    <div className="relative group">
      {icon && <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors">{icon}</div>}
      <input 
        className={`w-full bg-white dark:bg-slate-800/80 border ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} 
          rounded-2xl py-3.5 px-4 ${icon ? 'pl-12' : ''} text-slate-800 dark:text-white placeholder:text-slate-400 
          focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500 ml-1 font-medium animate-fade-in">{error}</p>}
  </div>
);

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => (
  <div 
    onClick={onClick}
    className={`glass-card rounded-2xl p-5 transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''} ${className}`}
  >
    {children}
  </div>
);

// --- Header ---
export const Header: React.FC<{ 
  title: string; 
  leftIcon?: React.ReactNode; 
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  transparent?: boolean;
}> = ({ title, leftIcon, rightIcon, onLeftPress, onRightPress, transparent }) => (
  <div className={`flex items-center justify-between px-4 py-4 sticky top-0 z-30 ${transparent ? '' : 'glass border-b border-white/20'}`}>
    <button onClick={onLeftPress} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-90">
      {leftIcon}
    </button>
    <h1 className="text-lg font-bold text-slate-800 dark:text-white flex-1 text-center truncate px-2">{title}</h1>
    <button onClick={onRightPress} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-90 text-primary-600 dark:text-primary-400">
      {rightIcon}
    </button>
  </div>
);

// --- FAB ---
export const FAB: React.FC<{ onClick: () => void; icon: React.ReactNode }> = ({ onClick, icon }) => (
  <button 
    onClick={onClick}
    className="absolute bottom-8 right-6 w-14 h-14 bg-gradient-to-tr from-primary-600 to-blue-400 rounded-2xl text-white shadow-xl shadow-primary-600/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 z-30"
  >
    {icon}
  </button>
);

// --- Toggle ---
export const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button 
    onClick={onChange}
    className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`}
  >
    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);