-- Phase 8: Contact Messages + Join Interests admin operations
-- Adds missing operational fields and hardens RLS policies.

-- ─── contact_messages: new operational columns ──────────────────────────────

ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS follow_up_required boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS follow_up_date timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz;

-- Extend status CHECK constraint to include 'waiting'
-- (drop old constraint if exists, add updated one)
ALTER TABLE contact_messages DROP CONSTRAINT IF EXISTS contact_messages_status_check;
ALTER TABLE contact_messages
  ADD CONSTRAINT contact_messages_status_check
  CHECK (status IN ('new', 'read', 'in_progress', 'waiting', 'resolved', 'archived'));

ALTER TABLE contact_messages DROP CONSTRAINT IF EXISTS contact_messages_priority_check;
ALTER TABLE contact_messages
  ADD CONSTRAINT contact_messages_priority_check
  CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- ─── join_interests: new operational columns ────────────────────────────────

ALTER TABLE join_interests
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS follow_up_required boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS follow_up_date timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

-- Extend status CHECK constraint to include 'invited' and 'active'
ALTER TABLE join_interests DROP CONSTRAINT IF EXISTS join_interests_status_check;
ALTER TABLE join_interests
  ADD CONSTRAINT join_interests_status_check
  CHECK (status IN ('new', 'reviewed', 'contacted', 'invited', 'active', 'followed_up', 'archived'));

ALTER TABLE join_interests DROP CONSTRAINT IF EXISTS join_interests_priority_check;
ALTER TABLE join_interests
  ADD CONSTRAINT join_interests_priority_check
  CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- ─── RLS: harden contact_messages ───────────────────────────────────────────
-- All SELECT/UPDATE/DELETE policies used qual: true for authenticated,
-- allowing any of 33 auth users to read/mutate private contact data.

DROP POLICY IF EXISTS contact_messages_select_admin ON contact_messages;
CREATE POLICY contact_messages_select_admin ON contact_messages
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS contact_messages_update_admin ON contact_messages;
CREATE POLICY contact_messages_update_admin ON contact_messages
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS contact_messages_delete_admin ON contact_messages;
CREATE POLICY contact_messages_delete_admin ON contact_messages
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ─── RLS: harden join_interests ─────────────────────────────────────────────

DROP POLICY IF EXISTS join_interests_select_admin ON join_interests;
CREATE POLICY join_interests_select_admin ON join_interests
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS join_interests_update_admin ON join_interests;
CREATE POLICY join_interests_update_admin ON join_interests
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

DROP POLICY IF EXISTS join_interests_delete_admin ON join_interests;
CREATE POLICY join_interests_delete_admin ON join_interests
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
