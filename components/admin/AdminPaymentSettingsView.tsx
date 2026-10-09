'use client';

import { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Check,
  AlertCircle,
  Save,
  Sliders,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { updatePaymentSettingsAction } from '@/lib/actions/payment-settings';
import { PaymentMethodsConfig } from '@/lib/payment/types';

interface AdminPaymentSettingsViewProps {
  initialConfig: PaymentMethodsConfig;
}

export function AdminPaymentSettingsView({ initialConfig }: AdminPaymentSettingsViewProps) {
  const [config, setConfig] = useState<PaymentMethodsConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleToggle = (key: keyof PaymentMethodsConfig) => {
    setConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    // Guard: Ensure at least one payment method is active
    const hasAtLeastOne =
      config.cardEnabled ||
      (config.mobileMoneyEnabled &&
        (config.evcEnabled || config.zaadEnabled || config.sahalEnabled || config.edahabEnabled || config.premierEnabled));

    if (!hasAtLeastOne) {
      setStatusMessage({
        type: 'error',
        text: 'At least one payment method must remain enabled for customers to complete checkout.',
      });
      setIsSaving(false);
      return;
    }

    try {
      const res = await updatePaymentSettingsAction(config);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'Payment methods updated successfully. Changes are live on the checkout page immediately.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Failed to update payment settings.',
        });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error occurred while saving.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DC]">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D49B4B] flex items-center gap-1.5 mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Store Configuration</span>
          </div>
          <h1 className="font-playfair text-3xl font-normal text-[#1E1C1A]">
            Payment Methods Control
          </h1>
          <p className="text-xs text-[#8A847A]">
            Turn payment channels on or off and configure which methods appear to customers during checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 rounded-2xl bg-[#182821] hover:bg-[#233A30] disabled:opacity-50 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
        >
          {isSaving ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving Settings...
            </span>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#D49B4B]" />
              <span>Save & Publish Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Status Feedback */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Grid: Payment Channels vs Live Checkout Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. CREDIT / DEBIT CARDS */}
          <div className="p-6 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC] flex items-center justify-center text-[#B85233]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-playfair text-base font-semibold text-[#1E1C1A]">
                    Credit & Debit Cards
                  </h3>
                  <p className="text-xs text-[#8A847A]">Visa, Mastercard, & International Cards</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggle('cardEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  config.cardEnabled ? 'bg-[#182821]' : 'bg-[#E5DFC0]'
                }`}
                aria-label="Toggle Credit Cards"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.cardEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-[#6B655B]">
              <span>Status on checkout:</span>
              <span className={`font-semibold ${config.cardEnabled ? 'text-emerald-700' : 'text-stone-400'}`}>
                {config.cardEnabled ? '● Visible & Active' : '○ Hidden from Customers'}
              </span>
            </div>
          </div>

          {/* 2. SOMALI MOBILE MONEY (MASTER TOGGLE & SUB-PROVIDERS) */}
          <div className="p-6 rounded-3xl bg-white border border-[#EBE6DC] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC] flex items-center justify-center text-[#B85233]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-playfair text-base font-semibold text-[#1E1C1A]">
                    Somali Mobile Money
                  </h3>
                  <p className="text-xs text-[#8A847A]">Master switch for all instant wallet settlements</p>
                </div>
              </div>

              {/* Master Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggle('mobileMoneyEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  config.mobileMoneyEnabled ? 'bg-[#182821]' : 'bg-[#E5DFC0]'
                }`}
                aria-label="Toggle Mobile Money Master"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.mobileMoneyEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Individual Provider Toggles */}
            <div className="space-y-3 pt-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8A847A]">
                Supported Mobile Networks
              </p>

              {[
                {
                  key: 'evcEnabled' as const,
                  name: 'EVC Plus',
                  network: 'Hormuud Telecom',
                  logo: '/images/payment-methods/EVC-PLUS-Logo-01-230x128.webp',
                },
                {
                  key: 'zaadEnabled' as const,
                  name: 'ZAAD Service',
                  network: 'Telesom',
                  logo: '/images/payment-methods/zaad.png',
                },
                {
                  key: 'sahalEnabled' as const,
                  name: 'Sahal Service',
                  network: 'Golis Telecom',
                  logo: '/images/payment-methods/Golis_Telecom_Logo.png',
                },
                {
                  key: 'edahabEnabled' as const,
                  name: 'eDahab',
                  network: 'Dahabshiil',
                  logo: '/images/payment-methods/edahab.jpg',
                },
                {
                  key: 'premierEnabled' as const,
                  name: 'Premier Wallet',
                  network: 'Premier Bank',
                  logo: '/images/payment-methods/premier wallet.png',
                },
              ].map((provider) => {
                const isEnabled = config[provider.key] && config.mobileMoneyEnabled;

                return (
                  <div
                    key={provider.key}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isEnabled
                        ? 'bg-[#FAF8F5] border-[#EBE6DC]'
                        : 'bg-stone-50 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded-lg bg-white border border-[#EBE6DC] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                        <img
                          src={provider.logo}
                          alt={provider.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-playfair text-xs sm:text-sm font-semibold text-[#1E1C1A]">
                          {provider.name}
                        </div>
                        <div className="text-[10px] text-[#8A847A]">{provider.network}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!config.mobileMoneyEnabled}
                      onClick={() => handleToggle(provider.key)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                        config[provider.key] && config.mobileMoneyEnabled
                          ? 'bg-[#2D5A43]'
                          : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          config[provider.key] && config.mobileMoneyEnabled
                            ? 'translate-x-4'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Customer Preview Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#EBE6DC] shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E5DFC0]">
              <Eye className="w-4 h-4 text-[#B85233]" />
              <h3 className="font-playfair text-base font-medium text-[#1E1C1A]">
                Customer Checkout Preview
              </h3>
            </div>

            <p className="text-xs text-[#6B655B] leading-relaxed">
              Based on your active configuration, here are the payment methods currently visible to shoppers on the checkout page:
            </p>

            <div className="space-y-2.5">
              {config.cardEnabled ? (
                <div className="p-3.5 rounded-2xl bg-white border-2 border-[#B85233] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-[#B85233]" />
                    <span className="font-semibold text-[#1E1C1A]">Credit or Debit Card</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-stone-100 border border-dashed border-stone-300 text-xs text-stone-400 italic">
                  Card payment option is hidden
                </div>
              )}

              {config.mobileMoneyEnabled ? (
                <div className="p-3.5 rounded-2xl bg-white border border-[#EBE6DC] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-[#B85233]" />
                      <span className="font-semibold text-[#1E1C1A]">Mobile Money Dropdown</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#F5F2EB] flex flex-wrap gap-1.5">
                    {config.evcEnabled && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EBE6DC] text-[10px] font-medium">
                        EVC Plus
                      </span>
                    )}
                    {config.zaadEnabled && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EBE6DC] text-[10px] font-medium">
                        ZAAD
                      </span>
                    )}
                    {config.sahalEnabled && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EBE6DC] text-[10px] font-medium">
                        Sahal
                      </span>
                    )}
                    {config.edahabEnabled && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EBE6DC] text-[10px] font-medium">
                        eDahab
                      </span>
                    )}
                    {config.premierEnabled && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EBE6DC] text-[10px] font-medium">
                        Premier Wallet
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-stone-100 border border-dashed border-stone-300 text-xs text-stone-400 italic">
                  Mobile Money option is hidden
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E5DFC0] text-[11px] text-[#8A847A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4D5844] shrink-0" />
              <span>Instant synchronization across all live devices upon save.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
