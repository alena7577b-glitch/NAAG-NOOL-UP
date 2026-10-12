'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, User as UserIcon, Globe, Shield, LogOut, UserCheck } from 'lucide-react';
import { locales, localeNames, Locale } from '@/config/i18n';
import { logoutAction } from '@/lib/auth/actions';

export interface AuthUserState {
  id: string;
  email: string;
  fullName?: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN';
}

export interface NavItem {
  label: string;
  href: string;
}

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  cartCount?: number;
  currentLocale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
  user?: AuthUserState | null;
}

export function MobileNav({
  isOpen,
  onClose,
  items,
  cartCount = 0,
  currentLocale = 'en',
  onLocaleChange,
  user,
}: MobileNavProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Drawer"
      className="fixed inset-0 z-[9999] lg:hidden flex justify-end"
    >
      {/* 1. Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-Over Sidebar Drawer */}
      <aside
        className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#FAF8F5] text-[#1E1C1A] h-full h-[100dvh] shadow-2xl flex flex-col overflow-hidden border-l border-[#E5DFC0] animate-in slide-in-from-right duration-300"
      >
        {/* Mobile Nav Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5DFC0] bg-[#FAF8F5] shrink-0">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center focus-visible:outline-none"
            aria-label="Naag Nool UP Home"
          >
            <Image
              src="/images/logo-header-official.png"
              alt="Naag Nool UP"
              width={240}
              height={98}
              className="h-10 sm:h-11 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-full text-[#1E1C1A] hover:bg-[#EAE5DC] transition-colors cursor-pointer focus-visible:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
          {/* Main Editorial Navigation */}
          <ul className="space-y-3 pb-4 border-b border-[#E5DFC0]/70">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block font-playfair text-2xl text-[#1E1C1A] hover:text-[#B85233] transition-colors py-1 focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Core Categories Quick Access */}
          <div className="space-y-2.5 pb-4 border-b border-[#E5DFC0]/70">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A847A]">
              Shop Collections
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { name: 'Mugs', href: '/shop?category=Mugs' },
                { name: 'Journals', href: '/shop?category=Journals' },
                { name: 'Notebooks', href: '/shop?category=Notebooks' },
                { name: 'Bags', href: '/shop?category=Bags' },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg bg-white border border-[#EBE6DC] text-xs font-medium text-[#1E1C1A] hover:border-[#B85233] hover:text-[#B85233] transition-colors shadow-xs"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Account Controls */}
          {user ? (
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B655B]">
                  <UserCheck className="w-4 h-4 text-[#B85233]" />
                  <span>Account ({user.fullName || user.email.split('@')[0]})</span>
                </div>
                {user.role !== 'CUSTOMER' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    {user.role}
                  </span>
                )}
              </div>
              <div className="space-y-1.5 pt-1">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="block text-sm font-medium text-stone-700 hover:text-[#B85233] transition-colors py-1"
                >
                  Account Overview
                </Link>
                <Link
                  href="/account/orders"
                  onClick={onClose}
                  className="block text-sm font-medium text-stone-700 hover:text-[#B85233] transition-colors py-1"
                >
                  Order History
                </Link>
                <Link
                  href="/account/profile"
                  onClick={onClose}
                  className="block text-sm font-medium text-stone-700 hover:text-[#B85233] transition-colors py-1"
                >
                  Personal Profile
                </Link>
                {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-2 text-sm font-semibold text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-lg transition-colors border border-amber-200 mt-2"
                  >
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <form action={logoutAction} className="pt-2">
                  <button
                    type="submit"
                    onClick={onClose}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 py-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B655B]">
                <UserIcon className="w-4 h-4" />
                <span>Account Access</span>
              </div>
              <div className="flex gap-2.5 pt-1">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex-1 text-center py-2.5 px-4 bg-[#B85233] text-white rounded-xl font-medium text-xs tracking-wide hover:bg-[#A04428] transition-colors shadow-xs"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="flex-1 text-center py-2.5 px-4 bg-white border border-[#E5DFC0] text-[#1E1C1A] rounded-xl font-medium text-xs tracking-wide hover:bg-[#EAE5DC] transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          )}

          {/* Language Selection */}
          <div className="pt-4 border-t border-[#E5DFC0]/70 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B655B]">
              <Globe className="w-4 h-4" />
              <span>Language</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {locales.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    onLocaleChange?.(loc);
                    onClose();
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    currentLocale === loc
                      ? 'bg-[#B85233] text-white shadow-xs'
                      : 'bg-white border border-[#E5DFC0] text-[#1E1C1A] hover:bg-[#EAE5DC]'
                  }`}
                >
                  {localeNames[loc].nativeName}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Footer Utility Actions (Pinned to Bottom) */}
        <div className="p-5 border-t border-[#E5DFC0] bg-white flex items-center justify-between shrink-0">
          <Link
            href={user ? '/account' : '/login'}
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium text-[#1E1C1A] hover:text-[#B85233] transition-colors"
          >
            <UserIcon className="w-4 h-4 text-[#8A847A]" />
            <span>{user ? 'My Account' : 'Sign In'}</span>
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-[#B85233] hover:bg-[#A04428] px-4 py-2 rounded-full transition-colors shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag ({cartCount})</span>
          </Link>
        </div>
      </aside>
    </div>,
    document.body
  );
}
