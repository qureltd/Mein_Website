import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Admin-only endpoint — requires a valid Supabase session JWT from an admin user.
// Handles drop launch email notifications with three modes:
//   preview  — returns eligible recipient count, no emails sent
//   dry_run  — sends one email to the calling admin only, dry_run flagged
//   send     — sends to all eligible recipients (requires confirm: true)

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "POST") return err("Method not allowed.", 405);

  // ── Auth: require valid session JWT ────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return err("Authentication required.", 401);
  }
  const callerJwt = authHeader.replace("Bearer ", "").trim();

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return err("Server configuration error.", 500);

  // Verify caller JWT using anon key to get the user
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!anonKey) return err("Server configuration error.", 500);

  const callerClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${callerJwt}` } },
  });

  const { data: { user: callerUser }, error: authError } = await callerClient.auth.getUser();
  if (authError || !callerUser) return err("Invalid or expired session.", 401);

  // Check admin_users table for this user + allowed roles
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: adminRow } = await adminClient
    .from("admin_users")
    .select("id, email, role")
    .eq("id", callerUser.id)
    .in("role", ["super_admin", "shop_manager"])
    .maybeSingle();

  if (!adminRow) return err("Forbidden. Admin access required.", 403);

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body.");
  }

  const { drop_id, mode, confirm } = body as {
    drop_id?: string;
    mode?: "preview" | "dry_run" | "send";
    confirm?: boolean;
  };

  if (!drop_id) return err("drop_id is required.");
  if (!mode || !["preview", "dry_run", "send"].includes(mode)) {
    return err("mode must be one of: preview, dry_run, send.");
  }
  if (mode === "send" && confirm !== true) {
    return err("confirm: true is required for mode 'send'.");
  }

  // ── Fetch drop ─────────────────────────────────────────────────────────────
  const { data: drop, error: dropError } = await adminClient
    .from("shop_drops")
    .select("id, name, slug, status, launch_email_sent_at")
    .eq("id", drop_id)
    .maybeSingle();

  if (dropError || !drop) return err("Drop not found.", 404);

  // ── Guard: already sent ────────────────────────────────────────────────────
  if (mode === "send" && drop.launch_email_sent_at) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Launch notification already sent for this drop.",
        sent_at: drop.launch_email_sent_at,
      }),
      { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const siteUrl = Deno.env.get("SITE_URL") ?? "https://mein.world";
  const shopUrl = `${siteUrl}/shop`;

  // ── Fetch eligible recipients ──────────────────────────────────────────────
  // People who:
  //   - consented_to_updates = true
  //   - status != 'archived'
  //   - have 'Merch / product drops' in interests OR path = 'shop_early_access'
  // Deduplicated by email (keep oldest row per email).
  const { data: recipients, error: recipientsError } = await adminClient
    .from("join_interests")
    .select("id, email, name")
    .eq("consented_to_updates", true)
    .neq("status", "archived")
    .or("interests.cs.{Merch / product drops},path.eq.shop_early_access");

  if (recipientsError) {
    console.error("Failed to fetch recipients:", recipientsError.message);
    return err("Failed to fetch recipient list.", 500);
  }

  // Deduplicate by email — keep first occurrence (oldest, since ordered by created_at desc from DB default)
  const seen = new Set<string>();
  const dedupedRecipients = (recipients ?? []).filter((r) => {
    const email = (r.email as string).toLowerCase();
    if (seen.has(email)) return false;
    seen.add(email);
    return true;
  });

  // ── Preview mode ───────────────────────────────────────────────────────────
  if (mode === "preview") {
    return ok({
      drop_id,
      drop_name: drop.name,
      recipient_count: dedupedRecipients.length,
      already_sent: !!drop.launch_email_sent_at,
      sent_at: drop.launch_email_sent_at ?? null,
    });
  }

  // ── Dry-run mode ───────────────────────────────────────────────────────────
  if (mode === "dry_run") {
    const adminEmail = adminRow.email as string;
    try {
      await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${serviceRoleKey}`,
          "x-client-info": "send-drop-launch/1.0",
        },
        body: JSON.stringify({
          email_type: "drop_launch_notification",
          recipient_email: adminEmail,
          template_data: {
            drop_name: drop.name,
            shop_url: shopUrl,
          },
          related_table: "shop_drops",
          related_id: drop_id,
          dry_run: true,
        }),
      });
    } catch (e) {
      console.error("dry_run send failed:", e);
      return err("Failed to send test email.", 500);
    }
    return ok({
      mode: "dry_run",
      test_sent_to: adminEmail,
      recipient_count: dedupedRecipients.length,
      drop_name: drop.name,
    });
  }

  // ── Real send ──────────────────────────────────────────────────────────────
  // Check email_events for already-sent records for this drop (per-recipient secondary guard)
  const { data: alreadySentEvents } = await adminClient
    .from("email_events")
    .select("recipient_email")
    .eq("related_table", "shop_drops")
    .eq("related_id", drop_id)
    .eq("template_alias", "mein-drop-launch-notification")
    .eq("status", "sent");

  const alreadySentEmails = new Set(
    (alreadySentEvents ?? []).map((e) => (e.recipient_email as string).toLowerCase())
  );

  const toSend = dedupedRecipients.filter(
    (r) => !alreadySentEmails.has((r.email as string).toLowerCase())
  );

  let sentCount = 0;
  let failedCount = 0;
  const skippedCount = dedupedRecipients.length - toSend.length;

  // Process in batches of 50
  const BATCH_SIZE = 50;
  for (let i = 0; i < toSend.length; i += BATCH_SIZE) {
    const batch = toSend.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((recipient) =>
        fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${serviceRoleKey}`,
            "x-client-info": "send-drop-launch/1.0",
          },
          body: JSON.stringify({
            email_type: "drop_launch_notification",
            recipient_email: (recipient.email as string).toLowerCase(),
            recipient_name: recipient.name ?? undefined,
            template_data: {
              drop_name: drop.name,
              shop_url: shopUrl,
            },
            related_table: "shop_drops",
            related_id: drop_id,
          }),
        }).then(async (res) => {
          const data = await res.json().catch(() => ({})) as Record<string, unknown>;
          if (!res.ok || !data.success) throw new Error(data.error as string ?? "send failed");
          return data;
        })
      )
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        sentCount++;
      } else {
        failedCount++;
        console.error("Recipient send failed:", result.reason);
      }
    }
  }

  // Mark drop as sent regardless of partial failures (sent_count > 0 means at least some succeeded)
  if (sentCount > 0 || toSend.length === 0) {
    await adminClient
      .from("shop_drops")
      .update({
        launch_email_sent_at: new Date().toISOString(),
        launch_email_sent_by: callerUser.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", drop_id);
  }

  return ok({
    mode: "send",
    drop_id,
    drop_name: drop.name,
    sent: sentCount,
    failed: failedCount,
    skipped: skippedCount,
    total_eligible: dedupedRecipients.length,
  });
});
