'use client';

import { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  CheckCircle,
  Clock,
  X,
  Save,
} from 'lucide-react';
import { PostStatus } from '@prisma/client';
import { createBlogPostAction, updateBlogPostStatusAction } from '@/lib/actions/admin-management';

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
}

interface AdminBlogViewProps {
  initialPosts: BlogPostItem[];
}

export function AdminBlogView({ initialPosts }: AdminBlogViewProps) {
  const [posts, setPosts] = useState<BlogPostItem[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'PUBLISHED' as PostStatus,
  });

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setNewPost((prev) => ({ ...prev, title, slug }));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    setIsSubmitting(true);
    try {
      const res = await createBlogPostAction(newPost);
      if (res.success && res.post) {
        setPosts((prev) => [
          {
            id: res.post.id,
            title: res.post.title,
            slug: res.post.slug,
            excerpt: res.post.excerpt || '',
            content: res.post.content,
            featuredImage: res.post.featuredImage || '/images/book-cover-awakening.png',
            status: res.post.status,
            publishedAt: res.post.publishedAt ? res.post.publishedAt.toISOString() : null,
            createdAt: res.post.createdAt.toISOString(),
          },
          ...prev,
        ]);
        setIsModalOpen(false);
        setNewPost({ title: '', slug: '', excerpt: '', content: '', status: 'PUBLISHED' });
      }
    } catch {
      // Ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (postId: string, status: PostStatus) => {
    try {
      const res = await updateBlogPostStatusAction(postId, status);
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, status } : p))
        );
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B85233] mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Editorial & Thought Leadership</span>
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-medium text-[#1E1C1A]">
            Blog & Journal Entries
          </h1>
          <p className="text-sm text-[#6B655B] mt-1">
            Publish mindful essays, journaling guides, and community impact reflections.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#182821] text-white text-xs font-medium hover:bg-[#22382E] transition-colors self-start shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Published Articles</span>
            <CheckCircle className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            {posts.filter((p) => p.status === 'PUBLISHED').length}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Live on community reading page</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Draft Entries</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            {posts.filter((p) => p.status === 'DRAFT').length}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Pending editorial review</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8A847A] uppercase font-semibold">
            <span>Total Entries</span>
            <BookOpen className="w-4 h-4 text-[#B85233]" />
          </div>
          <div className="text-3xl font-playfair font-semibold text-[#1E1C1A] mt-2">
            {posts.length}
          </div>
          <p className="text-xs text-[#6B655B] mt-1">Archived & published corpus</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#EBE6DC] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#8A847A]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search published articles or drafts..."
          className="w-full text-sm bg-transparent outline-none text-[#1E1C1A] placeholder-[#8A847A]"
        />
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-3xl border border-[#EBE6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#F0EBE1] bg-[#FAF8F5] text-[#8A847A] text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-4 px-6 text-start">Article Title</th>
                <th className="py-4 px-6 text-start">Slug</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-start">Published On</th>
                <th className="py-4 px-6 text-end">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#8A847A]">
                    No articles published yet. Click &quot;New Article&quot; above to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-playfair font-semibold text-[#1E1C1A] block">
                        {item.title}
                      </span>
                      {item.excerpt && (
                        <span className="text-xs text-[#6B655B] line-clamp-1 mt-0.5">
                          {item.excerpt}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 font-mono text-xs text-[#8A847A]">
                      /blog/{item.slug}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          item.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-[#8A847A] text-xs">
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString()
                        : 'Unpublished'}
                    </td>

                    <td className="py-4 px-6 text-end">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value as PostStatus)
                        }
                        className="text-xs bg-[#FAF8F5] border border-[#EBE6DC] rounded-xl px-2.5 py-1 text-[#1E1C1A] outline-none"
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-[#EBE6DC] space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-playfair text-xl font-semibold text-[#1E1C1A]">
                  Create New Journal Article
                </h3>
                <p className="text-xs text-[#8A847A] mt-1">
                  Draft an editorial reflection or publication for the Naag Nool UP circle.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] block mb-1.5">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. The Power of Daily Intention in Mogadishu"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE6DC] text-sm text-[#1E1C1A] outline-none focus:border-[#B85233]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] block mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={newPost.slug}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE6DC] text-xs font-mono text-[#1E1C1A] outline-none focus:border-[#B85233]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] block mb-1.5">
                  Brief Excerpt / Summary
                </label>
                <input
                  type="text"
                  value={newPost.excerpt}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  placeholder="One sentence synopsis of the thought piece..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE6DC] text-xs text-[#1E1C1A] outline-none focus:border-[#B85233]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1E1C1A] block mb-1.5">
                  Article Content
                </label>
                <textarea
                  required
                  rows={5}
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Write the reflective guide or essay text here..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE6DC] text-xs text-[#1E1C1A] outline-none focus:border-[#B85233]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0EBE1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#6B655B] hover:text-[#1E1C1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#182821] text-white text-xs font-medium hover:bg-[#22382E] transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Publishing...' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
