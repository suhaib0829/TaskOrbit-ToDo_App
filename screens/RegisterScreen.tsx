import React, { useState } from 'react';
import { Screen, Input, Button, Header } from '../components/ui';
import { AuthService, getFirebaseErrorMessage } from '../services/auth';
import { ScreenName } from '../types';
import { Mail, Lock, CheckCircle, ChevronLeft } from 'lucide-react';

export const RegisterScreen = ({ navigate }: { navigate: (s: ScreenName) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPass) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPass) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await AuthService.register(email, password);
      // Auto-login handled by auth state listener
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <Header 
        title="Create Account" 
        leftIcon={<ChevronLeft className="w-6 h-6 text-slate-700" />}
        onLeftPress={() => navigate('Login')}
      />
      
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-slate-800">Get Started</h2>
          <p className="text-slate-500 mt-1">Create a new account to manage your data.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
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
            placeholder="Minimum 6 characters"
            icon={<Lock className="w-5 h-5" />}
          />

          <Input 
            label="Confirm Password" 
            type="password" 
            value={confirmPass} 
            onChange={e => setConfirmPass(e.target.value)} 
            placeholder="Repeat password"
            icon={<CheckCircle className="w-5 h-5" />}
          />

          <div className="pt-4">
            <Button type="submit" isLoading={isLoading}>
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </Screen>
  );
};
