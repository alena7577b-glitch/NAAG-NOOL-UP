# NAAG NOOL UP — SUPABASE FOUNDATION & BACKEND INTEGRATION
## Technical Architecture & Implementation Report — Phase 2.5

**Project:** Naag Nool UP  
**Phase:** Phase 2.5 — Supabase Foundation & Backend Integration  
**Date:** October 1, 2026  
**Architecture:** Next.js 16 (App Router) + Supabase PostgreSQL + Supabase Auth + Supabase Storage + Server-Side Prisma ORM + Abstract Payment Provider  
**Status:** IMPLEMENTED & VERIFIED  

---

## 1. Executive Summary

Phase 2.5 implements the technical backend, database, authentication, and object storage foundation for **Naag Nool UP**, transitioning the system safely to a **Hybrid Supabase Architecture** (Option C recommended in the Supabase Architecture Evaluation).

This phase establishes the non-visual backend infrastructure required for customer authentication, role-based access control, administrative guards, media uploads, and database operations.

```
                     +-----------------------------------+
                     |       Next.js 16 App Router       |
                     |  (Server Actions, Route Handlers) |
                     +-----------------+-----------------+
                                       |
           +---------------------------+---------------------------+
           |                           |                           |
           v                           v                           v
+--------------------+      +--------------------+      +--------------------+
|   Supabase Auth    |      |     Prisma ORM     |      |  Supabase Storage  |
|  (@supabase/ssr)   |      |  (Data Operations) |      | (Media Management) |
+----------+---------+      +----------+---------+      +----------+---------+
           |                           |                           |
           v                           v                           v
+--------------------+      +--------------------+      +--------------------+
|     auth.users     | <--- |    public."User"   |      | Public / Private   |
|   (Identity UUID)  |      |   (Authoritative)  |      | S3-Compatible Bkts |
+--------------------+      +--------------------+      +--------------------+
                                       |
                   +-------------------+-------------------+
                   |                   |                   |
                   v                   v                   v
              [CUSTOMER]            [ADMIN]          [SUPERADMIN]
```

---

## 2. Implemented Components & Architecture

### 2.1 Packages Installed & Configured
- `@supabase/supabase-js` (`^2.117.2`): Official JavaScript SDK for Supabase.
- `@supabase/ssr` (`^0.12.7`): Official SSR package for Next.js App Router (cookie & session lifecycle management).
- `@prisma/client` & `prisma` (`^7.10.0`): Type-safe server-side data access layer.

---

### 2.2 Environment Configuration & Strict Security Boundaries

Environment parsing is governed by [`lib/env.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/lib/env.ts) using runtime Zod validation.

```
Browser Client Components  --->  NEXT_PUBLIC_SITE_URL
                                  NEXT_PUBLIC_SUPABASE_URL
                                  NEXT_PUBLIC_SUPABASE_ANON_KEY (RLS-enforced)

Trusted Server-Only Code   --->  DATABASE_URL (Direct / Pooled)
                                  DIRECT_URL (Migrations)
                                  SUPABASE_SERVICE_ROLE_KEY (RLS-bypassing, NEVER on client)
                                  AUTH_SECRET
                                  PAYMENT_PROVIDER_KEY / SECRETS
```

#### Security Invariants:
1. `SUPABASE_SERVICE_ROLE_KEY` is strictly prohibited from browser exposure. `getServerEnv()` throws an explicit error if invoked in browser contexts.
2. `isBrowser` detection accurately isolates server runtimes and build steps while allowing safe unit testing.
3. [`.env.example`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/.env.example) is comprehensively documented with Supabase connection pooler configurations (`aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`).

---

### 2.3 Supabase Client Architecture

The client architecture is decoupled across 4 purpose-built modules:

1. **Browser Client ([`lib/supabase/client.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/lib/supabase/client.ts)):**
   - Instantiated via `createBrowserClient` from `@supabase/ssr`.
   - Uses only public credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
   - Safe for browser rendering and React Client Components.
2. **Server Client ([`lib/supabase/server.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/lib/supabase/server.ts)):**
   - Instantiated via `createServerClient` from `@supabase/ssr`.
   - Reads and sets HTTP-only session cookies via Next.js `cookies()` from `next/headers`.
   - Operates in user/anonymous context with RLS enforcement.
3. **Privileged Admin Client ([`lib/supabase/admin.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/lib/supabase/admin.ts)):**
   - Instantiated via `createClient` from `@supabase/supabase-js`.
   - Utilizes `SUPABASE_SERVICE_ROLE_KEY` with `persistSession: false`.
   - Strictly server-only. Used for user provisioning, role synchronization, and administrative media operations.
