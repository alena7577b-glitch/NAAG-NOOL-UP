'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  ArrowLeft,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  createProductAction,
  updateProductAction,
  toggleProductAvailabilityAction,
  deleteProductAction,
  AdminProductInput,
} from '@/lib/actions/admin-products';

interface SerializedProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  isAvailable: boolean;
  imageUrl: string;
  createdAt: string;
}

interface AdminProductsViewProps {
  initialProducts: SerializedProduct[];
  adminUser: { id: string; email: string; fullName?: string | null; role: string };
}

export function AdminProductsView({ initialProducts, adminUser }: AdminProductsViewProps) {
  const [products, setProducts] = useState<SerializedProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SerializedProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formInput, setFormInput] = useState<AdminProductInput>({
    title: '',
    slug: '',
    description: '',
    price: 24.0,
    stockQuantity: 100,
    category: 'Self-Discovery',
    isAvailable: true,
    imageUrl: '',
  });

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormInput({
      title: '',
      slug: '',
      description: '',
      price: 24.0,
      stockQuantity: 100,
      category: 'Self-Discovery',
      isAvailable: true,
      imageUrl: '',
    });
    setIsModalOpen(true);
    setStatusMessage(null);
  };

  const handleOpenEditModal = (prod: SerializedProduct) => {
    setEditingProduct(prod);
    setFormInput({
      title: prod.title,
      slug: prod.slug,
      description: prod.description,
      price: prod.price,
      stockQuantity: prod.stockQuantity,
      category: prod.category,
      isAvailable: prod.isAvailable,
      imageUrl: prod.imageUrl,
    });
    setIsModalOpen(true);
    setStatusMessage(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormInput((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (type === 'checkbox') {
      setFormInput((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormInput((prev) => ({ ...prev, [name]: value }));
      // Auto-generate slug from title if creating
      if (name === 'title' && !editingProduct) {
        const generated = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
        setFormInput((prev) => ({ ...prev, slug: generated }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (editingProduct) {
        const res = await updateProductAction(editingProduct.id, formInput);
        if (res.success && res.product) {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === editingProduct.id
                ? {
                    ...p,
                    title: res.product!.title,
                    slug: res.product!.slug,
                    description: res.product!.description || '',
                    price: Number(res.product!.price),
                    stockQuantity: res.product!.stockQuantity,
                    category: res.product!.category,
                    isAvailable: res.product!.isAvailable,
                    imageUrl: formInput.imageUrl || p.imageUrl,
                  }
                : p
            )
          );
          setIsModalOpen(false);
          setStatusMessage({ text: 'Journal updated successfully.', type: 'success' });
        } else {
          setStatusMessage({ text: res.error || 'Failed to update journal.', type: 'error' });
        }
      } else {
        const res = await createProductAction(formInput);
        if (res.success && res.product) {
          const newProd: SerializedProduct = {
            id: res.product.id,
            title: res.product.title,
            slug: res.product.slug,
            description: res.product.description || '',
            price: Number(res.product.price),
            stockQuantity: res.product.stockQuantity,
            category: res.product.category,
            isAvailable: res.product.isAvailable,
            imageUrl: formInput.imageUrl || '',
            createdAt: res.product.createdAt.toISOString(),
          };
          setProducts((prev) => [newProd, ...prev]);
          setIsModalOpen(false);
          setStatusMessage({ text: 'New journal added to catalog.', type: 'success' });
        } else {
          setStatusMessage({ text: res.error || 'Failed to create journal.', type: 'error' });
        }
      }
    } catch {
      setStatusMessage({ text: 'A network error occurred.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await toggleProductAvailabilityAction(id, !currentStatus);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isAvailable: res.isAvailable! } : p))
        );
      }
    } catch {
      // Toggle error
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete or archive "${title}"?`)) return;

    try {
      const res = await deleteProductAction(id);
      if (res.success) {
        if (res.archived) {
          setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isAvailable: false } : p))
          );
          alert(`"${title}" has existing orders so it has been marked inactive.`);
        } else {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }
      }
    } catch {
      alert('Failed to delete product.');
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
              <Package className="w-5 h-5 text-[#B85233]" />
              <h1 className="font-playfair text-2xl font-normal text-[#1E1C1A]">
                Product Catalog Management
              </h1>
            </div>
            <p className="text-xs text-[#6B655B]">
              Add, edit, and configure authentic journals in the PostgreSQL database.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Journal</span>
          </Button>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border text-xs sm:text-sm flex items-center gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Search & Counter Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search journals by title, slug, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E5DFC0] bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
            />
          </div>
          <span className="text-xs text-[#6B655B]">
            Showing <strong>{filteredProducts.length}</strong> of {products.length} products
          </span>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-[#E5DFC0] shadow-2xs overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-[#B85233]/40 mx-auto" />
              <p className="font-playfair text-xl text-[#1E1C1A]">No Journals in Database</p>
              <p className="text-xs text-[#6B655B] max-w-sm mx-auto">
                No products currently match your search. Click &quot;Add New Journal&quot; to seed official client items.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-[#E5DFC0] bg-[#FAF8F5] text-[#1E1C1A] uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-3.5 px-4 text-start">Journal</th>
                    <th className="py-3.5 px-4 text-start">Category</th>
                    <th className="py-3.5 px-4 text-start">Price</th>
                    <th className="py-3.5 px-4 text-start">Stock</th>
                    <th className="py-3.5 px-4 text-start">Status</th>
                    <th className="py-3.5 px-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFC0]/60">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-md bg-[#FAF7F2] border border-[#E5DFC0]/60 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.imageUrl || `/images/journal-${p.slug.replace('the-', '')}.png`}
                              alt={p.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-[#1E1C1A]">{p.title}</p>
                            <p className="text-[10px] text-[#6B655B] font-mono">{p.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#4A433A]">{p.category}</td>

                      <td className="py-3 px-4 font-semibold text-[#1E1C1A]">
                        ${p.price.toFixed(2)}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            p.stockQuantity > 10
                              ? 'text-emerald-700'
                              : p.stockQuantity > 0
                              ? 'text-amber-700'
                              : 'text-red-600'
                          }`}
                        >
                          {p.stockQuantity} in stock
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggle(p.id, p.isAvailable)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                            p.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {p.isAvailable ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-stone-400" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            aria-label={`Edit ${p.title}`}
                            className="p-1.5 text-stone-600 hover:text-[#B85233] transition-colors rounded hover:bg-stone-100 cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.title)}
                            aria-label={`Delete ${p.title}`}
                            className="p-1.5 text-stone-600 hover:text-red-600 transition-colors rounded hover:bg-stone-100 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Create / Edit Journal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl border border-[#E5DFC0] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5DFC0]/60 pb-4">
                <h2 className="font-playfair text-2xl text-[#1E1C1A]">
                  {editingProduct ? 'Edit Journal' : 'Add New Journal'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                    Journal Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formInput.title}
                    onChange={handleFormChange}
                    placeholder="e.g. The Awakening"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      required
                      value={formInput.slug}
                      onChange={handleFormChange}
                      placeholder="the-awakening"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233] font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formInput.category}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                    >
                      <option value="Self-Discovery">Self-Discovery</option>
                      <option value="Healing & Growth">Healing & Growth</option>
                      <option value="Confidence & Success">Confidence & Success</option>
                      <option value="Gratitude & Mindfulness">Gratitude & Mindfulness</option>
                      <option value="Legacy & Purpose">Legacy & Purpose</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Authoritative Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      required
                      value={formInput.price}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Stock Inventory Count *
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      required
                      value={formInput.stockQuantity}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                    Image Asset URL
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formInput.imageUrl || ''}
                    onChange={handleFormChange}
                    placeholder="/images/journal-awakening.png or Supabase storage URL"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                    Editorial Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formInput.description || ''}
                    onChange={handleFormChange}
                    placeholder="Enter the mindful description and journaling prompts summary..."
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={formInput.isAvailable}
                    onChange={handleFormChange}
                    className="accent-[#B85233] w-4 h-4"
                  />
                  <label htmlFor="isAvailable" className="text-xs text-[#1E1C1A] font-medium cursor-pointer">
                    Active & Available in Storefront
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[#E5DFC0]/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                  >
                    {editingProduct ? 'Save Changes' : 'Create Journal'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
