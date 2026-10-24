import { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth/server';
import { ProfileForm } from './ProfileForm';
import { User, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Personal Profile — Naag Nool UP',
  description: 'Manage your personal profile and contact information',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 border-b border-[#F0EBE1] pb-5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#B85233]/10 text-[#B85233] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-playfair text-2xl text-[#1E1C1A] font-normal">
              Personal Profile
            </h1>
            <p className="text-xs text-[#8A847A] mt-0.5">
              Update your contact details, display name, and preferences across the platform.
            </p>
          </div>
        </div>

        <ProfileForm initialFullName={user.fullName || ''} email={user.email} />

        <div className="mt-8 pt-6 border-t border-[#F0EBE1] flex items-center gap-2 text-xs text-[#8A847A]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your contact information is confidential and protected by end-to-end encryption.</span>
        </div>
      </div>
    </div>
  );
}
