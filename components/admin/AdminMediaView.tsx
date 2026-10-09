'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ImageIcon,
  Search,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  category: string;
  url: string;
  sizeLabel: string;
}

const BRAND_MEDIA_ASSETS: MediaItem[] = [
  { id: 'm1', name: 'Ayeyo Portrait (Hero)', category: 'Hero & Editorial', url: '/images/ayeyo-actual-hero.png', sizeLabel: '641 KB' },
  { id: 'm2', name: 'Hero Panoramic Landscape', category: 'Hero & Editorial', url: '/images/hp-hero-panoramic.png', sizeLabel: '408 KB' },
  { id: 'm3', name: 'Somali Women Circle', category: 'Community', url: '/images/community-women-circle.jpg', sizeLabel: '277 KB' },
  { id: 'm4', name: 'Cinematic Sunset Glow', category: 'Atmospheric', url: '/images/prefooter-sunset-cinematic.jpg', sizeLabel: '714 KB' },
  { id: 'm5', name: 'The Awakening Edition Cover', category: 'Journals', url: '/images/book-cover-awakening.png', sizeLabel: '12 KB' },
  { id: 'm6', name: 'The Clarity Edition Cover', category: 'Journals', url: '/images/book-cover-clarity.png', sizeLabel: '11 KB' },
  { id: 'm7', name: 'The Healing Edition Cover', category: 'Journals', url: '/images/book-cover-healing.png', sizeLabel: '12 KB' },
  { id: 'm8', name: 'The Confidence Edition Cover', category: 'Journals', url: '/images/book-cover-confidence.png', sizeLabel: '12 KB' },
  { id: 'm9', name: 'The Abundance Edition Cover', category: 'Journals', url: '/images/book-cover-abundance.png', sizeLabel: '11 KB' },
  { id: 'm10', name: 'The Legacy Edition Cover', category: 'Journals', url: '/images/book-cover-legacy.png', sizeLabel: '12 KB' },
  { id: 'm11', name: 'EVC Plus Carrier Logo', category: 'Payment Badges', url: '/images/payment-methods/EVC-PLUS-Logo-01-230x128.webp', sizeLabel: '4 KB' },
  { id: 'm12', name: 'ZAAD Service Logo', category: 'Payment Badges', url: '/images/payment-methods/zaad.png', sizeLabel: '13 KB' },
  { id: 'm13', name: 'Sahal (Golis) Logo', category: 'Payment Badges', url: '/images/payment-methods/Golis_Telecom_Logo.png', sizeLabel: '109 KB' },
  { id: 'm14', name: 'eDahab Dahabshiil Logo', category: 'Payment Badges', url: '/images/payment-methods/edahab.jpg', sizeLabel: '9 KB' },
  { id: 'm15', name: 'Premier Wallet Logo', category: 'Payment Badges', url: '/images/payment-methods/premier wallet.png', sizeLabel: '36 KB' },
  { id: 'm16', name: 'Ayeyo Writing & Reflection', category: 'Hero & Editorial', url: '/images/ayeyo-writing.png', sizeLabel: '87 KB' },
  { id: 'm17', name: 'Ayeyo Study & Quietude', category: 'Hero & Editorial', url: '/images/ayeyo-study.png', sizeLabel: '41 KB' },
  { id: 'm18', name: 'Ayeyo Walking Outdoors', category: 'Hero & Editorial', url: '/images/ayeyo-walking.png', sizeLabel: '38 KB' },
];

export function AdminMediaView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['ALL', 'Journals', 'Hero & Editorial', 'Community', 'Payment Badges', 'Atmospheric'];

  const filtered = BRAND_MEDIA_ASSETS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(window.location.origin + item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B85233] mb-1">
          <ImageIcon className="w-4 h-4" />
          <span>Brand Repository</span>
        </div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A]">
          Media Assets & Photography
        </h1>
        <p className="text-sm text-[#6B655B] mt-1">
          Curated visual library of journal photography, brand portraits, carrier marks, and hero banners.
        </p>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((item) => {
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="group bg-white rounded-3xl border border-[#EBE6DC] shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="relative aspect-4/3 w-full bg-[#FAF8F5] overflow-hidden p-2 flex items-center justify-center">
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B85233] block">
                    {item.category}
                  </span>
                  <h3 className="font-playfair font-semibold text-sm text-[#1E1C1A] mt-0.5 line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[#8A847A] mt-1 font-mono">
                    <span>{item.sizeLabel}</span>
                  </div>
                </div>

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
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
