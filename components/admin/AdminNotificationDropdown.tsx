'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  ShoppingBag,
  HeartHandshake,
  Mail,
  AlertTriangle,
  Sparkles,
  CheckCheck,
} from 'lucide-react';
import { AdminNotification } from '@/lib/actions/admin-notifications';

export function AdminNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ORDER' | 'DONATION' | 'INQUIRY' | 'LOW_STOCK'>('ALL');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        const res = await fetch('/api/admin/notifications');
        if (res.ok && isMounted) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {
        // Ignore network errors in dropdown polling
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setIsOpen(false);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'ALL') return true;
    return n.type === activeFilter;
  });

  const getIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'DONATION':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#FFF6ED] text-[#C46820] flex items-center justify-center shrink-0 border border-[#F3DEC9]">
            <HeartHandshake className="w-4 h-4 text-[#D49B4B]" />
          </div>
        );
      case 'ORDER':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#F7EBE8] text-[#B85233] flex items-center justify-center shrink-0 border border-[#F2D7D0]">
            <ShoppingBag className="w-4 h-4" />
          </div>
        );
      case 'INQUIRY':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#F4EFFC] text-[#7E4BC4] flex items-center justify-center shrink-0 border border-[#E5D7FA]">
            <Mail className="w-4 h-4" />
          </div>
        );
      case 'LOW_STOCK':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#FEF3F2] text-[#D92D20] flex items-center justify-center shrink-0 border border-[#FECDCA]">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case 'COMMUNITY':
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-[#E8F0EC] text-[#2D5A43] flex items-center justify-center shrink-0 border border-[#CEE1D6]">
            <Sparkles className="w-4 h-4 text-[#2D5A43]" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-2xl border transition-all shadow-xs ${
          isOpen
            ? 'bg-[#182821] text-white border-[#182821]'
            : 'bg-white border-[#EBE6DC] text-[#1E1C1A] hover:bg-[#FAF8F5]'
        }`}
        title="Store Notifications"
        aria-label="Store Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />

        {/* Real Live Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#B85233] text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-75">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-[#EBE6DC] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-[#FAF8F5] border-b border-[#F0EBE1] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-playfair text-base font-semibold text-[#1E1C1A]">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#B85233]/15 text-[#B85233] border border-[#B85233]/20">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-medium text-[#8A847A] hover:text-[#182821] transition-colors flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-3 py-2 bg-white border-b border-[#F5F2EB] flex items-center gap-1 overflow-x-auto custom-scrollbar text-[11px]">
            {[
              { label: 'All', value: 'ALL' },
              { label: 'Orders', value: 'ORDER' },
              { label: 'Donations', value: 'DONATION' },
              { label: 'Inquiries', value: 'INQUIRY' },
              { label: 'Stock', value: 'LOW_STOCK' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveFilter(tab.value as any)}
                className={`px-2.5 py-1 rounded-xl font-medium transition-all shrink-0 ${
                  activeFilter === tab.value
                    ? 'bg-[#182821] text-white shadow-xs'
                    : 'bg-[#FBF9F4] text-[#6B6152] hover:bg-[#EFEAE1]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications Scrollable Body */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#F5F2EB]">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#EBE6DC] text-[#8A847A] mx-auto flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#8A847A]" />
                </div>
                <p className="text-xs font-semibold text-[#1E1C1A]">All caught up!</p>
                <p className="text-[11px] text-[#8A847A]">
                  No active store alerts at the moment.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => handleNotificationClick(item.id)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-[#FAF8F5] transition-colors group ${
                    item.unread ? 'bg-[#FCFBF8]' : ''
                  }`}
                >
                  {getIcon(item.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        className={`text-xs truncate ${
                          item.unread
                            ? 'font-bold text-[#1E1C1A]'
                            : 'font-medium text-[#4A453E]'
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-[#8A847A] shrink-0 font-mono">
                        {item.timeAgo}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8A847A] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#B85233] shrink-0 mt-2" />
                  )}
                </Link>
              ))
            )}
          </div>

          {/* Footer Navigation Shortcuts */}
          <div className="p-3 bg-[#FAF8F5] border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#6B6152]">
            <Link
              href="/admin/orders"
              onClick={() => setIsOpen(false)}
              className="hover:text-[#B85233] transition-colors font-medium text-[11px]"
            >
              Orders
            </Link>
            <span className="text-stone-300">•</span>
            <Link
              href="/admin/donations"
              onClick={() => setIsOpen(false)}
              className="hover:text-[#D49B4B] transition-colors font-medium text-[11px]"
            >
              Ayeeyo Koris
            </Link>
            <span className="text-stone-300">•</span>
            <Link
              href="/admin/inquiries"
              onClick={() => setIsOpen(false)}
              className="hover:text-[#B85233] transition-colors font-medium text-[11px]"
            >
              Inquiries
            </Link>
            <span className="text-stone-300">•</span>
            <Link
              href="/admin/inventory"
              onClick={() => setIsOpen(false)}
              className="hover:text-[#B85233] transition-colors font-medium text-[11px]"
            >
              Inventory
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
