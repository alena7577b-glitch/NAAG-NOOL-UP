'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  ExternalLink,
  Layers,
} from 'lucide-react';

export interface PageItem {
  id: string;
  slug: string;
  title: string;
  locale: string;
  route: string;
  purpose: string;
  updatedAt: string;
}

const STATIC_STOREFRONT_PAGES: PageItem[] = [
  {
    id: 'page-home',
    slug: '',
    title: 'Home — Hero & Philosophy',
    locale: 'en',
    route: '/',
    purpose: 'Hero marquee, featured journal releases, philosophy showcase',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-story',
    slug: 'story',
    title: 'Our Story — Mission & Vision',
    locale: 'en',
    route: '/story',
    purpose: 'Narrative of empowering Somali women and mindful reflection',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-shop',
    slug: 'shop',
    title: 'Shop — Guided Journal Editions',
    locale: 'en',
    route: '/shop',
    purpose: 'Complete catalog of guided journals, specs, and purchasing',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-cart',
    slug: 'cart',
    title: 'Shopping Bag',
    locale: 'en',
    route: '/cart',
    purpose: 'Cart item review, quantities, and subtotal calculation',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-checkout',
    slug: 'checkout',
    title: 'Secure Checkout',
    locale: 'en',
    route: '/checkout',
    purpose: 'Card & Somali mobile money dual payment settlement',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-contact',
    slug: 'contact',
    title: 'Contact & Support',
    locale: 'en',
    route: '/contact',
    purpose: 'Inquiry form, physical location details, and direct support',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-community',
    slug: 'community',
    title: 'Community Newsletter',
    locale: 'en',
    route: '/community',
    purpose: 'Monthly prompts, circle signups, and empowerment articles',
    updatedAt: new Date().toISOString(),
  },
];

interface AdminPagesViewProps {
  initialDbPages?: Array<{ id: string; slug: string; title: string; locale: string; updatedAt: string }>;
}

export function AdminPagesView({ initialDbPages = [] }: AdminPagesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Combine static architecture with any custom CMS pages
  const allPages: PageItem[] = [
    ...STATIC_STOREFRONT_PAGES,
    ...initialDbPages.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      locale: p.locale,
      route: `/${p.slug}`,
      purpose: 'Custom CMS Content Page',
      updatedAt: p.updatedAt,
    })),
  ];

  const filtered = allPages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B85233] mb-1">
          <Layers className="w-4 h-4" />
          <span>Site Architecture</span>
        </div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A]">
          Storefront Pages & Templates
        </h1>
        <p className="text-sm text-[#6B655B] mt-1">
          Review core landing pages, conversion funnels, brand stories, and view live previews.
        </p>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE6DC] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#8A847A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter pages by title or route..."
          className="w-full text-sm bg-transparent outline-none text-[#1E1C1A] placeholder-[#8A847A]"
        />
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-3xl border border-[#EBE6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#F0EBE1] bg-[#FAF8F5] text-[#8A847A] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-4 px-6 text-start">Page Name</th>
                <th className="py-4 px-6 text-start">Route</th>
                <th className="py-4 px-6 text-start">Purpose / Architecture</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-4 px-6 font-medium text-[#1E1C1A]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#B85233]" />
                      <span>{item.title}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-[#6B655B]">
                    {item.route}
                  </td>

                  <td className="py-4 px-6 text-[#6B655B] text-xs">
                    {item.purpose}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Live
                    </span>
                  </td>

                  <td className="py-4 px-6 text-end">
                    <Link
                      href={item.route}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] text-xs font-medium text-[#1E1C1A] hover:border-[#B85233] transition-colors"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
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
