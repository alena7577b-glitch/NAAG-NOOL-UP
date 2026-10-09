'use client';

import { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Crown,
  Trash2,
  Check,
  AlertCircle,
  X,
  Lock,
  Mail,
  User,
  Search,
} from 'lucide-react';
import { Role } from '@prisma/client';
import {
  createStaffAccountAction,
  updateUserRoleAction,
  deleteUserAccountAction,
} from '@/lib/actions/admin-users';

export interface AdminUserItem {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
}

interface AdminUsersViewProps {
  initialUsers: AdminUserItem[];
  currentUserEmail: string;
}

export function AdminUsersView({ initialUsers, currentUserEmail }: AdminUsersViewProps) {
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'ADMIN' as 'ADMIN' | 'SUPERADMIN',
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMessage(null);

    try {
      const res = await createStaffAccountAction(formData);
      if (res.success && res.user) {
        setUsers((prev) => [
          {
            id: res.user!.id,
            email: res.user!.email,
            fullName: formData.fullName,
            role: res.user!.role,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setIsCreateModalOpen(false);
        setFormData({ fullName: '', email: '', password: '', role: 'ADMIN' });
        setFeedbackMessage({ type: 'success', text: `Staff account created for ${res.user!.email}` });
      } else {
        setFeedbackMessage({ type: 'error', text: res.error || 'Failed to create staff account.' });
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      const res = await updateUserRoleAction(userId, newRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setFeedbackMessage({ type: 'success', text: 'Role updated successfully.' });
      } else {
        setFeedbackMessage({ type: 'error', text: res.error || 'Failed to update role.' });
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: 'Failed to update role.' });
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to remove account ${email}?`)) return;

    try {
      const res = await deleteUserAccountAction(userId);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setFeedbackMessage({ type: 'success', text: `Account ${email} deleted.` });
      } else {
        setFeedbackMessage({ type: 'error', text: res.error || 'Failed to delete account.' });
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: 'Failed to delete account.' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DC]">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D49B4B] flex items-center gap-1.5 mb-1">
            <Crown className="w-3.5 h-3.5" />
            <span>Super Administrator Console</span>
          </div>
          <h1 className="font-playfair text-3xl font-normal text-[#1E1C1A]">
            Staff & User Management
          </h1>
          <p className="text-xs text-[#8A847A]">
            Create authorized logins, assign system roles, and revoke staff access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#182821] hover:bg-[#233A30] text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4 text-[#D49B4B]" />
          <span>Create Staff Login</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-3 animate-in fade-in ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-stone-400 hover:text-stone-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Role Filter */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE6DC] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full ps-9 pe-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:border-[#B85233]"
          />
          <Search className="w-3.5 h-3.5 text-[#8A847A] absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#8A847A]">Filter:</span>
          {['ALL', 'SUPERADMIN', 'ADMIN', 'CUSTOMER'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                roleFilter === r
                  ? 'bg-[#182821] text-white shadow-2xs'
                  : 'bg-[#FAF8F5] text-[#6B655B] hover:text-[#1E1C1A] border border-[#EBE6DC]'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white border border-[#EBE6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#8A847A] uppercase text-[10px] tracking-wider border-b border-[#EBE6DC]">
                <th className="py-3.5 px-6 text-start font-semibold">User / Staff</th>
                <th className="py-3.5 px-4 text-start font-semibold">System Role</th>
                <th className="py-3.5 px-4 text-start font-semibold">Created Date</th>
                <th className="py-3.5 px-6 text-end font-semibold">Role Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#8A847A]">
                    No accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isPrimarySuperAdmin = u.email.toLowerCase() === 'info@naagnoolup.com';
                  const isCurrent = u.email.toLowerCase() === currentUserEmail.toLowerCase();

                  return (
                    <tr key={u.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#182821] text-white font-serif font-bold flex items-center justify-center text-xs shrink-0">
                            {u.fullName ? u.fullName.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-[#1E1C1A] flex items-center gap-1.5">
                              <span>{u.fullName || 'No Name Provided'}</span>
                              {isPrimarySuperAdmin && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                  PRIMARY
                                </span>
                              )}
                              {isCurrent && (
                                <span className="text-[10px] text-[#4D5844] font-medium">(You)</span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#8A847A] font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {u.role === 'SUPERADMIN' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#182821] text-[#D49B4B] border border-[#2B463A]">
                            <Crown className="w-3 h-3 text-[#D49B4B]" />
                            SUPER ADMIN
                          </span>
                        ) : u.role === 'ADMIN' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Shield className="w-3 h-3 text-emerald-600" />
                            ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#FAF8F5] text-[#6B655B] border border-[#EBE6DC]">
                            <Users className="w-3 h-3" />
                            CUSTOMER
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-[#8A847A] font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-4 px-6 text-end">
                        <div className="flex items-center justify-end gap-2">
                          {!isPrimarySuperAdmin && (
                            <>
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                                className="px-2.5 py-1 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs font-medium text-[#1E1C1A] focus:outline-none"
                              >
                                <option value="CUSTOMER">Customer</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPERADMIN">Super Admin</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Remove User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {isPrimarySuperAdmin && (
                            <span className="text-[10px] text-[#8A847A] italic">Protected Account</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE STAFF MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#EBE6DC] shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#182821] text-[#D49B4B] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-playfair text-lg font-medium text-[#1E1C1A]">Create Staff Login</h3>
                  <p className="text-[11px] text-[#8A847A]">Issue new administrator credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-[#1E1C1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                  Staff Member Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Marian Hassan"
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                  />
                  <User className="w-3.5 h-3.5 text-[#8A847A] absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                  Login Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff@naagnoolup.com"
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                  />
                  <Mail className="w-3.5 h-3.5 text-[#8A847A] absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                  Initial Password (min 8 chars)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#8A847A] absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1E1C1A] uppercase tracking-wider">
                  Access Level / Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'SUPERADMIN' })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                >
                  <option value="ADMIN">Admin (Catalog, Orders, Operations)</option>
                  <option value="SUPERADMIN">Super Admin (Full System & User Control)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#EBE6DC] text-xs font-medium text-[#1E1C1A] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#182821] hover:bg-[#233A30] disabled:opacity-50 text-white text-xs font-medium shadow-sm transition-all"
                >
                  {isSubmitting ? 'Creating Login...' : 'Create Staff Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
