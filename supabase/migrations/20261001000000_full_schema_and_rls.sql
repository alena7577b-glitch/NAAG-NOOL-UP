-- ==============================================================================
-- NAAG NOOL UP — Full PostgreSQL Database Schema & Row Level Security (RLS)
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/hqtaemeyyhkvcuaxfrvy/sql/new)
-- ==============================================================================

-- 1. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE public."Role" AS ENUM ('CUSTOMER', 'ADMIN', 'SUPERADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public."OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public."PaymentStatus" AS ENUM ('INITIATED', 'VERIFIED', 'FAILED', 'REFUNDED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public."ContactStatus" AS ENUM ('UNREAD', 'READ', 'REPLIED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public."PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. TABLES & CONSTRAINTS

-- Table: "User"
CREATE TABLE IF NOT EXISTS public."User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT,
  "fullName" TEXT,
  "role" public."Role" NOT NULL DEFAULT 'CUSTOMER'::public."Role",
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: "Product"
CREATE TABLE IF NOT EXISTS public."Product" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "price" DECIMAL(10,2) NOT NULL,
  "stockQuantity" INTEGER NOT NULL DEFAULT 0,
  "category" TEXT NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: "ProductImage"
CREATE TABLE IF NOT EXISTS public."ProductImage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "productId" TEXT NOT NULL REFERENCES public."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "url" TEXT NOT NULL,
  "altText" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: "Order"
CREATE TABLE IF NOT EXISTS public."Order" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderNumber" TEXT NOT NULL UNIQUE,
  "userId" TEXT REFERENCES public."User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "totalAmount" DECIMAL(10,2) NOT NULL,
  "status" public."OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT'::public."OrderStatus",
  "shippingAddress" JSONB NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT,
  "customerName" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: "OrderItem"
CREATE TABLE IF NOT EXISTS public."OrderItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL REFERENCES public."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "productId" TEXT NOT NULL REFERENCES public."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "quantity" INTEGER NOT NULL,
  "unitPrice" DECIMAL(10,2) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: "Payment"
CREATE TABLE IF NOT EXISTS public."Payment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL REFERENCES public."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "provider" TEXT NOT NULL,
  "transactionId" TEXT,
  "amount" DECIMAL(10,2) NOT NULL,
  "status" public."PaymentStatus" NOT NULL DEFAULT 'INITIATED'::public."PaymentStatus",
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: "CommunitySignup"
CREATE TABLE IF NOT EXISTS public."CommunitySignup" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "marketingConsent" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: "ContactSubmission"
CREATE TABLE IF NOT EXISTS public."ContactSubmission" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" public."ContactStatus" NOT NULL DEFAULT 'UNREAD'::public."ContactStatus",
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: "ContentPage"
CREATE TABLE IF NOT EXISTS public."ContentPage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "contentJson" JSONB NOT NULL,
  "locale" TEXT NOT NULL DEFAULT 'en',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: "BlogPost"
CREATE TABLE IF NOT EXISTS public."BlogPost" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "featuredImage" TEXT,
  "status" public."PostStatus" NOT NULL DEFAULT 'DRAFT'::public."PostStatus",
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: "MediaAsset"
CREATE TABLE IF NOT EXISTS public."MediaAsset" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "filename" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: "SiteSetting"
CREATE TABLE IF NOT EXISTS public."SiteSetting" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "key" TEXT NOT NULL UNIQUE,
  "value" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. HELPER FUNCTIONS FOR ROLE CHECKING IN POSTGRESQL
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()::text
    AND role IN ('ADMIN', 'SUPERADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()::text
    AND role = 'SUPERADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ROW LEVEL SECURITY (RLS) POLICIES

-- "User"
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile or admin can view all" ON public."User";
CREATE POLICY "Users can view own profile or admin can view all"
ON public."User" FOR SELECT
USING (id = auth.uid()::text OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own non-role fields" ON public."User";
CREATE POLICY "Users can update own non-role fields"
ON public."User" FOR UPDATE
USING (id = auth.uid()::text OR public.is_admin())
WITH CHECK (
  (id = auth.uid()::text AND role = (SELECT role FROM public."User" WHERE id = auth.uid()::text))
  OR public.is_superadmin()
);

-- "Product"
ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view available products" ON public."Product";
CREATE POLICY "Public can view available products"
ON public."Product" FOR SELECT
USING ("isAvailable" = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage products" ON public."Product";
CREATE POLICY "Admins can manage products"
ON public."Product" FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- "ProductImage"
ALTER TABLE public."ProductImage" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view product images" ON public."ProductImage";
CREATE POLICY "Public can view product images"
ON public."ProductImage" FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage product images" ON public."ProductImage";
CREATE POLICY "Admins can manage product images"
ON public."ProductImage" FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- "Order"
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view own orders" ON public."Order";
CREATE POLICY "Customers can view own orders"
ON public."Order" FOR SELECT
USING ("userId" = auth.uid()::text OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage orders" ON public."Order";
CREATE POLICY "Admins can manage orders"
ON public."Order" FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- "OrderItem"
ALTER TABLE public."OrderItem" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view items of own orders" ON public."OrderItem";
CREATE POLICY "Customers can view items of own orders"
ON public."OrderItem" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public."Order" o
    WHERE o.id = "OrderItem"."orderId"
    AND (o."userId" = auth.uid()::text OR public.is_admin())
  )
);

DROP POLICY IF EXISTS "Admins can manage order items" ON public."OrderItem";
CREATE POLICY "Admins can manage order items"
ON public."OrderItem" FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- "Payment"
ALTER TABLE public."Payment" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view payment records" ON public."Payment";
CREATE POLICY "Admins can view payment records"
ON public."Payment" FOR SELECT
USING (public.is_admin());

-- "CommunitySignup"
ALTER TABLE public."CommunitySignup" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit community signup" ON public."CommunitySignup";
CREATE POLICY "Public can submit community signup"
ON public."CommunitySignup" FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view community signups" ON public."CommunitySignup";
CREATE POLICY "Admins can view community signups"
ON public."CommunitySignup" FOR SELECT
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete community signups" ON public."CommunitySignup";
CREATE POLICY "Admins can delete community signups"
ON public."CommunitySignup" FOR DELETE
USING (public.is_admin());

-- "ContactSubmission"
ALTER TABLE public."ContactSubmission" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit contact inquiries" ON public."ContactSubmission";
CREATE POLICY "Public can submit contact inquiries"
ON public."ContactSubmission" FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage contact inquiries" ON public."ContactSubmission";
CREATE POLICY "Admins can manage contact inquiries"
ON public."ContactSubmission" FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- "ContentPage"
ALTER TABLE public."ContentPage" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read content pages" ON public."ContentPage";
CREATE POLICY "Public can read content pages"
ON public."ContentPage" FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage content pages" ON public."ContentPage";
CREATE POLICY "Admins can manage content pages"
ON public."ContentPage" FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- "BlogPost"
ALTER TABLE public."BlogPost" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published blog posts" ON public."BlogPost";
CREATE POLICY "Public can read published blog posts"
ON public."BlogPost" FOR SELECT
USING (status = 'PUBLISHED' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage blog posts" ON public."BlogPost";
CREATE POLICY "Admins can manage blog posts"
ON public."BlogPost" FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- "MediaAsset"
ALTER TABLE public."MediaAsset" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read media assets" ON public."MediaAsset";
CREATE POLICY "Public can read media assets"
ON public."MediaAsset" FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage media assets" ON public."MediaAsset";
CREATE POLICY "Admins can manage media assets"
ON public."MediaAsset" FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- "SiteSetting"
ALTER TABLE public."SiteSetting" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site settings" ON public."SiteSetting";
CREATE POLICY "Public can read site settings"
ON public."SiteSetting" FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON public."SiteSetting";
CREATE POLICY "Admins can manage site settings"
ON public."SiteSetting" FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('naag-nool-public-media', 'naag-nool-public-media', true),
  ('naag-nool-private-docs', 'naag-nool-private-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Public bucket read policy
DROP POLICY IF EXISTS "Public Access to Media" ON storage.objects;
CREATE POLICY "Public Access to Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'naag-nool-public-media');
