-- Grant service_role the INSERT/SELECT/UPDATE it needs to operate all Edge Functions.
--
-- All Edge Functions create a Supabase client with the service_role key. The
-- service_role PostgreSQL role bypasses RLS but still requires explicit table-level
-- grants via PostgREST. These grants were absent, causing "Failed to save" errors
-- on every public form submit before the function ever reached the email step.
--
-- Grants are scoped to actual operations per function:
--   submissions:      INSERT (submit-submission)
--                     SELECT (all reads + WHERE clause support for UPDATE)
--                     UPDATE (publish-story, submit-consent-response, unpublish-story)
--   contact_messages: INSERT, SELECT (submit-contact only — no UPDATE used)
--   join_interests:   INSERT, SELECT (no edge function currently UPDATEs this table)
--
-- No changes to anon, authenticated, or public grants.

GRANT INSERT, SELECT, UPDATE ON public.submissions      TO service_role;
GRANT INSERT, SELECT          ON public.contact_messages TO service_role;
GRANT INSERT, SELECT          ON public.join_interests   TO service_role;
