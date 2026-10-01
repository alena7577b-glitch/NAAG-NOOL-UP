# NAAG NOOL UP — Phase 3 Authentication & Account System Architecture

## Overview
Phase 3 delivers a complete, secure, production-ready authentication and customer account system for **NAAG NOOL UP**. The architecture integrates Supabase Auth for credential handling, session management, and multi-factor/magic-link capabilities with PostgreSQL / Prisma as the authoritative source of truth for user profiles, roles, and order records.

---

## Key Components & Architecture

### 1. Dual-Layer Auth & Role Architecture
- **Supabase Auth (`auth.users`)**: Handles user authentication, password hashing (bcrypt/argon2), confirmation emails, and password recovery tokens.
- **PostgreSQL / Prisma (`public.User`)**: Authoritative store for user profiles and roles (`CUSTOMER`, `ADMIN`, `SUPERADMIN`).
- **Anti-Escalation Engine**:
  - `provisionUserFromSupabase` strictly forces new users to the `CUSTOMER` role regardless of user metadata.
  - Role elevation is exclusively restricted to authenticated `SUPERADMIN` actors via `assignUserRole()`.

### 2. Implemented Routes & Capabilities

#### Customer Authentication Flow:
- `/register`: Registration with password confirmation, Zod validation, and email confirmation messaging.
- `/login`: Customer login portal with password visibility toggling, redirect param handling, and reset success alerts.
- `/forgot-password`: Email-based password recovery triggering Supabase recovery links.
- `/reset-password`: Secure password updating via authenticated recovery sessions.
- `/auth/callback`: Server route exchanging authorization/recovery codes with Supabase SSR cookies.

#### Customer Account Portal (Protected via `requireAuthenticatedUser()`):
- `/account`: Account overview, member status, and recent order snapshot.
- `/account/profile`: Edit display name and view verified email address.
- `/account/orders`: Real-time order history, line items, and fulfillment status badges.
- `/account/settings`: Password change with current password verification.

#### Admin Portal & Access Control (Protected via `requireAdmin()`):
- `/admin/login`: Dedicated admin login screen enforcing role verification.
- `/admin/unauthorized`: Branded 403 Forbidden page for unauthorized role attempts.
- `/admin`: Protected administration control center foundation.

#### Global Header Integration:
- `Navbar` and `MobileNav`: Dynamically detect user session state, rendering "Sign In" for unauthenticated visitors and user avatar / name / role / account links for logged-in members.

---

## Security Invariants
1. Passwords are never stored in plain text or handled by custom hashing algorithms.
2. Server Actions validate all payloads using strict Zod schemas (`lib/validation/schemas.ts`).
3. Admin routes require valid session + database role verification. Unprivileged customers attempting admin login are immediately signed out and denied.
4. Database queries for customer orders strictly filter by the authenticated session `userId`.