4. **Middleware Session Manager ([`lib/supabase/middleware.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/lib/supabase/middleware.ts) & [`middleware.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/middleware.ts)):**
   - Intercepts incoming requests to refresh expired auth tokens and synchronize cookies between `NextRequest` and `NextResponse`.
   - Gracefully passes through if Supabase credentials are not yet configured.

---

### 2.4 `auth.users` -> `public.User` Relationship & User Provisioning

Identity synchronization is managed by [`lib/auth/provisioning.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/lib/auth/provisioning.ts):

- **Canonical Identity Identifier:** The Supabase Auth UUID (`auth.users.id`) maps 1:1 to `public.User.id`.
- **Default Role Guarantee:** All new user registrations are guaranteed the `CUSTOMER` role.
- **Anti-Escalation Safeguard:**
  - Client-supplied metadata (`user_metadata.role`) is **strictly ignored**.
  - Changing an application role requires calling `assignUserRole(targetUserId, role, actor)`, which strictly requires `actor.role === 'SUPERADMIN'`.
  - The PostgreSQL database record `public.User.role` remains the primary, authoritative source of truth for all application logic.

---

### 2.5 Role-Based Access Control (RBAC) & Server Auth Guards

#### Role Hierarchy:
$$\text{SUPERADMIN (3)} > \text{ADMIN (2)} > \text{CUSTOMER (1)}$$

Implemented in [`lib/auth/rbac.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/lib/auth/rbac.ts) and [`lib/auth/server.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/lib/auth/server.ts):

| Permission / Capability | `CUSTOMER` | `ADMIN` | `SUPERADMIN` | Unauthenticated |
| :--- | :---: | :---: | :---: | :---: |
| Browse Shop & Place Orders | Yes | Yes | Yes | Yes (Guest) |
| View Own Profile & Orders | Yes | Yes | Yes | No (401) |
| Access Admin Panel UI | No (403) | Yes | Yes | No (401) |
| Manage Products & Catalog | No (403) | Yes | Yes | No (401) |
| Manage Orders & Fulfillment | No (403) | Yes | Yes | No (401) |
| Manage CMS & Blog Articles | No (403) | Yes | Yes | No (401) |
| View Financial Reports | No (403) | Yes | Yes | No (401) |
| Assign Administrative Roles | No (403) | No (403) | Yes | No (401) |

#### Server-Side Guards:
- `requireAuthenticatedUser()`: Returns `AuthSessionUser` or throws `AuthenticationError` (401).
- `requireRole(['ADMIN', 'SUPERADMIN'])`: Asserts role membership or throws `AuthorizationError` (403).
- `requireAdmin()`: Enforces admin access.
- `requireSuperAdmin()`: Strictly enforces superadmin access.

---

### 2.6 Supabase Storage & Media Architecture

Implemented via the existing `MediaStorageProvider` abstraction:

- **Provider Implementation ([`services/media/supabaseStorageProvider.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/services/media/supabaseStorageProvider.ts)):**
  - Manages uploads to public bucket (`naag-nool-public-media`) and private bucket (`naag-nool-private-docs`).
  - Implements `uploadFile`, `deleteFile`, `getPublicUrl`, and `getSignedUrl`.
