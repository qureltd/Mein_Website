-- Phase 4: grant SELECT/UPDATE on admin-read tables to authenticated role
-- These are required for the admin shell to read data.
-- RLS policies still restrict access to admin_users only (enforced by existing policies).

GRANT SELECT ON submissions        TO authenticated;
GRANT SELECT ON stories            TO authenticated;
GRANT SELECT ON consent_requests   TO authenticated;
GRANT SELECT ON join_interests     TO authenticated;
GRANT SELECT ON contact_messages   TO authenticated;
GRANT SELECT ON shop_products      TO authenticated;
GRANT SELECT ON shop_drops         TO authenticated;
GRANT SELECT ON email_events       TO authenticated;
GRANT SELECT ON media_assets       TO authenticated;
GRANT SELECT ON audit_logs         TO authenticated;
GRANT SELECT ON admin_users        TO authenticated;

-- Allow admin status updates on contact_messages and join_interests
GRANT UPDATE (status, admin_notes, updated_at) ON contact_messages TO authenticated;
GRANT UPDATE (status, admin_notes, updated_at) ON join_interests    TO authenticated;

-- Allow admin to update submission status (existing workflow from AdminDashboard)
GRANT UPDATE (status, admin_notes, rejection_reason, reviewed_at, published_at, updated_at) ON submissions TO authenticated;

-- Allow admin to insert stories (existing publishAsStory workflow)
GRANT INSERT ON stories TO authenticated;
