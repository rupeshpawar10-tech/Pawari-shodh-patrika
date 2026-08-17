import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useCms } from '../../lib/CmsContext';
import { ShieldCheck, ArrowLeft, ShieldAlert, Mail, Lock, LogIn } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { googleLogin, login, directSuperAdminLogin } = useAuth();
  const { setActiveView } = useCms();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'email' | 'google'>('email');

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      const code = err?.code;
      if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Incorrect email address or password. Access is restricted to authorized CMS staff.');
      } else {
        setError(err?.message || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await googleLogin();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const code = err?.code || 'auth/unauthorized';
      const msg = err?.message || 'Google sign-in failed.';
      
      if (msg.includes('Unauthorized admin account') || code === 'auth/unauthorized') {
        setError(`Unauthorized account. Access is allowed ONLY for registered CMS staff.`);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 max-w-md w-full shadow-xl space-y-6">
        
        {/* Title & Short Instruction */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-950 text-amber-300 flex items-center justify-center shadow-md border-2 border-amber-500/40">
            <ShieldCheck className="w-7 h-7 stroke-[1.75]" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Pawari Shodh Patrika
            </h2>
            <p className="text-xs font-semibold text-amber-800 tracking-wider uppercase mt-1">
              Protected Admin & Staff Portal
            </p>
          </div>
          <p className="text-sm text-slate-600 font-medium leading-relaxed pt-1">
            Secure login. Enter your CMS staff credentials or sign in with authorized Google account.
          </p>
        </div>

        {/* Unauthorized / Error Message (Only shown when error occurs) */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 font-medium space-y-1 animate-in slide-in-from-top-1">
            <div className="font-bold flex items-center space-x-1.5 text-red-950">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>Authentication Error</span>
            </div>
            <p className="leading-relaxed text-xs text-slate-700">{error}</p>
          </div>
        )}

        {/* 1-Click Direct Admin Access Button */}
        <button
          type="button"
          onClick={async () => {
            setLoading(true);
            try {
              await directSuperAdminLogin('rupeshpawar10@gmail.com', 'Prof. Rupesh Pawar');
            } catch (e) {
              setError('Direct Super Admin access failed.');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-red-950 font-bold border-2 border-amber-600 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm cursor-pointer active:scale-[0.98]"
        >
          <ShieldCheck className="w-5 h-5 text-red-950 shrink-0" />
          <span>⚡ 1-Click Super Admin Login (सीधा प्रवेश करें)</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-slate-400 text-xs font-semibold uppercase">Or Sign In With</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Toggle Login Method */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('email')}
            className={`py-2 rounded-lg transition ${mode === 'email' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => setMode('google')}
            className={`py-2 rounded-lg transition ${mode === 'google' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Google Sign-In
          </button>
        </div>

        {mode === 'email' ? (
          <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="rupeshpawar10@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-red-950 hover:bg-red-900 text-amber-100 font-bold rounded-xl transition shadow-xs flex items-center justify-center space-x-2 text-xs focus:ring-2 focus:ring-amber-500 active:scale-[0.99]"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
            </button>
          </form>
        ) : (
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold border-2 border-slate-300 rounded-xl transition shadow-xs hover:shadow flex items-center justify-center space-x-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{loading ? 'Authenticating...' : 'Sign In with Google Gmail'}</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  await directSuperAdminLogin('rupeshpawar10@gmail.com', 'Prof. Rupesh Pawar');
                } catch (e) {
                  setError('Direct Super Admin access failed.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-amber-950/10 hover:bg-amber-950/20 text-amber-900 font-bold border border-amber-800/30 rounded-xl transition flex items-center justify-center space-x-2 text-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Quick Login as Super Admin (rupeshpawar10@gmail.com)</span>
            </button>
          </div>
        )}

        {/* Return to Public Website Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveView('home')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Journal Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
