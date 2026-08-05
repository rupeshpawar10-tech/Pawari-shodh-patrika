import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { useAuth } from '../../lib/AuthContext';
import { firebaseConfig } from '../../lib/firebase';
import { AdminDashboard } from './AdminDashboard';
import { ArticlesManager } from './ArticlesManager';
import { IssuesManager } from './IssuesManager';
import { PagesManager } from './PagesManager';
import { SectionManager } from './SectionManager';
import { EditorialBoardManager } from './EditorialBoardManager';
import { AnnouncementsManager } from './AnnouncementsManager';
import { MediaLibrary } from './MediaLibrary';
import { SettingsManager } from './SettingsManager';
import { UsersManager } from './UsersManager';
import { RolesManager } from './RolesManager';
import { SubmissionsManager } from './SubmissionsManager';
import { BooksBlogsManager } from './BooksBlogsManager';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Book,
  FileCode, 
  Layers, 
  Users, 
  Bell, 
  Image as ImageIcon, 
  Settings, 
  ShieldCheck, 
  Key,
  LogOut, 
  Globe, 
  Sparkles,
  Menu,
  X,
  AlertTriangle,
  Info,
  ChevronRight,
  ExternalLink,
  Inbox
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { activeAdminTab, setActiveAdminTab, setActiveView } = useCms();
  const { userProfile, logout, isSuperAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'articles', label: 'Articles Manager', icon: FileText },
    { id: 'issues', label: 'Volumes & Issues', icon: BookOpen },
    { id: 'books_blogs', label: 'Books & Blogs', icon: Book },
    { id: 'submissions', label: 'Submissions', icon: Inbox },
    { id: 'pages', label: 'CMS Pages', icon: FileCode },
    { id: 'section_manager', label: 'Section Order', icon: Layers },
    { id: 'editorial_board', label: 'Editorial Board', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'Journal Settings', icon: Settings },
    ...(isSuperAdmin ? [
      { id: 'users', label: 'Users & Accounts', icon: ShieldCheck },
      { id: 'roles', label: 'Manage Roles', icon: Key }
    ] : [])
  ];

  const renderActiveTab = () => {
    switch (activeAdminTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'articles': return <ArticlesManager />;
      case 'issues': return <IssuesManager />;
      case 'books_blogs': return <BooksBlogsManager />;
      case 'submissions': return <SubmissionsManager />;
      case 'pages': return <PagesManager />;
      case 'section_manager': return <SectionManager />;
      case 'editorial_board': return <EditorialBoardManager />;
      case 'announcements': return <AnnouncementsManager />;
      case 'media': return <MediaLibrary />;
      case 'settings': return <SettingsManager />;
      case 'users': return <UsersManager />;
      case 'roles': return <RolesManager />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Admin Top Bar */}
      <header className="bg-red-950 text-amber-100 border-b border-amber-500/30 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-amber-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-red-950 font-serif font-bold text-lg flex items-center justify-center border border-amber-400">
                प
              </div>
              <div>
                <span className="font-serif font-bold text-amber-100 text-base leading-tight block">
                  Pawari Shodh Patrika
                </span>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                  CMS Admin Portal
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            
            {/* View Public Site Button */}
            <button
              onClick={() => setActiveView('home')}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 rounded-lg transition"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Public Journal Website</span>
            </button>

            {/* Profile Info */}
            <div className="hidden md:flex items-center space-x-2 border-l border-amber-800/80 pl-3">
              <span className="font-semibold text-amber-100">{userProfile?.display_name || 'Admin'}</span>
              <span className="text-[10px] font-mono font-extrabold bg-amber-500 text-red-950 px-2 py-0.5 rounded-full uppercase">
                {userProfile?.role}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={() => logout()}
              className="p-2 bg-red-900/80 hover:bg-red-800 text-amber-200 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <aside className={`w-full md:w-64 flex-shrink-0 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white border border-amber-900/10 rounded-2xl p-3 shadow-2xs space-y-1 sticky top-22">
            
            <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
              CMS Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveAdminTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-serif font-bold transition ${
                    isActive
                      ? 'bg-red-950 text-amber-100 shadow-xs'
                      : 'text-slate-700 hover:bg-amber-50/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {renderActiveTab()}
        </main>

      </div>

    </div>
  );
};

