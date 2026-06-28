
-- ── Phase 6: Wall Publishing Workflow ────────────────────────────────────────

-- 1. Fix anon stories RLS — add unpublished_at IS NULL so unpublished stories
--    are not visible to the public even after being unpublished.
DROP POLICY IF EXISTS select_stories_public_published ON stories;
CREATE POLICY select_stories_public_published ON stories
  FOR SELECT TO anon
  USING (published_at IS NOT NULL AND unpublished_at IS NULL);

-- 2. Grant SELECT on stories to anon explicitly (safety net)
GRANT SELECT ON stories TO anon;

-- 3. Grant UPDATE on stories to authenticated (was missing — UPDATE RLS policy
--    existed but table-level GRANT was not present, causing silent failures)
GRANT UPDATE (title, excerpt, author_display_name, category, featured, sort_order,
              media_url, admin_notes, unpublished_at, updated_at) ON stories TO authenticated;

-- 4. Grant public_display_name UPDATE on submissions to authenticated
--    (required for admin client to set public name without edge function)
GRANT UPDATE (public_display_name) ON submissions TO authenticated;

-- 5. Remove DELETE permission from authenticated on stories — prefer unpublish
DROP POLICY IF EXISTS delete_stories ON stories;
REVOKE DELETE ON stories FROM authenticated;
