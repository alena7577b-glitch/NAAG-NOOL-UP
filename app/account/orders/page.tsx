import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { Package, ShoppingBag, Clock, CheckCircle2, Truck, AlertCircle, ArrowRight } from 'lucide-react';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Order History — Naag Nool UP',
  description: 'View and track your previous orders and purchases',
};

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'PAID':
    case 'DELIVERED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-full shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {status}
        </span>
      );
    case 'PROCESSING':
    case 'SHIPPED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded-full shadow-2xs">
          <Truck className="w-3.5 h-3.5 text-amber-700" />
          {status}
        </span>
      );
    case 'CANCELLED':
    case 'REFUNDED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full shadow-2xs">
          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          {status}
        </span>
      );
    case 'PENDING_PAYMENT':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold rounded-full shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-stone-500" />
          {status}
        </span>
      );
  }
}

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const orders = await db.order.findMany({
    where: { userId: user.id },
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
  });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 border-b border-[#F0EBE1] pb-5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#0A3929]/10 text-[#0A3929] flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-playfair text-2xl text-[#1E1C1A] font-normal">
              Order History & Deliveries
            </h1>
            <p className="text-xs text-[#8A847A] mt-0.5">
              Review your purchase history, fulfillment status, and receipts.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 px-6 text-center rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-white border border-[#E8E2D5] space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF3E0] border border-[#D49B4B]/40 flex items-center justify-center text-[#D49B4B] mx-auto shadow-inner">
              <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="font-playfair text-xl text-[#1E1C1A]">
                No Orders Placed Yet
              </h2>
              <p className="text-xs sm:text-sm text-[#6B655B] leading-relaxed">
                When you purchase our guided journals, sisterhood collections, or stationery, your orders, package tracking, and receipts will appear here.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1C1A] hover:bg-[#0A3929] text-white rounded-full font-semibold text-xs transition-all shadow-md active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#D49B4B]" />
                <span>Explore The Collection</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#FAF8F5]/60 hover:bg-white rounded-2xl border border-[#E8E2D5] p-5 sm:p-6 shadow-2xs hover:shadow-xs hover:border-[#D49B4B]/60 transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E2D5]/70">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A847A]">
                      Order Reference
                    </span>
                    <p className="font-mono font-bold text-sm sm:text-base text-[#1E1C1A]">
                      #{order.orderNumber}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A847A]">
                      Order Date
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-[#1E1C1A]">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A847A]">
                      Total Amount
                    </span>
                    <p className="font-playfair text-base sm:text-lg font-bold text-[#1E1C1A]">
                      ${Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Items List */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A847A] block">
                    Purchased Items ({order.items.length})
                  </span>
                  <div className="divide-y divide-[#E8E2D5]/60">
                    {order.items.map((item) => {
                      const img = item.product?.images?.[0]?.url || '/images/journal-clarity.png';
                      return (
                        <div key={item.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D5] overflow-hidden shrink-0 p-1 flex items-center justify-center shadow-2xs">
                              <Image
                                src={img}
                                alt={item.product?.title || 'Product'}
                                width={36}
                                height={36}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/product/${item.product?.slug || ''}`}
                                className="font-medium text-[#1E1C1A] hover:text-[#B85233] transition-colors"
                              >
                                {item.product?.title || 'Naag Nool UP Item'}
                              </Link>
                              <p className="text-[11px] text-[#8A847A] font-mono">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono font-semibold text-[#1E1C1A]">
                            ${Number(item.unitPrice).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-[#F0EBE1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8A847A]">
          <span>Need assistance with an order? Contact our support team directly.</span>
          <Link
            href="/contact"
            className="text-[#B85233] hover:text-[#9E4228] font-semibold inline-flex items-center gap-1"
          >
            <span>Customer Concierge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
