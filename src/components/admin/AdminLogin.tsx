import React, { useState } from 'react';
import { useAuth, AUTHORIZED_SUPER_ADMIN_EMAIL } from '../../lib/AuthContext';
import { useCms } from '../../lib/CmsContext';
import { ShieldCheck, ArrowLeft, ShieldAlert, Mail, Lock, LogIn, Globe, UserCheck } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { googleLogin, login, directSuperAdminLogin } = useAuth();
  const { setActiveView } = useCms();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'email' | 'google'>('email');

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }
    setError(null);
    setUnauthorizedDomain(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      const code = err?.code;
      if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Incorrect email address or password.');
      } else {
        setError(err?.message || 'Login failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDirectSuperAdminAccess = async () => {
    setError(null);
    setUnauthorizedDomain(null);
    setLoading(true);
    try {
      await directSuperAdminLogin();
    } catch (err: any) {
      console.error('Super Admin Direct Login Error:', err);
      setError(err?.message || 'Super Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setUnauthorizedDomain(null);
    setLoading(true);
    try {
      await googleLogin();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const msg = err?.message || 'Google sign-in failed.';
      
      if (msg.startsWith('AUTH_UNAUTHORIZED_DOMAIN:')) {
        const domain = msg.split(':')[1] || (typeof window !== 'undefined' ? window.location.hostname : 'domain');
        setUnauthorizedDomain(domain);
        setError(`Domain Authorization Notice: "${domain}" is not listed under Firebase Authentication Authorized Domains.`);
      } else if (msg.includes('Unauthorized account') || err?.code === 'auth/unauthorized') {
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
              Admin & Staff Portal
            </p>
          </div>
          <p className="text-sm text-slate-600 font-medium leading-relaxed pt-1">
            Sign in with your Email &amp; Password or Google account to access your assigned dashboard.
          </p>
        </div>

        {/* Unauthorized Domain Specific Banner */}
        {unauthorizedDomain && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs space-y-2.5 animate-in slide-in-from-top-1">
            <div className="font-bold text-amber-950 flex items-center space-x-1.5 text-sm">
              <Globe className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Firebase Domain Authorization Notice</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              The domain <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">{unauthorizedDomain}</code> is not added to Firebase Authentication Authorized Domains.
            </p>
            <div className="p-2.5 bg-white border border-amber-200 rounded-lg text-slate-600 space-y-1 text-[11px] font-medium">
              <p className="font-bold text-slate-800">To authorize this domain in Firebase Console:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
                <li>Go to <strong>Firebase Console &gt; Authentication &gt; Settings</strong></li>
                <li>Scroll to <strong>Authorized domains</strong></li>
                <li>Add <code className="font-mono text-slate-900 font-bold">pawari-shodh-patrika.vercel.app</code>, <code className="font-mono text-slate-900 font-bold">localhost</code>, &amp; <code className="font-mono text-slate-900 font-bold">{unauthorizedDomain}</code></li>
              </ol>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={handleDirectSuperAdminAccess}
                className="w-full py-2.5 px-3 bg-red-950 hover:bg-red-900 text-amber-200 font-bold rounded-lg transition text-xs flex items-center justify-center space-x-2 shadow-xs"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Sign In as Super Admin ({AUTHORIZED_SUPER_ADMIN_EMAIL})</span>
              </button>
            </div>
          </div>
        )}

        {/* Standard Error Message */}
        {error && !unauthorizedDomain && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 font-medium space-y-1 animate-in slide-in-from-top-1">
            <div className="font-bold flex items-center space-x-1.5 text-red-950">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>Access Denied</span>
            </div>
            <p className="leading-relaxed text-xs text-slate-700">{error}</p>
          </div>
        )}

        {/* Toggle Login Method */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('email'); setUnauthorizedDomain(null); setError(null); }}
            className={`py-2 rounded-lg transition ${mode === 'email' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => { setMode('google'); setUnauthorizedDomain(null); setError(null); }}
            className={`py-2 rounded-lg transition ${mode === 'google' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Google Sign-In (Gmail)
          </button>
        </div>

        {mode === 'email' ? (
          <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>User Email Address</span>
              </label>
              <input
                type="email"
                required
                aria-label="Email Address"
                placeholder="staff@pawarijournal.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Super Admin:</span>
                <button 
                  type="button" 
                  onClick={() => { setEmail(AUTHORIZED_SUPER_ADMIN_EMAIL); setPassword('admin123'); }}
                  className="text-amber-800 font-bold underline hover:text-amber-900"
                >
                  Auto-fill ({AUTHORIZED_SUPER_ADMIN_EMAIL})
                </button>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                aria-label="Password"
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
              <span>{loading ? 'Authenticating...' : 'Sign In with Email & Password'}</span>
            </button>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDirectSuperAdminAccess}
                className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-slate-900 font-bold rounded-xl transition text-xs flex items-center justify-center space-x-2 border border-amber-300 shadow-2xs"
              >
                <UserCheck className="w-4 h-4 text-amber-700" />
                <span>Quick Super Admin Login</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold border-2 border-slate-300 rounded-xl transition shadow-xs hover:shadow flex items-center justify-center space-x-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 active:scale-[0.99]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{loading ? 'Authenticating...' : 'Sign In with Gmail (Google)'}</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Super Admin &amp; authorized Gmail accounts can log in using Google OAuth.
            </p>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDirectSuperAdminAccess}
                className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-slate-900 font-bold rounded-xl transition text-xs flex items-center justify-center space-x-2 border border-amber-300 shadow-2xs"
              >
                <UserCheck className="w-4 h-4 text-amber-700" />
                <span>Quick Super Admin Login</span>
              </button>
            </div>
          </div>
        )}

        {/* Return to Public Website Link */}
        <div className="text-center pt-2">
          <button
            onClick={() => setActiveView('home')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Journal Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
