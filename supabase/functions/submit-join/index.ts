import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Public endpoint — no JWT required.
// Handles Join MEIN movement signups. Inserts into join_interests,
// sends a join_confirmation email, deduplicates by email + path.

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

// DB path values — the only values accepted by the join_interests CHECK constraint.
const VALID_DB_PATHS = new Set([
  "young_person", "parent_guardian", "creator",
  "school_partner", "supporter", "partner",
]);

// Map front-end aliases → DB values (handles old UI path keys and convenience aliases).
const PATH_MAP: Record<string, string> = {
  school_educator: "school_partner",
  creative: "creator",
};

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

  const {
    first_name,
    email,
    joining_as,
    interests,
    message,
    consented_to_updates,
  } = body as {
    first_name?: string;
    email?: string;
    joining_as?: string;
    interests?: string[];
    message?: string;
    consented_to_updates?: boolean;
  };

  // Validation
  if (!email || !isValidEmail(email)) return err("A valid email address is required.");
  if (email.length > 254) return err("Email address is too long.");
  if (!joining_as) return err("Please select how you are joining.");
  if (consented_to_updates !== true) return err("You must agree to receive MEIN updates to join.");
  if (first_name && first_name.length > 100) return err("Name must be 100 characters or fewer.");
  if (message && message.length > 2000) return err("Message must be 2000 characters or fewer.");

  // Map front-end aliases to DB path values
  const dbPath = PATH_MAP[joining_as] ?? joining_as;
  if (!VALID_DB_PATHS.has(dbPath)) return err("Invalid joining_as value.");

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return err("Server configuration error.", 500);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // Deduplication — same email + path already exists and is not archived
  const { data: existing } = await supabase
    .from("join_interests")
    .select("id")
    .eq("email", email.trim().toLowerCase())
    .eq("path", dbPath)
    .neq("status", "archived")
    .maybeSingle();

  if (existing) return ok({ duplicate: true });

  // Insert
  const { data: inserted, error: insertError } = await supabase
    .from("join_interests")
    .insert({
      name: first_name?.trim() || null,
      email: email.trim().toLowerCase(),
      path: dbPath,
      interests: Array.isArray(interests) && interests.length > 0 ? interests : null,
      message: message?.trim() || null,
      consented_to_updates: true,
      status: "new",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("join_interests insert failed:", insertError?.message);
    return err("Failed to save your interest. Please try again.", 500);
  }

  // Send join_confirmation email (non-fatal)
  const siteUrl = Deno.env.get("SITE_URL") ?? "https://mein.world";
  try {
    await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serviceRoleKey}`,
        "x-client-info": "submit-join/1.0",
      },
      body: JSON.stringify({
        email_type: "join_confirmation",
        recipient_email: email.trim().toLowerCase(),
        recipient_name: first_name?.trim() || undefined,
        template_data: {
          start_url: `${siteUrl}/make-your-move`,
        },
        related_table: "join_interests",
        related_id: inserted.id,
      }),
    });
  } catch (emailErr) {
    console.error("join_confirmation email failed (non-fatal):", emailErr);
  }

  return ok({ id: inserted.id });
});
