# NAAG NOOL UP — COMPLETE FORENSIC PROJECT AUDIT
**Authoritative Pre-Deployment Engineering, Security, Database, Architecture, and Production Readiness Audit**  
**Date of Audit**: October 10, 2026  
**Auditor Roles**: Senior Software Architect, Principal Full-Stack Engineer, Database Architect, Security Engineer, DevOps Engineer, QA Lead, Performance Engineer, and Production Readiness Auditor  
**Repository**: `c:\Users\kapiir\Desktop\naag nool up` (`alena7577b-glitch/NAAG-NOOL-UP`)  
**Branch**: `main` (synchronized with `origin/main`, commit `d9c772c`)  
**Audit Scope**: Strict Read-Only Forensic Inspection across 49 Dimensions. Zero code modifications, zero schema changes, zero destructive operations executed.

---

## 1. EXECUTIVE SUMMARY

### 1.1 High-Level Project State
NAAG NOOL UP is a bespoke, luxury modest fashion and cultural heritage e-commerce web platform celebrating Somali womanhood, generational craft, and community initiatives (*Ayeyo Koris* and *Shax* gaming). The platform is built with Next.js 16.3.7 (App Router with Turbopack), React 19.3.0, TypeScript 6.0.3, Tailwind CSS v4.3.3, Prisma 7.10.0 with PostgreSQL adapter (`pg`), and Supabase (PostgreSQL with Row Level Security and SSR Authentication).

The frontend demonstrates exceptional luxury aesthetic direction, bespoke typography, responsive mobile navigation, rich editorial layouts, and an interactive Shax cultural game. The authentication foundation incorporates robust server-side Supabase SSR session handling, OAuth2 integration with Google, and multi-tier role-based access control (`CUSTOMER`, `ADMIN`, `SUPERADMIN`).

Substantial architectural progress was completed between October 8 and October 10, 2026:
- The `/checkout` route exists and renders an expansive multi-step luxury checkout flow (`CheckoutView.tsx`, 48 KB).
- The shopping bag (`/cart`) is fully wired to client-side persistence via `CartContext.tsx` (`localStorage`).
- An extensive admin management suite exists under `/admin` spanning 14 sub-views (products, inventory, orders, customers, community, inquiries, pages, blog, media, roles, settings).
- Real database seeding has occurred: PostgreSQL contains 6 products, 24 images, 6 users, 1 order, and 1 payment record.
- Automated tests expanded to 16 test suites and 123 tests, all passing (100% pass rate).
- Production build (`prisma generate && next build`) compiles successfully in 63 seconds with 39 registered routes.

### 1.2 Critical Production Vulnerabilities & Blockers
Despite these major milestones, forensic inspection identified critical technical blockers and launch risks:
1. **Linting Failure (P1 / CI Blocker)**: `npm run lint` fails with exit code 1 due to 2 unescaped entity syntax errors in `app/admin/page.tsx:105` and 3 unoptimized `<img>` warnings.
2. **Checkout Transaction Logic Flaw (P1 / Commerce Blocker)**: In `lib/actions/checkout.ts`, product inventory is decremented *before* payment initiation. If payment initiation fails, `createOrderAction` still returns `{ success: true }`, creating an orphaned unpaid order with decremented stock.
3. **Payment Webhook IDOR / Crash Bug (P1 / Payment Blocker)**: In `app/api/webhooks/payment/route.ts:64`, the order update query calls `where: { id: orderId }`. If the gateway transmits `orderNumber` as the reference, this query throws an unhandled Prisma exception and returns a 500 error to the payment provider.
4. **Missing Payment Webhook Secret (P0 / Security Blocker)**: `SOOMARPAY_WEBHOOK_SECRET` is absent from `.env`. Webhook signature verification fails or cannot be verified in live production.
5. **Internationalization Disconnected (P1 / Core Requirement)**: Despite dictionaries in `messages/` (`en.json`, `so.json`, `ar.json`), `app/layout.tsx` hardcodes `lang="en"` and `dir="ltr"`. The navbar language dropdown has no attached handler; selecting Somali or Arabic does nothing.
6. **Missing Legal Pages (P2 / Compliance Risk)**: Footer links to `/privacy` and `/terms` return 404 Not Found. Shipping and Returns links redirect to `/shop`.
7. **Transactional Email Is a Mock (P1 / Operations Blocker)**: `services/email/index.ts` contains no active transport (SMTP or Resend); customer order receipts are not dispatched.
8. **Admin Shell Authorization Fallback (P2 / Security Concern)**: In `app/admin/layout.tsx`, unauthorized users are returned `<>{children}</>` rather than being redirected to `/admin/login` at the layout level.

### 1.3 Executive Production Readiness Verdict
**VERDICT: NO-GO**  
The platform cannot safely accept live customer payments or process orders in production until the P0/P1 blockers in payment webhook verification, checkout transaction error handling, and transactional emails are resolved.

---

## 2. PROJECT INVENTORY

### 2.1 File System Structure
- **Root Directory**: `c:\Users\kapiir\Desktop\naag nool up`
- **Total Tracked Directories**: 19 top-level directories
- **Key Subsystems**:
  - `app/`: 16 route groups, 39 active endpoints, App Router layout, error, not-found, robots, sitemap
  - `components/`: UI library, layout (Navbar, Footer, MobileNav), commerce (`CartView`, `CheckoutView`, `ProductCard`, `ProductDetailView`), admin views (14 distinct console components)
  - `lib/`: Actions (7 files), Auth (RBAC, provisioning, server helpers), Cart context, Database client (`db.ts`), Environment validator (`env.ts`), Logger (`logger.ts`), Products library, SEO helpers, Supabase clients
  - `services/`: Payment dispatchers (`MockProvider`, `StripePaymentProvider`, `SoomarPayProvider`), Media storage (`SupabaseMediaStorageProvider`, `LocalDevStorageProvider`), Email service (`ProductionEmailService`)
  - `prisma/`: `schema.prisma` (12 models, 5 enums), `prisma.config.ts`
  - `supabase/`: `config.toml`, migrations (`20261001000000_full_schema_and_rls.sql`, `20261001000000_rls_foundation.sql`)
  - `messages/`: `en.json`, `so.json`, `ar.json`
  - `tests/`: 17 test specification files covering RBAC, auth, commerce, storage, public actions, and payment providers
  - `public/`: 91 editorial and product assets in `public/images/`, 5 mobile money logos

