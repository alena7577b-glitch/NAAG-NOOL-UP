-- ==============================================================================
-- NAAG NOOL UP — Supabase PostgreSQL Row Level Security (RLS) Policies
-- ==============================================================================
-- These policies provide defense-in-depth security at the PostgreSQL database engine level.
-- When queries are executed directly via the Supabase client (REST/PostgREST/Realtime),
-- access is strictly governed by auth.uid() and database roles.
-- ==============================================================================

-- 1. Helper Functions for Role Checking in PostgreSQL
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

-- ------------------------------------------------------------------------------
-- Table: "User"
-- ------------------------------------------------------------------------------
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile or admin can view all" ON public."User";
CREATE POLICY "Users can view own profile or admin can view all"
ON public."User" FOR SELECT
USING (
  id = auth.uid()::text OR public.is_admin()
);

DROP POLICY IF EXISTS "Users can update own non-role fields" ON public."User";
CREATE POLICY "Users can update own non-role fields"
ON public."User" FOR UPDATE
USING (
  id = auth.uid()::text OR public.is_admin()
)
WITH CHECK (
  (id = auth.uid()::text AND role = (SELECT role FROM public."User" WHERE id = auth.uid()::text))
  OR public.is_superadmin()
);

-- ------------------------------------------------------------------------------
-- Table: "Product"
-- ------------------------------------------------------------------------------
ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view available products" ON public."Product";
CREATE POLICY "Public can view available products"
ON public."Product" FOR SELECT
USING (
  "isAvailable" = true OR public.is_admin()
);

DROP POLICY IF EXISTS "Admins can manage products" ON public."Product";
CREATE POLICY "Admins can manage products"
ON public."Product" FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- Table: "ProductImage"
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Table: "Order"
-- ------------------------------------------------------------------------------
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view own orders" ON public."Order";
CREATE POLICY "Customers can view own orders"
ON public."Order" FOR SELECT
USING (
  "userId" = auth.uid()::text OR public.is_admin()
);

DROP POLICY IF EXISTS "Admins can manage orders" ON public."Order";
CREATE POLICY "Admins can manage orders"
ON public."Order" FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- Table: "OrderItem"
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Table: "Payment"
-- ------------------------------------------------------------------------------
ALTER TABLE public."Payment" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view payment records" ON public."Payment";
CREATE POLICY "Admins can view payment records"
ON public."Payment" FOR SELECT
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Table: "CommunitySignup"
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Table: "ContactSubmission"
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Table: "ContentPage"
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Table: "BlogPost"
-- ------------------------------------------------------------------------------
ALTER TABLE public."BlogPost" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published blog posts" ON public."BlogPost";
CREATE POLICY "Public can read published blog posts"
ON public."BlogPost" FOR SELECT
USING (
  status = 'PUBLISHED' OR public.is_admin()
);

DROP POLICY IF EXISTS "Admins can manage blog posts" ON public."BlogPost";
CREATE POLICY "Admins can manage blog posts"
ON public."BlogPost" FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- Table: "MediaAsset"
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Table: "SiteSetting"
-- ------------------------------------------------------------------------------
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
