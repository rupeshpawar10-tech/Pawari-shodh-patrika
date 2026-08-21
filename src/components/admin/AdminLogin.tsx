import React, { useState } from 'react';
import { useAuth, DEFAULT_SAMPLE_USERS, AUTHORIZED_SUPER_ADMIN_EMAIL } from '../../lib/AuthContext';
import { useCms } from '../../lib/CmsContext';
import { ShieldCheck, ArrowLeft, ShieldAlert, Mail, Lock, LogIn, Globe, UserCheck, ChevronDown, Check, Sparkles, KeyRound } from 'lucide-react';

interface AccountOption {
  email: string;
  name: string;
  roleTitle: string;
  roleTitleHindi: string;
  badgeColor: string;
  isSuperAdmin?: boolean;
}

const PRESET_ACCOUNTS: AccountOption[] = [
  {
    email: AUTHORIZED_SUPER_ADMIN_EMAIL,
    name: 'Prof. Rupesh Pawar',
    roleTitle: 'Super Admin (Chief Editor)',
    roleTitleHindi: 'मुख्य व्यवस्थापक एवं प्रधान संपादक',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    isSuperAdmin: true
  },
  {
    email: 'anand.pawar@pawarijournal.org',
    name: 'Dr. Anand Mohan Pawar',
    roleTitle: 'Director / Patron',
    roleTitleHindi: 'निदेशक / मुख्य संरक्षक',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
  },
  {
    email: 'meena.verma@pawarijournal.org',
    name: 'Dr. Meena Verma',
    roleTitle: 'Editorial Team Lead',
    roleTitleHindi: 'संपादकीय मंडल प्रमुख',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  {
    email: 'rajesh.sharma@pawarijournal.org',
    name: 'Dr. Rajesh Sharma',
    roleTitle: 'Editor (Linguistics)',
    roleTitleHindi: 'भाषा व साहित्य संपादक',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  {
    email: 'sunita.deshmukh@pawarijournal.org',
    name: 'Sunita Deshmukh',
    roleTitle: 'Associate Editor',
    roleTitleHindi: 'सह-संपादक',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
  },
  {
    email: 'vijay.kumar@pawarijournal.org',
    name: 'Dr. Vijay Kumar',
    roleTitle: 'Peer Reviewer',
    roleTitleHindi: 'शोध समीक्षा मंडल',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
  }
];

export const AdminLogin: React.FC = () => {
  const { googleLogin, login, allUsers } = useAuth();
  const { setActiveView } = useCms();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'email' | 'google'>('email');
  const [showAccountChooser, setShowAccountChooser] = useState(true);

  // Combine PRESET_ACCOUNTS with any newly registered accounts from allUsers
  const availableAccounts: AccountOption[] = React.useMemo(() => {
    const map = new Map<string, AccountOption>();
    
    // Add preset standard accounts
    PRESET_ACCOUNTS.forEach(acc => {
      map.set(acc.email.toLowerCase().trim(), acc);
    });

    // Add any existing registered users
    if (allUsers && allUsers.length > 0) {
      allUsers.forEach(u => {
        if (u.email && !map.has(u.email.toLowerCase().trim())) {
          map.set(u.email.toLowerCase().trim(), {
            email: u.email,
            name: u.display_name || u.email.split('@')[0],
            roleTitle: (u.role || 'Staff').replace('_', ' ').toUpperCase(),
            roleTitleHindi: 'पोर्टल सदस्य',
            badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
            isSuperAdmin: u.role === 'super_admin'
          });
        }
      });
    }

    return Array.from(map.values());
  }, [allUsers]);

  const handleSelectAccount = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setError(null);
    setUnauthorizedDomain(null);
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('कृपया ईमेल आईडी और पासवर्ड दोनों दर्ज करें। (Please enter both email address and password.)');
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
        setError('गलत ईमेल पता या पासवर्ड। (Incorrect email address or password.)');
      } else {
        setError(err?.message || 'लॉगिन असफल रहा। कृपया पुनः प्रयास करें। (Login failed. Please verify your credentials.)');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (hintEmail?: string) => {
    setError(null);
    setUnauthorizedDomain(null);
    setLoading(true);
    try {
      const emailToHint = hintEmail || (email.includes('@') ? email : undefined);
      await googleLogin(emailToHint);
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 animate-in fade-in duration-200" id="admin-login-container">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 max-w-lg w-full shadow-xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-950 text-amber-300 flex items-center justify-center shadow-md border-2 border-amber-500/40">
            <ShieldCheck className="w-7 h-7 stroke-[1.75]" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              पवारी शोध पत्रिका
            </h2>
            <p className="text-xs font-semibold text-amber-800 tracking-wider uppercase mt-0.5">
              Admin &amp; Editorial Staff Portal
            </p>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            प्रशासनिक व संपादकीय कार्यों हेतु अपना खाता (Email ID) चुनें या दर्ज करें।
          </p>
        </div>

        {/* Account Chooser Section (ईमेल आईडी चुनें) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3" id="email-chooser-section">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <UserCheck className="w-4 h-4 text-amber-700" />
              <span>ईमेल आईडी चुनें (Choose Email ID)</span>
            </label>
            <button
              type="button"
              id="btn-toggle-account-chooser"
              onClick={() => setShowAccountChooser(!showAccountChooser)}
              className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline flex items-center space-x-1"
            >
              <span>{showAccountChooser ? 'सूची छिपाएं' : 'सभी खाते देखें'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showAccountChooser ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Quick Select Grid of Accounts */}
          {showAccountChooser && (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {availableAccounts.map((acc) => {
                const isSelected = email.toLowerCase().trim() === acc.email.toLowerCase().trim();
                return (
                  <button
                    key={acc.email}
                    type="button"
                    id={`btn-select-account-${acc.email.replace(/[^a-z0-9]/g, '_')}`}
                    onClick={() => handleSelectAccount(acc.email)}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-start justify-between space-x-2 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {acc.name}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${acc.badgeColor}`}>
                          {acc.roleTitleHindi}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-600 truncate mt-0.5">
                        {acc.email}
                      </p>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                          +
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Selected Email Indicator */}
          {email && (
            <div className="p-2 bg-amber-100/70 border border-amber-300 rounded-lg flex items-center justify-between text-xs text-amber-950 font-medium">
              <div className="flex items-center space-x-1.5 min-w-0">
                <Check className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span className="text-slate-700">चयनित (Selected):</span>
                <span className="font-bold font-mono truncate">{email}</span>
              </div>
              <button
                type="button"
                id="btn-clear-email"
                onClick={() => setEmail('')}
                className="text-[11px] text-amber-800 hover:text-red-700 font-bold underline shrink-0 ml-2"
              >
                बदलें (Change)
              </button>
            </div>
          )}
        </div>

        {/* Unauthorized Domain Warning */}
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
                <li>Add <code className="font-mono text-slate-900 font-bold">{unauthorizedDomain}</code>, <code className="font-mono text-slate-900 font-bold">pawari-shodh-patrika.vercel.app</code>, &amp; <code className="font-mono text-slate-900 font-bold">localhost</code></li>
              </ol>
            </div>
          </div>
        )}

        {/* Standard Error Message */}
        {error && !unauthorizedDomain && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 font-medium space-y-2 animate-in slide-in-from-top-1">
            <div className="font-bold flex items-center space-x-1.5 text-red-950">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>Sign-In Notice (सूचना)</span>
            </div>
            <p className="leading-relaxed text-xs text-slate-700">{error}</p>
            {error.toLowerCase().includes('popup') && (
              <div className="pt-1.5 border-t border-red-200/60 text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">💡 Quick Fix for Browser Popup Block:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Allow popups in your browser's address bar icon</li>
                  <li>Or switch to <strong>Email &amp; Password</strong> login tab below</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Toggle Login Method Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold" id="login-mode-tabs">
          <button
            type="button"
            id="tab-email-password"
            onClick={() => { setMode('email'); setUnauthorizedDomain(null); setError(null); }}
            className={`py-2.5 rounded-lg transition flex items-center justify-center space-x-1.5 ${
              mode === 'email' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>ईमेल और पासवर्ड (Email/Pass)</span>
          </button>
          <button
            type="button"
            id="tab-google-signin"
            onClick={() => { setMode('google'); setUnauthorizedDomain(null); setError(null); }}
            className={`py-2.5 rounded-lg transition flex items-center justify-center space-x-1.5 ${
              mode === 'google' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google खाता (Gmail)</span>
          </button>
        </div>

        {/* Mode: Email & Password */}
        {mode === 'email' ? (
          <form onSubmit={handleEmailPasswordSignIn} className="space-y-4" id="form-email-password-login">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>ईमेल आईडी (Email Address)</span>
              </label>
              <input
                type="email"
                id="input-login-email"
                required
                aria-label="Email Address"
                placeholder="staff@pawarijournal.org या अपना ईमेल"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>पासवर्ड (Password)</span>
              </label>
              <input
                type="password"
                id="input-login-password"
                required
                aria-label="Password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              id="btn-submit-email-login"
              disabled={loading}
              className="w-full py-3 px-4 bg-red-950 hover:bg-red-900 text-amber-100 font-bold rounded-xl transition shadow-xs flex items-center justify-center space-x-2 text-xs focus:ring-2 focus:ring-amber-500 active:scale-[0.99]"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'प्रमाणीकरण हो रहा है... (Authenticating)' : 'ईमेल से साइन इन करें (Sign In)'}</span>
            </button>
          </form>
        ) : (
          /* Mode: Google Sign-In with Account Chooser Prompt */
          <div className="space-y-3 pt-1" id="google-login-section">
            {email ? (
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center space-x-1.5 text-amber-950 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>चयनित ईमेल से Google लॉगिन:</span>
                </div>
                <div className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1.5 rounded-lg border border-amber-200">
                  {email}
                </div>
                <button
                  type="button"
                  id="btn-google-signin-hinted"
                  onClick={() => handleGoogleSignIn(email)}
                  disabled={loading}
                  className="w-full py-2.5 px-3 bg-red-950 hover:bg-red-900 text-amber-200 font-bold rounded-lg transition text-xs flex items-center justify-center space-x-2"
                >
                  <span>{email} से Google साइन इन करें</span>
                </button>
              </div>
            ) : null}

            <button
              type="button"
              id="btn-google-signin-general"
              onClick={() => handleGoogleSignIn()}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold border-2 border-slate-300 rounded-xl transition shadow-xs hover:shadow flex items-center justify-center space-x-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 active:scale-[0.99]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{loading ? 'प्रमाणीकरण हो रहा है...' : 'Google खाता चुनें और साइन इन करें (Choose Google Account)'}</span>
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Google OAuth का उपयोग करके आप सीधे अपना अधिकृत Gmail खाता चुनकर लॉगिन कर सकते हैं।
            </p>
          </div>
        )}

        {/* Return to Public Website Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <button
            type="button"
            id="btn-return-public-website"
            onClick={() => setActiveView('home')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>मुख्य शोध पत्रिका वेबसाइट पर लौटें (Return to Journal)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
