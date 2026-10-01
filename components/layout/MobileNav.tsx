'use client';

import { useEffect } from 'react';
import Link from 'next/link';
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#F9F6F0] animate-in fade-in duration-200"
    >
      {/* Mobile Nav Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5DFC0]">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 focus-visible:outline-none"
        >
          <span className="font-playfair text-xl font-medium tracking-wider text-[#1E1C1A]">
            NAAG NOOL UP
          </span>
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

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        <ul className="space-y-4">
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

        {/* User Account Controls in Mobile Menu */}
        {user ? (
          <div className="pt-6 border-t border-[#E5DFC0]/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B655B]">
                <UserCheck className="w-4 h-4 text-terracotta" />
                <span>Account ({user.fullName || user.email.split('@')[0]})</span>
              </div>
              {user.role !== 'CUSTOMER' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber/20 text-amber-900 border border-amber/30">
                  {user.role}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Link
                href="/account"
                onClick={onClose}
                className="block text-sm font-medium text-stone-700 hover:text-terracotta transition-colors py-1"
              >
                Account Overview
              </Link>
              <Link
                href="/account/orders"
                onClick={onClose}
                className="block text-sm font-medium text-stone-700 hover:text-terracotta transition-colors py-1"
              >
                Order History
              </Link>
              <Link
                href="/account/profile"
                onClick={onClose}
                className="block text-sm font-medium text-stone-700 hover:text-terracotta transition-colors py-1"
              >
                Personal Profile
              </Link>
              <Link
                href="/account/settings"
                onClick={onClose}
                className="block text-sm font-medium text-stone-700 hover:text-terracotta transition-colors py-1"
              >
                Security & Settings
              </Link>
              {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="flex items-center gap-2 text-sm font-semibold text-amber-900 bg-amber/10 hover:bg-amber/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <Shield className="w-4 h-4 text-amber-700" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
              <form action={logoutAction} className="pt-2">
                <button
                  type="submit"
                  onClick={onClose}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 py-1"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="pt-6 border-t border-[#E5DFC0]/70 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B655B]">
              <UserIcon className="w-4 h-4" />
              <span>Authentication</span>
            </div>
            <div className="flex gap-3">
              <Link
                href="/login"
                onClick={onClose}
                className="flex-1 text-center py-2.5 px-4 bg-terracotta text-white rounded-xl font-medium text-xs tracking-wide hover:bg-terracotta-dark transition-colors shadow-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex-1 text-center py-2.5 px-4 bg-white border border-stone-300 text-dusk rounded-xl font-medium text-xs tracking-wide hover:bg-sand transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* Language Selection */}
        <div className="pt-6 border-t border-[#E5DFC0]/70 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B655B]">
            <Globe className="w-4 h-4" />
            <span>Language</span>
          </div>
          <div className="flex flex-wrap gap-2">
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
                    ? 'bg-[#B85233] text-white'
                    : 'bg-white border border-[#E5DFC0] text-[#1E1C1A] hover:bg-[#EAE5DC]'
                }`}
              >
                {localeNames[loc].nativeName}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Footer Utility Actions */}
      <div className="p-6 border-t border-[#E5DFC0] bg-white flex items-center justify-between">
        <Link
          href={user ? "/account" : "/login"}
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-medium text-[#1E1C1A] hover:text-[#B85233] transition-colors"
        >
          <UserIcon className="w-4 h-4" />
          <span>{user ? "My Account" : "Sign In"}</span>
        </Link>
        <Link
          href="/cart"
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-medium text-[#1E1C1A] hover:text-[#B85233] transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -end-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#B85233] text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart ({cartCount})</span>
        </Link>
      </div>
    </div>
  );
}
