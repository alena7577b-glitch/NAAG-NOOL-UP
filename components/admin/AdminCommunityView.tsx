'use client';

import { useState } from 'react';
import {
  Compass,
  Search,
  Mail,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

export interface CommunitySignupItem {
  id: string;
  fullName: string;
  email: string;
  marketingConsent: boolean;
  createdAt: string;
}

interface AdminCommunityViewProps {
  initialSignups: CommunitySignupItem[];
}

export function AdminCommunityView({ initialSignups }: AdminCommunityViewProps) {
  const [signups] = useState<CommunitySignupItem[]>(initialSignups);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = signups.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyEmails = () => {
    const emailList = filtered.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B85233] mb-1">
            <Compass className="w-4 h-4" />
            <span>Circle of Reflection</span>
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A]">
            Community Signups
          </h1>
          <p className="text-sm text-[#6B655B] mt-1">
            Women who joined the Naag Nool UP newsletter, journal prompts, and empowerment initiatives.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyEmails}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#182821] text-white text-xs font-medium hover:bg-[#22382E] transition-colors self-start shadow-xs"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Emails Copied!' : 'Copy All Emails'}</span>
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Community Subscribers</span>
            <Sparkles className="w-4 h-4 text-[#D49B4B]" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            {signups.length}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Total newsletter opt-ins</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Marketing Consented</span>
            <Mail className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            {signups.filter((s) => s.marketingConsent).length}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Eligible for campaign releases</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Growth Trajectory</span>
            <Compass className="w-4 h-4 text-[#B85233]" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            100%
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Direct organic interest</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE6DC] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#8A847A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by subscriber name or email..."
          className="w-full text-sm bg-transparent outline-none text-[#1E1C1A] placeholder-[#8A847A]"
        />
      </div>

      {/* Signups Table */}
      <div className="bg-white rounded-3xl border border-[#EBE6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#F0EBE1] bg-[#FAF8F5] text-[#8A847A] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-4 px-6 text-start">Member Name</th>
                <th className="py-4 px-6 text-start">Email Address</th>
                <th className="py-4 px-6 text-center">Consent</th>
                <th className="py-4 px-6 text-end">Joined On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#8A847A]">
                    No community signups found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-6 font-medium text-[#1E1C1A]">
                      {item.fullName || 'Anonymous Member'}
                    </td>
                    <td className="py-4 px-6 text-[#6B655B] font-mono text-xs">
                      {item.email}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Subscribed
                      </span>
                    </td>
                    <td className="py-4 px-6 text-end text-[#8A847A] text-xs">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