---

## 3. TECHNOLOGY STACK AUDIT

| Technology | Actual Version | Verified Location | Status | Production Concern |
| :--- | :---: | :--- | :---: | :--- |
| **Next.js** | 16.3.7 | `package.json` | VERIFIED | Next 16 Turbopack emits warning: `middleware` convention deprecated in favor of `proxy`. |
| **React** | 19.3.0 | `package.json` | VERIFIED | React 19 Server Components & Actions active. |
| **TypeScript** | 6.0.3 | `package.json`, `tsconfig.json` | VERIFIED | Compiles cleanly with 0 type errors. |
| **Node.js** | 22.15.1 | Runtime Environment | VERIFIED | Active on host environment. |
| **Tailwind CSS** | 4.3.3 | `package.json`, `@tailwindcss/postcss` | VERIFIED | Tailwind v4 engine using `@import "tailwindcss";` in `globals.css`. |
| **Prisma ORM** | 7.10.0 | `package.json`, `prisma/schema.prisma` | VERIFIED | Uses `@prisma/adapter-pg` driver adapter. |
| **Database Driver** | `pg` 8.23.1 | `package.json`, `lib/db.ts` | VERIFIED | Pool configured (max: 5 connections, timeout: 5000ms). |
| **Supabase SSR** | 0.12.7 | `package.json`, `lib/supabase/` | VERIFIED | Cookie-based session sync in `updateSession`. |
| **Supabase JS** | 2.117.2 | `package.json`, `lib/supabase/admin.ts` | VERIFIED | Admin client with service-role key on server only. |
| **Validation** | Zod 4.6.5 | `package.json`, `lib/validation/` | VERIFIED | Validates environment, checkout forms, admin actions. |
| **Icons** | Lucide-React 1.49.0 | `package.json` | VERIFIED | Used across storefront and admin views. |
| **Testing** | Jest 30.5.2 | `package.json`, `jest.config.mjs` | VERIFIED | `ts-jest` 29.4.14, jsdom 29.1.1. |
| **Localization** | `next-intl` 4.14.8 | `package.json`, `messages/` | PARTIAL | Installed and dictionaries written, but disconnected in RootLayout. |
| **Email** | Custom Stub | `services/email/index.ts` | INCOMPLETE | No nodemailer, Resend, or SendGrid library installed. |

---

## 4. ARCHITECTURE AUDIT

### 4.1 Data & Control Flow
```
Client Browser (React 19 Hydration / Client Components)
      │
      ▼
Edge Proxy / Next.js Middleware (`middleware.ts` -> `lib/supabase/middleware.ts`)
      │  (Refreshes auth cookies via Supabase Auth `getUser()`)
      ▼
Server Components (`app/**/page.tsx`)
      │  (Fetch data via Server Actions or Direct Prisma Client)
      ├──► Server Actions (`lib/actions/*.ts`)
      │         │
      │         ├──► Authentication & RBAC Guard (`lib/auth/server.ts`)
      │         ├──► Zod Schema Validation (`lib/validation/*.ts`)
      │         ├──► PostgreSQL Database via Prisma Adapter (`lib/db.ts`)
      │         └──► External Payment Gateways (`services/payment/`)
      │
      └──► Route Handlers (`app/api/**/route.ts`)
                ├──► `/api/auth/me`: Current session user endpoint
                └──► `/api/webhooks/payment`: Gateway webhook listener
```

### 4.2 Architecture Findings
- **Server/Client Boundaries**: Well-maintained. Server actions are isolated with `'use server'` directives. Secrets in `lib/env.ts` explicitly guard against browser access via `isBrowser` check.
- **Database Access Pattern**: The application uses Prisma Client (`lib/db.ts`) connected to Supabase PostgreSQL via connection pooling. Because connections use the direct database connection string (`DATABASE_URL`), server queries execute with table owner privileges, bypassing PostgreSQL RLS policies. RLS policies protect against client-direct Supabase requests, while server actions enforce application-level RBAC.
- **Circular Dependencies**: None identified.
- **Architectural Risk**: `middleware.ts` relies on the deprecated convention in Next.js 16 (`middleware-to-proxy` warning emitted during build).

---

## 5. CODEBASE QUALITY AUDIT

### 5.1 Static Analysis & Compiler Verification
- **TypeScript Typecheck**:
  - Command: `npm run type-check` (`tsc --noEmit`)
  - Result: **0 errors** (VERIFIED). Strict typing is enforced.
- **ESLint Execution**:
  - Command: `npm run lint` (`eslint .`)
  - Result: **FAILED** with exit code 1 (VERIFIED).
  - Specific Findings:
    1. `app/admin/page.tsx:105:17`: `error` `react/no-unescaped-entities` (`'` unescaped).
    2. `app/admin/page.tsx:105:24`: `error` `react/no-unescaped-entities` (`'` unescaped).
    3. `components/admin/AdminPaymentSettingsView.tsx:254:25`: `warning` `@next/next/no-img-element`.
    4. `components/commerce/CheckoutView.tsx:764:31`: `warning` `@next/next/no-img-element`.
    5. `components/commerce/CheckoutView.tsx:811:39`: `warning` `@next/next/no-img-element`.
  - Impact: CI/CD deployment pipelines will abort the build if `eslint` fails.

### 5.2 Code Smells & Antipatterns
- **Magic Fallbacks in Admin Dashboard**: In `app/admin/page.tsx:42-59`, if database queries fail or return low numbers, the dashboard artificially forces counts using `Math.max(6, realProductsCount)`, `Math.max(12, realOrdersCount)`, and computes fake benchmark revenue `(realRevenueSum + 1150)`.
- **Primary Key Mutation**: In `lib/auth/provisioning.ts:85`, an update mutates the `id` of `public.User` to align with Supabase Auth UUID if an account was pre-created with an existing email. Primary key mutations in relational databases carry severe constraint integrity risks.
- **Orphan Duplicate Route**: `/shop/[slug]` directly re-exports `/product/[slug]` without canonical tag or 301 redirect.

---

## 6. ROUTE AUDIT

The application compiles 39 routes (`next build` output verified):

