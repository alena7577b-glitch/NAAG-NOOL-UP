'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  ArrowLeft,
  Search,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  X,
  CreditCard,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OrderStatus } from '@prisma/client';
import { updateOrderStatusAction } from '@/lib/actions/admin-orders';

export interface SerializedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Record<string, any>;
  createdAt: string;
  payments: Array<{
    id: string;
    provider: string;
    status: string;
    amount: number;
  }>;
  items: Array<{
    id: string;
    productId: string;
    productTitle: string;
    productSlug: string;
    quantity: number;
    unitPrice: number;
  }>;
}

interface AdminOrdersViewProps {
  initialOrders: SerializedOrder[];
  adminUser: { id: string; email: string; fullName?: string | null; role: string };
}

export function AdminOrdersView({ initialOrders, adminUser }: AdminOrdersViewProps) {
  const [orders, setOrders] = useState<SerializedOrder[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<SerializedOrder | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    setActionMessage(null);

    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        setActionMessage(`Order updated to ${newStatus}.`);
      } else {
        setActionMessage(res.error || 'Failed to update order status.');
      }
    } catch {
      setActionMessage('Network error updating status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>PAID</span>
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>PENDING PAYMENT</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>PROCESSING</span>
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800">
            <Truck className="w-3 h-3 text-indigo-600" />
            <span>SHIPPED</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
            <PackageCheck className="w-3 h-3 text-purple-600" />
            <span>DELIVERED</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 text-red-600" />
            <span>CANCELLED</span>
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-800">
            <span>REFUNDED</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-[#6B655B] hover:text-[#B85233] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Dashboard</span>
          </Link>
          <span className="text-xs text-[#6B655B]">Admin: {adminUser.email}</span>
        </div>

        {/* Header Bar */}
        <div className="bg-white rounded-2xl border border-[#E5DFC0] p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-5 h-5 text-[#B85233]" />
              <h1 className="font-playfair text-2xl font-normal text-[#1E1C1A]">
                Order Fulfillment & Management
              </h1>
            </div>
            <p className="text-xs text-[#6B655B]">
              Inspect customer orders, track payments, and update fulfillment milestones.
            </p>
          </div>

          <div className="text-xs text-[#1E1C1A] bg-[#FAF8F5] border border-[#E5DFC0] px-4 py-2 rounded-xl">
            Total Orders: <strong>{orders.length}</strong>
          </div>
        </div>

        {/* Action notification */}
        {actionMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <span>{actionMessage}</span>
            <button
              type="button"
              onClick={() => setActionMessage(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by order #, customer, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E5DFC0] bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {['ALL', 'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#B85233] text-white font-medium'
                      : 'bg-white border border-[#E5DFC0] text-[#6B655B] hover:text-[#1E1C1A]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              )
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-[#E5DFC0] shadow-2xs overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <ShoppingCart className="w-12 h-12 text-[#B85233]/40 mx-auto" />
              <p className="font-playfair text-xl text-[#1E1C1A]">No Orders Found</p>
              <p className="text-xs text-[#6B655B] max-w-sm mx-auto">
                No orders currently match the selected criteria. Real customer checkout orders will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-[#E5DFC0] bg-[#FAF8F5] text-[#1E1C1A] uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-3.5 px-4 text-start">Order Number</th>
                    <th className="py-3.5 px-4 text-start">Date</th>
                    <th className="py-3.5 px-4 text-start">Customer</th>
                    <th className="py-3.5 px-4 text-start">Items</th>
                    <th className="py-3.5 px-4 text-start">Total</th>
                    <th className="py-3.5 px-4 text-start">Fulfillment Status</th>
                    <th className="py-3.5 px-4 text-end">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFC0]/60">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#1E1C1A]">
                        {order.orderNumber}
                      </td>

                      <td className="py-3 px-4 text-[#6B655B]">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-[#1E1C1A]">{order.customerName}</p>
                        <p className="text-[11px] text-[#6B655B]">{order.customerEmail}</p>
                      </td>

                      <td className="py-3 px-4 text-[#4A433A]">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} {order.items.length === 1 ? 'journal' : 'journals'}
                      </td>

                      <td className="py-3 px-4 font-semibold text-[#1E1C1A]">
                        ${order.totalAmount.toFixed(2)}
                      </td>

                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>

                      <td className="py-3 px-4 text-end">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E5DFC0] text-[#1E1C1A] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#B85233]" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Order Inspection Drawer */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl border border-[#E5DFC0] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E5DFC0]/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-[#B85233] font-semibold">
                      Order Details
                    </span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <h2 className="font-playfair text-2xl text-[#1E1C1A] mt-0.5">
                    {selectedOrder.orderNumber}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Update Control */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFC0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-semibold text-[#1E1C1A]">Update Fulfillment Status</p>
                  <p className="text-[11px] text-[#6B655B]">
                    Current milestone in customer delivery journey
                  </p>
                </div>
                <select
                  value={selectedOrder.status}
                  disabled={isUpdating}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  className="px-3 py-2 rounded-lg border border-[#E5DFC0] bg-white font-medium focus:ring-1 focus:ring-[#B85233] focus:outline-none cursor-pointer"
                >
                  <option value="PENDING_PAYMENT">PENDING PAYMENT</option>
                  <option value="PAID">PAID</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              {/* Customer & Shipping Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-[#E5DFC0]/70 bg-white space-y-2">
                  <p className="font-semibold uppercase tracking-wider text-[10px] text-[#B85233]">
                    Customer Information
                  </p>
                  <p className="font-semibold text-sm text-[#1E1C1A]">
                    {selectedOrder.customerName}
                  </p>
                  <div className="flex items-center gap-2 text-[#6B655B]">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div className="flex items-center gap-2 text-[#6B655B]">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-[#E5DFC0]/70 bg-white space-y-2">
                  <p className="font-semibold uppercase tracking-wider text-[10px] text-[#B85233]">
                    Shipping Destination
                  </p>
                  <div className="flex items-start gap-2 text-[#4A433A]">
                    <MapPin className="w-4 h-4 shrink-0 text-[#B85233] mt-0.5" />
                    <div>
                      <p>{selectedOrder.shippingAddress.addressLine1}</p>
                      {selectedOrder.shippingAddress.addressLine2 && (
                        <p>{selectedOrder.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {selectedOrder.shippingAddress.city},{' '}
                        {selectedOrder.shippingAddress.postalCode}{' '}
                        {selectedOrder.shippingAddress.country}
                      </p>
                      {selectedOrder.shippingAddress.deliveryNotes && (
                        <p className="text-[11px] text-[#6B655B] italic mt-1">
                          Note: {selectedOrder.shippingAddress.deliveryNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <p className="font-semibold uppercase tracking-wider text-xs text-[#1E1C1A]">
                  Purchased Items
                </p>
                <div className="divide-y divide-[#E5DFC0]/60 border border-[#E5DFC0] rounded-xl overflow-hidden bg-white text-xs">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#1E1C1A]">{item.productTitle}</p>
                        <p className="text-[11px] text-[#6B655B]">
                          Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-semibold text-[#1E1C1A]">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="p-3.5 bg-[#FAF8F5] flex justify-between font-semibold text-sm text-[#1E1C1A]">
                    <span>Authoritative Total</span>
                    <span className="font-playfair text-base text-[#B85233]">
                      ${selectedOrder.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payments Status */}
              <div className="p-4 rounded-xl border border-[#E5DFC0]/70 bg-[#FAF8F5] space-y-1 text-xs">
                <div className="flex items-center gap-2 font-semibold text-[#1E1C1A]">
                  <CreditCard className="w-4 h-4 text-[#B85233]" />
                  <span>Payment Information</span>
                </div>
                {selectedOrder.payments.length > 0 ? (
                  selectedOrder.payments.map((p) => (
                    <div key={p.id} className="flex justify-between text-[#6B655B] text-[11px]">
                      <span>Provider: {p.provider}</span>
                      <span>
                        Status: <strong>{p.status}</strong> (${p.amount.toFixed(2)})
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-[#6B655B]">No payments recorded</p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
