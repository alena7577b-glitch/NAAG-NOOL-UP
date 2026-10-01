import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Shield, Users, Package, ShoppingCart, LogOut, CheckCircle2 } from 'lucide-react';
import { requireAdmin } from '@/lib/auth/server';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { logoutAction } from '@/lib/auth/actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Console — Naag Nool UP',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardFoundationPage() {
  let user;
  try {
    user = await requireAdmin();
  } catch {
    redirect('/admin/unauthorized');
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] py-10 px-4 sm:px-6 lg:px-8">
      <Container size="default">
        {/* Admin Top Header */}
        <div className="bg-[#1E1C1A] text-white rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md border border-[#332E2B]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#B85233]/20 border border-[#B85233]/40 flex items-center justify-center text-[#D49B4B] shrink-0">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-[#D49B4B]/20 text-[#D49B4B] border border-[#D49B4B]/30">
                  {user.role}
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Authenticated Session
                </span>
              </div>
              <h1 className="font-playfair text-2xl sm:text-3xl font-normal mt-1.5 text-white">
                Admin Console
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 font-sans">
                Logged in as <strong className="text-white">{user.fullName || user.email}</strong> ({user.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <Link href="/account" className="flex-1 sm:flex-initial">
              <Button variant="outline" size="sm" className="w-full justify-center text-xs bg-transparent text-white border-stone-600 hover:bg-stone-800">
                Customer View
              </Button>
            </Link>
            <form action={logoutAction} className="flex-1 sm:flex-initial">
              <Button variant="ghost" size="sm" type="submit" className="w-full justify-center text-xs text-red-300 hover:text-red-200 hover:bg-red-950/40">
                <LogOut className="w-3.5 h-3.5 me-1.5" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        {/* Foundation Modules Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E5DFC0] rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#B85233]/10 text-[#B85233] flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="font-playfair text-lg font-medium text-[#1E1C1A] mb-1">
              Catalog & Inventory
            </h2>
            <p className="text-xs text-[#1E1C1A]/70 leading-relaxed">
              Product models and inventory schema are active and secured with Row Level Security. Full catalog editor is scheduled for Phase 4.
            </p>
          </div>

          <div className="bg-white border border-[#E5DFC0] rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#4D5844]/10 text-[#4D5844] flex items-center justify-center mb-4">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h2 className="font-playfair text-lg font-medium text-[#1E1C1A] mb-1">
              Orders & Fulfillment
            </h2>
            <p className="text-xs text-[#1E1C1A]/70 leading-relaxed">
              Orders and payment models are connected with Prisma. Administrative order fulfillment management will be accessible in the admin phase.
            </p>
          </div>

          <div className="bg-white border border-[#E5DFC0] rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#D49B4B]/10 text-[#D49B4B] flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="font-playfair text-lg font-medium text-[#1E1C1A] mb-1">
              User & Role Management
            </h2>
            <p className="text-xs text-[#1E1C1A]/70 leading-relaxed">
              Role-based access control engine is active. Only SUPERADMIN accounts can promote or reassign user roles.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
