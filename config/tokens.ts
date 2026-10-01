/**
 * NAAG NOOL UP — Design Tokens & Theme Configuration
 * Establishes central visual tokens for colors, typography, spacing, and layout.
 */

export const colors = {
  dusk: '#1E1C1A',
  duskDark: '#141312',
  terracotta: '#B85233',
  terracottaHover: '#A64426',
  amber: '#D49B4B',
  sage: '#4D5844',
  sageDark: '#3B4734',
  sand: '#F9F6F0',
  sandLight: '#FAF8F5',
  border: '#E5DFC0',
  muted: '#EAE5DC',
  mutedText: '#6B655B',
} as const;

export const fonts = {
  serif: 'Playfair Display, Georgia, serif',
  accent: 'Cormorant Upright, Georgia, serif',
  sans: 'DM Sans, system-ui, sans-serif',
} as const;

export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1280px',
  largeDesktop: '1536px',
} as const;

export const layout = {
  maxContainerWidth: '1280px',
  headerHeight: '80px',
} as const;

export type ColorToken = keyof typeof colors;
