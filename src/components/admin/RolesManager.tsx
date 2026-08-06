import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useCms } from '../../lib/CmsContext';
import { CustomRole, RolePermissions } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  ShieldCheck, 
  Shield, 
  PlusCircle, 
  Trash2, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  FileText, 
  BookOpen, 
  Inbox, 
  FileCode, 
  Settings,
  Lock
} from 'lucide-react';

export const RolesManager: React.FC = () => {
  const { roles, addCustomRole, deleteCustomRole, allUsers, isSuperAdmin, canManageUsers, userProfile } = useAuth();
  const { setActiveAdminTab } = useCms();

  const [roleId, setRoleId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  
  const [permissions, setPermissions] = useState<RolePermissions>({
    canManageArticles: true,
    canManageIssues: false,
    canManageSubmissions: true,
    canManagePages: false,
    canManageSettings: false,
    canManageUsers: false,
  });

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
  const [confirmingRoleDelete, setConfirmingRoleDelete] = useState<string | null>(null);



  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanId = roleId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (!cleanId || !roleName.trim()) {
      setErrorMsg('Please enter a valid Role ID and Role Name.');
      return;
    }

    if (roles.some(r => r.id === cleanId)) {
      setErrorMsg(`A role with ID "${cleanId}" already exists. Please choose another ID.`);
      return;
    }

    const newRoleObj: CustomRole = {
      id: cleanId,
      name: roleName.trim(),
      description: roleDesc.trim() || 'Custom editorial role',
      is_system: false,
      permissions,
      created_at: new Date().toISOString()
    };

    try {
      await addCustomRole(newRoleObj);
      setSuccessMsg(`Custom role "${newRoleObj.name}" created successfully and saved to Firestore!`);
      setRoleId('');
      setRoleName('');
      setRoleDesc('');
      setPermissions({
        canManageArticles: true,
        canManageIssues: false,
        canManageSubmissions: true,
        canManagePages: false,
        canManageSettings: false,
        canManageUsers: false,
      });
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg('Failed to create role: ' + (err.message || String(err)));
    }
  };

  const handleDeleteRole = async (targetRoleId: string) => {
    setDeletingRoleId(targetRoleId);
    setErrorMsg(null);
    try {
      await deleteCustomRole(targetRoleId);
      setSuccessMsg(`Role "${targetRoleId}" deleted successfully.`);
      setConfirmingRoleDelete(null);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg('Failed to delete role: ' + (err.message || String(err)));
    } finally {
      setDeletingRoleId(null);
    }
  };

  const getUserCountForRole = (rId: string) => {
    return allUsers.filter(u => u.role === rId).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-red-900" />
            <h1 className="text-xl font-serif font-bold text-slate-900">Manage Custom Roles & Permissions</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Define custom role titles, configure module access permissions, and sync across Firestore users.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-amber-100 text-red-950 rounded-lg text-xs font-bold font-mono">
            {roles.length} Total Roles
          </span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold font-mono">
            {roles.filter(r => !r.is_system).length} Custom Roles
          </span>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form: Add New Custom Role */}
      <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs space-y-4">
        <h2 className="text-sm font-serif font-bold text-slate-900 uppercase border-b pb-2 flex items-center space-x-2">
          <PlusCircle className="w-4 h-4 text-red-900" />
          <span>Create New Custom Role</span>
        </h2>

        <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Role Key / ID <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. reviewer, section_editor"
                value={roleId}
                onChange={e => setRoleId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
              <span className="text-[10px] text-slate-400">Lowercase letters and underscores only</span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Role Display Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Peer Reviewer"
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Description</label>
              <input
                type="text"
                placeholder="Short description of responsibilities..."
                value={roleDesc}
                onChange={e => setRoleDesc(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Module Access Checkboxes */}
          <div className="pt-2">
            <label className="block text-slate-800 font-bold font-serif mb-2 text-xs">
              Module Access & Functional Permissions:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              
              <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={permissions.canManageArticles}
                  onChange={e => setPermissions({ ...permissions, canManageArticles: e.target.checked })}
                  className="rounded text-red-900 focus:ring-red-900"
                />
                <span className="font-semibold text-slate-800">Articles (लेख)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={permissions.canManageIssues}
                  onChange={e => setPermissions({ ...permissions, canManageIssues: e.target.checked })}
                  className="rounded text-red-900 focus:ring-red-900"
                />
                <span className="font-semibold text-slate-800">Issues (अंक)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={permissions.canManageBooks ?? true}
                  onChange={e => setPermissions({ ...permissions, canManageBooks: e.target.checked })}
                  className="rounded text-red-900 focus:ring-red-900"
                />
                <span className="font-semibold text-slate-800">Books (किताबें)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={permissions.canManageBlogs ?? true}
                  onChange={e => setPermissions({ ...permissions, canManageBlogs: e.target.checked })}
                  className="rounded text-red-900 focus:ring-red-900"
                />
                <span className="font-semibold text-slate-800">Blogs (ब्लॉग)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={permissions.canManageOther ?? true}
                  onChange={e => setPermissions({ ...permissions, canManageOther: e.target.checked })}
                  className="rounded text-red-900 focus:ring-red-900"
                />
                <span className="font-semibold text-slate-800">Other (अन्य सामग्री)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={permissions.canManageSubmissions}
                  onChange={e => setPermissions({ ...permissions, canManageSubmissions: e.target.checked })}
                  className="rounded text-red-900 focus:ring-red-900"
                />
                <span className="font-semibold text-slate-800">Submissions (सबमिशन)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={permissions.canManagePages}
                  onChange={e => setPermissions({ ...permissions, canManagePages: e.target.checked })}
                  className="rounded text-red-900 focus:ring-red-900"
                />
                <span className="font-semibold text-slate-800">CMS Pages (पेज)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={permissions.canManageSettings}
                  onChange={e => setPermissions({ ...permissions, canManageSettings: e.target.checked })}
                  className="rounded text-red-900 focus:ring-red-900"
                />
                <span className="font-semibold text-slate-800">Settings (सेटिंग्स)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={permissions.canManageUsers}
                  onChange={e => setPermissions({ ...permissions, canManageUsers: e.target.checked })}
                  className="rounded text-red-900 focus:ring-red-900"
                />
                <span className="font-semibold text-slate-800">Users & Roles (यूजर्स)</span>
              </label>

            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold rounded-xl transition shadow-xs flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Save Role to Firestore</span>
            </button>
          </div>
        </form>
      </div>

      {/* All Roles List */}
      <div className="bg-white border border-amber-900/10 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-serif font-bold text-slate-900 text-sm uppercase tracking-wider">
            Active System & Custom Roles List
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Synced with Firestore `roles` collection
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {roles.map(r => {
            const userCount = getUserCountForRole(r.id);
            return (
              <div key={r.id} className="p-5 hover:bg-amber-50/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-bold text-slate-900 text-base">
                      {r.name}
                    </span>
                    
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                      key: {r.id}
                    </span>

                    {r.is_system ? (
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase font-mono border border-amber-300">
                        System Default
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase font-mono border border-emerald-300">
                        Custom Role
                      </span>
                    )}

                    <span className="text-[11px] font-mono text-slate-500 flex items-center space-x-1 pl-2 border-l">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{userCount} Assigned {userCount === 1 ? 'User' : 'Users'}</span>
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {r.description || 'No description provided.'}
                  </p>

                  {/* Granted Permissions Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {r.permissions?.canManageArticles && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        <FileText className="w-3 h-3 text-red-900" />
                        <span>Articles</span>
                      </span>
                    )}
                    {r.permissions?.canManageIssues && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        <BookOpen className="w-3 h-3 text-amber-700" />
                        <span>Issues</span>
                      </span>
                    )}
                    {r.permissions?.canManageSubmissions && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        <Inbox className="w-3 h-3 text-sky-700" />
                        <span>Submissions</span>
                      </span>
                    )}
                    {r.permissions?.canManagePages && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        <FileCode className="w-3 h-3 text-indigo-700" />
                        <span>Pages</span>
                      </span>
                    )}
                    {r.permissions?.canManageSettings && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        <Settings className="w-3 h-3 text-slate-700" />
                        <span>Settings</span>
                      </span>
                    )}
                    {r.permissions?.canManageUsers && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        <ShieldCheck className="w-3 h-3 text-emerald-700" />
                        <span>Users</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start md:self-center">
                  {r.is_system ? (
                    <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded border">
                      <Lock className="w-3 h-3" />
                      <span>Protected System Role</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmingRoleDelete(r.id)}
                      disabled={deletingRoleId === r.id}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 font-bold border border-red-200 rounded-lg transition text-xs flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      <span>{deletingRoleId === r.id ? 'Deleting...' : 'Delete Role'}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* CONFIRM DELETE ROLE MODAL */}
      <ConfirmModal
        isOpen={Boolean(confirmingRoleDelete)}
        title="Delete Custom Role"
        message={`Are you sure you want to delete role "${confirmingRoleDelete}"? Any users currently assigned to this role will automatically be reassigned to "editorial".`}
        confirmLabel={deletingRoleId ? "Deleting..." : "Delete Role"}
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => confirmingRoleDelete && handleDeleteRole(confirmingRoleDelete)}
        onCancel={() => setConfirmingRoleDelete(null)}
      />
    </div>
  );
};
