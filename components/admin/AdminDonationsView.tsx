'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  DollarSign,
  Users,
  GraduationCap,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  CreditCard,
  Building,
  Sparkles,
  Copy,
  Check,
  X,
  AlertCircle,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import {
  AdminDonationRecord,
  AdminDonationsSummary,
  updateDonationStatusAction,
  createManualDonationAction,
  ManualDonationInput,
} from '@/lib/actions/admin-donations';
import { OrderStatus } from '@prisma/client';

interface AdminDonationsViewProps {
  initialDonations: AdminDonationRecord[];
  initialSummary: AdminDonationsSummary;
}

export function AdminDonationsView({
  initialDonations,
  initialSummary,
}: AdminDonationsViewProps) {
  const [donations, setDonations] = useState<AdminDonationRecord[]>(initialDonations);
  const [summary] = useState<AdminDonationsSummary>(initialSummary);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');

  // Detail Modal
  const [activeDonation, setActiveDonation] = useState<AdminDonationRecord | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Manual Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState<ManualDonationInput>({
    donorName: '',
    donorEmail: '',
    amount: 50,
    paymentMethod: 'BANK_TRANSFER',
    status: 'PAID',
    donorNotes: '',
    adminNotes: '',
  });
  const [manualError, setManualError] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered donations
  const filteredDonations = donations.filter((d) => {
    // Status
    if (selectedStatus !== 'ALL' && d.status !== selectedStatus) return false;

    // Provider
    if (selectedProvider !== 'ALL') {
      const provider = d.payments[0]?.provider?.toUpperCase() || '';
      if (!provider.includes(selectedProvider)) return false;
    }

    // Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      return (
        d.orderNumber.toLowerCase().includes(q) ||
        d.donorName.toLowerCase().includes(q) ||
        d.donorEmail.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      const res = await updateDonationStatusAction(orderId, newStatus, adminNoteInput);
      if (res.success) {
        setDonations((prev) =>
          prev.map((item) =>
            item.id === orderId
              ? {
                  ...item,
                  status: newStatus,
                  adminNotes: adminNoteInput || item.adminNotes,
                }
              : item
          )
        );
        if (activeDonation && activeDonation.id === orderId) {
          setActiveDonation({
            ...activeDonation,
            status: newStatus,
            adminNotes: adminNoteInput || activeDonation.adminNotes,
          });
        }
      }
    });
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);

    startTransition(async () => {
      const res = await createManualDonationAction(manualForm);
      if (!res.success) {
        setManualError(res.error || 'Failed to record donation.');
        return;
      }

      // Add optimistically or refresh
      setIsManualModalOpen(false);
      window.location.reload();
    });
  };

  const exportCsv = () => {
    const headers = [
      'Donation ID',
      'Date',
      'Donor Name',
      'Donor Email',
      'Amount (USD)',
      'Status',
      'Payment Provider',
      'Transaction Ref',
      'Initiative',
      'Admin Notes',
    ];

    const rows = filteredDonations.map((d) => [
      d.orderNumber,
      new Date(d.createdAt).toISOString(),
      `"${d.donorName.replace(/"/g, '""')}"`,
      d.donorEmail,
      d.amount.toFixed(2),
      d.status,
      d.payments[0]?.provider || 'N/A',
      d.payments[0]?.transactionId || 'N/A',
      `"${d.initiative.replace(/"/g, '""')}"`,
      `"${(d.adminNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `ayeeyo-koris-donations-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ============================================================== */}
      {/* 1. EDITORIAL HEADER & QUICK ACTIONS                            */}
      {/* ============================================================== */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#182821] via-[#22382E] to-[#182821] border border-[#2B473A] p-6 sm:p-10 text-white shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D49B4B]/20 border border-[#D49B4B]/40 text-[#E5B56D] text-xs font-semibold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Philanthropic Impact Ledger</span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-4xl font-normal tracking-tight text-[#F9F6F0]">
            Ayeeyo Koris Children Donations
          </h1>

          <p className="text-sm text-[#A8BEB4] leading-relaxed">
            Direct educational scholarships, uniforms, textbooks, and nutrition for Somali
            children being raised by resilient grandmothers. Track real-time pledges and verified contributions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <Link
            href="/ayeyo-koris"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-medium text-white transition-all backdrop-blur-sm shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D49B4B]" />
            <span>View Public Page</span>
          </Link>

          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-medium text-white transition-all backdrop-blur-sm shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setManualError(null);
              setIsManualModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D49B4B] hover:bg-[#C28C3E] text-[#182821] text-xs font-semibold transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Record Offline Contribution</span>
          </button>
        </div>

        {/* Decorative corner crest */}
        <div className="absolute right-4 bottom-2 opacity-10 pointer-events-none w-48 h-48">
          <svg viewBox="0 0 100 100" fill="none" stroke="#FFFFFF" strokeWidth="1">
            <circle cx="50" cy="50" r="40" />
            <path d="M50 10 L50 90 M10 50 L90 50" />
          </svg>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. EXECUTIVE METRICS & IMPACT COUNTERS                          */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Verified Funds */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs flex flex-col justify-between hover:border-[#D48344]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F0EC] text-[#2D5A43] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2D5A43] bg-emerald-50 px-2 py-0.5 rounded-full">
              Verified Paid
            </span>
          </div>

          <div className="my-2">
            <span className="text-xs text-[#8A847A] block">Total Raised</span>
            <div className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
              ${summary.totalRaised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-[#8A847A]">
            <span>{summary.completedDonationsCount} completed transactions</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Settled
            </span>
          </div>
        </div>

        {/* Card 2: Pledged & In-Flight */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs flex flex-col justify-between hover:border-[#D48344]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF6ED] text-[#C46820] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C46820] bg-amber-50 px-2 py-0.5 rounded-full">
              Awaiting Checkout
            </span>
          </div>

          <div className="my-2">
            <span className="text-xs text-[#8A847A] block">Total Pledged</span>
            <div className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
              ${summary.totalPledged.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-[#8A847A]">
            <span>{summary.pendingDonationsCount} pending verification</span>
            <span className="text-amber-600 font-medium">In-flight pledges</span>
          </div>
        </div>

        {/* Card 3: Donors Count */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs flex flex-col justify-between hover:border-[#D48344]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4EFFC] text-[#7E4BC4] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7E4BC4] bg-purple-50 px-2 py-0.5 rounded-full">
              Benefactors
            </span>
          </div>

          <div className="my-2">
            <span className="text-xs text-[#8A847A] block">Unique Donors</span>
            <div className="font-playfair text-3xl sm:text-4xl font-normal text-[#1E1C1A]">
              {summary.totalDonorsCount}
            </div>
          </div>

          <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-[#8A847A]">
            <span>Avg: ${summary.avgDonationAmount.toFixed(2)}</span>
            <span className="text-[#182821] font-semibold">Community Patrons</span>
          </div>
        </div>

        {/* Card 4: Impact Sponsored */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs flex flex-col justify-between hover:border-[#D48344]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F7EBE8] text-[#B85233] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B85233] bg-red-50 px-2 py-0.5 rounded-full">
              Direct Impact
            </span>
          </div>

          <div className="my-2">
            <span className="text-xs text-[#8A847A] block">Scholarships & Kits</span>
            <div className="font-playfair text-3xl sm:text-4xl font-normal text-[#B85233]">
              {summary.impactScholarshipsFunded} <span className="text-base text-[#8A847A] font-sans font-normal">Terms ({summary.impactKitsFunded} Kits)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-[#8A847A]">
            <span>$50 kit / $250 term</span>
            <span className="text-[#B85233] font-semibold flex items-center gap-0.5">
              <Sparkles className="w-3.5 h-3.5" /> Funded
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SEARCH & FILTER TABS                                        */}
      {/* ============================================================== */}
      <section className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search donor name, email, or DONATE-AK ref..."
              className="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-[#FBF9F4] border border-[#EBE6DC] text-xs sm:text-sm text-[#1E1C1A] placeholder-[#8A847A] focus:outline-none focus:border-[#B85233] focus:ring-2 focus:ring-[#B85233]/15 transition-all"
            />
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8A847A] whitespace-nowrap">Payment Gateway:</span>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#FBF9F4] border border-[#EBE6DC] text-xs font-medium text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
            >
              <option value="ALL">All Methods</option>
              <option value="STRIPE">Stripe (Card)</option>
              <option value="PAYPAL">PayPal</option>
              <option value="BANK">Bank / Manual</option>
            </select>
          </div>
        </div>

        {/* Status segmented pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F5F2EB]">
          {[
            { label: 'All Contributions', value: 'ALL', count: donations.length },
            {
              label: 'Verified & Paid',
              value: 'PAID',
              count: donations.filter((d) => d.status === 'PAID').length,
            },
            {
              label: 'Pending Pledges',
              value: 'PENDING_PAYMENT',
              count: donations.filter((d) => d.status === 'PENDING_PAYMENT').length,
            },
            {
              label: 'Cancelled',
              value: 'CANCELLED',
              count: donations.filter((d) => d.status === 'CANCELLED').length,
            },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedStatus === tab.value
                  ? 'bg-[#182821] text-white shadow-xs'
                  : 'bg-[#FBF9F4] text-[#6B6152] hover:bg-[#EFEAE1] border border-[#EBE6DC]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedStatus === tab.value
                    ? 'bg-white/20 text-white'
                    : 'bg-[#E5DFD3] text-[#182821]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. DONATIONS LEDGER TABLE                                      */}
      {/* ============================================================== */}
      <section className="rounded-3xl bg-white border border-[#EBE6DC] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#F5F2EB] flex items-center justify-between">
          <div>
            <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
              Donation Records ({filteredDonations.length})
            </h2>
            <p className="text-xs text-[#8A847A] mt-0.5">
              Chronological log of Ayeeyo Koris Children sponsorships
            </p>
          </div>
        </div>

        {filteredDonations.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC] text-[#8A847A] mx-auto flex items-center justify-center">
              <HeartHandshake className="w-7 h-7 text-[#D49B4B]" />
            </div>
            <div>
              <p className="font-playfair text-lg text-[#1E1C1A]">No donation records found</p>
              <p className="text-xs text-[#8A847A] max-w-sm mx-auto mt-1">
                {searchQuery
                  ? 'No contributions matched your filter criteria.'
                  : 'New donor pledges through the Ayeeyo Koris Children portal or manual admin entries will appear here.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsManualModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#182821] text-white text-xs font-medium hover:bg-[#22382E] transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record First Donation</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="text-[#8A847A] uppercase text-[10px] tracking-wider bg-[#FAF8F5] border-b border-[#F5F2EB]">
                  <th className="py-3.5 px-6 text-start font-semibold">Ref Number</th>
                  <th className="py-3.5 px-6 text-start font-semibold">Donor Details</th>
                  <th className="py-3.5 px-6 text-start font-semibold">Date & Time</th>
                  <th className="py-3.5 px-6 text-start font-semibold">Amount</th>
                  <th className="py-3.5 px-6 text-start font-semibold">Gateway</th>
                  <th className="py-3.5 px-6 text-start font-semibold">Status</th>
                  <th className="py-3.5 px-6 text-end font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EB]">
                {filteredDonations.map((item) => {
                  const payment = item.payments[0];
                  const providerName = payment?.provider || 'Unknown';
                  const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FAF8F5] transition-colors group cursor-pointer"
                      onClick={() => {
                        setActiveDonation(item);
                        setAdminNoteInput(item.adminNotes || '');
                      }}
                    >
                      {/* Ref Number */}
                      <td className="py-4 px-6 font-mono font-medium text-[#1E1C1A]">
                        <div className="flex items-center gap-1.5">
                          <span>{item.orderNumber}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(item.orderNumber, item.id);
                            }}
                            className="text-[#8A847A] hover:text-[#1E1C1A] transition-colors p-0.5"
                            title="Copy Ref"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Donor Details */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-[#1E1C1A]">{item.donorName}</div>
                        <div className="text-[11px] text-[#8A847A]">{item.donorEmail}</div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-[#6B6152]">{formattedDate}</td>

                      {/* Amount */}
                      <td className="py-4 px-6 font-mono text-sm font-semibold text-[#182821]">
                        ${item.amount.toFixed(2)}
                      </td>

                      {/* Gateway Provider */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5F2EB] text-[#1E1C1A] text-[11px] font-medium border border-[#EAE4D8]">
                          {providerName.toUpperCase().includes('CARD') ||
                          providerName.toUpperCase().includes('STRIPE') ? (
                            <>
                              <CreditCard className="w-3.5 h-3.5 text-[#B85233]" />
                              <span>Stripe Card</span>
                            </>
                          ) : providerName.toUpperCase().includes('PAYPAL') ? (
                            <>
                              <CreditCard className="w-3.5 h-3.5 text-[#003087]" />
                              <span>PayPal</span>
                            </>
                          ) : (
                            <>
                              <Building className="w-3.5 h-3.5 text-[#2D5A43]" />
                              <span>Manual / Bank</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {item.status === 'PAID' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        ) : item.status === 'PENDING_PAYMENT' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pledged</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Cancelled</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDonation(item);
                            setAdminNoteInput(item.adminNotes || '');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white border border-[#EBE6DC] text-xs font-medium text-[#1E1C1A] hover:border-[#B85233] hover:text-[#B85233] transition-colors shadow-2xs inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 5. DONATION DETAILS & VERIFICATION MODAL                       */}
      {/* ============================================================== */}
      {activeDonation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="w-full max-w-xl bg-white rounded-3xl border border-[#EBE6DC] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-[#182821] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D49B4B]">
                  Contribution Breakdown
                </span>
                <h3 className="font-playfair text-xl text-white font-normal">
                  {activeDonation.orderNumber}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveDonation(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Top Summary Banner */}
              <div className="p-4 rounded-2xl bg-[#FBF9F4] border border-[#EBE6DC] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8A847A] block">Contribution Amount</span>
                  <div className="font-playfair text-3xl font-semibold text-[#182821]">
                    ${activeDonation.amount.toFixed(2)}{' '}
                    <span className="text-xs font-sans text-[#8A847A] font-normal">USD</span>
                  </div>
                </div>

                <div>
                  {activeDonation.status === 'PAID' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified & Settled</span>
                    </span>
                  ) : activeDonation.status === 'PENDING_PAYMENT' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Pledge Pending</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Cancelled</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Donor Meta Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC]">
                  <span className="text-[#8A847A] block mb-1">Donor Name</span>
                  <span className="font-semibold text-[#1E1C1A] text-sm">{activeDonation.donorName}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC]">
                  <span className="text-[#8A847A] block mb-1">Donor Email</span>
                  <span className="font-mono text-[#1E1C1A] break-all">{activeDonation.donorEmail}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC]">
                  <span className="text-[#8A847A] block mb-1">Initiative</span>
                  <span className="font-medium text-[#1E1C1A]">{activeDonation.initiative}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC]">
                  <span className="text-[#8A847A] block mb-1">Created At</span>
                  <span className="text-[#1E1C1A]">
                    {new Date(activeDonation.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              {activeDonation.payments.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#EBE6DC] space-y-2">
                  <div className="text-xs font-semibold text-[#182821] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Gateway Transaction Metadata</span>
                  </div>
                  <div className="text-xs text-[#6B6152] space-y-1">
                    <div>
                      <span className="font-medium">Provider:</span> {activeDonation.payments[0].provider}
                    </div>
                    {activeDonation.payments[0].transactionId && (
                      <div>
                        <span className="font-medium">Transaction ID:</span>{' '}
                        <span className="font-mono">{activeDonation.payments[0].transactionId}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Payment Record Status:</span>{' '}
                      {activeDonation.payments[0].status}
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Internal Notes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1E1C1A] block">
                  Administrative Notes / Audit Remarks
                </label>
                <textarea
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Add private administrative notes (e.g., Bank wire reference number, check details, receipt sent)..."
                  rows={3}
                  className="w-full p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] placeholder-[#8A847A] focus:outline-none focus:border-[#B85233]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#F5F2EB] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {activeDonation.status !== 'PAID' && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleStatusUpdate(activeDonation.id, OrderStatus.PAID)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark as Received & Verified</span>
                    </button>
                  )}

                  {activeDonation.status !== 'CANCELLED' && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleStatusUpdate(activeDonation.id, OrderStatus.CANCELLED)}
                      className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium transition-all border border-red-200 disabled:opacity-50"
                    >
                      <span>Mark Cancelled</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDonation(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1E1C1A] text-xs font-medium transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. RECORD MANUAL CONTRIBUTION MODAL                            */}
      {/* ============================================================== */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="w-full max-w-lg bg-white rounded-3xl border border-[#EBE6DC] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-[#182821] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D49B4B]">
                  Direct Ledger Entry
                </span>
                <h3 className="font-playfair text-xl text-white font-normal">
                  Record Offline Contribution
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="p-6 space-y-4 text-xs">
              {manualError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{manualError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1E1C1A] block">Donor Full Name *</label>
                <input
                  type="text"
                  required
                  value={manualForm.donorName}
                  onChange={(e) => setManualForm({ ...manualForm, donorName: e.target.value })}
                  placeholder="e.g., Fadumo Jama"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1E1C1A] block">Donor Email *</label>
                <input
                  type="email"
                  required
                  value={manualForm.donorEmail}
                  onChange={(e) => setManualForm({ ...manualForm, donorEmail: e.target.value })}
                  placeholder="e.g., donor@example.com"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1E1C1A] block">Amount (USD) *</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={manualForm.amount}
                    onChange={(e) => setManualForm({ ...manualForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] font-mono focus:outline-none focus:border-[#B85233]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1E1C1A] block">Initial Status</label>
                  <select
                    value={manualForm.status}
                    onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as 'PAID' | 'PENDING_PAYMENT' })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                  >
                    <option value="PAID">Verified & Received</option>
                    <option value="PENDING_PAYMENT">Pledged / Awaiting Wire</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1E1C1A] block">Payment Method / Channel</label>
                <select
                  value={manualForm.paymentMethod}
                  onChange={(e) => setManualForm({ ...manualForm, paymentMethod: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                >
                  <option value="BANK_TRANSFER">Direct Bank Wire / Transfer</option>
                  <option value="DAHABSHIIL">Dahabshiil / Remittance</option>
                  <option value="CASH_EVENT">Cash Contribution at Gala / Event</option>
                  <option value="CHECK">Check / Money Order</option>
                  <option value="ZELLE">Zelle / Electronic Transfer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1E1C1A] block">Internal Audit / Receipt Note</label>
                <textarea
                  value={manualForm.adminNotes}
                  onChange={(e) => setManualForm({ ...manualForm, adminNotes: e.target.value })}
                  placeholder="Optional audit notes: check number, bank transfer ID, reference name..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                />
              </div>

              <div className="pt-3 border-t border-[#F5F2EB] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1E1C1A] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-[#D49B4B] hover:bg-[#C28C3E] text-[#182821] font-semibold shadow-xs disabled:opacity-50"
                >
                  {isPending ? 'Recording...' : 'Save Contribution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
