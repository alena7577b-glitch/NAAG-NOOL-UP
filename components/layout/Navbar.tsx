'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User as UserIcon, ShoppingBag, Menu, Globe, Shield, LogOut, Package, UserCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { MobileNav, NavItem } from './MobileNav';
import { locales, localeNames, Locale } from '@/config/i18n';
import { logoutAction } from '@/lib/auth/actions';

export interface AuthUserState {
  id: string;
  email: string;
  fullName?: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN';
}

export interface NavbarProps {
  cartCount?: number;
  onSearchClick?: () => void;
  currentLocale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
  user?: AuthUserState | null;
}

const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Ayeyo Koris', href: '/ayeyo-koris' },
  { label: 'Community', href: '/community' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar({
  cartCount = 0,
  onSearchClick,
  currentLocale = 'en',
  onLocaleChange,
  user: initialUser,
}: NavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUserState | null>(initialUser ?? null);
  const pathname = usePathname();

  useEffect(() => {
    if (initialUser !== undefined) {
      setCurrentUser(initialUser);
      return;
    }

    // Fetch active session state from /api/auth/me
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) return res.json();
        return { user: null };
      })
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, [initialUser, pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5DFC0]/70 bg-[#F9F6F0]/90 backdrop-blur-md transition-all">
      <Container size="default">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[#1E1C1A] hover:opacity-90 transition-opacity focus-visible:outline-none"
          >
            {/* Floral Motif Logo Mark */}
            <svg
              className="h-6 w-6 text-[#1E1C1A]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 2C12 7 7 12 2 12C7 12 12 17 12 22C12 17 17 12 22 12C17 12 12 7 12 2Z" />
            </svg>
            <span className="font-playfair text-xl sm:text-2xl font-normal tracking-[0.1em] uppercase">
              Naag Nool UP
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {defaultNavItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-sans text-sm font-medium tracking-wide transition-colors duration-150 py-1 relative ${
                    isActive
                      ? 'text-[#B85233]'
                      : 'text-[#1E1C1A]/85 hover:text-[#B85233]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 inset-x-0 h-0.5 bg-[#B85233] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher Dropdown */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsUserMenuOpen(false);
                }}
                aria-label="Select language"
                className="flex items-center gap-1.5 p-2 rounded-full text-[#1E1C1A] hover:bg-[#EAE5DC]/60 transition-colors cursor-pointer text-xs font-medium"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{currentLocale}</span>
              </button>

              {isLangOpen && (
                <div className="absolute end-0 mt-2 w-36 rounded-md bg-white p-1.5 shadow-lg border border-[#E5DFC0] z-50 animate-in fade-in zoom-in-95 duration-150">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        onLocaleChange?.(loc);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-start px-3 py-1.5 rounded-sm text-xs transition-colors cursor-pointer ${
                        currentLocale === loc
                          ? 'bg-[#B85233]/10 font-semibold text-[#B85233]'
                          : 'text-[#1E1C1A] hover:bg-[#F9F6F0]'
                      }`}
                    >
                      {localeNames[loc].nativeName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Trigger */}
            <button
              type="button"
              onClick={onSearchClick}
              aria-label="Search"
              className="p-2 rounded-full text-[#1E1C1A] hover:bg-[#EAE5DC]/60 transition-colors cursor-pointer focus-visible:outline-none"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Customer Account / Auth Dropdown */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen);
                      setIsLangOpen(false);
                    }}
                    aria-label="Account menu"
                    className="flex items-center gap-2 p-1.5 pe-3 rounded-full bg-sand/60 border border-stone-300/80 text-dusk hover:bg-[#EAE5DC] transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-terracotta text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-medium max-w-[100px] truncate hidden md:inline">
                      {currentUser.fullName || currentUser.email.split('@')[0]}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute end-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-stone-200/80 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                      <div className="px-3 py-2 border-b border-stone-100">
                        <p className="text-xs font-semibold text-dusk truncate">
                          {currentUser.fullName || 'Valued Member'}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                        {currentUser.role !== 'CUSTOMER' && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber/20 text-amber-900 border border-amber/30">
                            <Shield className="w-3 h-3" />
                            {currentUser.role}
                          </span>
                        )}
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-dusk hover:bg-sand/60 rounded-lg transition-colors"
                      >
                        <UserCheck className="w-4 h-4 text-terracotta" />
                        <span>Account Dashboard</span>
                      </Link>

                      <Link
                        href="/account/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-dusk hover:bg-sand/60 rounded-lg transition-colors"
                      >
                        <Package className="w-4 h-4 text-terracotta" />
                        <span>My Orders</span>
                      </Link>

                      {(currentUser.role === 'ADMIN' || currentUser.role === 'SUPERADMIN') && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-900 bg-amber/10 hover:bg-amber/20 rounded-lg transition-colors"
                        >
                          <Shield className="w-4 h-4 text-amber-700" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <div className="pt-1 border-t border-stone-100">
                        <form action={logoutAction}>
                          <button
                            type="submit"
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-start"
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span>Sign Out</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  aria-label="Sign In"
                  className="p-2 rounded-full text-[#1E1C1A] hover:bg-[#EAE5DC]/60 transition-colors focus-visible:outline-none flex items-center gap-1.5 text-xs font-medium"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              aria-label={`Shopping cart with ${cartCount} items`}
              className="relative p-2 rounded-full text-[#1E1C1A] hover:bg-[#EAE5DC]/60 transition-colors focus-visible:outline-none"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 -end-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#B85233] text-[10px] font-bold text-white">
                {cartCount}
              </span>
            </Link>

            {/* Mobile Navigation Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open mobile menu"
              className="lg:hidden p-2 rounded-full text-[#1E1C1A] hover:bg-[#EAE5DC]/60 transition-colors cursor-pointer focus-visible:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        items={defaultNavItems}
        cartCount={cartCount}
        currentLocale={currentLocale}
        onLocaleChange={onLocaleChange}
        user={currentUser}
      />
    </header>
  );
}
