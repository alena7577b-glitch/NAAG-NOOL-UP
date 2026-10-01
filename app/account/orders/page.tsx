import { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { Package, ShoppingBag, Clock, CheckCircle2, Truck, AlertCircle } from "lucide-react";
import { OrderStatus } from "@prisma/client";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Order History | NAAG NOOL UP",
  description: "View and track your previous orders and purchases",
};

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case "PAID":
    case "DELIVERED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {status}
        </span>
      );
    case "PROCESSING":
    case "SHIPPED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber/10 border border-amber/30 text-amber-900 text-xs font-semibold rounded-full">
          <Truck className="w-3.5 h-3.5 text-amber-700" />
          {status}
        </span>
      );
    case "CANCELLED":
    case "REFUNDED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full">
          <AlertCircle className="w-3.5 h-3.5" />
          {status}
        </span>
      );
    case "PENDING_PAYMENT":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold rounded-full">
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
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl text-dusk font-bold">Order History</h1>
        <p className="text-stone-600 text-sm mt-1">
          Review previous orders, track fulfillment status, and download invoices.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber/10 border border-amber/20 flex items-center justify-center text-terracotta">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="font-heading text-xl text-dusk font-bold">No orders placed yet</h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto mt-2 mb-6">
            When you purchase physical journals, guided stationery, or empowerment collections, your order receipts and delivery tracking will appear here.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-xl font-medium text-sm hover:bg-terracotta-dark transition-all shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore The Collection</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm hover:border-terracotta/40 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-500">Order ID</span>
                  <p className="font-mono font-semibold text-dusk text-base">#{order.orderNumber}</p>
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-500">Date</span>
                  <p className="text-sm font-medium text-stone-700">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-500">Total</span>
                  <p className="text-base font-bold text-dusk">${Number(order.totalAmount).toFixed(2)}</p>
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Items List */}
              <div className="pt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Purchased Items</p>
                <div className="divide-y divide-stone-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-stone-400 font-mono text-xs">{item.quantity}x</span>
                        <span className="font-medium text-dusk">{item.product.title}</span>
                      </div>
                      <span className="font-mono text-stone-600">${Number(item.unitPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
