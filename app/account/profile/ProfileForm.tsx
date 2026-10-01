"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { updateProfileAction } from "@/lib/auth/actions";
import { User, Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ProfileFormProps {
  initialFullName: string;
  email: string;
}

export function ProfileForm({ initialFullName, email }: ProfileFormProps) {
  const t = useTranslations("profile");
  const [fullName, setFullName] = useState(initialFullName);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const result = await updateProfileAction({ fullName });

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Failed to update profile");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{t("success")}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
          {t("fullName")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-stone-400">
            <User className="w-4 h-4" />
          </div>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ayan Mohamed"
            className="w-full bg-sand/30 border border-stone-200 rounded-xl ps-10 pe-4 py-3 text-dusk placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all text-sm"
          />
        </div>
      </div>

      {/* Email (Read-only) */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
          {t("email")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-stone-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            type="email"
            disabled
            value={email}
            className="w-full bg-stone-100 border border-stone-200/60 rounded-xl ps-10 pe-4 py-3 text-stone-500 text-sm cursor-not-allowed select-none"
          />
        </div>
        <p className="text-xs text-stone-500">{t("emailNote")}</p>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-terracotta text-white rounded-xl font-medium text-sm hover:bg-terracotta-dark focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:ring-offset-2 transition-all disabled:opacity-50 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t("saving")}</span>
            </>
          ) : (
            t("save")
          )}
        </button>
      </div>
    </form>
  );
}
