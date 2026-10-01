import Link from 'next/link';
import { User, Package, Settings, ArrowRight, ShoppingBag, Clock } from 'lucide-react';
import { requireAuthenticatedUser } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function AccountOverviewPage() {
  const user = await requireAuthenticatedUser();

  // Fetch recent orders for this user
  let recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: unknown;
    status: string;
    createdAt: Date;
    items: Array<{ id: string; quantity: number }>;
  }> = [];

  try {
    recentOrders = await db.order.findMany({
      where: { userId: user.id },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });
  } catch {
    recentOrders = [];
  }

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-white border border-[#E5DFC0] rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="font-playfair text-xl sm:text-2xl font-medium text-[#1E1C1A]">
          Welcome to Your Space, {user.fullName || 'Valued Member'}
        </h2>
        <p className="mt-2 text-sm text-[#1E1C1A]/70 leading-relaxed font-sans max-w-2xl">
          From your account dashboard, you can track recent orders, manage your personal profile, and update your security settings.
        </p>

        {/* Quick Shortcuts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Link
            href="/account/profile"
            className="group p-4 rounded-xl border border-[#E5DFC0] bg-[#F9F6F0]/50 hover:bg-white hover:border-[#B85233]/40 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#B85233]/10 text-[#B85233] flex items-center justify-center mb-2">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-playfair text-sm font-medium text-[#1E1C1A] group-hover:text-[#B85233] transition-colors">
              Profile Details
            </h3>
            <p className="text-xs text-[#1E1C1A]/60 mt-0.5">Manage personal information</p>
          </Link>

          <Link
            href="/account/orders"
            className="group p-4 rounded-xl border border-[#E5DFC0] bg-[#F9F6F0]/50 hover:bg-white hover:border-[#B85233]/40 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#B85233]/10 text-[#B85233] flex items-center justify-center mb-2">
              <Package className="w-4 h-4" />
            </div>
            <h3 className="font-playfair text-sm font-medium text-[#1E1C1A] group-hover:text-[#B85233] transition-colors">
              Order History
            </h3>
            <p className="text-xs text-[#1E1C1A]/60 mt-0.5">View purchases & receipts</p>
          </Link>

          <Link
            href="/account/settings"
            className="group p-4 rounded-xl border border-[#E5DFC0] bg-[#F9F6F0]/50 hover:bg-white hover:border-[#B85233]/40 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#B85233]/10 text-[#B85233] flex items-center justify-center mb-2">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="font-playfair text-sm font-medium text-[#1E1C1A] group-hover:text-[#B85233] transition-colors">
              Account Security
            </h3>
            <p className="text-xs text-[#1E1C1A]/60 mt-0.5">Password & credentials</p>
          </Link>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white border border-[#E5DFC0] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-playfair text-lg font-medium text-[#1E1C1A] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#B85233]" />
            Recent Activity
          </h2>
          {recentOrders.length > 0 && (
            <Link
              href="/account/orders"
              className="text-xs font-medium text-[#B85233] hover:underline flex items-center gap-1"
            >
              View all orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-[#E5DFC0] rounded-xl bg-[#F9F6F0]/40">
            <div className="w-12 h-12 rounded-full bg-[#B85233]/10 text-[#B85233] flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-playfair text-base font-medium text-[#1E1C1A]">
              No Orders Yet
            </h3>
            <p className="text-xs text-[#1E1C1A]/70 max-w-sm mx-auto mt-1 mb-5">
              Your story begins when you find what resonates with you. Explore our empowering journals and resources.
            </p>
            <Link href="/shop">
              <Button variant="outline" size="sm">
                Explore Journals
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E5DFC0]/70">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-medium text-[#1E1C1A]">
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-xs text-[#1E1C1A]/60">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {' • '}
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-[#EAE5DC] text-[#1E1C1A]">
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-[#1E1C1A]">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