| Route Path | Type | Auth Required | Purpose | Status |
| :--- | :---: | :---: | :--- | :---: |
| `/` | ƒ Dynamic | Public | Editorial Homepage, Hero, Shax Game, Journal Showcase | VERIFIED |
| `/_not-found` | ○ Static | Public | 404 Error Display | VERIFIED |
| `/about` | ○ Static | Public | Brand Heritage & Movement Story | VERIFIED |
| `/account` | ƒ Dynamic | Authenticated | Customer Dashboard | VERIFIED |
| `/account/orders` | ƒ Dynamic | Authenticated | Customer Order History & Tracking | VERIFIED |
| `/account/profile` | ƒ Dynamic | Authenticated | Personal Profile Settings | VERIFIED |
| `/account/settings` | ƒ Dynamic | Authenticated | Account Password & Preferences | VERIFIED |
| `/admin` | ƒ Dynamic | ADMIN / SUPERADMIN | Admin Analytics & KPI Dashboard | VERIFIED |
| `/admin/blog` | ƒ Dynamic | ADMIN / SUPERADMIN | Editorial Article Management | VERIFIED |
| `/admin/community` | ƒ Dynamic | ADMIN / SUPERADMIN | Community Membership Submissions | VERIFIED |
| `/admin/customers` | ƒ Dynamic | ADMIN / SUPERADMIN | Customer Directory & Order Metrics | VERIFIED |
| `/admin/inquiries` | ƒ Dynamic | ADMIN / SUPERADMIN | Contact Message Inbox | VERIFIED |
| `/admin/inventory` | ƒ Dynamic | ADMIN / SUPERADMIN | Real-time Stock Levels & Restock Controls | VERIFIED |
| `/admin/login` | ƒ Dynamic | Public | Dedicated Admin Portal Authentication | VERIFIED |
| `/admin/media` | ƒ Dynamic | ADMIN / SUPERADMIN | Media Asset Library & Storage Manager | VERIFIED |
| `/admin/orders` | ƒ Dynamic | ADMIN / SUPERADMIN | Order Fulfillment & Status Pipeline | VERIFIED |
| `/admin/pages` | ƒ Dynamic | ADMIN / SUPERADMIN | CMS Content Page Management | VERIFIED |
| `/admin/products` | ƒ Dynamic | ADMIN / SUPERADMIN | Catalog Creation, Pricing, Image Management | VERIFIED |
| `/admin/roles` | ƒ Dynamic | SUPERADMIN | Staff Directory & Privilege Delegation | VERIFIED |
| `/admin/settings` | ƒ Dynamic | SUPERADMIN | Payment Gateway Toggles & Store Configuration | VERIFIED |
| `/admin/unauthorized`| ƒ Dynamic | Public | 403 Forbidden Access Page | VERIFIED |
| `/admin/users` | ƒ Dynamic | SUPERADMIN | User Role Assignment & Administrative Control | VERIFIED |
| `/api/auth/me` | ƒ Dynamic | Public / Authenticated | Current User Session Inspection Endpoint | VERIFIED |
| `/api/webhooks/payment`| ƒ Dynamic | Public (Signed) | Payment Gateway Webhook Ingestion Handler | VERIFIED (P1 BUG) |
| `/auth/callback` | ƒ Dynamic | Public | Supabase OAuth / Magic Link Code Exchange | VERIFIED |
| `/ayeyo-koris` | ○ Static | Public | Intergenerational Eldercare Initiative | VERIFIED |
| `/cart` | ○ Static | Public | Shopping Bag View with LocalStorage Sync | VERIFIED |
| `/checkout` | ƒ Dynamic | Public / Authenticated | Multi-Step Luxury Checkout Flow | VERIFIED |
| `/community` | ○ Static | Public | Community Circle & Newsletter Signup | VERIFIED |
| `/contact` | ○ Static | Public | Customer Inquiries & Partnership Form | VERIFIED |
| `/forgot-password` | ○ Static | Public | Password Reset Request Initiation | VERIFIED |
| `/login` | ○ Static | Public | Customer Authentication Portal | VERIFIED |
| `/product/[slug]` | ƒ Dynamic | Public | Journal Detail & Editorial Gallery | VERIFIED |
| `/register` | ○ Static | Public | Customer Account Registration | VERIFIED |
| `/reset-password` | ○ Static | Public | Password Reset Finalization | VERIFIED |
| `/robots.txt` | ○ Static | Public | Search Engine Crawler Directive | VERIFIED |
| `/shop` | ○ Static (ISR) | Public | Product Catalog with Filters & Search | VERIFIED |
| `/shop/[slug]` | ƒ Dynamic | Public | Duplicate Alias for `/product/[slug]` | VERIFIED (SEO RISK) |
| `/sitemap.xml` | ○ Static | Public | Search Engine XML Sitemap | VERIFIED |

**Missing Routes Flagged**:
- `/privacy`: Linked in `Footer.tsx:149`, returns 404.
- `/terms`: Linked in `Footer.tsx:154`, returns 404.
- `/api/media/private`: Referenced in `services/media/supabaseStorageProvider.ts:60`, returns 404.

---

## 7. AUTHENTICATION AUDIT

### 7.1 Architecture & Flow
- **Provider**: Supabase Auth (GoTrue) using `@supabase/ssr`.
- **Session Management**: Cookie-based JWT tokens stored across HTTP cookies and refreshed on incoming requests via `middleware.ts`.
- **User Provisioning**: `lib/auth/provisioning.ts` provisions a corresponding record in `public.User` upon first login/registration with default role `CUSTOMER`.
- **OAuth2**: Google OAuth is enabled in `lib/auth/actions.ts` via `signInWithOAuth({ provider: 'google' })`.
- **Verification**: Verified via test suite `tests/auth-actions.test.ts`, `tests/auth-server.test.ts`, and `tests/user-provisioning.test.ts` (all passed).

### 7.2 Authentication Findings
- **Strengths**: Passwords are never stored in `public.User` (Supabase Auth handles hashing via bcrypt/Argon2); cookies are configured as HTTPOnly, Secure, and SameSite; server-side authentication does not trust client JWT payload claims without `getUser()` validation.
- **Weakness**: Password reset relies on Supabase standard email delivery. If custom SMTP is not configured in the Supabase Dashboard, emails may be rate-limited or delivered via generic Supabase default domains.

---

## 8. AUTHORIZATION & RBAC AUDIT

### 8.1 Roles & Hierarchy
The system implements three roles:
1. `CUSTOMER`: Default role. Can view products, place orders, view personal profile and order history.
2. `ADMIN`: Elevated role. Can access `/admin`, manage products, inventory, orders, customer views, inquiries, community entries, content, and media.
3. `SUPERADMIN`: Highest privilege. Has all `ADMIN` privileges plus staff user management, role modification (`assignUserRole`), and payment settings toggle.

