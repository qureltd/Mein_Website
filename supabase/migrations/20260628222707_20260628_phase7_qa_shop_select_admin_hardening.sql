-- Phase 7 QA: Restrict shop admin SELECT policies to admin_users only
-- Previously: qual: true for authenticated (any of 33 auth users could read hidden products)
-- Fixed: require EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())

-- shop_products
DROP POLICY IF EXISTS shop_products_select_admin ON shop_products;
CREATE POLICY shop_products_select_admin ON shop_products
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- shop_drops
DROP POLICY IF EXISTS shop_drops_select_admin ON shop_drops;
CREATE POLICY shop_drops_select_admin ON shop_drops
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
