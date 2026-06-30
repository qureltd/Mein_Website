-- ─────────────────────────────────────────────────────────────────────────────
-- Phase 13: Fix admin RLS policies — admin_users.id ≠ auth.uid()
-- ─────────────────────────────────────────────────────────────────────────────
-- Root cause: admin_users.id is an independent UUID (not linked to auth.users).
-- Every policy using `admin_users.id = auth.uid()` always evaluates to false,
-- blocking all admin reads/writes via the Supabase JS client.
--
-- Fix: replace the broken subquery with the email-based check that matches
-- the one working policy (select_own_admin_user), i.e.:
--   lower(admin_users.email) = lower(auth.jwt() ->> 'email')
-- ─────────────────────────────────────────────────────────────────────────────

-- Helper: reusable inline expression
-- EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email'))

-- ── audit_logs ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "audit_logs_select_admin" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert_admin" ON public.audit_logs;

CREATE POLICY "audit_logs_select_admin" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "audit_logs_insert_admin" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

-- ── consent_requests ─────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "consent_requests_select_admin" ON public.consent_requests;
DROP POLICY IF EXISTS "consent_requests_update_admin" ON public.consent_requests;

CREATE POLICY "consent_requests_select_admin" ON public.consent_requests
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "consent_requests_update_admin" ON public.consent_requests
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

-- ── contact_messages ─────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "contact_messages_select_admin" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_update_admin" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_delete_admin" ON public.contact_messages;

CREATE POLICY "contact_messages_select_admin" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "contact_messages_update_admin" ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "contact_messages_delete_admin" ON public.contact_messages
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

-- ── email_events ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "email_events_select_admin" ON public.email_events;
DROP POLICY IF EXISTS "email_events_update_admin" ON public.email_events;

CREATE POLICY "email_events_select_admin" ON public.email_events
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "email_events_update_admin" ON public.email_events
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

-- ── join_interests ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "join_interests_select_admin" ON public.join_interests;
DROP POLICY IF EXISTS "join_interests_update_admin" ON public.join_interests;
DROP POLICY IF EXISTS "join_interests_delete_admin" ON public.join_interests;

CREATE POLICY "join_interests_select_admin" ON public.join_interests
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "join_interests_update_admin" ON public.join_interests
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "join_interests_delete_admin" ON public.join_interests
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

-- ── media_assets ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "media_assets_select_admin" ON public.media_assets;
DROP POLICY IF EXISTS "media_assets_insert_admin" ON public.media_assets;
DROP POLICY IF EXISTS "media_assets_update_admin" ON public.media_assets;
DROP POLICY IF EXISTS "media_assets_delete_admin" ON public.media_assets;

CREATE POLICY "media_assets_select_admin" ON public.media_assets
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "media_assets_insert_admin" ON public.media_assets
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "media_assets_update_admin" ON public.media_assets
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "media_assets_delete_admin" ON public.media_assets
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

-- ── shop_drops ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "shop_drops_select_admin" ON public.shop_drops;
DROP POLICY IF EXISTS "shop_drops_insert_admin" ON public.shop_drops;
DROP POLICY IF EXISTS "shop_drops_update_admin" ON public.shop_drops;
DROP POLICY IF EXISTS "shop_drops_delete_admin" ON public.shop_drops;

CREATE POLICY "shop_drops_select_admin" ON public.shop_drops
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "shop_drops_insert_admin" ON public.shop_drops
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "shop_drops_update_admin" ON public.shop_drops
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "shop_drops_delete_admin" ON public.shop_drops
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

-- ── shop_products ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "shop_products_select_admin" ON public.shop_products;
DROP POLICY IF EXISTS "shop_products_insert_admin" ON public.shop_products;
DROP POLICY IF EXISTS "shop_products_update_admin" ON public.shop_products;
DROP POLICY IF EXISTS "shop_products_delete_admin" ON public.shop_products;

CREATE POLICY "shop_products_select_admin" ON public.shop_products
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "shop_products_insert_admin" ON public.shop_products
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "shop_products_update_admin" ON public.shop_products
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "shop_products_delete_admin" ON public.shop_products
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

-- ── stories ───────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "stories_select_admin" ON public.stories;
DROP POLICY IF EXISTS "insert_stories" ON public.stories;
DROP POLICY IF EXISTS "update_stories" ON public.stories;

CREATE POLICY "stories_select_admin" ON public.stories
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "insert_stories" ON public.stories
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "update_stories" ON public.stories
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

-- ── submissions ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "select_submissions_admin" ON public.submissions;
DROP POLICY IF EXISTS "update_submissions_admin" ON public.submissions;
DROP POLICY IF EXISTS "delete_submissions_admin" ON public.submissions;

CREATE POLICY "select_submissions_admin" ON public.submissions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "update_submissions_admin" ON public.submissions
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));

CREATE POLICY "delete_submissions_admin" ON public.submissions
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE lower(admin_users.email) = lower(auth.jwt() ->> 'email')));
