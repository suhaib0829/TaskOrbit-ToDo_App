import React, { useState } from 'react';
import { Screen, Input, Button } from '../components/ui';
import { AuthService, getFirebaseErrorMessage } from '../services/auth';
import { ScreenName } from '../types';
import { Mail, Lock, ArrowRight, Smartphone } from 'lucide-react';

export const LoginScreen = ({ navigate }: { navigate: (s: ScreenName) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await AuthService.login(email, password);
      // Auth state listener in App.tsx handles navigation
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen className="px-6 justify-center bg-gradient-to-br from-slate-50 to-primary-50">
      <div className="mb-10 text-center animate-slide-up">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary-500/40 mb-6 transform rotate-3">
          <Smartphone className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
        <p className="text-slate-500">Sign in to access your items</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5 w-full animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center">
            ⚠️ {error}
          </div>
        )}
        
        <Input 
          label="Email" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="you@example.com"
          icon={<Mail className="w-5 h-5" />}
        />
        
        <Input 
          label="Password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="••••••••"
          icon={<Lock className="w-5 h-5" />}
        />

        <div className="flex justify-end">
          <button 
            type="button"
            onClick={() => navigate('ForgotPassword')} 
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Forgot Password?
          </button>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Sign In <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <p className="text-slate-500 text-sm">
          Don't have an account?{' '}
          <button onClick={() => navigate('Register')} className="font-bold text-primary-600 hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </Screen>
  );
};
