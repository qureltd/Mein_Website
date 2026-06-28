
-- ── Phase 5: Consent Workflow Schema ─────────────────────────────────────────

-- 1. Expand consent_requests.status to include 'sent' and 'withdrawn'
ALTER TABLE consent_requests DROP CONSTRAINT IF EXISTS consent_requests_status_check;
ALTER TABLE consent_requests ADD CONSTRAINT consent_requests_status_check
  CHECK (status = ANY(ARRAY['pending'::text, 'sent'::text, 'approved'::text, 'declined'::text, 'withdrawn'::text]));

-- 2. Add consent_required flag to submissions
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS consent_required boolean NOT NULL DEFAULT false;

-- 3. Grant INSERT and UPDATE on consent_requests to authenticated role
GRANT INSERT ON consent_requests TO authenticated;
GRANT UPDATE ON consent_requests TO authenticated;

-- 4. Grant INSERT on audit_logs to authenticated role (for admin-side audit writes)
GRANT INSERT ON audit_logs TO authenticated;
