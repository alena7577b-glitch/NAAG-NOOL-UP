import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Package,
  Settings,
  ArrowRight,
  ShoppingBag,
  Clock,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Truck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { requireAuthenticatedUser } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

function getStatusPill(status: OrderStatus) {
  switch (status) {
    case 'PAID':
    case 'DELIVERED':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold rounded-full shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {status}
        </span>
      );
    case 'PROCESSING':
    case 'SHIPPED':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold rounded-full shadow-2xs">
          <Truck className="w-3.5 h-3.5 text-amber-700" />
          {status}
        </span>
      );
    case 'CANCELLED':
    case 'REFUNDED':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold rounded-full shadow-2xs">
          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          {status}
        </span>
      );
    case 'PENDING_PAYMENT':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-semibold rounded-full shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-stone-500" />
          {status}
        </span>
      );
  }
}

export default async function AccountOverviewPage() {
  const user = await requireAuthenticatedUser();

  // Fetch recent orders with full product and image details
  let recentOrders: any[] = [];
  let totalOrderCount = 0;

  try {
    const [orders, count] = await Promise.all([
      db.order.findMany({
        where: { userId: user.id },
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                    orderBy: { sortOrder: 'asc' },
                  },
                },
              },
            },
          },
        },
      }),
      db.order.count({
        where: { userId: user.id },
      }),
    ]);
    recentOrders = orders;
    totalOrderCount = count;
  } catch {
    recentOrders = [];
    totalOrderCount = 0;
  }

  const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Sister';

  return (
    <div className="space-y-8">
      {/* =========================================================================
          1. EDITORIAL SALUTATION & EXECUTIVE METRICS
         ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D49B4B]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F0EBE1] pb-5">
            <div>
              <p className="font-cormorant italic text-base sm:text-lg text-[#B85233] font-medium">
                Kusoo dhowaw • Welcome Home
              </p>
              <h2 className="font-playfair text-2xl sm:text-3xl text-[#1E1C1A] font-normal tracking-tight mt-0.5">
                Peace & Blessings, {firstName}
              </h2>
            </div>
            <p className="text-xs text-[#8A847A] font-sans">
              Your personal sanctum for intentional living, sisterhood, and wellness.
            </p>
          </div>

          {/* 4 Executive Highlight Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
            {/* Total Orders */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A847A] block">
                Total Orders
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A]">
                  {totalOrderCount}
                </span>
                <span className="text-xs text-[#8A847A]">completed</span>
              </div>
            </div>

            {/* Sisterhood Tier */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A847A] block">
                Sisterhood Circle
              </span>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-2xs" />
                <span className="text-xs font-semibold text-[#0A3929]">
                  Active Member
                </span>
              </div>
            </div>

            {/* Ayeeyo Koris Impact */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A847A] block">
                Social Impact
              </span>
              <div className="flex items-center gap-1.5 pt-1">
                <HeartHandshake className="w-3.5 h-3.5 text-[#B85233]" />
                <span className="text-xs font-semibold text-[#B85233]">
                  Ayeeyo Koris Supporter
                </span>
              </div>
            </div>

            {/* Account Protection */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A847A] block">
                Security Status
              </span>
              <div className="flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-800">
                  Encrypted & Safe
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. CORE ACTION PORTALS (3 INTERACTIVE LUXURY CARDS)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Profile Card */}
        <Link
          href="/account/profile"
          className="group relative bg-white rounded-3xl border border-[#E8E2D5] p-6 shadow-xs hover:shadow-md hover:border-[#D49B4B]/60 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#B85233]/10 text-[#B85233] flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <User className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="font-playfair text-lg font-medium text-[#1E1C1A] group-hover:text-[#B85233] transition-colors">
                Personal Profile
              </h3>
              <p className="text-xs text-[#6B655B] mt-1.5 leading-relaxed font-sans">
                Review your registered full name, primary email address, and shipping delivery details.
              </p>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-[#F0EBE1] flex items-center justify-between text-xs font-semibold text-[#B85233]">
            <span>Edit Profile</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Orders Card */}
        <Link
          href="/account/orders"
          className="group relative bg-white rounded-3xl border border-[#E8E2D5] p-6 shadow-xs hover:shadow-md hover:border-[#0A3929]/50 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0A3929]/10 text-[#0A3929] flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <Package className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="font-playfair text-lg font-medium text-[#1E1C1A] group-hover:text-[#0A3929] transition-colors">
                Purchases & Orders
              </h3>
              <p className="text-xs text-[#6B655B] mt-1.5 leading-relaxed font-sans">
                Access your journal deliveries, package tracking numbers, and digital tax receipts.
              </p>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-[#F0EBE1] flex items-center justify-between text-xs font-semibold text-[#0A3929]">
            <span>View All ({totalOrderCount})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Security Card */}
        <Link
          href="/account/settings"
          className="group relative bg-white rounded-3xl border border-[#E8E2D5] p-6 shadow-xs hover:shadow-md hover:border-[#D49B4B]/60 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D49B4B]/15 text-[#A8741A] flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <Settings className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="font-playfair text-lg font-medium text-[#1E1C1A] group-hover:text-[#A8741A] transition-colors">
                Account Security
              </h3>
              <p className="text-xs text-[#6B655B] mt-1.5 leading-relaxed font-sans">
                Manage your confidential password, active login sessions, and authentication security.
              </p>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-[#F0EBE1] flex items-center justify-between text-xs font-semibold text-[#A8741A]">
            <span>Security Settings</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* =========================================================================
          3. RECENT ACTIVITY & ORDER SHOWCASE
         ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EBE1] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A3929]/10 text-[#0A3929] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-playfair text-xl text-[#1E1C1A] font-normal">
                Recent Orders & Activity
              </h3>
              <p className="text-xs text-[#8A847A]">
                Latest purchases, order confirmations, and fulfillment status
              </p>
            </div>
          </div>

          {recentOrders.length > 0 && (
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B85233] hover:text-[#9E4228] transition-colors group"
            >
              <span>View Full Order History</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          /* =====================================================================
              EDITORIAL LUXURY EMPTY STATE WITH FEATURED INSPIRATION
             ===================================================================== */
          <div className="py-10 px-6 sm:px-12 text-center rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-white border border-[#E8E2D5] space-y-6">
            <div className="relative inline-block mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#FAF3E0] border border-[#D49B4B]/40 flex items-center justify-center text-[#D49B4B] shadow-inner">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <Sparkles className="w-4 h-4 text-[#D49B4B] absolute -top-1 -right-1" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h4 className="font-playfair text-xl sm:text-2xl text-[#1E1C1A] font-normal">
                Your Journey Begins With Intention
              </h4>
              <p className="text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                You haven&apos;t placed any orders yet. When you acquire our guided journals, sisterhood collections, or stationery, your orders and tracking will appear here.
              </p>
            </div>

            {/* Quick Suggestions Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2 text-start">
              <Link
                href="/shop/the-clarity"
                className="group p-4 rounded-2xl bg-white border border-[#E8E2D5] hover:border-[#B85233]/50 transition-all shadow-2xs hover:shadow-xs flex items-center gap-3.5"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] overflow-hidden shrink-0 border border-[#E8E2D5]/70 flex items-center justify-center p-1">
                  <Image
                    src="/images/journal-clarity.png"
                    alt="The Clarity Journal"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85233] block">
                    Bestseller
                  </span>
                  <p className="text-xs font-semibold text-[#1E1C1A] truncate group-hover:text-[#B85233] transition-colors">
                    The Clarity Journal
                  </p>
                  <span className="text-xs font-medium text-[#7A7265]">$24.00</span>
                </div>
              </Link>

              <Link
                href="/shop/the-inner-strength"
                className="group p-4 rounded-2xl bg-white border border-[#E8E2D5] hover:border-[#0A3929]/50 transition-all shadow-2xs hover:shadow-xs flex items-center gap-3.5"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] overflow-hidden shrink-0 border border-[#E8E2D5]/70 flex items-center justify-center p-1">
                  <Image
                    src="/images/journal-inner-strength.png"
                    alt="The Inner Strength Journal"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A3929] block">
                    Empowerment
                  </span>
                  <p className="text-xs font-semibold text-[#1E1C1A] truncate group-hover:text-[#0A3929] transition-colors">
                    Inner Strength Journal
                  </p>
                  <span className="text-xs font-medium text-[#7A7265]">$24.00</span>
                </div>
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#1E1C1A] hover:bg-[#0A3929] text-[#FAF8F5] text-xs sm:text-sm font-semibold px-7 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#D49B4B]" />
                <span>Explore Boutique Collection</span>
              </Link>
            </div>
          </div>
        ) : (
          /* =====================================================================
              ACTIVE ORDERS ROW PRESENTATION
             ===================================================================== */
          <div className="space-y-4">
            {recentOrders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border border-[#E8E2D5] bg-[#FAF8F5]/60 hover:bg-white hover:border-[#D49B4B]/60 transition-all duration-200 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E2D5]/70">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#8A847A] font-mono">Reference</span>
                        <span className="font-mono font-bold text-xs sm:text-sm text-[#1E1C1A]">
                          #{order.orderNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8A847A]">{formattedDate}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusPill(order.status)}
                      <span className="font-playfair text-base sm:text-lg font-bold text-[#1E1C1A]">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Purchased Items Previews */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {order.items.slice(0, 3).map((item: any) => {
                        const img = item.product?.images?.[0]?.url || '/images/journal-clarity.png';
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-[#E8E2D5] text-xs shadow-2xs"
                          >
                            <div className="w-6 h-6 rounded-md bg-[#FAF8F5] overflow-hidden shrink-0">
                              <Image
                                src={img}
                                alt={item.product?.title || 'Journal'}
                                width={24}
                                height={24}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="font-medium text-[#1E1C1A] truncate max-w-[140px]">
                              {item.product?.title || 'Naag Nool UP Item'}
                            </span>
                            <span className="text-[#8A847A] font-mono">×{item.quantity}</span>
                          </div>
                        );
                      })}
                      {order.items.length > 3 && (
                        <span className="text-xs text-[#8A847A] font-medium">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>

                    <Link
                      href="/account/orders"
                      className="text-xs font-semibold text-[#0A3929] hover:text-[#B85233] transition-colors inline-flex items-center gap-1"
                    >
                      <span>Track & Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          4. AYEEYO KORIS EDUCATIONAL SCHOLARSHIP SPOTLIGHT CARD
         ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0A3929] to-[#0E4733] text-white p-6 sm:p-8 border border-[#D49B4B]/40 shadow-md">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#D49B4B]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D49B4B]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D49B4B]">
                Ayeeyo Koris Children Initiative
              </span>
            </div>
            <h3 className="font-playfair text-xl sm:text-2xl font-normal text-white">
              Grandmothers Raise Tomorrow
            </h3>
            <p className="text-xs sm:text-sm text-[#D1DDD6] leading-relaxed">
              Every purchase through Naag Nool UP directly honors Somali grandmothers and provides educational scholarships, school uniforms, and nutrition to children in need.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/ayeyo-koris"
              className="inline-flex items-center gap-2 bg-[#D49B4B] hover:bg-[#C28C3E] text-[#1E1C1A] text-xs sm:text-sm font-semibold px-6 py-3 rounded-full transition-all shadow-md active:scale-95"
            >
              <span>Our Scholarship Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