### 8.2 Guard Implementation
- Server-side guards in `lib/auth/server.ts`:
  - `requireAuthenticatedUser()`: Throws 401.
  - `requireRole(roles)`: Throws 403.
  - `requireAdmin()`: Throws 403.
  - `requireSuperAdmin()`: Throws 403.
- In `lib/actions/admin-users.ts` and `lib/actions/payment-settings.ts`, actions call `requireSuperAdmin()`.
- **Vulnerability in Admin Layout**:
  In `app/admin/layout.tsx`:
  ```tsx
  const user = await getCurrentUser();
  const isAuthorized = user && (user.role === 'ADMIN' || user.role === 'SUPERADMIN');
  if (!isAuthorized) {
    return <>{children}</>;
  }
  ```
  While individual admin sub-pages (e.g., `app/admin/page.tsx:30`) call `await requireAdmin()`, returning `<>{children}</>` at the layout level without an immediate redirect to `/admin/login` is a defense-in-depth failure. Any future admin route created without its own page-level guard would render unprotected.

---

## 9. DATABASE AUDIT

### 9.1 Schema & Models
- **Database Engine**: PostgreSQL hosted on Supabase (project ref: `hqtaemeyyhkvcuaxfrvy`).
- **Models**: 12 models in `prisma/schema.prisma`:
  - `User`: Primary key `id` (text UUID), unique `email`, role enum, timestamps.
  - `Product`: Primary key `id`, unique `slug`, `price` (Decimal 10,2), `stockQuantity` (Int), `isAvailable` (Boolean).
  - `ProductImage`: References `Product` with `onDelete: Cascade`.
  - `Order`: Primary key `id`, unique `orderNumber`, optional `userId` (references `User` `onDelete: SetNull`), `totalAmount` (Decimal 10,2), `status` (OrderStatus enum), `shippingAddress` (JSONB).
  - `OrderItem`: References `Order` (`onDelete: Cascade`) and `Product` (`onDelete: Restrict`).
  - `Payment`: References `Order` (`onDelete: Cascade`), `provider`, `amount`, `status` (PaymentStatus enum).
  - `CommunitySignup`: `fullName`, unique `email`, `marketingConsent`.
  - `ContactSubmission`: `name`, `email`, `subject`, `message`, `status`.
  - `ContentPage`: unique `slug`, `title`, `contentJson`, `locale`.
  - `BlogPost`: unique `slug`, `title`, `content`, `status`, `publishedAt`.
  - `MediaAsset`: `filename`, `fileUrl`, `mimeType`, `sizeBytes`.
  - `SiteSetting`: unique `key`, `value` (JSONB).

### 9.2 Live Row Counts (Forensic Verification on October 10, 2026)
| Table Name | Actual Row Count | Status | Notes |
| :--- | :---: | :---: | :--- |
| `Product` | **6** | VERIFIED | Seeded canonical journals active |
| `ProductImage` | **24** | VERIFIED | 4 images per journal seeded |
| `User` | **6** | VERIFIED | Includes test users and admin staff |
| `Order` | **1** | VERIFIED | Benchmark test order |
| `OrderItem` | **2** | VERIFIED | Benchmark items |
| `Payment` | **1** | VERIFIED | Benchmark payment record |
| `CommunitySignup` | **4** | VERIFIED | Active community members |
| `ContactSubmission` | **5** | VERIFIED | Contact inquiry messages |
| `SiteSetting` | **1** | VERIFIED | Payment provider settings stored |
| `BlogPost` | **0** | EMPTY | No editorial blog posts seeded |
| `ContentPage` | **0** | EMPTY | No CMS content pages seeded |
| `MediaAsset` | **0** | EMPTY | No media records in database |

### 9.3 Database Index & Integrity Gaps
Forensic inspection of PostgreSQL `pg_indexes` revealed:
- **Missing Index on Foreign Keys**:
  - `Order.userId`: No index. User order queries (`findMany({ where: { userId } })`) trigger a sequential scan.
  - `OrderItem.orderId`: No separate index (only primary key `id` indexed).
  - `OrderItem.productId`: No index.
  - `ProductImage.productId`: No index.
  - `Payment.orderId`: No index.
- **Missing Index on Filtering Columns**:
  - `Order.createdAt`: No index (orders dashboard sorts by `createdAt DESC`).
  - `Product.category`: No index.
  - `Product.isAvailable`: No index.
- **Missing Database Constraint**:
  - `Product.stockQuantity` has no check constraint (`CHECK ("stockQuantity" >= 0)`). High concurrency can drive inventory into negative values.

---

## 10. DATABASE MIGRATION AUDIT

- **Migration Tooling**: The repository contains SQL scripts in `supabase/migrations/`:
  - `20261001000000_full_schema_and_rls.sql` (13,221 bytes)
  - `20261001000000_rls_foundation.sql` (9,281 bytes)
- **Prisma Migrations**: There is NO `prisma/migrations/` directory.
- **Operational Risk**: `package.json:12` defines `"db:push": "prisma db push"`. Relying on `db push` in a production environment bypasses declarative migration history, version tracking, and rollback capabilities. Future schema updates must be formalized via SQL migrations or `prisma migrate`.

---

## 11. SUPABASE AUDIT

- **Project URL**: `https://hqtaemeyyhkvcuaxfrvy.supabase.co` (VERIFIED in `.env`).
- **Connection Strings**:
  - `DATABASE_URL`: Port 6543 (PgBouncer connection pooler for serverless transactions).
  - `DIRECT_URL`: Port 5432 (Session mode for direct schema operations).
- **Security Check**:
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` is restricted to client-safe usage.
  - `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side code (`lib/supabase/admin.ts`, `lib/env.ts`). It is never referenced with `NEXT_PUBLIC_`.

---

## 12. ROW LEVEL SECURITY (RLS) AUDIT

- **RLS Status**: `rowsecurity` is enabled (`true`) across ALL 12 public tables in PostgreSQL.
- **Policies**: 24 distinct RLS policies are active:
  - `User`: Public can view own profile or admin can view all; users can update non-role fields.
  - `Product`: Public can view available products; admins can manage all products.
  - `Order`: Customers can view own orders; admins can manage all orders.
  - `Payment`: Admins can view payment records.
  - `CommunitySignup`: Public can insert; admins can view and delete.
  - `ContactSubmission`: Public can insert; admins can manage.
  - `BlogPost`, `ContentPage`, `MediaAsset`, `SiteSetting`: Public can select; admins can manage.
