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
  if (req.method !== "POST") return errorResponse("Method not allowed.", 405);

  // ── Auth ────────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return errorResponse("Unauthorized.", 401);
  }
  const jwt = authHeader.replace("Bearer ", "");

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return errorResponse("Server configuration error.", 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
  if (authError || !user) return errorResponse("Unauthorized.", 401);

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();
  if (!adminUser) return errorResponse("Forbidden: admin access required.", 403);

  // ── Parse input ─────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body.");
  }

  const { story_id } = body as Record<string, unknown>;
  if (!story_id || typeof story_id !== "string") {
    return errorResponse("story_id is required.");
  }

  // ── Fetch story ─────────────────────────────────────────────────────────────
  const { data: story } = await supabase
    .from("stories")
    .select("id, submission_id, unpublished_at, published_at")
    .eq("id", story_id)
    .maybeSingle();

  if (!story) return errorResponse("Story not found.", 404);

  if (story.unpublished_at) {
    return errorResponse("This story is already unpublished.");
  }

  const now = new Date().toISOString();

  // ── Unpublish story ─────────────────────────────────────────────────────────
  const { error: updateError } = await supabase
    .from("stories")
    .update({ unpublished_at: now, updated_at: now })
    .eq("id", story_id);

  if (updateError) {
    console.error("story unpublish failed:", updateError.message);
    return errorResponse("Failed to unpublish story.", 500);
  }

  // ── Revert submission status to approved ────────────────────────────────────
  if (story.submission_id) {
    const { error: subError } = await supabase
      .from("submissions")
      .update({ status: "approved", updated_at: now })
      .eq("id", story.submission_id);

    if (subError) {
      console.error("submission revert failed:", subError.message);
      // Non-fatal: story is unpublished, admin can fix submission status manually
    }
  }

  // ── Audit log ───────────────────────────────────────────────────────────────
  await supabase.from("audit_logs").insert({
    admin_id: user.id,
    action: "story_unpublished",
    entity_type: "stories",
    entity_id: story_id,
    previous_status: "published",
    new_status: "unpublished",
    notes: story.submission_id
      ? `Unpublished by ${user.email}. Submission ${story.submission_id} reverted to approved.`
      : `Unpublished by ${user.email}.`,
  });

  return successResponse({ story_id, unpublished_at: now });
});
