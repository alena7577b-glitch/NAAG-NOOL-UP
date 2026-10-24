import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Shield, ShoppingBag, Sparkles, Crown, CheckCircle2 } from 'lucide-react';
import { requireAuthenticatedUser } from '@/lib/auth/server';
import { isAdmin } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { Container } from '@/components/ui/Container';
import { logoutAction } from '@/lib/auth/actions';
import { AccountNav } from '@/components/account/AccountNav';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Account — Naag Nool UP',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;
  try {
    user = await requireAuthenticatedUser();
  } catch {
    redirect('/login?returnUrl=/account');
  }

  const userIsAdmin = isAdmin(user);
  const isSuperAdmin = user.role === 'SUPERADMIN';

  // Fetch verified order count for navigation badge
  let orderCount = 0;
  try {
    orderCount = await db.order.count({
      where: { userId: user.id },
    });
  } catch {
    orderCount = 0;
  }

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : user.email.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1C1A] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#D49B4B]/30 selection:text-[#0A3929]">
      <Container size="default">
        {/* =========================================================================
            1. PREMIER LUXURY MEMBER HEADER BANNER
           ========================================================================= */}
        <header className="relative mb-8 rounded-[28px] sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-[#061F16] via-[#0A3929] to-[#0F4733] text-white border border-[#D49B4B]/35 shadow-xl">
          {/* Subtle gold radiance & watermark decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D49B4B]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 left-1/4 w-72 h-72 bg-[#B85233]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-4 right-6 opacity-5 pointer-events-none hidden sm:block">
            <svg width="220" height="220" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <circle cx="50" cy="50" r="45" strokeWidth="1" />
              <circle cx="50" cy="50" r="30" strokeWidth="0.8" />
              <circle cx="50" cy="50" r="15" strokeWidth="0.6" />
            </svg>
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            {/* Left: Avatar & Identity Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              {/* Monogram Crest Avatar */}
              <div className="relative shrink-0">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#B85233] via-[#C96B40] to-[#D49B4B] flex items-center justify-center text-white font-playfair text-2xl sm:text-3xl font-medium tracking-tight shadow-xl ring-4 ring-[#D49B4B]/40 ring-offset-2 ring-offset-[#061F16]">
                  {initials}
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0A3929] border-2 border-[#D49B4B] flex items-center justify-center text-[#D49B4B] shadow-sm"
                  title="Verified Account"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              {/* Identity & Badges */}
              <div className="space-y-2 text-start">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-[#D49B4B]">
                    Member Space
                  </span>
                  <span className="text-white/30 hidden sm:inline">•</span>

                  {/* Role Badge */}
                  {isSuperAdmin ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-[#D49B4B]/20 text-[#F5DEB3] border border-[#D49B4B]/40 shadow-inner">
                      <Crown className="w-3 h-3 text-[#D49B4B]" />
                      Super Administrator
                    </span>
                  ) : userIsAdmin ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-emerald-900/50 text-emerald-200 border border-emerald-400/40">
                      <Shield className="w-3 h-3 text-emerald-300" />
                      Staff Administrator
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-white/10 text-[#FAF6F0] border border-white/20 backdrop-blur-xs">
                      <Sparkles className="w-3 h-3 text-[#D49B4B]" />
                      Valued Member
                    </span>
                  )}
                </div>

                <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-normal text-white leading-tight tracking-tight">
                  {user.fullName || 'Valued Member'}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#C8D4CD]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {user.email}
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="text-[#E0D8C9]">
                    Member of Naag Nool UP
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Elevated Action Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0 border-t border-white/10 lg:border-t-0">
              {userIsAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/40 hover:bg-black/60 text-[#D49B4B] border border-[#D49B4B]/50 transition-all duration-200 shadow-sm active:scale-95"
                >
                  <Shield className="w-3.5 h-3.5 text-[#D49B4B]" />
                  <span>Admin Console</span>
                </Link>
              )}

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#D49B4B] hover:bg-[#C28C3E] text-[#1E1C1A] transition-all duration-200 shadow-md active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop Boutique</span>
              </Link>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xs transition-all duration-200 cursor-pointer active:scale-95"
                  title="Sign out of account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* =========================================================================
            2. TWO-COLUMN LUXURY DASHBOARD LAYOUT
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 w-full">
            <AccountNav orderCount={orderCount} />
          </aside>

          {/* Dynamic Content Canvas */}
          <main className="lg:col-span-8 xl:col-span-9 w-full min-w-0">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}
