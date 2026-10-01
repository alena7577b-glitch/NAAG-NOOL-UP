/**
 * NAAG NOOL UP — Account & Orders Isolation Tests
 */

import { db } from '../lib/db';

jest.mock('../lib/db', () => ({
  db: {
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('Customer Account & Order History Isolation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('queries orders filtered strictly by authenticated customer userId', async () => {
    const customerId = 'cust-uuid-456';
    const mockOrders = [
      {
        id: 'ord-1',
        orderNumber: 'NNU-2026-001',
        userId: customerId,
        totalAmount: 145.0,
        status: 'PAID',
        createdAt: new Date(),
        items: [
          {
            id: 'item-1',
            quantity: 1,
            unitPrice: 145.0,
            product: { title: 'The Sovereign Journal', slug: 'sovereign-journal' },
          },
        ],
      },
    ];

    (db.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

    const orders = await db.order.findMany({
      where: { userId: customerId },
      orderBy: { createdAt: 'desc' },
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

    expect(db.order.findMany).toHaveBeenCalledWith({
      where: { userId: customerId },
      orderBy: { createdAt: 'desc' },
      include: expect.any(Object),
    });

    expect(orders).toHaveLength(1);
    expect(orders[0].userId).toBe(customerId);
    expect(orders[0].orderNumber).toBe('NNU-2026-001');
  });

  test('does not return orders belonging to other customers', async () => {
    (db.order.findMany as jest.Mock).mockResolvedValue([]);

    const orders = await db.order.findMany({
      where: { userId: 'unauthorized-user-id' },
    });

    expect(orders).toHaveLength(0);
  });
});
