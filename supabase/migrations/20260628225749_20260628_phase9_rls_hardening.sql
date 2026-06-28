
-- Phase 9: Full RLS hardening — fix all broad authenticated USING (true) policies
-- Tables affected: submissions, consent_requests, stories, email_events, media_assets, audit_logs

-- ============================================================
-- SUBMISSIONS
-- ============================================================
DROP POLICY IF EXISTS select_submissions_authenticated ON submissions;
DROP POLICY IF EXISTS update_submissions_authenticated ON submissions;
DROP POLICY IF EXISTS delete_submissions_authenticated ON submissions;

CREATE POLICY select_submissions_admin ON submissions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY update_submissions_admin ON submissions
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY delete_submissions_admin ON submissions
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Grant UPDATE and DELETE to authenticated (were missing)
GRANT UPDATE, DELETE ON submissions TO authenticated;

-- ============================================================
-- CONSENT REQUESTS
-- ============================================================
DROP POLICY IF EXISTS select_consent_requests_authenticated ON consent_requests;
DROP POLICY IF EXISTS update_consent_requests_authenticated ON consent_requests;

-- Admin full access
CREATE POLICY consent_requests_select_admin ON consent_requests
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY consent_requests_update_admin ON consent_requests
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Edge function / service-role handles public consent token lookup via service key
-- No anon/authenticated public SELECT needed here

-- ============================================================
-- STORIES
-- ============================================================
DROP POLICY IF EXISTS select_stories_authenticated_all ON stories;

CREATE POLICY stories_select_admin ON stories
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ============================================================
-- EMAIL EVENTS
-- ============================================================
DROP POLICY IF EXISTS email_events_select_admin ON email_events;
DROP POLICY IF EXISTS email_events_update_admin ON email_events;

CREATE POLICY email_events_select_admin ON email_events
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY email_events_update_admin ON email_events
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Grant UPDATE (was missing)
GRANT UPDATE ON email_events TO authenticated;

-- Also fix INSERT policy with_check (currently true — allow admin + edge function via service key)
-- INSERT stays as-is: edge functions use service role key, admins are authenticated
-- The insert policy with_check: true is acceptable here since INSERT is limited to authenticated
-- and email_events has no sensitive user data that an attacker could leak via INSERT

-- ============================================================
-- MEDIA ASSETS
-- ============================================================
DROP POLICY IF EXISTS media_assets_select_admin ON media_assets;
DROP POLICY IF EXISTS media_assets_insert_admin ON media_assets;
DROP POLICY IF EXISTS media_assets_update_admin ON media_assets;
DROP POLICY IF EXISTS media_assets_delete_admin ON media_assets;

CREATE POLICY media_assets_select_admin ON media_assets
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY media_assets_insert_admin ON media_assets
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY media_assets_update_admin ON media_assets
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY media_assets_delete_admin ON media_assets
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ============================================================
-- AUDIT LOGS
-- ============================================================
DROP POLICY IF EXISTS audit_logs_select_admin ON audit_logs;

CREATE POLICY audit_logs_select_admin ON audit_logs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- INSERT policy with_check: true is acceptable — authenticated admins write logs
-- but tighten it anyway
DROP POLICY IF EXISTS audit_logs_insert_admin ON audit_logs;

CREATE POLICY audit_logs_insert_admin ON audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