- **Service Bypass Factor**: `relforcerowsecurity` is `false` for all tables. Because `lib/db.ts` connects using `DATABASE_URL` as the database superuser, Prisma queries bypass RLS. This is normal for server actions, but means data isolation depends entirely on application-level authorization guards.

---

## 13. STORAGE AUDIT

- **Buckets Verified on Supabase**:
  1. `naag-nool-public-media`: Publicly accessible bucket for product photos and article assets.
  2. `naag-nool-private-docs`: Private bucket for order documents and legal records.
- **Storage Implementation**: `services/media/supabaseStorageProvider.ts`.
- **Defect Found**: Line 60 returns private URLs formatted as `/api/media/private?key=...`. This endpoint does not exist in `app/api/`, causing 404 errors if private uploads are requested.

---

## 14. COMMERCE AUDIT

### 14.1 Product Catalog
- 6 Canonical journals seeded: *The Awakening*, *The Clarity*, *The Healing*, *The Confidence*, *The Abundance*, *The Legacy*.
- Price: $24.00 each across all items.
- Live database queries in `lib/products.ts` correctly fetch from `db.product.findMany`, falling back to `CANONICAL_JOURNALS` only if the database is unreachable.

### 14.2 Shopping Bag (Cart)
- Implemented in `lib/cart/CartContext.tsx` with reducer actions (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`, `HYDRATE_CART`).
- Persisted to browser `localStorage` under key `naag_nool_cart_v1`.
- Verified in `CartView.tsx`: Displays order line items, quantity adjustments, item removals, free shipping qualification ($50 threshold), subtotal, and direct navigation to `/checkout`.

### 14.3 Checkout Pipeline
- Form fields in `CheckoutView.tsx`: Customer name, email, phone, address, city, country, postal code, delivery notes, and payment method selector.
- Validated via `checkoutSchema` in `lib/validation/checkout.ts`.
- Payment methods supported in UI:
  - Somali Mobile Money: EVC Plus, ZAAD, Sahal, eDahab, Premier Wallet.
  - Card: Visa, Mastercard.

### 14.4 Critical Commerce Flaws
1. **Unreserved Stock Decrement**: In `lib/actions/checkout.ts:105`, product stock is decremented immediately upon order creation. If payment initiation fails or the user abandons the external gateway, the stock decrement is never reverted.
2. **False Success Return on Payment Error**: In `lib/actions/checkout.ts:201`, if `paymentProvider.initiatePayment` returns `{ success: false }`, the action still returns `{ success: true, orderId: order.id }`. The customer is presented with an apparent order success screen even though payment was rejected.

---

## 15. PAYMENT AUDIT

### 15.1 Provider Architecture
- `services/payment/index.ts` provides dispatcher logic:
  - If `SOOMARPAY_API_KEY` is present or `PAYMENT_PROVIDER === 'soomarpay'`, activates `SoomarPayProvider`.
  - If Stripe configured, activates `StripePaymentProvider`.
  - In development without credentials, falls back to `MockPaymentProvider`.
- Active Gateway: **SoomarPay** is currently active (`SOOMARPAY_API_KEY` length: 58 characters).

### 15.2 Webhook Security & Vulnerability Analysis
- Webhook route: `app/api/webhooks/payment/route.ts`.
- **Missing Webhook Secret**: `SOOMARPAY_WEBHOOK_SECRET` is NOT defined in `.env`. Line 25 in `soomarPayProvider.ts` evaluates to `undefined`. HMAC-SHA256 signature validation in `handleWebhook` fails or cannot be verified.
- **Database Query Mismatch Bug (P1)**:
  ```typescript
  // Line 63-65:
  await db.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId }, // BUG: orderId may contain orderNumber
      data: { status: 'PAID' },
    });
  ```
  Line 44 allows looking up by `id` OR `orderNumber`:
  `OR: [{ id: orderId }, { orderNumber: orderId }]`
  However, line 64 attempts to update `where: { id: orderId }`. If the gateway sends `NNU-XXXXXX-XXXX` as the reference, Prisma throws: `Record to update not found` because `id` is a UUID. This crashes the webhook handler with HTTP 500.

---

## 16. ADMIN SYSTEM AUDIT

| Admin Module | Route | Backend Connection | Status | Evidence |
| :--- | :--- | :---: | :---: | :--- |
| **Dashboard** | `/admin` | `db.product.count()`, `db.order.count()` | PARTIAL | Employs artificial `Math.max` fallback benchmarks. |
| **Products** | `/admin/products` | `getAdminProducts()`, `createProductAction()` | COMPLETE | Full CRUD creation with Zod validation. |
| **Inventory** | `/admin/inventory` | `db.product.findMany()`, `updateStockAction()` | COMPLETE | Real-time stock display and adjustment modal. |
| **Orders** | `/admin/orders` | `getAdminOrders()`, `updateOrderStatusAction()` | COMPLETE | Status transition controls (`PAID`, `SHIPPED`, etc.). |
| **Customers** | `/admin/customers` | `db.user.findMany({ role: 'CUSTOMER' })` | COMPLETE | Metrics for lifetime spend and order count. |
| **Community** | `/admin/community`| `db.communitySignup.findMany()` | COMPLETE | Table of signups with marketing consent badges. |
| **Inquiries** | `/admin/inquiries`| `db.contactSubmission.findMany()` | COMPLETE | Message status tracking (`UNREAD`, `READ`, `REPLIED`). |
| **Pages (CMS)**| `/admin/pages` | `db.contentPage.findMany()` | PARTIAL | Table UI functional; 0 CMS pages currently seeded. |
| **Blog** | `/admin/blog` | `db.blogPost.findMany()` | PARTIAL | UI complete; 0 articles currently in database. |
| **Media** | `/admin/media` | `db.mediaAsset.findMany()`, Supabase Storage | COMPLETE | Asset grid and file upload capability. |
| **Roles & Staff**| `/admin/roles`, `/admin/users` | `assignUserRole()`, `getUsersWithRoles()` | COMPLETE | Superadmin-only role elevation controls. |
| **Settings** | `/admin/settings` | `getPaymentSettingsAction()`, `savePaymentSettingsAction()` | COMPLETE | Toggles for live payment gateways stored in `SiteSetting`. |

---

## 17. CMS & CONTENT AUDIT

- **Storage Method**: Storefront copy is largely hardcoded within component TSX files (`app/page.tsx`, `app/about/page.tsx`, `app/ayeyo-koris/page.tsx`, `app/community/page.tsx`).
- **Dynamic Content**: Products are database-driven with static fallbacks.
- **Admin CMS**: `ContentPage` and `BlogPost` tables exist, but no public storefront routes read from `ContentPage` or `BlogPost`. Any content created in the admin CMS does not automatically render on public pages without future template integration.

---

## 18. CONTENT INTEGRITY AUDIT

- **Lorem Ipsum**: None detected in repository.
- **Placeholder Statistics**: In `app/admin/page.tsx:59`, revenue defaults to `1,248.50` with an artificial `+ 1150` addition to real revenue.
- **Broken Footer Links**:
  - `/privacy` -> 404 Not Found.
  - `/terms` -> 404 Not Found.
  - Shipping & Returns -> point to `/shop` instead of dedicated policy documentation.
  - Facebook icon -> links to generic `https://facebook.com`.

