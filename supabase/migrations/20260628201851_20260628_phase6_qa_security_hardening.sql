
-- ── Phase 6 QA: Security Hardening ───────────────────────────────────────────

-- 1. Drop orphaned admin_users INSERT policy.
--    No GRANT INSERT on admin_users exists for authenticated, so this policy
--    never fired. But it is a latent escalation risk — if INSERT were ever
--    accidentally granted, any authenticated user could self-escalate to admin.
DROP POLICY IF EXISTS insert_admin_users ON admin_users;


-- 2. Restrict stories INSERT to verified admin_users members only.
--    Previously: with_check: true (any authenticated user could insert a story
--    directly, bypassing the publish-story edge function and all eligibility
--    checks). The service role used by the edge function is unaffected.
DROP POLICY IF EXISTS insert_stories ON stories;
CREATE POLICY insert_stories ON stories
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );


-- 3. Restrict stories UPDATE to verified admin_users members only.
--    Phase 6 added the UPDATE column grant, making the previous open policy
--    (qual: true, with_check: true) exploitable by any authenticated user.
--    Now only admin_users members can UPDATE stories.
--    The toggleFeatured call in AdminWallPage uses the anon key + admin JWT,
--    so legitimate admin actions remain functional.
DROP POLICY IF EXISTS update_stories ON stories;
CREATE POLICY update_stories ON stories
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );


-- 4. Revoke whole-table anon SELECT on stories; re-grant only safe public
--    columns. This removes anon access to admin_notes, sort_order, created_at,
--    updated_at while keeping the RLS filter (unpublished_at IS NULL) and all
--    columns the public pages actually need.
REVOKE SELECT ON stories FROM anon;
GRANT SELECT (
  id,
  title,
  excerpt,
  category,
  author_display_name,
  featured,
  published_at,
  media_url,
  submission_id,
  unpublished_at
) ON stories TO anon;
