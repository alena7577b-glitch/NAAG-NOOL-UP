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
  ExternalLink,
  Sparkles,
  Tag,
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
  imageUrls?: string[];
  colors?: string[];
  material?: string;
  dimensions?: string;
  createdAt: string;
}

interface AdminProductsViewProps {
  initialProducts: SerializedProduct[];
  adminUser: { id: string; email: string; fullName?: string | null; role: string };
}

const BASE_CATEGORIES = ['Journals', 'Notebooks', 'Mugs', 'Bags'];

const PRESET_COLORS = [
  'Terracotta',
  'Warm Ivory',
  'Desert Sand',
  'Midnight Slate',
  'Sage Green',
  'Rose Clay',
  'Onyx Black',
];

export function AdminProductsView({ initialProducts, adminUser }: AdminProductsViewProps) {
  const [products, setProducts] = useState<SerializedProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SerializedProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Dynamic Category Management
  const [availableCategories, setAvailableCategories] = useState<string[]>(() => {
    const existing = Array.from(new Set(initialProducts.map((p) => p.category).filter(Boolean)));
    return Array.from(new Set([...BASE_CATEGORIES, ...existing]));
  });
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Form Inputs
  const [formInput, setFormInput] = useState<AdminProductInput>({
    title: '',
    slug: '',
    description: '',
    price: 24.0,
    stockQuantity: 100,
    category: 'Journals',
    isAvailable: true,
    imageUrl: '',
    material: '',
    dimensions: '',
  });

  const [colorsInput, setColorsInput] = useState('');
  const [additionalImagesInput, setAdditionalImagesInput] = useState('');

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
      category: availableCategories[0] || 'Journals',
      isAvailable: true,
      imageUrl: '',
      material: '',
      dimensions: '',
    });
    setColorsInput('Terracotta, Warm Ivory, Desert Sand');
    setAdditionalImagesInput('');
    setIsAddingNewCategory(false);
    setNewCategoryName('');
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
      material: prod.material || '',
      dimensions: prod.dimensions || '',
    });

    // Populate existing categories if needed
    if (!availableCategories.includes(prod.category)) {
      setAvailableCategories((prev) => [...prev, prod.category]);
    }

    setColorsInput(prod.colors && prod.colors.length > 0 ? prod.colors.join(', ') : '');
    const extraImages = (prod.imageUrls || []).filter((u) => u !== prod.imageUrl);
    setAdditionalImagesInput(extraImages.join('\n'));

    setIsAddingNewCategory(false);
    setNewCategoryName('');
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
    }

    // Auto-generate slug from title if creating
    if (name === 'title' && !editingProduct) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormInput((prev) => ({ ...prev, slug: autoSlug }));
    }
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    if (!availableCategories.includes(trimmed)) {
      setAvailableCategories((prev) => [...prev, trimmed]);
    }
    setFormInput((prev) => ({ ...prev, category: trimmed }));
    setNewCategoryName('');
    setIsAddingNewCategory(false);
  };

  const handleAddPresetColor = (colorName: string) => {
    const existing = colorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (!existing.includes(colorName)) {
      const updated = [...existing, colorName].join(', ');
      setColorsInput(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const parsedColors = colorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const parsedExtraImages = additionalImagesInput
      .split(/[\n,]/)
      .map((u) => u.trim())
      .filter(Boolean);

    const allImageUrls = [
      formInput.imageUrl?.trim() || '',
      ...parsedExtraImages,
    ].filter(Boolean);

    const payload: AdminProductInput = {
      ...formInput,
      colors: parsedColors,
      imageUrls: allImageUrls,
    };

    try {
      if (editingProduct) {
        const res = await updateProductAction(editingProduct.id, payload);
        if (res.success && res.product) {
          const updatedProd: SerializedProduct = {
            id: res.product.id,
            title: res.product.title,
            slug: res.product.slug,
            description: res.product.description || '',
            price: Number(res.product.price),
            stockQuantity: res.product.stockQuantity,
            category: res.product.category,
            isAvailable: res.product.isAvailable,
            imageUrl: formInput.imageUrl || '',
            imageUrls: allImageUrls,
            colors: parsedColors,
            material: formInput.material,
            dimensions: formInput.dimensions,
            createdAt: res.product.createdAt.toISOString(),
          };

          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? updatedProd : p))
          );
          setStatusMessage({ text: `Product "${res.product.title}" updated successfully!`, type: 'success' });
          setIsModalOpen(false);
        } else {
          setStatusMessage({ text: res.error || 'Failed to update product', type: 'error' });
        }
      } else {
        const res = await createProductAction(payload);
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
            imageUrls: allImageUrls,
            colors: parsedColors,
            material: formInput.material,
            dimensions: formInput.dimensions,
            createdAt: res.product.createdAt.toISOString(),
          };

          setProducts((prev) => [newProd, ...prev]);
          setStatusMessage({ text: `Product "${res.product.title}" created successfully!`, type: 'success' });
          setIsModalOpen(false);
        } else {
          setStatusMessage({ text: res.error || 'Failed to create product', type: 'error' });
        }
      }
    } catch {
      setStatusMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailability = async (id: string, current: boolean) => {
    try {
      const res = await toggleProductAvailabilityAction(id, !current);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isAvailable: !current } : p))
        );
      }
    } catch {
      alert('Failed to toggle availability.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

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
              Add products across categories (Mugs, Journals, Notebooks, Bags, or custom categories) with colors and specifications.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
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
              placeholder="Search products by title, slug, or category..."
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
              <p className="font-playfair text-xl text-[#1E1C1A]">No Products in Database</p>
              <p className="text-xs text-[#6B655B] max-w-sm mx-auto">
                No products currently match your search. Click &quot;Add New Product&quot; to create items for Mugs, Journals, Notebooks, or Bags.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-[#E5DFC0] bg-[#FAF8F5] text-[#1E1C1A] uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-3.5 px-4 text-start">Product</th>
                    <th className="py-3.5 px-4 text-start">Category</th>
                    <th className="py-3.5 px-4 text-start">Colors</th>
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
                              src={p.imageUrl || '/images/logo-header.png'}
                              alt={p.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-[#1E1C1A]">{p.title}</p>
                              <Link
                                href={`/product/${p.slug}`}
                                target="_blank"
                                title="View live product details page"
                                className="text-stone-400 hover:text-[#B85233] transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                            <p className="text-[10px] text-[#6B655B] font-mono">{p.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-[#F4EFE6] text-[#A64426] border border-[#E5DFC0]/80">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#4A433A]">
                        {p.colors && p.colors.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[140px]">
                            {p.colors.slice(0, 3).map((c) => (
                              <span
                                key={c}
                                className="px-1.5 py-0.5 text-[9.5px] rounded bg-stone-100 text-stone-700 border border-stone-200"
                              >
                                {c}
                              </span>
                            ))}
                            {p.colors.length > 3 && (
                              <span className="text-[9.5px] text-stone-400 self-center">
                                +{p.colors.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400 italic text-[11px]">Default</span>
                        )}
                      </td>

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
                          onClick={() => handleToggleAvailability(p.id, p.isAvailable)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer transition-colors ${
                            p.isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-300'
                          }`}
                        >
                          {p.isAvailable ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-stone-500" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-stone-500 hover:text-[#B85233] hover:bg-[#FAF8F5] rounded-md transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Product"
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

        {/* Modal: Create / Edit Product */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl border border-[#E5DFC0] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5DFC0]/60 pb-4">
                <h2 className="font-playfair text-2xl text-[#1E1C1A]">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formInput.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Ceramic Terracotta Coffee Mug, The Awakening Journal, Canvas Tote Bag"
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
                      placeholder="terracotta-coffee-mug"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233] font-mono text-xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A]">
                        Category *
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                        className="text-[11px] font-medium text-[#B85233] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{isAddingNewCategory ? 'Use Existing' : '+ Add New'}</span>
                      </button>
                    </div>

                    {isAddingNewCategory ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="New category name..."
                          className="flex-1 px-3 py-2 rounded-lg border border-[#E5DFC0] bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                        />
                        <button
                          type="button"
                          onClick={handleAddNewCategory}
                          className="px-3 py-2 bg-[#B85233] text-white rounded-lg font-medium hover:bg-[#A64426] cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <select
                        name="category"
                        value={formInput.category}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2.5 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                      >
                        {availableCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}
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

                {/* Colors Section */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A]">
                      Available Colors
                    </label>
                    <span className="text-[10.5px] text-[#8A8276]">Comma-separated</span>
                  </div>
                  <input
                    type="text"
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    placeholder="e.g. Terracotta, Warm Ivory, Desert Sand, Midnight Slate"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233] mb-1.5"
                  />
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-stone-500 mr-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#B85233]" /> Quick add:
                    </span>
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleAddPresetColor(color)}
                        className="px-2 py-0.5 rounded-full text-[10px] bg-[#FAF6F0] border border-[#E5DFC0] text-[#1E1C1A] hover:bg-white hover:border-[#B85233] transition-colors cursor-pointer"
                      >
                        + {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Images Section */}
                <div className="space-y-2">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Primary Image Asset URL *
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formInput.imageUrl || ''}
                      onChange={handleFormChange}
                      placeholder="/images/merch-mug.png or web URL"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A]">
                        Additional Gallery Image URLs
                      </label>
                      <span className="text-[10.5px] text-[#8A8276]">One per line</span>
                    </div>
                    <textarea
                      rows={2}
                      value={additionalImagesInput}
                      onChange={(e) => setAdditionalImagesInput(e.target.value)}
                      placeholder="/images/product-angle-2.png&#10;/images/product-detail.png"
                      className="w-full px-3.5 py-2 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233] font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Specifications & Materials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Material / Craftsmanship
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={formInput.material || ''}
                      onChange={handleFormChange}
                      placeholder="e.g. Ceramic Stoneware, Organic Cotton Canvas, Linen"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Dimensions / Capacity
                    </label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formInput.dimensions || ''}
                      onChange={handleFormChange}
                      placeholder="e.g. 12 oz / 350ml, 6 x 8.5 inches, 15 x 16 inches"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B85233]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                    Editorial Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formInput.description || ''}
                    onChange={handleFormChange}
                    placeholder="Enter the mindful product description, inspiring story, and details..."
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
                    {editingProduct ? 'Save Changes' : 'Create Product'}
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
