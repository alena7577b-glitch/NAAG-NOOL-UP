'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  DollarSign,
  UserCheck,
  ArrowUpRight,
} from 'lucide-react';

export interface AdminCustomer {
  id: string;
  email: string;
  fullName: string;
  role: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  createdAt: string;
}

interface AdminCustomersViewProps {
  initialCustomers: AdminCustomer[];
}

export function AdminCustomersView({ initialCustomers }: AdminCustomersViewProps) {
  const [customers] = useState<AdminCustomer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalLifetimeValue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const repeatCustomers = customers.filter((c) => c.totalOrders > 1).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B85233] mb-1">
            <Users className="w-4 h-4" />
            <span>Patron Directory</span>
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A]">
            Customer Accounts
          </h1>
          <p className="text-sm text-[#6B655B] mt-1">
            Review registered patrons, order history, lifetime contribution, and community engagement.
          </p>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Total Customers</span>
            <Users className="w-4 h-4 text-[#182821]" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            {customers.length}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Registered patron profiles</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Total Customer Spend</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            ${totalLifetimeValue.toFixed(2)}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Delivered & verified orders</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Repeat Patrons</span>
            <UserCheck className="w-4 h-4 text-[#B85233]" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            {repeatCustomers}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Purchased multiple editions</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE6DC] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#8A847A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customers by name or email address..."
          className="w-full text-sm bg-transparent outline-none text-[#1E1C1A] placeholder-[#8A847A]"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#EBE6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#F0EBE1] bg-[#FAF8F5] text-[#8A847A] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-4 px-6 text-start">Patron</th>
                <th className="py-4 px-6 text-start">Email</th>
                <th className="py-4 px-6 text-center">Orders Placed</th>
                <th className="py-4 px-6 text-end">Lifetime Value</th>
                <th className="py-4 px-6 text-start">Latest Activity</th>
                <th className="py-4 px-6 text-end">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8A847A]">
                    No customers match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#182821] text-white flex items-center justify-center font-playfair font-semibold shrink-0">
                          {customer.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium text-[#1E1C1A] block">
                            {customer.fullName}
                          </span>
                          <span className="text-[11px] text-[#8A847A]">
                            Joined {new Date(customer.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-[#6B655B] font-mono text-xs">
                      {customer.email}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF8F5] border border-[#EBE6DC] text-[#1E1C1A]">
                        {customer.totalOrders} {customer.totalOrders === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-end font-mono font-semibold text-[#1E1C1A]">
                      ${customer.totalSpent.toFixed(2)}
                    </td>

                    <td className="py-4 px-6 text-[#6B655B] text-xs">
                      {customer.lastOrderDate ? (
                        new Date(customer.lastOrderDate).toLocaleDateString()
                      ) : (
                        <span className="text-[#8A847A] italic">No orders yet</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-end">
                      <Link
                        href={`/admin/orders?search=${encodeURIComponent(customer.email)}`}
                        className="inline-flex items-center gap-1 text-xs text-[#B85233] hover:text-[#943F24] font-medium"
                      >
                        <span>View Orders</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