---

## 19. CLIENT INPUT AUDIT

### Engineering Requirements
- Resolve ESLint errors in `app/admin/page.tsx`.
- Fix order update query in payment webhook (`where: { id: existingOrder.id }`).
- Fix inventory decrement and error handling in checkout server action.
- Integrate active SMTP / Resend provider in `services/email/index.ts`.
- Connect `next-intl` in `app/layout.tsx`.

### Client Business Requirements
- Provide legal text for Privacy Policy and Terms of Service.
- Provide definitive Shipping and Returns policy copy.
- Provide official social media account handle for Facebook.
- Provide production merchant credentials for SoomarPay / Salaam Somali Bank.

### Third-Party Requirements
- Configure SoomarPay webhook callback URL in the merchant portal pointing to `https://[DOMAIN]/api/webhooks/payment`.
- Obtain `SOOMARPAY_WEBHOOK_SECRET` from gateway support.
- Set up custom SMTP domain in Supabase Auth to prevent authentication email throttling.

---

## 20. INTERNATIONALIZATION & RTL AUDIT

- **Translation Files**:
  - `messages/en.json`: 132 lines, comprehensive English copy.
  - `messages/so.json`: 132 lines, high-quality Somali translations.
  - `messages/ar.json`: 132 lines, Arabic translations.
- **Implementation Status**: **DISCONNECTED**
  - `app/layout.tsx` hardcodes `<html lang="en" dir="ltr">`.
  - No `NextIntlClientProvider` is wrapped around the application.
  - The language selector in `components/layout/Navbar.tsx` triggers `onLocaleChange?.(loc)` where `onLocaleChange` is undefined. Selecting a language produces no change in UI or locale.
  - RTL stylesheet switching is never triggered.

---

## 21. ACCESSIBILITY AUDIT

- **Semantic Markup**: High quality. Landmarks (`<nav>`, `<main>`, `<footer>`), heading hierarchy (`h1` through `h4`), and descriptive ARIA labels on icon buttons.
- **Image Optimization**: ESLint flagged 3 raw `<img>` tags in `CheckoutView.tsx` and `AdminPaymentSettingsView.tsx` lacking Next.js `<Image />` optimization.
- **Form Controls**: Inputs have associated labels or clear `aria-label` attributes.

---

## 22. SEO AUDIT

- **Metadata Architecture**: Dynamic metadata generated in `lib/seo.ts` with OpenGraph and Twitter card definitions.
- **Sitemap & Robots**: `app/sitemap.ts` and `app/robots.ts` correctly serve `/sitemap.xml` and `/robots.txt`.
- **SEO Risk**: Duplicate content indexing between `/product/[slug]` and `/shop/[slug]` without a 301 redirect or canonical URL pointing to `/product/[slug]`.
- **Missing Asset**: No `favicon.ico` exists in `app/` or `public/`.

---

## 23. PERFORMANCE AUDIT

- **Turbopack Build Time**: 63 seconds total compile time for 39 routes.
- **Image Formats**: Extensive use of WebP and SVG alongside PNG.
- **Bundle Optimization**: Tree-shaking is active.
- **Performance Risk**: Missing database indexes on foreign keys (`Order.userId`, `OrderItem.orderId`) will lead to slow query latency as order volume scales.

---

## 24. SECURITY AUDIT

- **Secrets Audit**:
  - `SUPABASE_SERVICE_ROLE_KEY`: Secured server-side. Not exposed in client bundles.
  - `DATABASE_URL`: Password protected, server-only.
  - `SOOMARPAY_API_KEY`: Server-only.
- **Security Headers**: `next.config.mjs` configures `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: origin-when-cross-origin`, `Strict-Transport-Security: max-age=31536000`.
- **Security Gaps**:
  - No `Content-Security-Policy` (CSP) header is defined.
  - Payment webhook lacks signature verification secret (`SOOMARPAY_WEBHOOK_SECRET`).
  - Admin layout allows rendering `<>{children}</>` for unauthenticated users instead of forcing an immediate 403 or redirect.

---

## 25. ENVIRONMENT CONFIGURATION AUDIT

| Variable | .env.example | .env Present | Status | Risk / Action |
| :--- | :---: | :---: | :---: | :--- |
| `DATABASE_URL` | YES | YES | VERIFIED | Transaction pooler active. |
| `DIRECT_URL` | YES | YES | VERIFIED | Session direct connection active. |
| `AUTH_SECRET` | YES | YES | VERIFIED | 37-character secret configured. |
| `NEXT_PUBLIC_SITE_URL` | YES | YES | VERIFIED | Configured for deployment origin. |
| `NEXT_PUBLIC_SUPABASE_URL` | YES | YES | VERIFIED | Points to Supabase project. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | YES | YES | VERIFIED | Public anon key configured. |
| `SUPABASE_SERVICE_ROLE_KEY` | YES | YES | VERIFIED | Server secret configured. |
| `SOOMARPAY_API_KEY` | NO | YES | VERIFIED | Key configured. |
| `SOOMARPAY_BASE_URL` | NO | YES | VERIFIED | Configured to gateway endpoint. |
| `SOOMARPAY_WEBHOOK_SECRET` | NO | **MISSING** | **P0 GAP** | Must be added for webhook security. |
| `EMAIL_SERVER_HOST` | YES | **MISSING** | **P1 GAP** | Must be added for email dispatch. |
| `EMAIL_SERVER_USER` | YES | **MISSING** | **P1 GAP** | Must be added for email dispatch. |
| `EMAIL_FROM` | YES | **MISSING** | **P1 GAP** | Must be added for email dispatch. |

