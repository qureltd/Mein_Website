-- Grant service_role the permissions needed for Edge Function email logging.
-- Edge Functions use the service_role key which bypasses RLS but still requires
-- explicit table grants via PostgREST. email_events was missing INSERT entirely.

GRANT INSERT ON public.email_events TO service_role;
GRANT UPDATE ON public.email_events TO service_role;
GRANT SELECT ON public.email_events TO service_role;
