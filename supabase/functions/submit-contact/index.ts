import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Public endpoint — no JWT required.
// Handles: contact messages, school/org enquiries, shop notify signups.
// Inserts into contact_messages, then triggers a confirmation email
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

const VALID_CONTACT_TYPES = new Set([
  "young_person", "parent", "school", "organisation", "creator", "shop", "general",
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
    contact_type,
    name,
    email,
    subject,
    message,
    org_name,
    role,
  } = body as Record<string, string | undefined>;

  // Validation
  if (!email || !isValidEmail(email)) return err("A valid email address is required.");
  if (email.length > 254) return err("Email address is too long.");
  if (!message || !message.trim()) return err("Message is required.");
  if (message.length > 4000) return err("Message must be 4000 characters or fewer.");
  if (name && name.length > 100) return err("Name must be 100 characters or fewer.");
  if (subject && subject.length > 200) return err("Subject must be 200 characters or fewer.");
  if (contact_type && !VALID_CONTACT_TYPES.has(contact_type)) return err("Invalid contact_type.");

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return err("Server configuration error.", 500);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // Build the message body — school enquiries embed org/role context
  let fullMessage = message.trim();
  if (org_name || role) {
    const parts: string[] = [];
    if (org_name) parts.push(`Organisation: ${org_name}`);
    if (role) parts.push(`Role: ${role}`);
    fullMessage = `${parts.join("\n")}\n\n${fullMessage}`;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("contact_messages")
    .insert({
      contact_type: contact_type ?? "general",
      name: name?.trim() || null,
      email: email.trim(),
      subject: subject?.trim() || null,
      message: fullMessage,
      status: "new",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("contact_messages insert failed:", insertError?.message);
    return err("Failed to save your message. Please try again.", 500);
  }

  // Determine email type based on contact_type
  let emailType: string;
  if (contact_type === "school" || contact_type === "organisation") {
    emailType = "school_enquiry_confirmation";
  } else if (contact_type === "shop") {
    emailType = "drop_signup_confirmation";
  } else {
    emailType = "contact_confirmation";
  }

  const siteUrl = Deno.env.get("SITE_URL") ?? "https://mein.world";
  const firstName = name?.trim().split(" ")[0] ?? undefined;

  const templateData: Record<string, string> = {
    site_url: siteUrl,
    why_url: `${siteUrl}/why-this-matters`,
    shop_url: `${siteUrl}/shop`,
    contact_url: `${siteUrl}/contact`,
  };
  if (firstName) templateData.first_name = firstName;

  // Send confirmation email via send-email (using service role as Bearer)
  try {
    await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serviceRoleKey}`,
        "x-client-info": "submit-contact/1.0",
      },
      body: JSON.stringify({
        email_type: emailType,
        recipient_email: email.trim(),
        recipient_name: name?.trim() || undefined,
        template_data: templateData,
        related_table: "contact_messages",
        related_id: inserted.id,
      }),
    });
  } catch (emailErr) {
    // Non-fatal — message is saved, email failure is logged by send-email
    console.error("Email send failed (non-fatal):", emailErr);
  }

  // Admin alert — only if ADMIN_ALERT_EMAIL is configured
  const adminEmail = Deno.env.get("ADMIN_ALERT_EMAIL");
  if (adminEmail) {
    const siteUrlForAdmin = Deno.env.get("SITE_URL") ?? "https://mein.world";
    try {
      await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${serviceRoleKey}`,
          "x-client-info": "submit-contact/1.0",
        },
        body: JSON.stringify({
          email_type: "admin_new_contact",
          recipient_email: adminEmail,
          template_data: {
            admin_contact_url: `${siteUrlForAdmin}/admin/contact`,
            sender_name: name?.trim() || undefined,
            contact_type: contact_type ?? "general",
          },
          related_table: "contact_messages",
          related_id: inserted.id,
        }),
      });
    } catch (adminEmailErr) {
      console.error("Admin contact alert failed (non-fatal):", adminEmailErr);
    }
  }

  return ok({ id: inserted.id });
});
