import React, { useState } from 'react';
import { Screen, Input, Button, Header } from '../components/ui';
import { AuthService, getFirebaseErrorMessage } from '../services/auth';
import { ScreenName } from '../types';
import { ChevronLeft, Mail, Send } from 'lucide-react';

export const ForgotPasswordScreen = ({ navigate }: { navigate: (s: ScreenName) => void }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await AuthService.resetPassword(email);
      setMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: getFirebaseErrorMessage(err.code) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <Header 
        title="Reset Password" 
        leftIcon={<ChevronLeft className="w-6 h-6 text-slate-700" />}
        onLeftPress={() => navigate('Login')}
      />
      
      <div className="p-6 pt-10">
        <p className="text-slate-600 mb-8 leading-relaxed">
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleReset} className="space-y-6">
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="you@example.com"
            icon={<Mail className="w-5 h-5" />}
          />

          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium animate-fade-in ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <Button type="submit" isLoading={isLoading}>
            Send Reset Email <Send className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </Screen>
  );
};
