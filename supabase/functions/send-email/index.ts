import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ── CORS ─────────────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// ── Template alias map ────────────────────────────────────────────────────────
// Maps email_type values (stored in email_events) to Postmark template aliases.
// Templates must be created in the Postmark dashboard before they can be used.
const TEMPLATE_ALIASES: Record<string, string> = {
  consent_request:             "mein-consent-request",
  consent_confirmation:        "mein-consent-confirmation",
  consent_declined:            "mein-consent-declined",
  submission_received:         "mein-submission-received",
  submission_approved:         "mein-submission-approved",
  submission_published:        "mein-submission-published",
  contact_confirmation:        "mein-contact-confirmation",
  admin_new_contact:           "mein-admin-new-contact",
  admin_new_submission:        "mein-admin-new-submission",
  join_confirmation:           "mein-join-confirmation",
  drop_signup_confirmation:    "mein-drop-signup-confirmation",
  drop_launch_notification:    "mein-drop-launch-notification",
};

// ── Valid email types (must match email_events CHECK constraint) ──────────────
const VALID_EMAIL_TYPES = new Set(Object.keys(TEMPLATE_ALIASES));

// ── Payload shape ─────────────────────────────────────────────────────────────
interface SendEmailPayload {
  email_type: string;
  recipient_email: string;
  recipient_name?: string;
  template_alias?: string;       // overrides the map if provided
  template_data?: Record<string, unknown>;
  related_table?: string;
  related_id?: string;
  dry_run?: boolean;
}

// ── Simple email format check ─────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Safe error response — never leaks internals ───────────────────────────────
function errorResponse(message: string, status = 400): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ── Success response ──────────────────────────────────────────────────────────
function successResponse(body: Record<string, unknown>): Response {
  return new Response(JSON.stringify({ success: true, ...body }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed.", 405);
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let payload: SendEmailPayload;
  try {
    payload = await req.json();
  } catch {
    return errorResponse("Invalid JSON body.");
  }

  const {
    email_type,
    recipient_email,
    recipient_name,
    template_alias: payloadAlias,
    template_data = {},
    related_table,
    related_id,
    dry_run = false,
  } = payload;

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!email_type) return errorResponse("email_type is required.");
  if (!recipient_email) return errorResponse("recipient_email is required.");
  if (!isValidEmail(recipient_email)) return errorResponse("recipient_email is not a valid email address.");
  if (!VALID_EMAIL_TYPES.has(email_type)) {
    return errorResponse(`Unknown email_type: ${email_type}. Valid types: ${[...VALID_EMAIL_TYPES].join(", ")}`);
  }

  const resolvedAlias = payloadAlias ?? TEMPLATE_ALIASES[email_type];
  if (!resolvedAlias) {
    return errorResponse("No template_alias could be resolved for this email_type.");
  }

  // ── Supabase admin client (uses service role for email_events writes) ────────
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return errorResponse("Server configuration error.", 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // ── Create email_events row (status = pending) ───────────────────────────────
  const { data: eventRow, error: insertError } = await supabase
    .from("email_events")
    .insert({
      recipient_email,
      recipient_name: recipient_name ?? null,
      email_type,
      template_alias: resolvedAlias,
      related_table: related_table ?? null,
      related_id: related_id ?? null,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !eventRow) {
    // Logging failure is non-fatal if email still sends, but in Phase 2 we treat it as blocking
    // because auditing is critical for consent/youth emails.
    console.error("email_events insert failed:", insertError?.message);
    return errorResponse("Failed to log email event. Email not sent.", 500);
  }

  const eventId = eventRow.id as string;

  // ── Dry run — log but do not call Postmark ───────────────────────────────────
  if (dry_run) {
    await supabase
      .from("email_events")
      .update({
        status: "sent",
        error_message: "dry_run_no_send",
        sent_at: new Date().toISOString(),
      })
      .eq("id", eventId);

    return successResponse({
      dry_run: true,
      email_type,
      recipient_email,
      template_alias: resolvedAlias,
      event_id: eventId,
      message: "Dry run complete. No email was sent. Email event logged.",
    });
  }

  // ── Postmark token check ─────────────────────────────────────────────────────
  const postmarkToken = Deno.env.get("POSTMARK_SERVER_TOKEN");
  if (!postmarkToken) {
    await supabase
      .from("email_events")
      .update({
        status: "failed",
        error_message: "POSTMARK_SERVER_TOKEN is not configured.",
      })
      .eq("id", eventId);

    return errorResponse("Email service is not configured. Contact the administrator.", 500);
  }

  const fromEmail = Deno.env.get("POSTMARK_FROM_EMAIL") ?? "hello@mein.world";
  const messageStream = Deno.env.get("POSTMARK_MESSAGE_STREAM");

  // ── Send via Postmark template API ───────────────────────────────────────────
  const postmarkPayload: Record<string, unknown> = {
    From: fromEmail,
    To: recipient_email,
    TemplateAlias: resolvedAlias,
    TemplateModel: {
      recipient_name: recipient_name ?? "",
      ...template_data,
    },
  };

  if (messageStream) {
    postmarkPayload.MessageStream = messageStream;
  }

  let postmarkResponse: Response;
  try {
    postmarkResponse = await fetch("https://api.postmarkapp.com/email/withTemplate", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify(postmarkPayload),
    });
  } catch (networkErr) {
    const msg = networkErr instanceof Error ? networkErr.message : "Network error";
    console.error("Postmark network error:", msg);

    await supabase
      .from("email_events")
      .update({ status: "failed", error_message: "Failed to reach email provider." })
      .eq("id", eventId);

    return errorResponse("Failed to reach email provider. Please try again later.", 502);
  }

  const postmarkData = await postmarkResponse.json().catch(() => ({})) as Record<string, unknown>;

  if (!postmarkResponse.ok) {
    // Postmark error codes: https://postmarkapp.com/developer/api/overview#error-codes
    const postmarkMessage = (postmarkData.Message as string | undefined) ?? "Unknown error from email provider.";
    console.error("Postmark error:", postmarkResponse.status, postmarkMessage);

    await supabase
      .from("email_events")
      .update({
        status: "failed",
        error_message: `Postmark error ${postmarkResponse.status}: ${postmarkMessage}`,
      })
      .eq("id", eventId);

    // Expose only safe errors to callers — not raw Postmark internals
    if (postmarkResponse.status === 422) {
      // Template not found or invalid template model — safe to surface
      return errorResponse(`Email template not found or invalid: ${postmarkMessage}`, 422);
    }

    return errorResponse("Failed to send email. The issue has been logged.", 500);
  }

  // ── Success ──────────────────────────────────────────────────────────────────
  const messageId = (postmarkData.MessageID as string | undefined) ?? null;

  await supabase
    .from("email_events")
    .update({
      status: "sent",
      postmark_message_id: messageId,
      sent_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  return successResponse({
    email_type,
    recipient_email,
    template_alias: resolvedAlias,
    event_id: eventId,
    postmark_message_id: messageId,
    message: "Email sent successfully.",
  });
});
