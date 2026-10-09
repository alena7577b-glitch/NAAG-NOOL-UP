'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Archive,
  Compass,
  Mail,
  FileText,
  BookOpen,
  Image as ImageIcon,
  UserCheck,
  Shield,
  Settings,
  Search,
  Bell,
  Globe,
  ChevronDown,
  LogOut,
  Crown,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { logoutAction } from '@/lib/auth/actions';

interface AdminLayoutShellProps {
  children: React.ReactNode;
  userRole?: string;
  userName?: string;
  userEmail?: string;
}

export function AdminLayoutShell({
  children,
  userRole = 'SUPERADMIN',
  userName = 'Super Admin',
  userEmail = 'admin@naagnoolup.com',
}: AdminLayoutShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Grouped Navigation matching the source-of-truth mockup
  const primaryNav = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Inventory', href: '/admin/inventory', icon: Archive },
    { label: 'Community Signups', href: '/admin/community', icon: Compass },
    { label: 'Contact Submissions', href: '/admin/inquiries', icon: Mail },
  ];

  const contentNav = [
    { label: 'Pages', href: '/admin/pages', icon: FileText },
    { label: 'Blog Posts', href: '/admin/blog', icon: BookOpen },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  ];

  const managementNav = [
    { label: 'Users', href: '/admin/users', icon: UserCheck },
    { label: 'Roles & Permissions', href: '/admin/roles', icon: Shield },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1E1C1A] flex flex-col lg:flex-row antialiased selection:bg-[#B85233]/20">
      {/* ============================================================== */}
      {/* 1. LEFT SIDEBAR (Dark Forest Green #182821)                    */}
      {/* ============================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#182821] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-[#22382E] ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:sticky lg:h-screen lg:shrink-0`}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
          {/* Brand Logo Header */}
          <div className="p-6 pb-5 flex items-center justify-between border-b border-[#243B30]">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#D49B4B] group-hover:border-[#D49B4B] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12z" />
                  <path d="M12 8v10" />
                </svg>
              </div>
              <span className="font-playfair text-xl tracking-tight text-white font-normal">
                Naag Nool UP
              </span>
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="px-4 py-5 space-y-6 flex-1">
            {/* SUPER ADMIN BADGE */}
            <div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#D49B4B]">
                <Crown className="w-3.5 h-3.5 text-[#D49B4B]" />
                <span>Super Admin</span>
              </div>

              <div className="mt-2 space-y-1">
                {primaryNav.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        active
                          ? 'bg-[#283C33] text-white shadow-xs font-semibold'
                          : 'text-[#9EB1A7] hover:text-white hover:bg-[#1E332A]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#D49B4B]' : 'text-[#879C91]'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* CONTENT SECTION */}
            <div>
              <div className="px-3 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#668073] mb-2">
                Content
              </div>
              <div className="space-y-1">
                {contentNav.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm transition-all ${
                        active
                          ? 'bg-[#283C33] text-white font-semibold'
                          : 'text-[#9EB1A7] hover:text-white hover:bg-[#1E332A]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#D49B4B]' : 'text-[#879C91]'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* MANAGEMENT SECTION */}
            <div>
              <div className="px-3 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#668073] mb-2">
                Management
              </div>
              <div className="space-y-1">
                {managementNav.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm transition-all ${
                        active
                          ? 'bg-[#283C33] text-white font-semibold'
                          : 'text-[#9EB1A7] hover:text-white hover:bg-[#1E332A]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#D49B4B]' : 'text-[#879C91]'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BOTTOM SIDEBAR WATERMARK & MOTTO */}
          <div className="p-6 pt-4 border-t border-[#243B30] relative overflow-hidden">
            {/* Subtle botanical illustration */}
            <div className="flex items-center gap-3 text-[#D49B4B]/60 mb-2">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6">
                <path d="M4 28C14 26 24 16 28 4" />
                <path d="M28 4C20 6 12 14 10 24" />
                <path d="M16 16C22 18 26 22 28 28" />
              </svg>
            </div>
            <p className="font-playfair italic text-xs text-[#C5D3CB] leading-relaxed">
              Empowered Women Build Brighter Futures
            </p>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ============================================================== */}
      {/* 2. MAIN ADMIN CONTENT CONTAINER                                */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* ============================================================== */}
        {/* TOP HEADER BAR                                                 */}
        {/* ============================================================== */}
        <header className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md border-b border-[#EBE6DC] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#EBE6DC] text-[#1E1C1A]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search products, orders, customers, etc..."
                className="w-full ps-10 pe-14 py-2.5 rounded-2xl bg-white border border-[#EBE6DC] text-xs sm:text-sm text-[#1E1C1A] placeholder-[#A0988A] focus:outline-none focus:border-[#B85233] focus:ring-2 focus:ring-[#B85233]/15 transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3 pointer-events-none" />
              <kbd className="absolute right-3 top-2.5 px-2 py-0.5 rounded-md bg-[#F5F2EB] border border-[#E5E0D5] text-[10px] font-mono text-[#8A847A]">
                ⌘ K
              </kbd>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2.5 rounded-2xl bg-white border border-[#EBE6DC] text-[#1E1C1A] hover:bg-[#FAF8F5] transition-colors shadow-xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[#1E1C1A]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B85233] text-white text-[10px] font-bold flex items-center justify-center">
                1
              </span>
            </button>

            {/* Language Selector */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-2xl bg-white border border-[#EBE6DC] text-xs font-semibold text-[#1E1C1A] shadow-xs">
              <Globe className="w-3.5 h-3.5 text-[#8A847A]" />
              <span>EN</span>
              <ChevronDown className="w-3 h-3 text-[#8A847A]" />
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:ps-2 sm:pe-3 rounded-2xl bg-white border border-[#EBE6DC] hover:border-[#D48344]/50 transition-all shadow-xs"
              >
                {/* Circular Portrait Avatar */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#FAF8F5] border border-[#E8E2D8] shrink-0">
                  <Image
                    src="/images/hero-woman-portrait.png"
                    alt={userName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="hidden sm:block text-start leading-tight">
                  <div className="text-xs font-semibold text-[#1E1C1A]">{userName}</div>
                  <div className="text-[10px] font-mono text-[#B85233] uppercase">${userRole}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A847A] hidden sm:block" />
              </button>

              {/* Profile Dropdown Popup */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white border border-[#EBE6DC] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[#F0EBE1] mb-1">
                    <p className="text-xs font-semibold text-[#1E1C1A] truncate">{userName}</p>
                    <p className="text-[11px] text-[#8A847A] truncate font-mono">{userEmail}</p>
                  </div>

                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#1E1C1A] hover:bg-[#FAF8F5] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#8A847A]" />
                    <span>View Customer Store</span>
                  </Link>

                  <form action={logoutAction} className="pt-1 border-t border-[#F0EBE1] mt-1">
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ============================================================== */}
        {/* MAIN BODY CHILDREN                                             */}
        {/* ============================================================== */}
        <main className="flex-1 p-4 sm:p-8 space-y-8">
          {children}
        </main>

        {/* ============================================================== */}
        {/* ADMIN FOOTER BAR (Matching screenshot)                         */}
        {/* ============================================================== */}
        <footer className="px-4 sm:px-8 py-5 border-t border-[#EBE6DC] bg-[#FBF9F4] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A847A]">
          <div className="flex items-center gap-2">
            <span className="font-playfair text-[#1E1C1A] font-medium">Naag Nool UP</span>
            <span>© 2025. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#1E1C1A] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#1E1C1A] transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-[#1E1C1A] transition-colors">
              Help
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
