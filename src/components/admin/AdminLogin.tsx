import React, { useState } from 'react';
import { useAuth, AUTHORIZED_SUPER_ADMIN_EMAIL } from '../../lib/AuthContext';
import { useCms } from '../../lib/CmsContext';
import { ShieldCheck, ArrowLeft, ShieldAlert } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { googleLogin } = useAuth();
  const { setActiveView } = useCms();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        setError(`Unauthorized admin account. Access is allowed ONLY for approved email: ${AUTHORIZED_SUPER_ADMIN_EMAIL}`);
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
              Admin Portal
            </p>
          </div>
          <p className="text-sm text-slate-600 font-medium leading-relaxed pt-1">
            Sign in with your authorized Google account to manage the journal publication.
          </p>
        </div>

        {/* Unauthorized / Error Message (Only shown when error occurs) */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 font-medium space-y-1 animate-in slide-in-from-top-1">
            <div className="font-bold flex items-center space-x-1.5 text-red-950">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>Access Denied</span>
            </div>
            <p className="leading-relaxed text-xs text-slate-700">{error}</p>
          </div>
        )}

        {/* Continue with Google Button */}
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
            <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
          </button>
        </div>

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
