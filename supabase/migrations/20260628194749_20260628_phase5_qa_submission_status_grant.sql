
-- ── Phase 5 QA: Status expansion + grant fix ─────────────────────────────────

-- 1. Expand submissions.status to include consent workflow statuses
ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_status_check;
ALTER TABLE submissions ADD CONSTRAINT submissions_status_check
  CHECK (status = ANY(ARRAY[
    'received'::text,
    'under_review'::text,
    'needs_consent'::text,
    'consent_sent'::text,
    'consent_received'::text,
    'approved'::text,
    'not_approved'::text,
    'published'::text,
    'archived'::text
  ]));

-- 2. Add consent_required to the column-level UPDATE grant on submissions
--    (was missing — the column existed but authenticated could not write to it)
GRANT UPDATE (consent_required) ON submissions TO authenticated;
