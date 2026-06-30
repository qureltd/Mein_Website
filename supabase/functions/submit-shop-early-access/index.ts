import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Public endpoint — no JWT required.
// Handles Shop Early Access signups. Inserts into join_interests
// with path = 'shop_early_access', sends drop_signup_confirmation,
// deduplicates by email. Does NOT send join_confirmation.

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "POST") return err("Method not allowed.", 405);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body.");
  }

  // Honeypot — silent success for bots
  if (body._trap) return ok();

  const { email } = body as { email?: string };

  if (!email || !isValidEmail(email)) return err("A valid email address is required.");
  if (email.length > 254) return err("Email address is too long.");

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return err("Server configuration error.", 500);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const normalizedEmail = email.trim().toLowerCase();

  // Deduplication — same email already on the shop early access list and not archived
  const { data: existing } = await supabase
    .from("join_interests")
    .select("id")
    .eq("email", normalizedEmail)
    .eq("path", "shop_early_access")
    .neq("status", "archived")
    .maybeSingle();

  if (existing) return ok({ duplicate: true });

  // Insert
  const { data: inserted, error: insertError } = await supabase
    .from("join_interests")
    .insert({
      name: null,
      email: normalizedEmail,
      path: "shop_early_access",
      interests: ["Merch / product drops"],
      message: null,
      consented_to_updates: true,
      status: "new",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("join_interests insert failed:", insertError?.message);
    return err("Failed to save your details. Please try again.", 500);
  }

  // Send drop_signup_confirmation email (non-fatal)
  const siteUrl = Deno.env.get("SITE_URL") ?? "https://mein.world";
  try {
    await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serviceRoleKey}`,
        "x-client-info": "submit-shop-early-access/1.0",
      },
      body: JSON.stringify({
        email_type: "drop_signup_confirmation",
        recipient_email: normalizedEmail,
        template_data: {
          shop_url: `${siteUrl}/shop`,
        },
        related_table: "join_interests",
        related_id: inserted.id,
      }),
    });
  } catch (emailErr) {
    console.error("drop_signup_confirmation email failed (non-fatal):", emailErr);
  }

  return ok({ id: inserted.id });
});
