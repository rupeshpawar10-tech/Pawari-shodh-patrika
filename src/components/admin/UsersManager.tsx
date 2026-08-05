import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { UserRole } from '../../types';
import { ShieldCheck, UserPlus, Shield, User, Mail, Lock, CheckCircle2 } from 'lucide-react';

export const UsersManager: React.FC = () => {
  const { allUsers, updateUserRole, createUser, isSuperAdmin, roles } = useAuth();

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('editorial');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword || !newDisplayName) return;

    try {
      await createUser(newUserEmail, newUserPassword, newDisplayName, newRole);
      setSuccessMsg(`Created user ${newDisplayName} with role ${newRole}`);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewDisplayName('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert('Failed to create user: ' + err.message);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-red-200 text-center text-red-900 font-serif font-bold">
        Access Restricted: Only Super Admin can manage user credentials and permissions.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">User Credentials & Role Access Control</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Role-Based Access Control (RBAC): Super Admin, Director, Editorial</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Create User Form */}
      <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs space-y-4">
        <h2 className="text-sm font-serif font-bold text-slate-900 uppercase border-b pb-2 flex items-center space-x-2">
          <UserPlus className="w-4 h-4 text-red-900" />
          <span>Provision New CMS User</span>
        </h2>

        <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <input
            type="text"
            required
            placeholder="Display Name *"
            value={newDisplayName}
            onChange={e => setNewDisplayName(e.target.value)}
            className="p-2.5 bg-slate-50 border rounded-lg"
          />

          <input
            type="email"
            required
            placeholder="Email Address *"
            value={newUserEmail}
            onChange={e => setNewUserEmail(e.target.value)}
            className="p-2.5 bg-slate-50 border rounded-lg"
          />

          <input
            type="password"
            required
            placeholder="Password *"
            value={newUserPassword}
            onChange={e => setNewUserPassword(e.target.value)}
            className="p-2.5 bg-slate-50 border rounded-lg"
          />

          <select
            value={newRole}
            onChange={e => setNewRole(e.target.value as UserRole)}
            className="p-2.5 bg-slate-50 border rounded-lg font-bold text-slate-800"
          >
            {roles.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} {r.is_system ? '' : '(Custom)'}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold rounded-lg transition shadow-xs flex items-center justify-center space-x-1"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add CMS User</span>
          </button>
        </form>
      </div>

      {/* Users List Table */}
      <div className="bg-white border border-amber-900/10 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-serif font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role Permission</th>
                <th className="p-4 text-right">Modify Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.map(user => (
                <tr key={user.uid} className="hover:bg-amber-50/40 transition">
                  <td className="p-4 font-serif font-bold text-slate-900">
                    {user.display_name}
                  </td>

                  <td className="p-4 font-mono text-slate-600">
                    {user.email}
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold font-mono rounded-full uppercase ${
                      user.role === 'super_admin' ? 'bg-amber-500 text-red-950 font-extrabold' :
                      user.role === 'director' ? 'bg-red-900 text-amber-100' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <select
                      value={user.role}
                      onChange={e => updateUserRole(user.uid, e.target.value as UserRole)}
                      className="p-1.5 bg-slate-50 border border-slate-300 rounded font-semibold text-xs text-slate-800"
                    >
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} {r.is_system ? '' : '(Custom)'}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
