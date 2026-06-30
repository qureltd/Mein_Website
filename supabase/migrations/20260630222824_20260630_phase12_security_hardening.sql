-- ─────────────────────────────────────────────────────────────────────────────
-- Phase 12: Security Hardening
-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Fix mutable search_path on update_updated_at trigger function.
-- 2. Remove always-true public INSERT policies — all form submissions are
--    routed through service_role Edge Functions that bypass RLS entirely.
-- 3. Remove public SELECT storage policies on unused template buckets
--    (chat-attachments, bug-report-attachments) that ship with Bolt but are
--    not referenced anywhere in this codebase.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Fix function search_path ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ── 2. Remove always-true public INSERT policies ──────────────────────────────
-- consent_requests  (created by publish-story edge function via service_role)
DROP POLICY IF EXISTS "insert_consent_requests" ON public.consent_requests;

-- contact_messages  (created by submit-contact edge function via service_role)
DROP POLICY IF EXISTS "contact_messages_insert_anon" ON public.contact_messages;

-- email_events      (created by send-email edge function via service_role)
DROP POLICY IF EXISTS "email_events_insert_admin" ON public.email_events;

-- join_interests    (created by submit-join + submit-shop-early-access via service_role)
DROP POLICY IF EXISTS "join_interests_insert_anon" ON public.join_interests;

-- submissions       (created by submit-submission edge function via service_role)
DROP POLICY IF EXISTS "insert_submissions" ON public.submissions;

-- ── 3. Remove broad public SELECT policies on unused template buckets ─────────
-- These buckets (chat-attachments, bug-report-attachments) are Bolt template
-- artifacts. They are not referenced anywhere in the application codebase.
-- Their public SELECT policies allow anyone to list/download bucket contents.
DROP POLICY IF EXISTS "Public access for downloads"    ON storage.objects;
DROP POLICY IF EXISTS "Public bug report downloads"    ON storage.objects;
