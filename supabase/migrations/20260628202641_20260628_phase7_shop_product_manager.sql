
-- ── Phase 7: Shop Product Manager ────────────────────────────────────────────

-- 1. Add external_url and external_platform to shop_products
ALTER TABLE shop_products
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS external_platform text NOT NULL DEFAULT 'shopify';

-- 2. Fix shop_products INSERT/UPDATE/DELETE policies to require admin membership.
--    The existing policies were open to all authenticated users.
DROP POLICY IF EXISTS shop_products_insert_admin ON shop_products;
DROP POLICY IF EXISTS shop_products_update_admin ON shop_products;
DROP POLICY IF EXISTS shop_products_delete_admin ON shop_products;

CREATE POLICY shop_products_insert_admin ON shop_products
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY shop_products_update_admin ON shop_products
  FOR UPDATE TO authenticated
  USING  (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY shop_products_delete_admin ON shop_products
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- 3. Fix shop_drops INSERT/UPDATE/DELETE policies to require admin membership.
DROP POLICY IF EXISTS shop_drops_insert_admin ON shop_drops;
DROP POLICY IF EXISTS shop_drops_update_admin ON shop_drops;
DROP POLICY IF EXISTS shop_drops_delete_admin ON shop_drops;

CREATE POLICY shop_drops_insert_admin ON shop_drops
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY shop_drops_update_admin ON shop_drops
  FOR UPDATE TO authenticated
  USING  (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY shop_drops_delete_admin ON shop_drops
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- 4. Grant anon SELECT on safe public columns of shop_products.
--    The existing RLS policy allows it, but no table-level grant existed.
GRANT SELECT (
  id, drop_id, name, slug, short_description, product_type, status,
  price_display, image_url, image_alt, image_fit, image_bg,
  featured, sort_order, visible, external_url, external_platform,
  created_at
) ON shop_products TO anon;

-- 5. Grant anon SELECT on safe public columns of shop_drops.
GRANT SELECT (
  id, name, slug, description, status, launch_date,
  featured, sort_order, visible, created_at
) ON shop_drops TO anon;

-- 6. Grant authenticated INSERT and UPDATE on shop_products and shop_drops.
--    Policies existed but no table-level grants — writes were silently failing.
GRANT INSERT ON shop_products TO authenticated;
GRANT UPDATE ON shop_products TO authenticated;
GRANT INSERT ON shop_drops TO authenticated;
GRANT UPDATE ON shop_drops TO authenticated;
