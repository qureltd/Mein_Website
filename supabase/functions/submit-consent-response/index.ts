import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed.", 405);
  }

  let token: string | undefined;
  let decision: string | undefined;
  let signed_name: string | undefined;

  try {
    const body = await req.json();
    token = body?.token;
    decision = body?.decision;
    signed_name = body?.signed_name;
  } catch {
    return errorResponse("Invalid JSON body.");
  }

  if (!token || typeof token !== "string" || token.length < 16) {
    return errorResponse("A valid token is required.");
  }

  if (decision !== "approved" && decision !== "declined") {
    return errorResponse("decision must be 'approved' or 'declined'.");
  }

  // signed_name is required for BOTH approve and decline — formal record of who made the decision
  if (!signed_name || !signed_name.trim()) {
    return errorResponse("signed_name is required. Please enter your full name to confirm your decision.");
  }

  if (signed_name.trim().length > 255) {
    return errorResponse("signed_name must be 255 characters or fewer.");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return errorResponse("Server configuration error.", 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: cr } = await supabase
    .from("consent_requests")
    .select("id, status, submission_id, guardian_email")
    .eq("consent_token", token)
    .maybeSingle();

  if (!cr) {
    return errorResponse("Consent request not found. This link may be invalid.", 404);
  }

  if (cr.status === "approved" || cr.status === "declined") {
    return errorResponse("This consent request has already been responded to. Please contact the Mein team if you need to change your response.");
  }

  if (cr.status !== "sent") {
    return errorResponse("This consent request is not yet active. Please contact the Mein team.");
  }

  const respondedIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  const { error: updateError } = await supabase
    .from("consent_requests")
    .update({
      status: decision,
      responded_at: new Date().toISOString(),
      signed_name: signed_name.trim(),
      responded_ip: respondedIp,
    })
    .eq("id", cr.id);

  if (updateError) {
    console.error("consent_request update failed:", updateError.message);
    return errorResponse("Failed to record your response. Please try again.", 500);
  }

  // Update submission status when consent is approved
  if (decision === "approved") {
    const { error: subUpdateError } = await supabase
      .from("submissions")
      .update({ status: "consent_received", updated_at: new Date().toISOString() })
      .eq("id", cr.submission_id);

    if (subUpdateError) {
      console.error("submission status update failed:", subUpdateError.message);
      // Non-fatal: consent is recorded, admin will see it in consent panel
    }
  }

  // Audit log
  await supabase.from("audit_logs").insert({
    admin_id: null,
    action: decision === "approved" ? "consent_approved" : "consent_declined",
    entity_type: "consent_requests",
    entity_id: cr.id,
    previous_status: "sent",
    new_status: decision,
    notes:
      decision === "approved"
        ? `Guardian approved. Signed as: ${signed_name.trim()}`
        : `Guardian declined. Signed as: ${signed_name.trim()}`,
  });

  return successResponse({
    decision,
    message:
      decision === "approved"
        ? "Thank you. Consent has been recorded."
        : "Your response has been recorded.",
  });
});