---

## 26. DEPLOYMENT & HOSTING AUDIT

- **Target Platform**: Vercel / Node.js Serverless.
- **Build Command**: `prisma generate && next build` (exited with code 0).
- **Environment Parity**: Node 22 runtime compatible.
- **Blocker**: Deployment will fail on Vercel if CI runs `npm run lint` due to the ESLint failure in `app/admin/page.tsx`.

---

## 27. TESTING AUDIT

### 27.1 Automated Suite Metrics
- **Test Framework**: Jest with `ts-jest` and `@testing-library/react`.
- **Execution Command**: `npm test` (`jest --forceExit`)
- **Result**: **16 of 16 Test Suites Passed**, **123 of 123 Tests Passed** (100% Pass Rate).
- **Execution Time**: 51.328 seconds.

### 27.2 Test Suite Inventory
1. `tests/foundation.test.ts` (10 tests)
2. `tests/components.test.tsx` (11 tests)
3. `tests/nav-auth.test.tsx` (6 tests)
4. `tests/commerce-pipeline.test.ts` (14 tests)
5. `tests/media-storage.test.ts` (8 tests)
6. `tests/auth-actions.test.ts` (9 tests)
7. `tests/public-actions.test.ts` (5 tests)
8. `tests/user-provisioning.test.ts` (7 tests)
9. `tests/admin-guards.test.ts` (9 tests)
10. `tests/soomarpay-provider.test.ts` (9 tests)
11. `tests/auth-server.test.ts` (10 tests)
12. `tests/supabase-env.test.ts` (6 tests)
13. `tests/supabase-clients.test.ts` (5 tests)
14. `tests/account-orders.test.ts` (4 tests)
15. `tests/payment-provider.test.ts` (4 tests)
16. `tests/auth-rbac.test.ts` (6 tests)

---

## 28. MASTER PRODUCTION READINESS MATRIX

| Area | Status | Score | Evidence | Risk | Remaining Work |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **1. Architecture** | PASS | 88/100 | Clean server/client separation, Turbopack builds | Deprecated middleware convention | Migrate middleware to proxy |
| **2. Code Quality** | FAIL | 72/100 | TypeScript clean (0 errors), ESLint failed (code 1) | CI build failure | Fix 2 unescaped entities in admin page |
| **3. Database** | PASS | 82/100 | 12 tables active, 6 products seeded | Missing foreign key indexes | Add indexes on `userId`, `orderId` |
| **4. Migrations** | WARN | 65/100 | SQL migrations in `supabase/`, no Prisma migrations | `db push` drift in production | Formalize declarative migrations |
| **5. Supabase** | PASS | 90/100 | Pooler & direct DB active, service role protected | Connection pool limits | Configure max pool size |
| **6. Authentication**| PASS | 92/100 | Supabase SSR cookies, Google OAuth, provisioning | SMTP email rate limits | Configure custom SMTP in Supabase |
| **7. Authorization** | WARN | 80/100 | Strong server action guards, weak layout redirect | Defense-in-depth gap | Enforce layout redirect in admin |
| **8. RLS** | PASS | 90/100 | 24 active policies across all tables | Server Prisma bypasses RLS | Maintain server action guards |
| **9. Storage** | WARN | 78/100 | 2 buckets exist on Supabase, public bucket live | Private URL 404 | Implement `/api/media/private` |
| **10. Commerce** | WARN | 75/100 | Cart persistence, checkout flow, orders | Unreserved stock decrements | Fix stock decrement error handling |
| **11. Cart** | PASS | 95/100 | Full `CartContext.tsx` with localStorage sync | None | Production ready |
| **12. Checkout** | PASS | 88/100 | Multi-step form, Somali mobile money options | Unhandled failure return | Fix false success return on gateway error |
| **13. Orders** | WARN | 76/100 | Orders table populated, relation cascading | Concurrency overselling | Add database check constraint |
| **14. Payments** | BLOCKED | 55/100 | SoomarPay provider coded, API key configured | Missing webhook secret, order query bug | Fix webhook query, add secret |
| **15. Admin** | PASS | 86/100 | 14 functional subviews, staff management | Benchmark fallback stats | Replace fake fallback stats |
| **16. CMS** | WARN | 50/100 | Admin UI exists, 0 live storefront connections | Content disconnected | Wire CMS tables to storefront templates |
| **17. Content** | WARN | 78/100 | Rich editorial copy, missing legal pages | Legal exposure | Create Privacy & Terms pages |
| **18. i18n & RTL** | FAIL | 30/100 | 3 JSON dictionaries exist, layout hardcodes English | Somali & Arabic inaccessible | Connect `next-intl` in RootLayout |
| **19. Accessibility**| PASS | 82/100 | Semantic landmarks, accessible form labels | 3 unoptimized `<img>` tags | Replace with `<Image />` |
| **20. SEO** | PASS | 85/100 | Sitemap & robots generated, rich metadata | Duplicate route without canonical | Add 301 or canonical on `/shop/[slug]` |
| **21. Performance** | PASS | 88/100 | 63s build, WebP assets, Turbopack | Query latency without indexes | Add database indexes |
| **22. Security** | WARN | 80/100 | Secrets protected, headers active, no CSP | Unsigned webhooks | Add webhook secret, CSP header |
| **23. Email** | BLOCKED | 20/100 | Stub service only, no active transport | Customers receive no emails | Integrate nodemailer or Resend |
| **24. Testing** | PASS | 96/100 | 123 of 123 tests pass | Webhook edge case untested | Add webhook order query test |
| **25. Deployment** | PASS | 85/100 | Build clean, standalone output compatible | ESLint blocks Vercel build | Fix ESLint errors |
| **26. Assets** | WARN | 82/100 | 91 rich editorial photos, missing favicon | Missing favicon 404 | Add `favicon.ico` |

---

## 29. SEVERITY CLASSIFICATION

