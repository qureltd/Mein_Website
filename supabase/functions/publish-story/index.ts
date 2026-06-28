import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PUBLISHABLE_TYPES = ["create", "speak", "build", "represent", "feature"];

const VALID_CATEGORIES = [
  "future_self_letters", "mein_mover_videos", "youth_stories",
  "creative_submissions", "art_gallery", "writing",
  "behind_the_scenes", "merch_drops",
];

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

  const {
    submission_id,
    title,
    excerpt,
    author_display_name,
    category,
    featured = false,
  } = body as Record<string, unknown>;

  if (!submission_id || typeof submission_id !== "string") {
    return errorResponse("submission_id is required.");
  }
  if (!title || typeof title !== "string" || !title.trim()) {
    return errorResponse("title is required.");
  }
  if (!excerpt || typeof excerpt !== "string" || !excerpt.trim()) {
    return errorResponse("excerpt is required.");
  }
  if (!author_display_name || typeof author_display_name !== "string" || !author_display_name.trim()) {
    return errorResponse("author_display_name is required.");
  }
  if (!category || typeof category !== "string" || !VALID_CATEGORIES.includes(category)) {
    return errorResponse(`category must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }

  // ── Fetch submission ────────────────────────────────────────────────────────
  const { data: sub } = await supabase
    .from("submissions")
    .select("id, type, status, is_under_18, consent_required, name, display_name, email, guardian_email")
    .eq("id", submission_id)
    .maybeSingle();

  if (!sub) return errorResponse("Submission not found.", 404);

  // ── Eligibility: type ───────────────────────────────────────────────────────
  if (!PUBLISHABLE_TYPES.includes(sub.type)) {
    await supabase.from("audit_logs").insert({
      admin_id: user.id,
      action: "story_publish_attempt_blocked",
      entity_type: "submissions",
      entity_id: submission_id,
      previous_status: sub.status,
      new_status: sub.status,
      notes: `Blocked: ineligible type '${sub.type}'`,
    });
    return errorResponse(`Submission type '${sub.type}' is not eligible for Wall publishing.`);
  }

  // ── Eligibility: status ─────────────────────────────────────────────────────
  if (sub.status !== "approved") {
    await supabase.from("audit_logs").insert({
      admin_id: user.id,
      action: "story_publish_attempt_blocked",
      entity_type: "submissions",
      entity_id: submission_id,
      previous_status: sub.status,
      new_status: sub.status,
      notes: `Blocked: status is '${sub.status}', must be 'approved'`,
    });
    return errorResponse(
      `Submission must be approved before publishing. Current status: ${sub.status}.`
    );
  }

  // ── Eligibility: consent ────────────────────────────────────────────────────
  if (sub.is_under_18 || sub.consent_required) {
    const { data: consentReq } = await supabase
      .from("consent_requests")
      .select("id, status, signed_name, responded_at")
      .eq("submission_id", submission_id)
      .eq("status", "approved")
      .maybeSingle();

    if (!consentReq) {
      await supabase.from("audit_logs").insert({
        admin_id: user.id,
        action: "story_publish_attempt_blocked",
        entity_type: "submissions",
        entity_id: submission_id,
        previous_status: sub.status,
        new_status: sub.status,
        notes: "Blocked: no approved consent request found",
      });
      return errorResponse(
        "Approved parent/guardian consent is required before this submission can be published."
      );
    }

    if (!consentReq.signed_name) {
      return errorResponse("Consent record is incomplete — missing guardian signature.");
    }
  }

  // ── Check for duplicate active publication ──────────────────────────────────
  const { data: existingStory } = await supabase
    .from("stories")
    .select("id")
    .eq("submission_id", submission_id)
    .is("unpublished_at", null)
    .maybeSingle();

  if (existingStory) {
    return errorResponse("This submission is already published on The Wall.");
  }

  // ── Insert story ────────────────────────────────────────────────────────────
  const now = new Date().toISOString();

  const { data: story, error: storyError } = await supabase
    .from("stories")
    .insert({
      submission_id,
      title: (title as string).trim(),
      excerpt: (excerpt as string).trim(),
      author_display_name: (author_display_name as string).trim(),
      category,
      featured: Boolean(featured),
      published_at: now,
    })
    .select("id")
    .single();

  if (storyError || !story) {
    console.error("story insert failed:", storyError?.message);
    return errorResponse("Failed to create story record.", 500);
  }

  // ── Update submission ───────────────────────────────────────────────────────
  const { error: subUpdateError } = await supabase
    .from("submissions")
    .update({
      status: "published",
      published_at: now,
      public_display_name: (author_display_name as string).trim(),
      updated_at: now,
    })
    .eq("id", submission_id);

  if (subUpdateError) {
    console.error("submission update failed:", subUpdateError.message);
    // Story was inserted — log and continue so we don't leave inconsistent state silently
  }

  // ── Audit log ───────────────────────────────────────────────────────────────
  await supabase.from("audit_logs").insert({
    admin_id: user.id,
    action: "story_published",
    entity_type: "stories",
    entity_id: story.id,
    previous_status: "approved",
    new_status: "published",
    notes: `Submission ${submission_id} published as story ${story.id}`,
  });

  return successResponse({
    story_id: story.id,
    story_path: `/stories/${story.id}`,
  });
});
