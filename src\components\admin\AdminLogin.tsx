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

  const handleGoogleSignIn = async (useRedirectMode = false) => {
    setError(null);
    setLoading(true);
    try {
      await googleLogin(useRedirectMode);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const code = err?.code || '';
      const msg = err?.message || 'Google sign-in failed.';
      
      if (code === 'auth/unauthorized-domain' || msg.includes('origin') || msg.includes('OAuth') || msg.includes('policy')) {
        setError('गूगल OAuth नीति: Firebase Console में "Authorized domains" में "pawari-shodh-patrika.vercel.app" जोड़ना आवश्यक है। आप तुरंत प्रवेश हेतु "Email & Password" टैब का उपयोग करके भी सुरक्षित लॉगिन कर सकते हैं।');
      } else if (msg.includes('Unauthorized') || code === 'auth/unauthorized' || msg.includes('अनधिकृत')) {
        setError('अनधिकृत खाता! केवल अधिकृत संचालक (rupeshpawar10@gmail.com / rajeshbarange00@gmail.com) एवं CMS में पंजीकृत स्टाफ ही लॉगिन कर सकते हैं।');
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
            मुख्य संपादक एवं संचालक (Owner) प्रवेश पोर्टल
          </p>
        </div>

        {/* Unauthorized / Error Message (Only shown when error occurs) */}
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-xs text-red-900 font-medium space-y-1.5 animate-in slide-in-from-top-1">
            <div className="font-bold flex items-center space-x-1.5 text-red-950">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>प्रवेश अस्वीकृत / Access Denied</span>
            </div>
            <p className="leading-relaxed text-xs text-slate-800">{error}</p>
          </div>
        )}

        {/* Toggle Login Method */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('google'); setError(null); }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${mode === 'google' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span>Google Sign-In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('email'); setError(null); }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${mode === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span>Email & Password</span>
          </button>
        </div>

        {mode === 'google' ? (
          <div className="space-y-4 pt-1">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-4 px-4 bg-white hover:bg-slate-50 text-slate-800 font-black border-2 border-slate-300 hover:border-slate-400 rounded-2xl transition shadow-md hover:shadow-lg flex items-center justify-center space-x-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{loading ? 'सत्यापन जारी है...' : 'Google खाते से सुरक्षित लॉगिन करें'}</span>
            </button>

            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-950 space-y-1">
              <p className="font-bold flex items-center space-x-1 text-amber-900">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>अधिकृत स्वामी / सुपर एडमिन:</span>
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 font-mono text-[10px]">
                <li>rupeshpawar10@gmail.com</li>
                <li>rajeshbarange00@gmail.com</li>
              </ul>
              <p className="text-[10px] text-slate-500 pt-1">
                (इनके अतिरिक्त केवल CMS द्वारा बनाए गए पंजीकृत उपयोगकर्ताओं को ही प्रवेश मिलेगा)
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>ईमेल पता (Email Address)</span>
              </label>
              <input
                type="email"
                required
                placeholder="editor@pawarijournal.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>पासवर्ड (Password)</span>
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
              className="w-full py-3.5 px-4 bg-red-950 hover:bg-red-900 text-amber-200 font-bold rounded-xl transition shadow-md flex items-center justify-center space-x-2 text-xs focus:ring-2 focus:ring-amber-500 active:scale-[0.99] cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'सत्यापन जारी है...' : 'ईमेल व पासवर्ड से लॉगिन करें'}</span>
            </button>
          </form>
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
