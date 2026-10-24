'use client';

import { useState, useTransition, useRef } from 'react';
import Image from 'next/image';
import {
  ImageIcon,
  Search,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Upload,
  AlertCircle,
  X,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import {
  MediaItem,
  deleteAdminMediaAssetAction,
  uploadAdminMediaAction,
} from '@/lib/actions/admin-media';

interface AdminMediaViewProps {
  initialMedia: MediaItem[];
}

export function AdminMediaView({ initialMedia }: AdminMediaViewProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Deletion Confirmation Modal
  const [deletingAsset, setDeletingAsset] = useState<MediaItem | null>(null);

  // Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('Hero & Editorial');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  // Dynamic categories
  const categories = [
    'ALL',
    ...Array.from(new Set(mediaList.map((item) => item.category))),
  ];

  const filtered = mediaList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopyUrl = (item: MediaItem) => {
    const fullUrl = item.url.startsWith('http')
      ? item.url
      : window.location.origin + item.url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteConfirm = () => {
    if (!deletingAsset) return;
    const targetId = deletingAsset.id;

    startTransition(async () => {
      const res = await deleteAdminMediaAssetAction(targetId);
      if (res.success) {
        setMediaList((prev) => prev.filter((m) => m.id !== targetId));
        setDeletingAsset(null);
      }
    });
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setUploadError(null);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('category', uploadCategory);

    startTransition(async () => {
      const res = await uploadAdminMediaAction(formData);
      if (!res.success || !res.asset) {
        setUploadError(res.error || 'Upload failed.');
        return;
      }

      setMediaList((prev) => [res.asset!, ...prev]);
      setIsUploadModalOpen(false);
      setUploadFile(null);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B85233] mb-1">
            <ImageIcon className="w-4 h-4" />
            <span>Brand Repository</span>
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A]">
            Media Assets & Photography ({mediaList.length})
          </h1>
          <p className="text-sm text-[#6B655B] mt-1">
            Curated visual library of journal photography, brand portraits, carrier marks, and hero banners.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setUploadError(null);
            setUploadFile(null);
            setIsUploadModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#182821] hover:bg-[#22382E] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98] shrink-0"
        >
          <Upload className="w-3.5 h-3.5 text-[#D49B4B]" />
          <span>Upload Media Asset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#EBE6DC] shadow-xs flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-[#8A847A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by title or keyword..."
            className="w-full text-sm bg-transparent outline-none text-[#1E1C1A] placeholder-[#8A847A]"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#182821] text-white'
                  : 'bg-white border border-[#EBE6DC] text-[#6B655B] hover:text-[#1E1C1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Media Assets */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#EBE6DC] space-y-3">
          <ImageIcon className="w-10 h-10 text-[#8A847A] mx-auto opacity-50" />
          <p className="font-playfair text-lg text-[#1E1C1A]">No media assets found</p>
          <p className="text-xs text-[#8A847A]">Try clearing your search query or uploading a new asset.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item) => {
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-[#EBE6DC] shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all relative"
              >
                {/* Delete button positioned on top right */}
                <button
                  type="button"
                  onClick={() => setDeletingAsset(item)}
                  className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 hover:bg-red-50 text-stone-400 hover:text-red-600 border border-[#EBE6DC] shadow-xs transition-colors"
                  title="Delete Media Asset"
                  aria-label={`Delete ${item.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Thumbnail Preview */}
                <div className="relative aspect-4/3 w-full bg-[#FAF8F5] overflow-hidden p-2 flex items-center justify-center">
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    unoptimized={item.url.startsWith('http')}
                  />
                </div>

                {/* Meta details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B85233] block">
                      {item.category}
                    </span>
                    <h3 className="font-playfair font-semibold text-sm text-[#1E1C1A] mt-0.5 line-clamp-1" title={item.name}>
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-[#8A847A] mt-1 font-mono">
                      <span>{item.sizeLabel}</span>
                    </div>
                  </div>

                  {/* Actions: Copy URL & Open Link */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#F5F2EB]">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F0EBE1] border border-[#EBE6DC] text-xs font-medium text-[#1E1C1A] transition-colors"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy URL'}</span>
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl hover:bg-[#FAF8F5] text-[#8A847A] hover:text-[#1E1C1A] transition-colors"
                      title="Open full size"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* DELETE CONFIRMATION MODAL                                      */}
      {/* ============================================================== */}
      {deletingAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="w-full max-w-md bg-white rounded-3xl border border-[#EBE6DC] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-[#182821] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D49B4B]">
                  Confirm Asset Removal
                </span>
                <h3 className="font-playfair text-lg text-white font-normal">
                  Delete Media Asset
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setDeletingAsset(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC]">
                <div className="relative w-12 h-12 bg-white rounded-xl overflow-hidden border border-[#E8E2D8] shrink-0 flex items-center justify-center">
                  <Image
                    src={deletingAsset.url}
                    alt={deletingAsset.name}
                    fill
                    className="object-contain p-1"
                    unoptimized={deletingAsset.url.startsWith('http')}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[#1E1C1A] truncate">{deletingAsset.name}</p>
                  <p className="text-[11px] text-[#8A847A]">{deletingAsset.category} • {deletingAsset.sizeLabel}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Are you sure you want to permanently delete this media asset? Any content referencing this URL will no longer display this image.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setDeletingAsset(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1E1C1A] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Permanently</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* UPLOAD NEW MEDIA MODAL                                         */}
      {/* ============================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="w-full max-w-lg bg-white rounded-3xl border border-[#EBE6DC] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-[#182821] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D49B4B]">
                  Storage Repository
                </span>
                <h3 className="font-playfair text-xl text-white font-normal">
                  Upload Media Asset
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              {uploadError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* File Drop / Select Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-2xl bg-[#FAF8F5] border-2 border-dashed border-[#EBE6DC] hover:border-[#D48344] cursor-pointer text-center space-y-2 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setUploadFile(f);
                  }}
                  className="hidden"
                />

                <div className="w-10 h-10 rounded-full bg-white border border-[#EBE6DC] text-[#1E1C1A] mx-auto flex items-center justify-center shadow-xs">
                  <Upload className="w-4 h-4 text-[#B85233]" />
                </div>

                <div>
                  <p className="font-semibold text-sm text-[#1E1C1A]">
                    {uploadFile ? uploadFile.name : 'Click to select or drag and drop an image'}
                  </p>
                  <p className="text-[11px] text-[#8A847A] mt-0.5">
                    {uploadFile
                      ? `${(uploadFile.size / 1024).toFixed(0)} KB • Ready to upload`
                      : 'JPEG, PNG, WebP, AVIF, or SVG (Up to 10MB)'}
                  </p>
                </div>
              </div>

              {/* Category selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#1E1C1A] block">Asset Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B85233]"
                >
                  <option value="Hero & Editorial">Hero & Editorial</option>
                  <option value="Journals">Journals</option>
                  <option value="Community">Community</option>
                  <option value="Atmospheric">Atmospheric</option>
                  <option value="Payment Badges">Payment Badges</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#F5F2EB] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1E1C1A] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !uploadFile}
                  className="px-5 py-2 rounded-xl bg-[#182821] hover:bg-[#22382E] text-white font-semibold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D49B4B]" />
                      <span>Upload Asset</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
