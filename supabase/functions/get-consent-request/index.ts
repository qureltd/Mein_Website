import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function errorResponse(message: string, status = 400): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function successResponse(body: Record<string, unknown>): Response {
  return new Response(JSON.stringify({ success: true, ...body }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  const masked = local.slice(0, 2) + "***";
  return domain ? `${masked}@${domain}` : masked;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed.", 405);
  }

  let token: string | undefined;
  try {
    const body = await req.json();
    token = body?.token;
  } catch {
    return errorResponse("Invalid JSON body.");
  }

  if (!token || typeof token !== "string" || token.length < 16) {
    return errorResponse("A valid token is required.");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return errorResponse("Server configuration error.", 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: cr, error } = await supabase
    .from("consent_requests")
    .select("id, status, consent_type, consent_scope, consent_text_version, created_at, responded_at, guardian_email, submission_id")
    .eq("consent_token", token)
    .maybeSingle();

  if (error || !cr) {
    return errorResponse("Consent request not found. This link may be invalid or expired.", 404);
  }

  const { data: sub } = await supabase
    .from("submissions")
    .select("name, display_name, type, title")
    .eq("id", cr.submission_id)
    .maybeSingle();

  return successResponse({
    consent_request_id: cr.id,
    status: cr.status,
    consent_type: cr.consent_type,
    consent_scope: cr.consent_scope,
    consent_text_version: cr.consent_text_version,
    created_at: cr.created_at,
    responded_at: cr.responded_at,
    guardian_email_hint: maskEmail(cr.guardian_email),
    submission: sub
      ? {
          name: sub.display_name || sub.name,
          type: sub.type,
          title: sub.title,
        }
      : null,
  });
});
