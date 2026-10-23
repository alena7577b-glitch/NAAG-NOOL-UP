'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  X,
  ShoppingBag,
  User as UserIcon,
  Shield,
  LogOut,
  ChevronRight,
  Sparkles,
  BookOpen,
  Coffee,
  Bookmark,
  Package,
  ArrowRight,
  Coins,
} from 'lucide-react';
import { logoutAction } from '@/lib/auth/actions';
import { CurrencySwitcher } from '@/components/currency/CurrencySwitcher';

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
  user?: AuthUserState | null;
}

const categoryHighlights = [
  {
    name: 'Journals',
    subtext: 'Guided reflection',
    href: '/shop?category=Journals',
    icon: BookOpen,
  },
  {
    name: 'Mugs',
    subtext: 'Artisan ceramics',
    href: '/shop?category=Mugs',
    icon: Coffee,
  },
  {
    name: 'Notebooks',
    subtext: 'Everyday notes',
    href: '/shop?category=Notebooks',
    icon: Bookmark,
  },
  {
    name: 'Bags',
    subtext: 'Cultural totes',
    href: '/shop?category=Bags',
    icon: Package,
  },
];

export function MobileNav({
  isOpen,
  onClose,
  items,
  cartCount = 0,
  user,
}: MobileNavProps) {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const pathname = usePathname();

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

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Drawer"
      className="fixed inset-0 z-[9999] lg:hidden flex justify-end"
    >
      {/* 1. Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-[4px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Slide-Over Luxury Sidebar Drawer */}
      <aside
        className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#FAF7F2] text-[#1E1C1A] h-full h-[100dvh] shadow-2xl flex flex-col overflow-hidden border-l border-[#E5DFC0]/80 animate-in slide-in-from-right duration-300"
      >
        {/* Top Decorative Brand Ribbon */}
        <div className="h-1 w-full bg-gradient-to-r from-[#B85233] via-[#D49B4B] to-[#2D5A43]" />

        {/* Header: Logo, Close Button, and Brand Subtitle */}
        <div className="px-6 pt-5 pb-4 border-b border-[#E8E2D5] bg-[#FAF7F2] shrink-0">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center focus-visible:outline-none transition-transform hover:scale-[1.02]"
              aria-label="Naag Nool UP Home"
            >
              <Image
                src="/images/logo-header-official.png"
                alt="Naag Nool UP"
                width={240}
                height={98}
                className="h-10 sm:h-11 w-auto object-contain"
                priority
              />
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="p-2.5 rounded-full text-[#4A463F] hover:text-[#1E1C1A] hover:bg-[#EAE5DC] active:scale-95 transition-all cursor-pointer focus-visible:outline-none"
            >
              <X className="w-5 h-5 transition-transform duration-200 hover:rotate-90" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] font-sans tracking-[0.16em] uppercase text-[#8A847A]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B85233]" />
              Resilient • Worthy • In Charge
            </span>
            <span className="text-[#D49B4B] font-serif italic text-xs lowercase">est. 2025</span>
          </div>
        </div>

        {/* Scrollable Navigation Body */}
        <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-7 custom-scrollbar">
          {/* Main Editorial Menu */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A847A] block mb-2 px-1">
              Navigation
            </span>
            <ul className="space-y-1">
              {items.map((item, idx) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname?.startsWith(item.href);

                // Editorial badge tags for specific cultural destinations
                const badge =
                  item.href === '/ayeyo-koris'
                    ? 'Cultural Heritage'
                    : item.href === '/shop'
                    ? 'Bespoke Goods'
                    : item.href === '/community'
                    ? 'Movement & Shax'
                    : null;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                        isActive
                          ? 'bg-[#B85233]/10 text-[#B85233] font-medium'
                          : 'text-[#1E1C1A] hover:bg-white hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-[#A69E90] group-hover:text-[#B85233] transition-colors w-5">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="font-playfair text-xl sm:text-2xl group-hover:translate-x-1 transition-transform">
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {badge && (
                          <span className="hidden sm:inline-block text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAE5DC] text-[#6B655B]">
                            {badge}
                          </span>
                        )}
                        <ChevronRight
                          className={`w-4 h-4 transition-all duration-200 ${
                            isActive
                              ? 'text-[#B85233] translate-x-0.5'
                              : 'text-[#A69E90] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-[#B85233]'
                          }`}
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Curated Collections Grid */}
          <div className="space-y-3 pt-2 border-t border-[#E8E2D5]">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A847A]">
                Shop Collections
              </span>
              <Link
                href="/shop"
                onClick={onClose}
                className="text-xs text-[#B85233] hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {categoryHighlights.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={onClose}
                    className="group p-3 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#B85233] transition-all hover:shadow-xs flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#B85233] flex items-center justify-center group-hover:bg-[#B85233] group-hover:text-white transition-colors">
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#C4BEB3] group-hover:text-[#B85233] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div>
                      <h4 className="font-playfair text-sm font-medium text-[#1E1C1A] group-hover:text-[#B85233] transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-[#8A847A] font-sans mt-0.5">
                        {cat.subtext}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Heritage & Sisterhood Cultural Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#2D5A43]/10 via-[#2D5A43]/5 to-[#B85233]/10 border border-[#2D5A43]/20 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2D5A43] text-[#FAF7F2] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-[#D49B4B]" />
            </div>
            <div className="space-y-1">
              <h5 className="font-playfair text-sm font-medium text-[#1E1C1A]">
                Ayeeyo Koris Children Foundation
              </h5>
              <p className="text-xs text-[#6B655B] leading-relaxed">
                Empowering generational wisdom, elderly elder care, and the mindful play of traditional Somali Shax.
              </p>
              <Link
                href="/ayeyo-koris"
                onClick={onClose}
                className="text-xs text-[#2D5A43] font-semibold hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>Discover the Mission</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Account Profile / Authentication Module */}
          <div className="pt-2 border-t border-[#E8E2D5] space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A847A] block px-1">
              Account & Profile
            </span>

            {user ? (
              <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D5] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#B85233]/10 text-[#B85233] flex items-center justify-center font-bold text-xs">
                      {(user.fullName || user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1E1C1A] leading-tight">
                        {user.fullName || user.email.split('@')[0]}
                      </p>
                      <p className="text-[11px] text-[#8A847A] truncate max-w-[170px]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {user.role !== 'CUSTOMER' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                      {user.role}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F0EBE1]">
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="text-xs font-medium text-[#4A463F] hover:text-[#B85233] py-1 px-2 rounded hover:bg-[#FAF7F2] transition-colors"
                  >
                    Overview
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={onClose}
                    className="text-xs font-medium text-[#4A463F] hover:text-[#B85233] py-1 px-2 rounded hover:bg-[#FAF7F2] transition-colors"
                  >
                    Order History
                  </Link>
                  <Link
                    href="/account/profile"
                    onClick={onClose}
                    className="text-xs font-medium text-[#4A463F] hover:text-[#B85233] py-1 px-2 rounded hover:bg-[#FAF7F2] transition-colors"
                  >
                    Edit Profile
                  </Link>
                  {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
                    <Link
                      href="/admin"
                      onClick={onClose}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-950 py-1 px-2 rounded hover:bg-amber-50 transition-colors flex items-center gap-1"
                    >
                      <Shield className="w-3 h-3" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                </div>

                <form action={logoutAction} className="pt-2 border-t border-[#F0EBE1]">
                  <button
                    type="submit"
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 text-xs font-medium text-red-600 hover:text-red-700 py-1.5 cursor-pointer rounded hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#B85233] hover:bg-[#A04428] text-white rounded-xl font-medium text-xs tracking-wider transition-colors shadow-xs"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="flex items-center justify-center py-2.5 px-4 bg-white border border-[#E5DFC0] text-[#1E1C1A] hover:bg-[#EAE5DC] rounded-xl font-medium text-xs tracking-wider transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>



          {/* Currency Switcher in Mobile Drawer */}
          <div className="pt-2 border-t border-[#E8E2D5] space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A847A] flex items-center gap-1.5">
                <Coins className="w-3 h-3 text-[#8A847A]" />
                Currency
              </span>
              <span className="text-[10px] text-[#A69E90]">CAD Default</span>
            </div>
            <CurrencySwitcher variant="pill" />
          </div>
        </nav>

        {/* Pinned Bottom Luxury Action Bar */}
        <div className="p-4 sm:p-5 border-t border-[#E5DFC0] bg-white/95 backdrop-blur-md flex items-center gap-3 shrink-0">
          <Link
            href="/cart"
            onClick={onClose}
            className="flex-1 flex items-center justify-between bg-[#B85233] hover:bg-[#A04428] text-white px-5 py-3 rounded-xl transition-all shadow-sm active:scale-[0.99] group"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -end-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[8px] font-bold text-[#B85233]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold tracking-wide uppercase">
                View Shopping Bag
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-white/90">
                ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </aside>
    </div>,
    document.body
  );
}
