/**
 * NAAG NOOL UP — Multi-Currency System
 * Default Currency: CAD (Canadian Dollar)
 * Features auto-detection via client timezone/locale, manual switching, and cookie persistence.
 */

export type Currency = 'CAD' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: Currency;
  name: string;
  symbol: string;
  rateFromCAD: number; // 1 CAD to target currency
  flag: string;
  formatPrefix: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: '$',
    rateFromCAD: 1.0,
    flag: '🇨🇦',
    formatPrefix: '$',
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rateFromCAD: 0.73,
    flag: '🇺🇸',
    formatPrefix: '$',
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rateFromCAD: 0.68,
    flag: '🇪🇺',
    formatPrefix: '€',
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rateFromCAD: 0.58,
    flag: '🇬🇧',
    formatPrefix: '£',
  },
};

export const DEFAULT_CURRENCY: Currency = 'CAD';
export const CURRENCY_STORAGE_KEY = 'naagnoolup_currency';
export const CURRENCY_COOKIE_NAME = 'NEXT_CURRENCY';

/**
 * Convert price in base CAD to target currency
 */
export function convertFromCAD(amountInCAD: number, targetCurrency: Currency): number {
  const config = CURRENCIES[targetCurrency] || CURRENCIES.CAD;
  return amountInCAD * config.rateFromCAD;
}

/**
 * Format a price with appropriate currency symbol and code
 */
export function formatCurrency(
  amountInCAD: number | string,
  targetCurrency: Currency = 'CAD',
  options: { showCode?: boolean; compact?: boolean } = { showCode: true }
): string {
  const numAmount = typeof amountInCAD === 'string' ? parseFloat(amountInCAD.replace(/[^0-9.-]+/g, '')) : amountInCAD;
  if (isNaN(numAmount)) return '$0.00 CAD';

  const config = CURRENCIES[targetCurrency] || CURRENCIES.CAD;
  const converted = numAmount * config.rateFromCAD;

  const formattedNum = converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (options.compact) {
    return `${config.formatPrefix}${formattedNum}`;
  }

  if (options.showCode) {
    return `${config.formatPrefix}${formattedNum} ${config.code}`;
  }

  return `${config.formatPrefix}${formattedNum}`;
}

/**
 * Detect user's local currency based on browser timezone and language locale.
 * Default is CAD.
 */
export function detectUserCurrency(): Currency {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY;

  try {
    // 1. Timezone detection (most reliable client indicator)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

    // Canada Timezones
    if (
      timeZone.includes('Toronto') ||
      timeZone.includes('Vancouver') ||
      timeZone.includes('Edmonton') ||
      timeZone.includes('Winnipeg') ||
      timeZone.includes('Halifax') ||
      timeZone.includes('St_Johns') ||
      timeZone.includes('Montreal') ||
      timeZone.includes('Regina') ||
      timeZone.includes('Whitehorse') ||
      timeZone.includes('Canada')
    ) {
      return 'CAD';
    }

    // US Timezones
    if (
      timeZone.includes('New_York') ||
      timeZone.includes('Chicago') ||
      timeZone.includes('Los_Angeles') ||
      timeZone.includes('Denver') ||
      timeZone.includes('Phoenix') ||
      timeZone.includes('Detroit') ||
      timeZone.includes('Indiana') ||
      timeZone.includes('Anchorage') ||
      timeZone.includes('Honolulu')
    ) {
      return 'USD';
    }

    // UK Timezone
    if (timeZone.includes('London') || timeZone.includes('Belfast')) {
      return 'GBP';
    }

    // Eurozone Timezones
    if (
      timeZone.includes('Paris') ||
      timeZone.includes('Berlin') ||
      timeZone.includes('Rome') ||
      timeZone.includes('Madrid') ||
      timeZone.includes('Amsterdam') ||
      timeZone.includes('Brussels') ||
      timeZone.includes('Vienna') ||
      timeZone.includes('Dublin') ||
      timeZone.includes('Helsinki') ||
      timeZone.includes('Athens') ||
      timeZone.includes('Lisbon') ||
      timeZone.includes('Stockholm') ||
      timeZone.includes('Oslo') ||
      timeZone.includes('Copenhagen') ||
      timeZone.includes('Warsaw') ||
      timeZone.includes('Prague')
    ) {
      return 'EUR';
    }

    // Somalia / East Africa (Commercial standard is USD)
    if (
      timeZone.includes('Mogadishu') ||
      timeZone.includes('Nairobi') ||
      timeZone.includes('Djibouti') ||
      timeZone.includes('Addis_Ababa')
    ) {
      return 'USD';
    }

    // 2. Browser Locale Fallback
    const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    if (browserLang.toLowerCase().endsWith('-ca')) return 'CAD';
    if (browserLang.toLowerCase().endsWith('-us')) return 'USD';
    if (browserLang.toLowerCase().endsWith('-gb')) return 'GBP';
  } catch {
    // If timezone parsing fails, fall back to CAD
  }

  // Default to CAD as requested
  return DEFAULT_CURRENCY;
}
