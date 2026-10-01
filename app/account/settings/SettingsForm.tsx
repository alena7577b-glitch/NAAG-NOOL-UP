"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { updatePasswordAction } from "@/lib/auth/actions";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function SettingsForm() {
  const t = useTranslations("settings");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const result = await updatePasswordAction({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (result.success) {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError(result.error || "Failed to update password");
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

      {/* Current Password */}
      <div className="space-y-2">
        <label htmlFor="currentPassword" className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
          {t("currentPassword")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-stone-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-sand/30 border border-stone-200 rounded-xl ps-10 pe-10 py-3 text-dusk placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all text-sm"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-stone-400 hover:text-stone-600 transition-colors"
            tabIndex={-1}
          >
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <label htmlFor="newPassword" className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
          {t("newPassword")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-stone-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="newPassword"
            type={showNew ? "text" : "password"}
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-sand/30 border border-stone-200 rounded-xl ps-10 pe-10 py-3 text-dusk placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all text-sm"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-stone-400 hover:text-stone-600 transition-colors"
            tabIndex={-1}
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm New Password */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
          {t("confirmPassword")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-stone-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-sand/30 border border-stone-200 rounded-xl ps-10 pe-10 py-3 text-dusk placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all text-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-stone-400 hover:text-stone-600 transition-colors"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
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
              <span>{t("updating")}</span>
            </>
          ) : (
            t("updatePassword")
          )}
        </button>
      </div>
    </form>
  );
}
