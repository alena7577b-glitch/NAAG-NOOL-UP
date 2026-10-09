'use client';

import { useState } from 'react';
import {
  Mail,
  Search,
  CheckCircle,
  Clock,
  MessageSquare,
  X,
  Send,
} from 'lucide-react';
import { ContactStatus } from '@prisma/client';
import { updateInquiryStatusAction } from '@/lib/actions/admin-management';

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

interface AdminInquiriesViewProps {
  initialInquiries: InquiryItem[];
}

export function AdminInquiriesView({ initialInquiries }: AdminInquiriesViewProps) {
  const [inquiries, setInquiries] = useState<InquiryItem[]>(initialInquiries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const filtered = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusUpdate = async (id: string, newStatus: ContactStatus) => {
    setIsUpdating(true);
    try {
      const res = await updateInquiryStatusAction(id, newStatus);
      if (res.success) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch {
      // Ignore
    } finally {
      setIsUpdating(false);
    }
  };

  const unreadCount = inquiries.filter((i) => i.status === 'UNREAD').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B85233] mb-1">
          <Mail className="w-4 h-4" />
          <span>Customer Communications</span>
        </div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A]">
          Contact Submissions
        </h1>
        <p className="text-sm text-[#6B655B] mt-1">
          Inquiries, bulk order requests, media questions, and feedback submitted through the contact page.
        </p>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Unread Messages</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-amber-600 mt-2">
            {unreadCount}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Pending response</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Total Inquiries</span>
            <MessageSquare className="w-4 h-4 text-[#182821]" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            {inquiries.length}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Lifetime customer messages</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Replied / Resolved</span>
            <CheckCircle className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            {inquiries.filter((i) => i.status === 'REPLIED').length}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Addressed by staff</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE6DC] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#8A847A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by sender name, subject or message text..."
          className="w-full text-sm bg-transparent outline-none text-[#1E1C1A] placeholder-[#8A847A]"
        />
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-3xl border border-[#EBE6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#F0EBE1] bg-[#FAF8F5] text-[#8A847A] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-4 px-6 text-start">Sender</th>
                <th className="py-4 px-6 text-start">Subject</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-start">Date</th>
                <th className="py-4 px-6 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#8A847A]">
                    No contact submissions recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#FAF8F5]/80 transition-colors ${
                      item.status === 'UNREAD' ? 'bg-[#FAF8F5]/40 font-medium' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {item.status === 'UNREAD' && (
                          <span className="w-2 h-2 rounded-full bg-[#B85233]" />
                        )}
                        <div>
                          <span className="text-[#1E1C1A] block">{item.name}</span>
                          <span className="text-[11px] text-[#8A847A] font-mono">
                            {item.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-[#1E1C1A] max-w-xs truncate">
                      {item.subject}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          item.status === 'UNREAD'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : item.status === 'REPLIED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-[#8A847A] text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-end">
                      <button
                        type="button"
                        onClick={() => setSelectedInquiry(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs font-medium text-[#1E1C1A] hover:border-[#B85233] transition-colors"
                      >
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#EBE6DC] space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-playfair text-xl font-semibold text-[#1E1C1A]">
                  {selectedInquiry.subject}
                </h3>
                <p className="text-xs text-[#8A847A] mt-1">
                  From: {selectedInquiry.name} &lt;{selectedInquiry.email}&gt;
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              {selectedInquiry.message}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F0EBE1]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedInquiry.id, 'UNREAD')}
                  disabled={isUpdating}
                  className="px-2.5 py-1 rounded-lg text-xs border border-[#EBE6DC] hover:bg-stone-50"
                >
                  Mark Unread
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedInquiry.id, 'REPLIED')}
                  disabled={isUpdating}
                  className="px-2.5 py-1 rounded-lg text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-medium"
                >
                  Mark Replied
                </button>
              </div>

              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(
                  selectedInquiry.subject
                )}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#182821] text-white text-xs font-medium hover:bg-[#22382E] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply by Email</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
