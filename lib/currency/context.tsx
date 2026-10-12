'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  Currency,
  CURRENCIES,
  DEFAULT_CURRENCY,
  CURRENCY_STORAGE_KEY,
  CURRENCY_COOKIE_NAME,
  detectUserCurrency,
  formatCurrency,
  convertFromCAD,
} from './index';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInCAD: number | string, options?: { showCode?: boolean; compact?: boolean }) => string;
  convertPrice: (amountInCAD: number) => number;
  availableCurrencies: typeof CURRENCIES;
  isAutoDetected: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // 1. Check existing saved user preference
        const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency | null;
        if (saved && saved in CURRENCIES) {
          setCurrencyState(saved);
          return;
        }

        // 2. Auto-detect if no user preference set yet
        const detected = detectUserCurrency();
        setCurrencyState(detected);
        setIsAutoDetected(true);
        localStorage.setItem(CURRENCY_STORAGE_KEY, detected);
        document.cookie = `${CURRENCY_COOKIE_NAME}=${detected};path=/;max-age=31536000;SameSite=Lax`;
      } catch {
        // Storage unavailable fallback
        setCurrencyState(DEFAULT_CURRENCY);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    if (!(newCurrency in CURRENCIES)) return;
    setCurrencyState(newCurrency);
    setIsAutoDetected(false);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
      document.cookie = `${CURRENCY_COOKIE_NAME}=${newCurrency};path=/;max-age=31536000;SameSite=Lax`;
    } catch {
      // Storage error handling
    }
  }, []);

  const formatPrice = useCallback(
    (
      amountInCAD: number | string,
      options?: { showCode?: boolean; compact?: boolean }
    ) => {
      return formatCurrency(amountInCAD, currency, options);
    },
    [currency]
  );

  const convertPrice = useCallback(
    (amountInCAD: number) => {
      return convertFromCAD(amountInCAD, currency);
    },
    [currency]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatPrice,
      convertPrice,
      availableCurrencies: CURRENCIES,
      isAutoDetected,
    }),
    [currency, setCurrency, formatPrice, convertPrice, isAutoDetected]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Graceful fallback if called outside provider during SSR/testing
    return {
      currency: DEFAULT_CURRENCY,
      setCurrency: () => {},
      formatPrice: (amount, options) => formatCurrency(amount, DEFAULT_CURRENCY, options),
      convertPrice: (amount) => convertFromCAD(amount, DEFAULT_CURRENCY),
      availableCurrencies: CURRENCIES,
      isAutoDetected: false,
    };
  }
  return context;
}
