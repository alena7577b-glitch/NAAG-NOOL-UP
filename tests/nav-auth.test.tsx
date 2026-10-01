import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock server actions & DB to prevent Prisma initialisation in JSDOM unit tests
jest.mock('@/lib/auth/actions', () => ({
  logoutAction: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {},
}));

describe('Navbar & MobileNav Authentication States', () => {
  const defaultNavItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
  ];

  describe('Navbar Component', () => {
    test('renders Sign In link when user is not authenticated', () => {
      render(<Navbar user={null} />);
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    });

    test('renders user initials/name button when user is authenticated', () => {
      render(
        <Navbar
          user={{
            id: 'usr-1',
            email: 'ayan@example.com',
            fullName: 'Ayan Mohamed',
            role: 'CUSTOMER',
          }}
        />
      );

      expect(screen.getByRole('button', { name: /account menu/i })).toBeInTheDocument();
      expect(screen.getByText('Ayan Mohamed')).toBeInTheDocument();
    });
  });

  describe('MobileNav Component', () => {
    test('renders Sign In and Create Account CTAs when unauthenticated', () => {
      render(
        <MobileNav
          isOpen={true}
          onClose={jest.fn()}
          items={defaultNavItems}
          user={null}
        />
      );

      const signInLinks = screen.getAllByRole('link', { name: /sign in/i });
      expect(signInLinks.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole('link', { name: /create account/i })).toBeInTheDocument();
    });

    test('renders Account Links and Admin Badge when authenticated as ADMIN', () => {
      render(
        <MobileNav
          isOpen={true}
          onClose={jest.fn()}
          items={defaultNavItems}
          user={{
            id: 'admin-1',
            email: 'admin@naagnoolup.com',
            fullName: 'Admin User',
            role: 'ADMIN',
          }}
        />
      );

      expect(screen.getByText(/Account \(Admin User\)/i)).toBeInTheDocument();
      expect(screen.getByText('ADMIN')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /admin dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    });
  });
});
