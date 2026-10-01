import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Settings, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { requireAuthenticatedUser } from '@/lib/auth/server';
import { isAdmin } from '@/lib/auth/rbac';
import { Container } from '@/components/ui/Container';
import { logoutAction } from '@/lib/auth/actions';

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

  return (
    <div className="min-h-[85vh] bg-[#F9F6F0] py-10 px-4 sm:px-6 lg:px-8">
      <Container size="default">
        {/* Account Top Banner */}
        <div className="bg-white border border-[#E5DFC0] rounded-2xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#B85233]/10 border border-[#B85233]/20 flex items-center justify-center text-[#B85233] text-xl font-medium font-playfair shrink-0">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-playfair text-2xl font-medium text-[#1E1C1A]">
                  {user.fullName || 'Valued Member'}
                </h1>
                <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#EAE5DC] text-[#6B655B]">
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-[#1E1C1A]/70 font-sans mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            {userIsAdmin && (
              <Link href="/admin">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-[#1E1C1A] text-[#D49B4B] hover:bg-[#2A2724] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Console
                </button>
              </Link>
            )}
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="bg-white border border-[#E5DFC0] rounded-2xl p-3 shadow-sm space-y-1">
              <Link
                href="/account"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#1E1C1A] hover:bg-[#F9F6F0] hover:text-[#B85233] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-[#B85233]" />
                <span>Overview</span>
              </Link>
              <Link
                href="/account/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#1E1C1A] hover:bg-[#F9F6F0] hover:text-[#B85233] transition-colors"
              >
                <User className="w-4 h-4 text-[#B85233]" />
                <span>Profile Details</span>
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#1E1C1A] hover:bg-[#F9F6F0] hover:text-[#B85233] transition-colors"
              >
                <Package className="w-4 h-4 text-[#B85233]" />
                <span>Order History</span>
              </Link>
              <Link
                href="/account/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#1E1C1A] hover:bg-[#F9F6F0] hover:text-[#B85233] transition-colors"
              >
                <Settings className="w-4 h-4 text-[#B85233]" />
                <span>Security & Settings</span>
              </Link>
            </nav>
          </aside>

          {/* Main Account Content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </Container>
    </div>
  );
}
