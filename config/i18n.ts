/**
 * NAAG NOOL UP — Internationalization Configuration
 * Supports English (en), Somali (so), and Arabic (ar with RTL layout direction).
 */

export const locales = ['en', 'so', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const rtlLocales: Locale[] = ['ar'];

export function isRtlLocale(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}

export function getDirection(locale: string): 'rtl' | 'ltr' {
  return isRtlLocale(locale) ? 'rtl' : 'ltr';
}

export const localeNames: Record<Locale, { name: string; nativeName: string; dir: 'ltr' | 'rtl' }> = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr' },
  so: { name: 'Somali', nativeName: 'Soomaali', dir: 'ltr' },
  ar: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
};
