'use client';

import Link from 'next/link';
import {
  Shield,
  Crown,
  UserCheck,
  Check,
  X,
  ArrowRight,
} from 'lucide-react';

interface PermissionMatrixRow {
  permission: string;
  category: string;
  superAdmin: boolean;
  admin: boolean;
  customer: boolean;
}

const PERMISSION_ROWS: PermissionMatrixRow[] = [
  { permission: 'Assign Roles & Demote Staff', category: 'Authentication & Access', superAdmin: true, admin: false, customer: false },
  { permission: 'Create Staff Passwords & Logins', category: 'Authentication & Access', superAdmin: true, admin: false, customer: false },
  { permission: 'Configure Payment Gateways & Toggles', category: 'Store Settings', superAdmin: true, admin: true, customer: false },
  { permission: 'Manage Inventory & Stock Quantity', category: 'Product Catalog', superAdmin: true, admin: true, customer: false },
  { permission: 'Create & Update Product Editions', category: 'Product Catalog', superAdmin: true, admin: true, customer: false },
  { permission: 'View & Transition Order Statuses', category: 'Fulfillment', superAdmin: true, admin: true, customer: false },
  { permission: 'Access Patron Customer Directory', category: 'Fulfillment', superAdmin: true, admin: true, customer: false },
  { permission: 'Publish & Draft Blog Posts', category: 'Content Management', superAdmin: true, admin: true, customer: false },
  { permission: 'Review Contact Inquiries', category: 'Communications', superAdmin: true, admin: true, customer: false },
  { permission: 'Purchase Editions via Checkout', category: 'Storefront', superAdmin: true, admin: true, customer: true },
  { permission: 'Join Community & Newsletter', category: 'Storefront', superAdmin: true, admin: true, customer: true },
];

export function AdminRolesView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B85233] mb-1">
            <Shield className="w-4 h-4" />
            <span>Governance & Security</span>
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A]">
            Roles & Permissions Matrix
          </h1>
          <p className="text-sm text-[#6B655B] mt-1">
            Hierarchical security boundaries separating Super Admin, Admin staff, and customers.
          </p>
        </div>

        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#182821] text-white text-xs font-medium hover:bg-[#22382E] transition-colors self-start shadow-xs"
        >
          <span>Manage Staff Accounts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Role Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SUPER ADMIN */}
        <div className="p-6 rounded-3xl bg-white border-2 border-[#D49B4B] shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D49B4B] mb-2">
            <Crown className="w-4 h-4" />
            <span>Root Authority</span>
          </div>
          <h2 className="font-playfair text-xl font-semibold text-[#1E1C1A]">
            Super Admin
          </h2>
          <p className="text-xs text-[#6B655B] mt-1">
            Absolute administrative power over all staff invitations, role demotions, payment toggles, and database models.
          </p>
          <div className="mt-4 pt-4 border-t border-[#F5F2EB] text-xs text-[#1E1C1A] space-y-1 font-mono">
            <div>Principal: info@naagnoolup.com</div>
            <div className="text-[#8A847A]">Password: Protected</div>
          </div>
        </div>

        {/* ADMIN */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#182821] mb-2">
            <Shield className="w-4 h-4" />
            <span>Operations Staff</span>
          </div>
          <h2 className="font-playfair text-xl font-semibold text-[#1E1C1A]">
            Staff Admin
          </h2>
          <p className="text-xs text-[#6B655B] mt-1">
            Full operational control over order fulfillments, inventory, blog publications, and customer inquiries.
          </p>
          <div className="mt-4 pt-4 border-t border-[#F5F2EB] text-xs text-[#8A847A]">
            Provisioned directly by Super Admin.
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="p-6 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A847A] mb-2">
            <UserCheck className="w-4 h-4" />
            <span>Patron Access</span>
          </div>
          <h2 className="font-playfair text-xl font-semibold text-[#1E1C1A]">
            Customer
          </h2>
          <p className="text-xs text-[#6B655B] mt-1">
            Public consumer storefront access, bag checkout, order tracking, and newsletter subscriptions.
          </p>
          <div className="mt-4 pt-4 border-t border-[#F5F2EB] text-xs text-[#8A847A]">
            Restricted from /admin console routes.
          </div>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-3xl border border-[#EBE6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#F0EBE1] bg-[#FAF8F5] text-[#8A847A] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-4 px-6 text-start">Operation / Permission</th>
                <th className="py-4 px-6 text-start">Category</th>
                <th className="py-4 px-6 text-center text-[#D49B4B]">Super Admin</th>
                <th className="py-4 px-6 text-center text-[#182821]">Staff Admin</th>
                <th className="py-4 px-6 text-center text-[#8A847A]">Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {PERMISSION_ROWS.map((row) => (
                <tr key={row.permission} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-4 px-6 font-medium text-[#1E1C1A]">
                    {row.permission}
                  </td>

                  <td className="py-4 px-6 text-[#6B655B] text-xs">
                    {row.category}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span className="w-6 h-6 rounded-full bg-[#D49B4B]/10 text-[#D49B4B] inline-flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center">
                    {row.admin ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 inline-flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-400 inline-flex items-center justify-center">
                        <X className="w-3.5 h-3.5 stroke-[2]" />
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-center">
                    {row.customer ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 inline-flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-400 inline-flex items-center justify-center">
                        <X className="w-3.5 h-3.5 stroke-[2]" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
