'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Package, Settings, Sparkles, ChevronRight } from 'lucide-react';

interface AccountNavProps {
  orderCount?: number;
}

export function AccountNav({ orderCount = 0 }: AccountNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/account',
      label: 'Overview',
      subtitle: 'Dashboard & Highlights',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/account/orders',
      label: 'Order History',
      subtitle: 'Tracking & Receipts',
      icon: Package,
      badge: orderCount > 0 ? `${orderCount}` : undefined,
    },
    {
      href: '/account/profile',
      label: 'Personal Profile',
      subtitle: 'Contact & Addresses',
      icon: User,
    },
    {
      href: '/account/settings',
      label: 'Security & Settings',
      subtitle: 'Password & Credentials',
      icon: Settings,
    },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <div className="space-y-5">
      {/* 1. Desktop & Tablet Vertical Navigation */}
      <nav
        aria-label="Account Navigation"
        className="hidden lg:block bg-white rounded-3xl border border-[#E8E2D5] p-3 shadow-xs space-y-1.5 overflow-hidden"
      >
        <div className="px-4 py-2.5 pb-2 border-b border-[#F0EBE1] flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A847A]">
            Account Menu
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D49B4B]" />
        </div>

        <div className="space-y-1 pt-1">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-[#0A3929] text-white shadow-md shadow-[#0A3929]/20'
                    : 'text-[#3E3A35] hover:text-[#0A3929] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      active
                        ? 'bg-[#D49B4B] text-[#1E1C1A]'
                        : 'bg-[#F2ECE1] text-[#7A7265] group-hover:bg-[#EAE2D3] group-hover:text-[#0A3929]'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <span
                      className={`block text-xs font-semibold leading-tight tracking-wide ${
                        active ? 'text-white' : 'text-[#1E1C1A]'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`block text-[10px] leading-tight mt-0.5 ${
                        active ? 'text-[#D4DFD8]' : 'text-[#8A847A]'
                      }`}
                    >
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-tight ${
                        active
                          ? 'bg-[#D49B4B] text-[#1E1C1A]'
                          : 'bg-[#EAE5DC] text-[#4A463F]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 ${
                      active
                        ? 'text-[#D49B4B] translate-x-0.5'
                        : 'text-[#C5BEB2] group-hover:text-[#0A3929] group-hover:translate-x-0.5'
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 2. Mobile Horizontal Luxury Segmented Tabs */}
      <nav
        aria-label="Account Navigation Mobile"
        className="lg:hidden bg-white rounded-2xl border border-[#E8E2D5] p-2 shadow-xs overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center gap-1.5 min-w-max">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  active
                    ? 'bg-[#0A3929] text-white shadow-xs'
                    : 'text-[#4A463F] hover:bg-[#FAF7F2] hover:text-[#0A3929]'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    active ? 'text-[#D49B4B]' : 'text-[#8A847A]'
                  }`}
                />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                      active
                        ? 'bg-[#D49B4B] text-[#1E1C1A]'
                        : 'bg-[#EAE5DC] text-[#1E1C1A]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 3. Sisterhood Affirmation Card (Desktop Sidebar Footer) */}
      <div className="hidden lg:block relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#182B22] to-[#0A1C14] text-white p-5 border border-[#D49B4B]/30 shadow-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D49B4B]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="w-8 h-8 rounded-full bg-[#D49B4B]/20 text-[#D49B4B] flex items-center justify-center border border-[#D49B4B]/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <p className="font-playfair italic text-sm text-[#FAF7F2] leading-snug">
              &ldquo;A woman who honors her worth transforms every generation that follows.&rdquo;
            </p>
            <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#D49B4B] font-semibold">
              Naag Nool UP Sisterhood
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
