'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  ArrowRight,
  X,
  AlertCircle,
} from 'lucide-react';
import {
  SiteBanner,
  BannerFormData,
  saveAdminBannerAction,
  toggleBannerActiveAction,
  deleteBannerAction,
} from '@/lib/actions/admin-banners';

interface AdminBannersViewProps {
  initialBanners: SiteBanner[];
}

const COLOR_PRESETS = [
  { name: 'Forest Emerald', bg: '#182821', text: '#F9F6F0' },
  { name: 'Terracotta Sunset', bg: '#B85233', text: '#FFFFFF' },
  { name: 'Warm Desert Gold', bg: '#D49B4B', text: '#182821' },
  { name: 'Sage Botanical', bg: '#4D5844', text: '#FFFFFF' },
  { name: 'Obsidian Midnight', bg: '#1E1C1A', text: '#FFFFFF' },
];

const BADGE_PRESETS = [
  'ANNOUNCEMENT',
  'SPECIAL OFFER',
  'IMPACT',
  'PHILANTHROPY',
  'LIMITED EDITION',
  'FREE SHIPPING',
  'NEW ARRIVAL',
];

export function AdminBannersView({ initialBanners }: AdminBannersViewProps) {
  const [banners, setBanners] = useState<SiteBanner[]>(initialBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    text: '',
    badge: 'ANNOUNCEMENT',
    linkUrl: '/shop',
    linkText: 'Explore Now',
    position: 'top_ribbon',
    bgColor: '#182821',
    textColor: '#F9F6F0',
    isActive: true,
    priority: 1,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openCreateModal = () => {
    setEditingBannerId(null);
    setFormError(null);
    setFormData({
      title: '',
      text: '',
      badge: 'ANNOUNCEMENT',
      linkUrl: '/shop',
      linkText: 'Shop Collection',
      position: 'top_ribbon',
      bgColor: '#182821',
      textColor: '#F9F6F0',
      isActive: true,
      priority: 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: SiteBanner) => {
    setEditingBannerId(banner.id);
    setFormError(null);
    setFormData({
      title: banner.title,
      text: banner.text,
      badge: banner.badge || '',
      linkUrl: banner.linkUrl || '',
      linkText: banner.linkText || '',
      position: banner.position,
      bgColor: banner.bgColor,
      textColor: banner.textColor,
      isActive: banner.isActive,
      priority: banner.priority || 1,
    });
    setIsModalOpen(true);
  };

  const handleToggle = (bannerId: string, currentActive: boolean) => {
    const nextActive = !currentActive;
    startTransition(async () => {
      const res = await toggleBannerActiveAction(bannerId, nextActive);
      if (res.success) {
        setBanners((prev) =>
          prev.map((b) => (b.id === bannerId ? { ...b, isActive: nextActive } : b))
        );
      }
    });
  };

  const handleDelete = (bannerId: string) => {
    startTransition(async () => {
      const res = await deleteBannerAction(bannerId);
      if (res.success) {
        setBanners((prev) => prev.filter((b) => b.id !== bannerId));
        setDeleteConfirmId(null);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    startTransition(async () => {
      const res = await saveAdminBannerAction(formData, editingBannerId || undefined);
      if (!res.success) {
        setFormError(res.error || 'Failed to save banner.');
        return;
      }

      setIsModalOpen(false);
      window.location.reload();
    });
  };

  const activeTopBanner = banners.find((b) => b.isActive && b.position === 'top_ribbon');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ============================================================== */}
      {/* 1. EDITORIAL HEADER                                            */}
      {/* ============================================================== */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#182821] via-[#22382E] to-[#182821] border border-[#2B473A] p-6 sm:p-10 text-white shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D49B4B]/20 border border-[#D49B4B]/40 text-[#E5B56D] text-xs font-semibold uppercase tracking-wider">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Storefront Announcements & Ads</span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-4xl font-normal tracking-tight text-[#F9F6F0]">
            Ad Banners & Site Notices
          </h1>

          <p className="text-sm text-[#A8BEB4] leading-relaxed">
            Create, schedule, and customize high-impact promotional ribbons, free shipping alerts,
            and philanthropic campaign banners visible sitewide.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-medium text-white transition-all backdrop-blur-sm shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D49B4B]" />
            <span>Preview Storefront</span>
          </Link>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D49B4B] hover:bg-[#C28C3E] text-[#182821] text-xs font-semibold transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Banner</span>
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. LIVE STOREFRONT PREVIEW                                     */}
      {/* ============================================================== */}
      <section className="p-6 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#B85233]" />
            <h2 className="font-playfair text-lg font-medium text-[#1E1C1A]">
              Live Header Ribbon Preview
            </h2>
          </div>
          <span className="text-xs text-[#8A847A]">What customers see right now</span>
        </div>

        {activeTopBanner ? (
          <div
            className="py-2.5 px-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-inner transition-all"
            style={{
              backgroundColor: activeTopBanner.bgColor,
              color: activeTopBanner.textColor,
            }}
          >
            <div className="flex items-center gap-2.5 text-xs">
              {activeTopBanner.badge && (
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border border-white/20"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: activeTopBanner.textColor,
                  }}
                >
                  {activeTopBanner.badge}
                </span>
              )}
              <span className="font-medium">{activeTopBanner.text}</span>
            </div>

            {activeTopBanner.linkUrl && (
              <span
                className="text-xs font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity inline-flex items-center gap-1"
                style={{ color: activeTopBanner.textColor }}
              >
                <span>{activeTopBanner.linkText || 'Learn More'}</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </div>
        ) : (
          <div className="py-4 px-6 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#EBE6DC] text-center text-xs text-[#8A847A]">
            No top ribbon banner is currently active. Activate one below to display it across the website header.
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 3. BANNERS REPOSITORY LIST                                     */}
      {/* ============================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-playfair text-xl font-medium text-[#1E1C1A]">
            Configured Banners ({banners.length})
          </h2>
          <span className="text-xs text-[#8A847A]">
            Active banners display automatically to visitors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                banner.isActive
                  ? 'border-[#D49B4B]/50 ring-1 ring-[#D49B4B]/20'
                  : 'border-[#EBE6DC] opacity-75'
              }`}
            >
              {/* Card Top: Position & Active switch */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: banner.bgColor }}
                    title={`Theme color: ${banner.bgColor}`}
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6152] bg-[#F5F2EB] px-2.5 py-0.5 rounded-md">
                    {banner.position === 'top_ribbon'
                      ? 'Top Ribbon'
                      : banner.position === 'hero_ad'
                      ? 'Hero Feature Ad'
                      : 'Footer Notice'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8A847A]">
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleToggle(banner.id, banner.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      banner.isActive ? 'bg-[#182821]' : 'bg-[#E5DFD3]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        banner.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Banner Mock Preview Card */}
              <div
                className="p-4 rounded-2xl shadow-inner text-xs space-y-2"
                style={{
                  backgroundColor: banner.bgColor,
                  color: banner.textColor,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-playfair text-sm font-semibold tracking-wide">
                    {banner.title}
                  </span>
                  {banner.badge && (
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-white/20"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                    >
                      {banner.badge}
                    </span>
                  )}
                </div>

                <p className="opacity-90 leading-relaxed text-xs">{banner.text}</p>

                {banner.linkUrl && (
                  <div className="pt-1 flex items-center gap-1 font-semibold text-[11px] underline underline-offset-2">
                    <span>{banner.linkText || 'Learn More'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Card Meta & Actions */}
              <div className="pt-3 border-t border-[#F5F2EB] flex items-center justify-between text-xs">
                <div className="text-[11px] text-[#8A847A]">
                  Target: <span className="font-mono text-[#1E1C1A]">{banner.linkUrl || 'None'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(banner)}
                    className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-[#1E1C1A] hover:border-[#B85233] hover:text-[#B85233] transition-colors"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirmId === banner.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(banner.id)}
                        className="px-2 py-1 rounded-lg bg-red-600 text-white text-[11px] font-semibold"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 rounded-lg bg-stone-100 text-stone-700 text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(banner.id)}
                      className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-stone-400 hover:border-red-300 hover:text-red-600 transition-colors"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. CREATE / EDIT BANNER MODAL                                  */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="w-full max-w-xl bg-white rounded-3xl border border-[#EBE6DC] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-[#182821] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D49B4B]">
                  Banner Configuration
                </span>
                <h3 className="font-playfair text-xl text-white font-normal">
                  {editingBannerId ? 'Edit Ad Banner' : 'Create New Banner'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Placement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1E1C1A] block">Headline / Internal Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Spring Philanthropy Drive"
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1E1C1A] block">Placement Position *</label>
                  <select
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        position: e.target.value as 'top_ribbon' | 'hero_ad' | 'footer_callout',
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                  >
                    <option value="top_ribbon">Top Header Ribbon (Sitewide)</option>
                    <option value="hero_ad">Hero Promotional Slot</option>
                    <option value="footer_callout">Footer Notice</option>
                  </select>
                </div>
              </div>

              {/* Banner Text Message */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1E1C1A] block">Announcement Copy / Message *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="e.g., Complimentary worldwide delivery on all orders over $100. 100% of journal profits fund education."
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                />
              </div>

              {/* Badge Tag & Presets */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1E1C1A] block">Badge Label (Optional)</label>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g., SPECIAL OFFER, IMPACT"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {BADGE_PRESETS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, badge: b })}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#FAF8F5] border border-[#EBE6DC] hover:border-[#D49B4B] text-[#6B6152]"
                    >
                      +{b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Link & Button CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1E1C1A] block">Target Destination URL</label>
                  <input
                    type="text"
                    value={formData.linkUrl || ''}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="e.g., /ayeyo-koris or /shop"
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] font-mono focus:outline-none focus:border-[#B85233]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1E1C1A] block">Button CTA Text</label>
                  <input
                    type="text"
                    value={formData.linkText || ''}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    placeholder="e.g., Learn More, Shop Now"
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                  />
                </div>
              </div>

              {/* Visual Color Theme */}
              <div className="space-y-2">
                <label className="font-semibold text-[#1E1C1A] block">Color Theme Palette</label>
                <div className="flex flex-wrap items-center gap-2">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          bgColor: p.bg,
                          textColor: p.text,
                        })
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                        formData.bgColor === p.bg
                          ? 'border-[#182821] ring-2 ring-[#182821]/20 font-semibold'
                          : 'border-[#EBE6DC] hover:border-stone-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: p.bg }}
                      />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Switch */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#1E1C1A] block">Make Banner Active Immediately</span>
                  <span className="text-[11px] text-[#8A847A]">
                    Active banners are displayed live to all website visitors
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#182821] rounded-md focus:ring-[#B85233]"
                />
              </div>

              {/* Live Preview inside modal */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-[#8A847A] uppercase tracking-wider block">
                  Interactive Preview
                </span>
                <div
                  className="p-3.5 rounded-xl text-xs space-y-1 shadow-inner"
                  style={{
                    backgroundColor: formData.bgColor,
                    color: formData.textColor,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{formData.title || 'Banner Title'}</span>
                    {formData.badge && (
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-white/20"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                      >
                        {formData.badge}
                      </span>
                    )}
                  </div>
                  <p className="opacity-90 leading-snug">{formData.text || 'Your announcement copy will appear here...'}</p>
                  {formData.linkText && (
                    <div className="text-[11px] font-semibold underline underline-offset-2">
                      {formData.linkText} →
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#F5F2EB] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1E1C1A] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-[#D49B4B] hover:bg-[#C28C3E] text-[#182821] font-semibold shadow-xs disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : editingBannerId ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
