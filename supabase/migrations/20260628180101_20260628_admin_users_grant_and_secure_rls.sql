-- Phase: Admin access fix
-- Purpose: Grant explicit SELECT on admin_users to authenticated role, and tighten
--          the SELECT RLS policy so each admin can only read their own row.
--          The previous policy (USING (true)) allowed any authenticated user to
--          read all admin records. This replaces it with an own-row check.
--
-- Does NOT: drop admin_users, remove existing rows, weaken /admin protection,
--           grant anon access, or touch any other table.

-- 1. Grant explicit SELECT to authenticated role.
--    RLS policy alone is not enough — table-level GRANT must also be present.
GRANT SELECT ON admin_users TO authenticated;

-- 2. Remove the old permissive SELECT policy.
DROP POLICY IF EXISTS "select_admin_users" ON admin_users;

-- 3. Add a secure own-row SELECT policy.
--    Authenticated users can only see the admin_users row that matches their
--    own authenticated email (case-insensitive).
CREATE POLICY "select_own_admin_user" ON admin_users
  FOR SELECT
  TO authenticated
  USING (lower(email) = lower(auth.jwt() ->> 'email'));

-- last_login UPDATE is deferred — no UPDATE grant or policy added in this migration.
-- It will be added in a dedicated migration once admin login is confirmed working.
