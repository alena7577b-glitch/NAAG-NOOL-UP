'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useCurrency } from '@/lib/currency/context';
import { Currency, CURRENCIES } from '@/lib/currency';

interface CurrencySwitcherProps {
  variant?: 'navbar' | 'compact' | 'footer' | 'pill';
  className?: string;
}

export function CurrencySwitcher({
  variant = 'navbar',
  className = '',
}: CurrencySwitcherProps) {
  const { currency, setCurrency, isAutoDetected } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const activeConfig = CURRENCIES[currency] || CURRENCIES.CAD;

  if (variant === 'pill') {
    return (
      <div className={`grid grid-cols-4 gap-1 bg-[#EFEAE1] p-1 rounded-xl ${className}`}>
        {(Object.keys(CURRENCIES) as Currency[]).map((code) => {
          const isSelected = currency === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setCurrency(code)}
              className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer text-center ${
                isSelected
                  ? 'bg-white text-[#B85233] shadow-xs font-semibold'
                  : 'text-[#6B655B] hover:text-[#1E1C1A]'
              }`}
            >
              {code}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Select store currency"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#FAF6F0] hover:bg-white/15 transition-all cursor-pointer focus-visible:outline-none border border-white/20 bg-white/10"
        >
          <span className="text-sm leading-none">{activeConfig.flag}</span>
          <span className="font-mono tracking-tight font-semibold text-[11px] text-[#FAF6F0]">
            {activeConfig.code}
          </span>
          <span className="text-[10px] text-white/60">({activeConfig.symbol})</span>
          <ChevronDown
            className={`w-3 h-3 text-white/60 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div
            role="listbox"
            aria-label="Currency selection list"
            className="absolute bottom-full mb-2 start-0 w-48 rounded-xl bg-[#26241B] shadow-2xl border border-white/15 py-2 z-50 text-[#FAF6F0] animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                Store Currency
              </span>
              {isAutoDetected && (
                <span className="text-[9px] bg-[#B85233]/30 text-[#E59880] font-medium px-1.5 py-0.5 rounded-full">
                  Auto-detected
                </span>
              )}
            </div>

            <div className="py-1">
              {(Object.keys(CURRENCIES) as Currency[]).map((code) => {
                const cfg = CURRENCIES[code];
                const isSelected = currency === code;

                return (
                  <button
                    key={code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setCurrency(code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 text-[#FAF6F0] font-semibold'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{cfg.flag}</span>
                      <span className="font-mono font-bold">{cfg.code}</span>
                      <span className="text-white/50 font-sans text-[11px] truncate max-w-[80px]">
                        {cfg.name}
                      </span>
                    </div>

                    {isSelected && <Check className="w-3.5 h-3.5 text-[#E59880]" />}
                  </button>
                );
              })}
            </div>

            <div className="px-3 pt-1.5 pb-0.5 border-t border-white/10 text-[10px] text-white/40 text-center">
              Base: CAD ($) • Live conversion
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select store currency"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-[#1E1C1A] hover:bg-[#EAE5DC]/70 transition-all cursor-pointer focus-visible:outline-none border border-[#E5DFC0]/60 bg-white/40"
      >
        <span className="text-sm leading-none">{activeConfig.flag}</span>
        <span className="font-mono tracking-tight font-semibold text-[11px] text-[#1E1C1A]">
          {activeConfig.code}
        </span>
        <span className="text-[10px] text-[#8A847A]">({activeConfig.symbol})</span>
        <ChevronDown
          className={`w-3 h-3 text-[#8A847A] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Currency selection list"
          className="absolute end-0 top-full mt-2 w-48 rounded-xl bg-white shadow-xl border border-[#E5DFC0] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1.5 border-b border-[#F0EBE1] flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A847A]">
              Store Currency
            </span>
            {isAutoDetected && (
              <span className="text-[9px] bg-[#B85233]/10 text-[#B85233] font-medium px-1.5 py-0.5 rounded-full">
                Auto-detected
              </span>
            )}
          </div>

          <div className="py-1">
            {(Object.keys(CURRENCIES) as Currency[]).map((code) => {
              const cfg = CURRENCIES[code];
              const isSelected = currency === code;

              return (
                <button
                  key={code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setCurrency(code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#B85233]/10 text-[#B85233] font-semibold'
                      : 'text-[#1E1C1A] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cfg.flag}</span>
                    <span className="font-mono font-bold">{cfg.code}</span>
                    <span className="text-[#8A847A] font-sans text-[11px] truncate max-w-[80px]">
                      {cfg.name}
                    </span>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-[#B85233]" />}
                </button>
              );
            })}
          </div>

          <div className="px-3 pt-1.5 pb-0.5 border-t border-[#F0EBE1] text-[10px] text-[#A69E90] text-center">
            Base: CAD ($) • Live conversion
          </div>
        </div>
      )}
    </div>
  );
}
