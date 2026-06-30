-- Phase 10: Drop launch notification schema
-- 1. Extend join_interests.path CHECK to include shop_early_access
-- 2. Add launch email tracking columns to shop_drops
-- 3. Grant service_role access to new shop_drops columns

-- ─── join_interests: extend path constraint ──────────────────────────────────
ALTER TABLE public.join_interests
  DROP CONSTRAINT IF EXISTS join_interests_path_check;
ALTER TABLE public.join_interests
  ADD CONSTRAINT join_interests_path_check
    CHECK (path IN (
      'young_person', 'parent_guardian', 'creator',
      'school_partner', 'supporter', 'partner', 'shop_early_access'
    ));

-- ─── shop_drops: launch email tracking ──────────────────────────────────────
ALTER TABLE public.shop_drops
  ADD COLUMN IF NOT EXISTS launch_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS launch_email_sent_by UUID REFERENCES admin_users(id);

-- ─── Grants ──────────────────────────────────────────────────────────────────
GRANT SELECT, UPDATE ON public.shop_drops TO service_role;
