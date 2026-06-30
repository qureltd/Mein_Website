-- Allow edge functions (service_role) to read admin_users for role verification.
-- Without this, maybeSingle() returns null and all admin JWT checks return 403.
GRANT SELECT ON public.admin_users TO service_role;
