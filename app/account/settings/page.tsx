import { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth/server';
import { SettingsForm } from './SettingsForm';
import { Settings, Shield, KeyRound } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Security & Settings — Naag Nool UP',
  description: 'Update your password and manage account security preferences',
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 border-b border-[#F0EBE1] pb-5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#D49B4B]/15 text-[#A8741A] flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-playfair text-2xl text-[#1E1C1A] font-normal">
              Security & Credentials
            </h1>
            <p className="text-xs text-[#8A847A] mt-0.5">
              Manage your confidential password, active login credentials, and authentication security.
            </p>
          </div>
        </div>

        <div className="space-y-6 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E1C1A]">
            <KeyRound className="w-4 h-4 text-[#B85233]" />
            <span>Update Password</span>
          </div>

          <SettingsForm />
        </div>

        <div className="mt-8 pt-6 border-t border-[#F0EBE1] flex items-center gap-2 text-xs text-[#8A847A]">
          <Shield className="w-4 h-4 text-[#0A3929] shrink-0" />
          <span>Sessions are secured through Supabase multi-layered authentication tokens.</span>
        </div>
      </div>
    </div>
  );
}
