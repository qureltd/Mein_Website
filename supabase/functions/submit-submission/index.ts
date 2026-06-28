import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Public endpoint — no JWT required.
// Handles: MakeYourMove and FutureMe submission inserts.
// Inserts into submissions, then triggers a confirmation email
// via send-email using the service role key.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function err(msg: string, status = 400): Response {
  return new Response(JSON.stringify({ success: false, error: msg }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function ok(body: Record<string, unknown> = {}): Response {
  return new Response(JSON.stringify({ success: true, ...body }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const VALID_SUBMISSION_TYPES = new Set([
  "create", "speak", "build", "represent", "feature",
  "future_me", "school", "partner", "contact",
]);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "POST") return err("Method not allowed.", 405);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body.");
  }

  const {
    name,
    display_name,
    email,
    age: rawAge,
    type,
    title,
    content,
    guardian_name,
    guardian_email,
    consent_scope,
  } = body as Record<string, unknown>;

  // Validation
  if (!name || typeof name !== "string" || !name.trim()) return err("Name is required.");
  if (name.toString().length > 100) return err("Name must be 100 characters or fewer.");
  if (!email || typeof email !== "string" || !isValidEmail(email)) return err("A valid email address is required.");
  if (email.length > 254) return err("Email address is too long.");
  if (!type || typeof type !== "string" || !VALID_SUBMISSION_TYPES.has(type)) return err("Invalid submission type.");
  if (!content || typeof content !== "string" || !content.trim()) return err("Content is required.");
  if (content.length > 6000) return err("Content must be 6000 characters or fewer.");
  if (display_name && typeof display_name === "string" && display_name.length > 60) return err("Display name must be 60 characters or fewer.");
  if (title && typeof title === "string" && title.length > 200) return err("Title must be 200 characters or fewer.");

  const age = rawAge !== undefined && rawAge !== "" ? parseInt(String(rawAge), 10) : null;
  if (age !== null && (isNaN(age) || age < 10 || age > 25)) {
    return err("Age must be between 10 and 25.");
  }

  const isUnder18 = age !== null && age < 18;
  const consentRequired = isUnder18;

  if (isUnder18) {
    if (!guardian_email || typeof guardian_email !== "string" || !isValidEmail(guardian_email as string)) {
      return err("A valid guardian email is required for under-18 submissions.");
    }
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return err("Server configuration error.", 500);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: inserted, error: insertError } = await supabase
    .from("submissions")
    .insert({
      name: (name as string).trim(),
      display_name: display_name ? (display_name as string).trim() : null,
      email: (email as string).trim(),
      age: age,
      type,
      title: title ? (title as string).trim() : null,
      content: (content as string).trim(),
      is_under_18: isUnder18,
      guardian_name: guardian_name ? (guardian_name as string).trim() : null,
      guardian_email: guardian_email ? (guardian_email as string).trim() : null,
      consent_required: consentRequired,
      consent_scope: consent_scope ? (consent_scope as string).trim() : null,
      status: "received",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("submissions insert failed:", insertError?.message);
    return err("Failed to save your submission. Please try again.", 500);
  }

  const siteUrl = Deno.env.get("SITE_URL") ?? "https://mein.world";
  const firstName = (name as string).trim().split(" ")[0];

  // Youth-facing confirmation: future_me uses its own template
  const emailType = type === "future_me" ? "future_me_received" : "submission_received";

  const templateData: Record<string, string> = {
    site_url: siteUrl,
    make_move_url: `${siteUrl}/make-your-move`,
    first_name: firstName,
    submission_type: type as string,
  };

  // Send confirmation to submitter
  try {
    await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serviceRoleKey}`,
        "x-client-info": "submit-submission/1.0",
      },
      body: JSON.stringify({
        email_type: emailType,
        recipient_email: (email as string).trim(),
        recipient_name: (name as string).trim(),
        template_data: templateData,
        related_table: "submissions",
        related_id: inserted.id,
      }),
    });
  } catch (emailErr) {
    console.error("Submitter confirmation email failed (non-fatal):", emailErr);
  }

  // Send admin alert
  const adminEmail = Deno.env.get("ADMIN_ALERT_EMAIL");
  if (adminEmail) {
    try {
      await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${serviceRoleKey}`,
          "x-client-info": "submit-submission/1.0",
        },
        body: JSON.stringify({
          email_type: "admin_new_submission",
          recipient_email: adminEmail,
          template_data: {
            admin_submission_url: `${siteUrl}/admin/submissions/${inserted.id}`,
            submitter_name: (name as string).trim(),
            submission_type: type as string,
          },
          related_table: "submissions",
          related_id: inserted.id,
        }),
      });
    } catch (adminEmailErr) {
      console.error("Admin alert email failed (non-fatal):", adminEmailErr);
    }
  }

  return ok({ id: inserted.id });
});
