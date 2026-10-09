'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Archive,
  Search,
  CheckCircle,
  AlertTriangle,
  Save,
  Plus,
  Minus,
} from 'lucide-react';
import { updateInventoryStockAction } from '@/lib/actions/admin-management';

export interface InventoryItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  stockQuantity: number;
  isAvailable: boolean;
  imageUrl: string;
  updatedAt: string;
}

interface AdminInventoryViewProps {
  initialInventory: InventoryItem[];
}

export function AdminInventoryView({ initialInventory }: AdminInventoryViewProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; success: boolean; text: string } | null>(null);

  const filtered = inventory.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockDelta = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, stockQuantity: Math.max(0, item.stockQuantity + delta) }
          : item
      )
    );
  };

  const handleAvailabilityToggle = (id: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const handleSaveItem = async (item: InventoryItem) => {
    setUpdatingId(item.id);
    setFeedback(null);

    try {
      const res = await updateInventoryStockAction(
        item.id,
        item.stockQuantity,
        item.isAvailable
      );

      if (res.success) {
        setFeedback({
          id: item.id,
          success: true,
          text: 'Stock & availability saved!',
        });
      } else {
        setFeedback({
          id: item.id,
          success: false,
          text: res.error || 'Failed to update stock.',
        });
      }
    } catch {
      setFeedback({
        id: item.id,
        success: false,
        text: 'An error occurred while saving.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const totalStockUnits = inventory.reduce((acc, i) => acc + i.stockQuantity, 0);
  const lowStockCount = inventory.filter((i) => i.stockQuantity < 10).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B85233] mb-1">
          <Archive className="w-4 h-4" />
          <span>Warehouse Operations</span>
        </div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A]">
          Inventory & Stock Control
        </h1>
        <p className="text-sm text-[#6B655B] mt-1">
          Monitor real-time warehouse inventory, manage edition availability, and adjust stock allocations.
        </p>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Total Units In Stock</span>
            <Archive className="w-4 h-4 text-[#182821]" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            {totalStockUnits}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Across all published titles</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-amber-600 mt-2">
            {lowStockCount}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Editions with under 10 copies</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Active SKUs</span>
            <CheckCircle className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            {inventory.filter((i) => i.isAvailable).length} / {inventory.length}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Available on customer storefront</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE6DC] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#8A847A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter editions by title or collection..."
          className="w-full text-sm bg-transparent outline-none text-[#1E1C1A] placeholder-[#8A847A]"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#EBE6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#F0EBE1] bg-[#FAF8F5] text-[#8A847A] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-4 px-6 text-start">Edition / Journal</th>
                <th className="py-4 px-6 text-start">Category</th>
                <th className="py-4 px-6 text-start">Price</th>
                <th className="py-4 px-6 text-center">Stock Level</th>
                <th className="py-4 px-6 text-center">Storefront Status</th>
                <th className="py-4 px-6 text-end">Save Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {filtered.map((item) => {
                const isUpdating = updatingId === item.id;
                const itemFeedback = feedback?.id === item.id ? feedback : null;

                return (
                  <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-14 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] overflow-hidden shrink-0 p-0.5">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-playfair font-semibold text-[#1E1C1A] block">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-[#8A847A] font-mono">
                            /{item.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-[#6B655B]">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF8F5] border border-[#EBE6DC] text-[#1E1C1A]">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-mono font-medium text-[#1E1C1A]">
                      ${item.price.toFixed(2)}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#EBE6DC] p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => handleStockDelta(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#E8E2D8] text-[#1E1C1A] flex items-center justify-center hover:bg-stone-50"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-12 text-center font-mono font-bold text-sm text-[#1E1C1A]">
                          {item.stockQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStockDelta(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#E8E2D8] text-[#1E1C1A] flex items-center justify-center hover:bg-stone-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => handleAvailabilityToggle(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          item.isAvailable
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border border-stone-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isAvailable ? 'bg-emerald-600' : 'bg-stone-400'
                          }`}
                        />
                        {item.isAvailable ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-end">
                      <div className="flex flex-col items-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleSaveItem(item)}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#182821] text-white text-xs font-medium hover:bg-[#22382E] transition-colors disabled:opacity-50"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{isUpdating ? 'Saving...' : 'Save'}</span>
                        </button>
                        {itemFeedback && (
                          <span
                            className={`text-[11px] font-medium ${
                              itemFeedback.success ? 'text-emerald-700' : 'text-red-600'
                            }`}
                          >
                            {itemFeedback.text}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