### P0 — LAUNCH BLOCKERS (Cannot Safely Launch)
1. **Missing Payment Webhook Secret**: `SOOMARPAY_WEBHOOK_SECRET` is absent from `.env`. Payment callbacks cannot be verified, leaving order verification vulnerable or non-functional.
2. **Missing Transactional Email Provider**: No live email dispatcher exists in `services/email/index.ts`. Order confirmations and password resets are not delivered.

### P1 — CRITICAL ISSUES (Major Production Risk)
1. **Payment Webhook Crash on Order Number**: `app/api/webhooks/payment/route.ts:64` updates `where: { id: orderId }` rather than `where: { id: existingOrder.id }`. If the gateway sends `orderNumber`, the query crashes with a 500 error.
2. **False Success in Checkout Action**: `lib/actions/checkout.ts:201` returns `success: true` even when `paymentResult.success === false`.
3. **Premature Stock Decrement Without Restitution**: Inventory is decremented before payment completion. Abandoned checkouts permanently reduce stock.
4. **Linting Failure Halts CI/CD**: ESLint exit code 1 blocks automated deployment pipelines.
5. **Internationalization Disconnected**: Somali and Arabic translations cannot be viewed because `app/layout.tsx` hardcodes English LTR.

### P2 — IMPORTANT ISSUES (Fix Before Public Traffic)
1. **Missing Legal Pages**: Footer links to `/privacy` and `/terms` yield 404 Not Found.
2. **Missing Database Indexes**: `Order.userId`, `OrderItem.orderId`, and `ProductImage.productId` lack indexes.
3. **Admin Layout Defense-in-Depth**: Unauthenticated requests to `/admin/*` render `<>{children}</>` at the layout level.
4. **Duplicate Route Without Canonical**: `/shop/[slug]` re-exports `/product/[slug]` with no canonical SEO tag.
5. **Missing Favicon**: Neither `app/favicon.ico` nor `public/favicon.ico` exists.
6. **Missing Private Storage Route**: `/api/media/private` returns 404 for private media asset requests.

### P3 — MINOR ISSUES (Polish)
1. **Unescaped `<img>` Tags**: 3 raw `<img>` tags in checkout and payment settings view should use Next.js `<Image />`.
2. **Admin Fake Fallback Metrics**: Replace hardcoded `Math.max(6, ...)` benchmark fallbacks in `app/admin/page.tsx` with true zero-state displays.
3. **Generic Social Link**: Update Facebook icon in footer from `https://facebook.com` to brand page.

---

## 30. BLOCKER CLASSIFICATION

### Technical Blockers
- ESLint syntax errors in `app/admin/page.tsx`.
- Checkout server action false-success bug.
- Payment webhook `orderId` vs `existingOrder.id` mismatch bug.
- Transactional email transport implementation.
- Internationalization RootLayout wiring.

### Client / Business Blockers
- Privacy Policy legal documentation.
- Terms & Conditions legal documentation.
- Shipping and Returns policy copy.
- Official brand Facebook page URL.

### Third-Party Blockers
- SoomarPay live merchant webhook secret (`SOOMARPAY_WEBHOOK_SECRET`).
- Production SMTP server credentials or Resend API key.

---

## 31. PRODUCTION READINESS SCORES

| Category | Score |
| :--- | :---: |
| **Architecture** | 88 / 100 |
| **Code Quality** | 72 / 100 |
| **Database** | 82 / 100 |
| **Security** | 80 / 100 |
| **Authentication** | 92 / 100 |
| **Commerce** | 75 / 100 |
| **Admin System** | 86 / 100 |
| **Testing** | 96 / 100 |
| **Performance** | 88 / 100 |
| **SEO** | 85 / 100 |
| **Deployment** | 85 / 100 |
| **OVERALL PRODUCTION READINESS** | **68 / 100** |

---

## 32. COMPLETE REMAINING WORK

### A. Critical Engineering & Payments
1. Fix `app/api/webhooks/payment/route.ts:64` to use `where: { id: existingOrder.id }`.
2. Fix `lib/actions/checkout.ts` to return `{ success: false, error: ... }` when payment initiation fails.
3. Implement inventory restitution or a reservation timeout for unpaid checkout attempts.
4. Add `SOOMARPAY_WEBHOOK_SECRET` to `.env` and verify signature checking in `soomarPayProvider.ts`.

### B. CI/CD & Code Quality
1. Fix unescaped entities in `app/admin/page.tsx:105` to restore passing ESLint (`npm run lint`).
2. Replace raw `<img>` elements in `CheckoutView.tsx` and `AdminPaymentSettingsView.tsx` with Next.js `<Image />`.

### C. Email Integration
1. Install and configure an active email transport (e.g., `resend` or `nodemailer`).
2. Implement live dispatch in `services/email/index.ts` for order confirmations and contact inquiries.

### D. Internationalization & Routing
1. Wire `next-intl` in `app/layout.tsx` using `NextIntlClientProvider` or locale-based routing.
2. Connect navbar language selector to update active locale and toggle `dir="rtl"` for Arabic.
3. Add 301 permanent redirect from `/shop/[slug]` to `/product/[slug]` or inject canonical URL tags.

### E. Legal & Content Completion
1. Create `app/privacy/page.tsx` with compliant Privacy Policy.
2. Create `app/terms/page.tsx` with Terms & Conditions.
3. Create dedicated shipping and returns policy sections.
4. Provide and place `favicon.ico` in `app/favicon.ico`.

### F. Database Optimization
1. Add PostgreSQL indexes for `Order(userId)`, `Order(createdAt)`, `OrderItem(orderId)`, `OrderItem(productId)`, `ProductImage(productId)`, `Payment(orderId)`.
2. Add check constraint `CHECK ("stockQuantity" >= 0)` on `Product`.

---

## 33. FINAL AUDIT VERDICT

# NO-GO

### Verdict Rationale
The platform exhibits extraordinary artistic and architectural execution, strong authentication, comprehensive automated test coverage (123 passing tests), and a working catalog and cart. However, the system cannot be launched in production because:
1. Automated CI/CD will fail on ESLint linting.
2. Payment webhooks contain a verified logic defect that will crash upon order completion.
3. Webhook signatures cannot be validated due to a missing webhook secret.
4. Checkout false-success returns will mislead customers on payment failures.
5. Transactional order confirmation emails are non-functional.
6. Crucial legal compliance pages (Privacy Policy, Terms) are missing (404).

Resolving these specific, well-defined issues will elevate the platform from **68%** to **100% Launch Readiness (GO)**.
