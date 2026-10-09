import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/server';
import { getAdminOrders } from '@/lib/actions/admin-orders';
import { AdminOrdersView } from '@/components/admin/AdminOrdersView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Order Fulfillment & Management — Admin Console',
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage() {
  let user;
  try {
    user = await requireAdmin();
  } catch {
    redirect('/admin/unauthorized');
  }

  const orders = await getAdminOrders();

  const serializedOrders = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone || '',
    totalAmount: Number(o.totalAmount),
    status: o.status,
    shippingAddress: (o.shippingAddress as Record<string, any>) || {},
    createdAt: o.createdAt.toISOString(),
    payments: o.payments.map((p) => ({
      id: p.id,
      provider: p.provider,
      status: p.status,
      amount: Number(p.amount),
    })),
    items: o.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      productTitle: i.product?.title || 'Journal',
      productSlug: i.product?.slug || '',
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
    })),
  }));

  return <AdminOrdersView initialOrders={serializedOrders} adminUser={user} />;
}