- **Validation & Sanitization ([`services/media/validation.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/services/media/validation.ts)):**
  - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/svg+xml`, `application/pdf`.
  - Max image size: 10MB; Max document size: 25MB.
  - Path traversal defense: Sanitizes illegal characters (`..`, `/`, `\`) and falls back safely to timestamped identifiers.
- **Provider Factory ([`services/media/mediaStorage.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/services/media/mediaStorage.ts)):**
  - `getMediaStorageProvider()` dynamically selects `SupabaseMediaStorageProvider` when configured, or `LocalDevStorageProvider` in offline/local environments.

---

### 2.7 Row Level Security (RLS) Strategy & Migration SQL

The complete PostgreSQL RLS script is archived in [`prisma/sql/rls_policies.sql`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/prisma/sql/rls_policies.sql).

#### RLS Interaction with Prisma:
- **Defense in Depth:** RLS policies protect direct Supabase client requests, PostgREST queries, and Realtime subscriptions.
- **Prisma Server Operations:** Prisma connects using standard PostgreSQL database credentials that operate server-side. Next.js Server Actions and Route Handlers strictly enforce application-level RBAC guards (`requireAdmin()`, `requireAuthenticatedUser()`) and Zod input validation schemas.

---

### 2.8 Payment Abstraction Compatibility

- Preserved [`services/payment/types.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/services/payment/types.ts) and [`services/payment/mockProvider.ts`](file:///c:/Users/kapiir/Desktop/naag%20nool%20up/services/payment/mockProvider.ts).
- Cleanly decoupled and verified against the Prisma `Order` and `Payment` models. Ready for future integration with client-approved payment gateways (Somali Mobile Money / Card processor).

---

## 3. Verification & Test Results

The entire foundation was validated through unit, integration, and build tests:

```
Test Suites: 9 passed, 9 total
Tests:       76 passed, 76 total
Snapshots:   0 total
Time:        7.292 s
```

### Verified Test Suites:
1. `tests/supabase-env.test.ts`: Environment variable schema validation, security boundary isolation.
2. `tests/supabase-clients.test.ts`: Browser, Server, and Admin client instantiation and error recovery.
3. `tests/auth-rbac.test.ts`: Role hierarchy, permission matrix for `CUSTOMER`, `ADMIN`, `SUPERADMIN`.
4. `tests/user-provisioning.test.ts`: New user provisioning, role defaults, role elevation restriction.
5. `tests/auth-server.test.ts`: Server guards (`401 AuthenticationError`, `403 AuthorizationError`).
6. `tests/media-storage.test.ts`: Media upload validation, MIME filtering, path traversal protection, provider fallback.
7. `tests/payment-provider.test.ts`: Payment provider interface contract and webhook handling.
8. `tests/components.test.tsx`: Existing Phase 2 UI component and design token rendering.
9. `tests/foundation.test.ts`: Architecture tokens, i18n RTL support, and validation schemas.

### TypeScript & Production Build Verification:
- `npm run type-check`: **0 errors (Clean exit code 0)**
- `npm run build`: **Compiled successfully in Next.js 16 (Turbopack) (Clean exit code 0)**

---

## 4. Scope Discipline & Deferred Elements

### What Is Implemented in Phase 2.5:
- [x] `@supabase/supabase-js` and `@supabase/ssr` installed and configured.
- [x] Strict environment validation in `lib/env.ts` and template in `.env.example`.
- [x] Browser client, Server client, Admin client, and Middleware session updater.
- [x] Canonical `auth.users.id` -> `public.User.id` relationship design.
- [x] Secure server-side user provisioning and role elevation prevention.
- [x] Full RBAC engine and server-side authorization guards (`requireAdmin`, etc.).
- [x] Supabase Media Storage Provider conforming to `MediaStorageProvider`.
- [x] Storage validation, MIME verification, and path traversal protection.
- [x] PostgreSQL Row Level Security (RLS) SQL policies in `prisma/sql/rls_policies.sql`.
- [x] Prisma configuration updated for Supabase connection pooling mode.
- [x] Payment provider abstraction preserved and verified.
- [x] 76 unit and integration tests passing.
- [x] TypeScript validation passing.
- [x] Production build passing.

### What Is Intentionally Deferred (Future Phases):
- **Authentication UI Pages:** Login, Register, Forgot Password, Reset Password screens (belong to Phase 3 / Auth UI).
- **Public Website Pages:** Homepage, About, Shop, Product Detail, Cart, Checkout, Community, Contact (belong to future content & commerce phases).
- **Admin Dashboard UI:** Administrative layout, analytics charts, and management views (belong to Admin Phase).
- **Live Payment Gateway:** Real Somali Mobile Money / Card API credentials (pending client provision).
- **Real Database Migration Execution:** `prisma db push` / `migrate` against a live remote Supabase project will be executed when the client provides live production credentials.

---

## 5. Required Credentials for Live Deployment

When preparing for live Supabase deployment, the following values should be configured in the deployment environment (`.env.local` / Vercel / Cloud environment):

1. `NEXT_PUBLIC_SUPABASE_URL` (from Supabase Project Settings -> API)
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase Project Settings -> API)
3. `SUPABASE_SERVICE_ROLE_KEY` (from Supabase Project Settings -> API -> Service Role)
4. `DATABASE_URL` (Supabase Connection Pooling string on port 6543)
5. `DIRECT_URL` (Supabase Direct Connection string on port 5432)
