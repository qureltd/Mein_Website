import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ── CORS ─────────────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// ── Template alias map ────────────────────────────────────────────────────────
// Maps email_type → internal tracking key stored in email_events.template_alias.
// Templates are generated server-side; no Postmark dashboard templates required.
const TEMPLATE_ALIASES: Record<string, string> = {
  consent_request:             "mein-consent-request",
  consent_confirmation:        "mein-consent-confirmation",
  consent_declined:            "mein-consent-declined",
  submission_received:         "mein-submission-received",
  future_me_received:          "mein-future-me-received",
  submission_approved:         "mein-submission-approved",
  submission_published:        "mein-submission-published",
  contact_confirmation:        "mein-contact-confirmation",
  school_enquiry_confirmation: "mein-school-enquiry-confirmation",
  admin_new_contact:           "mein-admin-new-contact",
  admin_new_submission:        "mein-admin-new-submission",
  join_confirmation:           "mein-join-confirmation",
  drop_signup_confirmation:    "mein-drop-signup-confirmation",
  drop_launch_notification:    "mein-drop-launch-notification",
};

const VALID_EMAIL_TYPES = new Set(Object.keys(TEMPLATE_ALIASES));

// ── Payload shape ─────────────────────────────────────────────────────────────
// Note: template_alias is intentionally not accepted from callers.
// Subject, HtmlBody, TextBody, and From are never accepted from callers.
// All email content is generated server-side from the fixed email_type.
interface SendEmailPayload {
  email_type: string;
  recipient_email: string;
  recipient_name?: string;
  template_data?: Record<string, unknown>;
  related_table?: string;
  related_id?: string;
  dry_run?: boolean;
}

// ── Utility ───────────────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

// ── Template building ─────────────────────────────────────────────────────────

type Vars = Record<string, unknown>;

// Escape user-supplied values for safe embedding in HTML
function esc(s: unknown): string {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Get a trimmed string from vars, returning fallback if missing/empty
function v(vars: Vars, key: string, fallback = ""): string {
  const val = vars[key];
  return typeof val === "string" && val.trim() ? val.trim() : fallback;
}

// Branded HTML email wrapper — pale blue bg, white card, Mein wordmark
function layout(cardContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#F5F8FF;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-text-size-adjust:100%;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5F8FF;">
<tr><td align="center" style="padding:32px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

  <tr><td style="padding:0 0 20px 0;">
    <p style="font-size:22px;font-weight:800;color:#111111;letter-spacing:-0.5px;margin:0;line-height:1.2;">Mein</p>
    <p style="font-size:11px;color:#6B7280;margin:4px 0 0 0;letter-spacing:0.8px;text-transform:uppercase;">Live your future today.</p>
  </td></tr>

  <tr><td style="background-color:#FFFFFF;border-radius:12px;padding:36px 32px 32px 32px;border:1px solid #E5E7EB;">
    ${cardContent}
  </td></tr>

  <tr><td style="padding:20px 0 0 0;">
    <p style="font-size:12px;color:#9CA3AF;text-align:center;margin:0;line-height:1.7;">
      Mein &mdash; Live your future today.<br>
      This email was sent because you interacted with Mein.<br>
      Questions? <a href="mailto:hello@meintoday.com" style="color:#9CA3AF;text-decoration:underline;">hello@meintoday.com</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// Paragraph with escaped text
function p(text: string): string {
  return `<p style="font-size:15px;color:#111111;line-height:1.65;margin:0 0 14px 0;">${esc(text)}</p>`;
}

// Bold inline span with escaped text
function bold(text: string): string {
  return `<strong style="color:#111111;">${esc(text)}</strong>`;
}

// CTA button — Electric Blue #2F6BFF, white text, 8px radius
function ctaButton(label: string, url: string): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 8px 0;">
<tr><td style="background-color:#2F6BFF;border-radius:8px;">
  <a href="${esc(url)}" style="display:inline-block;padding:12px 24px;color:#FFFFFF;font-weight:700;font-size:14px;text-decoration:none;letter-spacing:-0.1px;">${esc(label)}</a>
</td></tr>
</table>`;
}

// Youth greeting: "Hey {name}," or "Hey Mein Builder,"
function youthGreetHtml(firstName?: string): string {
  const salutation = firstName ? `Hey ${esc(firstName)},` : "Hey Mein Builder,";
  return `<p style="font-size:16px;font-weight:700;color:#111111;margin:0 0 18px 0;">${salutation}</p>`;
}

// Adult / guardian / admin greeting: "Hello {name}," or "Hello,"
function adultGreetHtml(firstName?: string): string {
  const salutation = firstName ? `Hello ${esc(firstName)},` : "Hello,";
  return `<p style="font-size:16px;font-weight:700;color:#111111;margin:0 0 18px 0;">${salutation}</p>`;
}

// Signatures
const YOUTH_SIG_HTML = `<p style="font-size:14px;color:#6B7280;line-height:1.8;margin:24px 0 0 0;">Keep moving,<br><strong style="color:#111111;">Eva</strong><br>Co-Creator, Mein<br><em style="color:#9CA3AF;font-size:13px;">Live your future today.</em></p>`;
const ADULT_SIG_HTML = `<p style="font-size:14px;color:#6B7280;line-height:1.8;margin:24px 0 0 0;">Warmly,<br><strong style="color:#111111;">Eva</strong><br>Co-Creator, Mein<br><em style="color:#9CA3AF;font-size:13px;">Live your future today.</em></p>`;

const YOUTH_SIG_TEXT = "\nKeep moving,\nEva\nCo-Creator, Mein\nLive your future today.";
const ADULT_SIG_TEXT = "\nWarmly,\nEva\nCo-Creator, Mein\nLive your future today.";
const TEXT_FOOTER = "\n\n---\nMein — Live your future today.\nQuestions? hello@meintoday.com";

interface EmailContent {
  subject: string;
  htmlBody: string;
  textBody: string;
}

// Extract a first name from vars, supporting multiple key names, returning undefined if absent
function firstName(vars: Vars): string | undefined {
  const fn = v(vars, "first_name") || v(vars, "recipient_name");
  return fn || undefined;
}

// Extract guardian name from vars, falling back to recipient_name
function guardianName(vars: Vars): string | undefined {
  const gn = v(vars, "guardian_name") || v(vars, "recipient_name");
  return gn || undefined;
}

// Build server-side email content for a given email_type.
// All user-supplied values are HTML-escaped before embedding.
// No caller can influence Subject, HtmlBody, TextBody, or From.
function buildEmail(emailType: string, vars: Vars): EmailContent {
  switch (emailType) {

    // ── Youth: submission received ──────────────────────────────────────────
    case "submission_received": {
      const fn = firstName(vars);
      const siteUrl = v(vars, "site_url", "https://mein.world");
      const subject = "We got your move";
      return {
        subject,
        htmlBody: layout(
          youthGreetHtml(fn) +
          p("We got your move — and that matters.") +
          p("You do not need a perfect plan to begin. You took a step, and the Mein team will review your submission with care.") +
          p("If your story is a good fit to share publicly, we may follow up about consent and next steps.") +
          ctaButton("Visit Mein", siteUrl) +
          YOUTH_SIG_HTML
        ),
        textBody: [
          fn ? `Hey ${fn},` : "Hey Mein Builder,",
          "",
          "We got your move — and that matters.",
          "",
          "You do not need a perfect plan to begin. You took a step, and the Mein team will review your submission with care.",
          "",
          "If your story is a good fit to share publicly, we may follow up about consent and next steps.",
          "",
          `Visit Mein: ${siteUrl}`,
          YOUTH_SIG_TEXT,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Youth: Future Me received ───────────────────────────────────────────
    case "future_me_received": {
      const fn = firstName(vars);
      const moveUrl = v(vars, "make_move_url", "https://mein.world/make-your-move");
      const subject = "Your Future Me message was received";
      return {
        subject,
        htmlBody: layout(
          youthGreetHtml(fn) +
          p("Your Future Me message was received.") +
          p("That is not just a form. It is a small promise to the person you are becoming.") +
          p("Take your time. Keep showing up. One move is enough to begin.") +
          ctaButton("Make another move", moveUrl) +
          YOUTH_SIG_HTML
        ),
        textBody: [
          fn ? `Hey ${fn},` : "Hey Mein Builder,",
          "",
          "Your Future Me message was received.",
          "",
          "That is not just a form. It is a small promise to the person you are becoming.",
          "",
          "Take your time. Keep showing up. One move is enough to begin.",
          "",
          `Make another move: ${moveUrl}`,
          YOUTH_SIG_TEXT,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Adult: contact confirmation ─────────────────────────────────────────
    case "contact_confirmation": {
      const fn = firstName(vars);
      const siteUrl = v(vars, "site_url", "https://mein.world");
      const subject = "We got your message";
      return {
        subject,
        htmlBody: layout(
          adultGreetHtml(fn) +
          p("Thanks for reaching out.") +
          p("We got your message and someone from the Mein team will review it.") +
          p("If your note is about a young person, school, partnership, or collaboration, we will handle it with care.") +
          ctaButton("Back to Mein", siteUrl) +
          ADULT_SIG_HTML
        ),
        textBody: [
          fn ? `Hello ${fn},` : "Hello,",
          "",
          "Thanks for reaching out.",
          "",
          "We got your message and someone from the Mein team will review it.",
          "",
          "If your note is about a young person, school, partnership, or collaboration, we will handle it with care.",
          "",
          `Back to Mein: ${siteUrl}`,
          ADULT_SIG_TEXT,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Adult: school/org enquiry confirmation ──────────────────────────────
    case "school_enquiry_confirmation": {
      const fn = firstName(vars);
      const whyUrl = v(vars, "why_url", "https://mein.world/why-this-matters");
      const subject = "Thanks for reaching out to Mein";
      return {
        subject,
        htmlBody: layout(
          adultGreetHtml(fn) +
          p("Thank you for reaching out about Mein.") +
          p("We built Mein to help young people feel seen, supported, and ready to take their next move.") +
          p("Someone from our team will review your enquiry and follow up.") +
          ctaButton("Learn why Mein matters", whyUrl) +
          ADULT_SIG_HTML
        ),
        textBody: [
          fn ? `Hello ${fn},` : "Hello,",
          "",
          "Thank you for reaching out about Mein.",
          "",
          "We built Mein to help young people feel seen, supported, and ready to take their next move.",
          "",
          "Someone from our team will review your enquiry and follow up.",
          "",
          `Learn why Mein matters: ${whyUrl}`,
          ADULT_SIG_TEXT,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Adult: join confirmation ────────────────────────────────────────────
    case "join_confirmation": {
      const fn = firstName(vars);
      const startUrl = v(vars, "start_url", "https://mein.world");
      const subject = "You are in the Mein movement";
      return {
        subject,
        htmlBody: layout(
          adultGreetHtml(fn) +
          p("Welcome to Mein.") +
          p("Whether you are a young person, parent, creator, school, partner, or supporter — there is room for you here.") +
          p("Mein is about starting where you are and moving toward who you are becoming.") +
          ctaButton("Start here", startUrl) +
          ADULT_SIG_HTML
        ),
        textBody: [
          fn ? `Hello ${fn},` : "Hello,",
          "",
          "Welcome to Mein.",
          "",
          "Whether you are a young person, parent, creator, school, partner, or supporter — there is room for you here.",
          "",
          "Mein is about starting where you are and moving toward who you are becoming.",
          "",
          `Start here: ${startUrl}`,
          ADULT_SIG_TEXT,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Youth: drop signup confirmation ────────────────────────────────────
    case "drop_signup_confirmation": {
      const fn = firstName(vars);
      const shopUrl = v(vars, "shop_url", "https://mein.world/shop");
      const subject = "You are on the Drop 001 list";
      return {
        subject,
        htmlBody: layout(
          youthGreetHtml(fn) +
          p("You are on the list for Drop 001.") +
          p("Mein merch is not just something to wear. It is a reminder to live your future today.") +
          p("We will let you know when the drop is ready.") +
          ctaButton("Visit the shop", shopUrl) +
          YOUTH_SIG_HTML
        ),
        textBody: [
          fn ? `Hey ${fn},` : "Hey Mein Builder,",
          "",
          "You are on the list for Drop 001.",
          "",
          "Mein merch is not just something to wear. It is a reminder to live your future today.",
          "",
          "We will let you know when the drop is ready.",
          "",
          `Visit the shop: ${shopUrl}`,
          YOUTH_SIG_TEXT,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Youth: drop launch notification ────────────────────────────────────
    case "drop_launch_notification": {
      const fn = firstName(vars);
      const shopUrl = v(vars, "shop_url", "https://mein.world/shop");
      const dropName = v(vars, "drop_name", "The drop");
      const subject = "The drop is here";
      const dropUnsubHtml = `<p style="font-size:12px;color:#9CA3AF;line-height:1.7;margin:16px 0 0 0;padding-top:16px;border-top:1px solid #E5E7EB;">You&apos;re receiving this because you signed up for MEIN drop updates. To unsubscribe, email <a href="mailto:hello@meintoday.com" style="color:#9CA3AF;text-decoration:underline;">hello@meintoday.com</a>.</p>`;
      return {
        subject,
        htmlBody: layout(
          youthGreetHtml(fn) +
          `<p style="font-size:15px;color:#111111;line-height:1.65;margin:0 0 14px 0;">${bold(dropName)} is here.</p>` +
          p("The drop you signed up for is now live. Head to the shop to see it.") +
          ctaButton("Shop now", shopUrl) +
          YOUTH_SIG_HTML +
          dropUnsubHtml
        ),
        textBody: [
          fn ? `Hey ${fn},` : "Hey Mein Builder,",
          "",
          `${dropName} is here.`,
          "",
          "The drop you signed up for is now live. Head to the shop to see it.",
          "",
          `Shop now: ${shopUrl}`,
          YOUTH_SIG_TEXT,
          "\nYou're receiving this because you signed up for MEIN drop updates. To unsubscribe, email hello@meintoday.com.",
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Guardian: consent request ───────────────────────────────────────────
    // Caller passes guardian name as recipient_name (top-level) or guardian_name in template_data.
    // Supports consent_link (primary) and consent_url (legacy fallback).
    case "consent_request": {
      const gn = guardianName(vars);
      const submitterName = v(vars, "submitter_name", "a young person");
      const consentLink = v(vars, "consent_link") || v(vars, "consent_url");
      const consentScope = v(vars, "consent_scope");
      const subject = "Parent/guardian consent requested for Mein";

      const scopeBlockHtml = consentScope
        ? `<p style="font-size:14px;color:#374151;background-color:#F5F8FF;border-left:3px solid #2F6BFF;padding:10px 14px;margin:0 0 14px 0;border-radius:0 6px 6px 0;">${esc(consentScope)}</p>`
        : "";

      const buttonHtml = consentLink ? ctaButton("Review consent request", consentLink) : "";

      return {
        subject,
        htmlBody: layout(
          adultGreetHtml(gn) +
          `<p style="font-size:15px;color:#111111;line-height:1.65;margin:0 0 14px 0;">A young person — ${bold(submitterName)} — has submitted something to Mein that may be considered for sharing publicly.</p>` +
          p("Before anything is published, we need your review and consent.") +
          scopeBlockHtml +
          p("Please open the secure link below to see what is being requested and choose whether to approve or decline.") +
          buttonHtml +
          `<p style="font-size:13px;color:#6B7280;margin:12px 0 0 0;line-height:1.5;">Nothing will be published unless consent is approved and the Mein team completes review.</p>` +
          ADULT_SIG_HTML
        ),
        textBody: [
          gn ? `Hello ${gn},` : "Hello,",
          "",
          `A young person — ${submitterName} — has submitted something to Mein that may be considered for sharing publicly.`,
          "",
          "Before anything is published, we need your review and consent.",
          ...(consentScope ? ["", `What consent covers: ${consentScope}`] : []),
          "",
          "Please open the secure link below to see what is being requested and choose whether to approve or decline.",
          "",
          consentLink
            ? `Review consent request: ${consentLink}`
            : "(Consent link unavailable — contact the Mein team.)",
          "",
          "Nothing will be published unless consent is approved and the Mein team completes review.",
          ADULT_SIG_TEXT,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Guardian: consent confirmation ─────────────────────────────────────
    case "consent_confirmation": {
      const gn = guardianName(vars);
      const contactUrl = v(vars, "contact_url", "https://mein.world/contact");
      const subject = "Consent response received";
      return {
        subject,
        htmlBody: layout(
          adultGreetHtml(gn) +
          p("Thank you. Your consent response has been recorded.") +
          p("If you approved, the Mein team will complete its review before anything is shared publicly.") +
          p("If you have questions or need to request removal later, please contact us.") +
          ctaButton("Contact Mein", contactUrl) +
          ADULT_SIG_HTML
        ),
        textBody: [
          gn ? `Hello ${gn},` : "Hello,",
          "",
          "Thank you. Your consent response has been recorded.",
          "",
          "If you approved, the Mein team will complete its review before anything is shared publicly.",
          "",
          "If you have questions or need to request removal later, please contact us.",
          "",
          `Contact Mein: ${contactUrl}`,
          ADULT_SIG_TEXT,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Guardian: consent declined ──────────────────────────────────────────
    case "consent_declined": {
      const gn = guardianName(vars);
      const contactUrl = v(vars, "contact_url", "https://mein.world/contact");
      const subject = "Consent declined";
      return {
        subject,
        htmlBody: layout(
          adultGreetHtml(gn) +
          p("Your response has been recorded.") +
          p("Because consent was declined, the related content will not be published by Mein.") +
          p("Thank you for reviewing it.") +
          ctaButton("Contact Mein", contactUrl) +
          ADULT_SIG_HTML
        ),
        textBody: [
          gn ? `Hello ${gn},` : "Hello,",
          "",
          "Your response has been recorded.",
          "",
          "Because consent was declined, the related content will not be published by Mein.",
          "",
          "Thank you for reviewing it.",
          "",
          `Contact Mein: ${contactUrl}`,
          ADULT_SIG_TEXT,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Youth: submission approved ──────────────────────────────────────────
    case "submission_approved": {
      const fn = firstName(vars);
      const wallUrl = v(vars, "wall_url", "https://mein.world/stories");
      const subject = "Your move has been reviewed";
      return {
        subject,
        htmlBody: layout(
          youthGreetHtml(fn) +
          p("The Mein team reviewed your submission.") +
          p("Your move matters, and we are glad you shared it.") +
          p("If your story is being considered for The Wall, we will only move forward with the right review and consent steps.") +
          ctaButton("Visit The Wall", wallUrl) +
          YOUTH_SIG_HTML
        ),
        textBody: [
          fn ? `Hey ${fn},` : "Hey Mein Builder,",
          "",
          "The Mein team reviewed your submission.",
          "",
          "Your move matters, and we are glad you shared it.",
          "",
          "If your story is being considered for The Wall, we will only move forward with the right review and consent steps.",
          "",
          `Visit The Wall: ${wallUrl}`,
          YOUTH_SIG_TEXT,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Youth: submission published ─────────────────────────────────────────
    case "submission_published": {
      const fn = firstName(vars);
      const storyUrl = v(vars, "story_url", "https://mein.world/stories");
      const wallUrl = v(vars, "wall_url", "https://mein.world/stories");
      const subject = "Your story is live on The Wall";
      return {
        subject,
        htmlBody: layout(
          youthGreetHtml(fn) +
          p("Your story is now live on The Wall.") +
          p("Thank you for sharing a piece of your journey.") +
          p("Someone else may see your move and feel brave enough to start too.") +
          ctaButton("View your story", storyUrl) +
          `<p style="font-size:13px;color:#6B7280;margin:8px 0 0 0;"><a href="${esc(wallUrl)}" style="color:#2F6BFF;text-decoration:none;">Browse The Wall</a></p>` +
          YOUTH_SIG_HTML
        ),
        textBody: [
          fn ? `Hey ${fn},` : "Hey Mein Builder,",
          "",
          "Your story is now live on The Wall.",
          "",
          "Thank you for sharing a piece of your journey.",
          "",
          "Someone else may see your move and feel brave enough to start too.",
          "",
          `View your story: ${storyUrl}`,
          `Browse The Wall: ${wallUrl}`,
          YOUTH_SIG_TEXT,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Admin: new submission alert ─────────────────────────────────────────
    case "admin_new_submission": {
      const adminUrl = v(vars, "admin_submission_url", "https://mein.world/admin/submissions");
      const submitterName = v(vars, "submitter_name");
      const submissionType = v(vars, "submission_type");
      const subject = "New Mein submission received";

      const metaRows = [
        submitterName ? `<tr><td style="font-size:13px;color:#6B7280;padding:4px 0;white-space:nowrap;">Submitter:</td><td style="font-size:13px;color:#111111;padding:4px 0 4px 12px;">${esc(submitterName)}</td></tr>` : "",
        submissionType ? `<tr><td style="font-size:13px;color:#6B7280;padding:4px 0;white-space:nowrap;">Type:</td><td style="font-size:13px;color:#111111;padding:4px 0 4px 12px;">${esc(submissionType)}</td></tr>` : "",
      ].filter(Boolean).join("");

      const metaHtml = metaRows
        ? `<table cellpadding="0" cellspacing="0" border="0" style="margin:12px 0 4px 0;">${metaRows}</table>`
        : "";

      return {
        subject,
        htmlBody: layout(
          adultGreetHtml() +
          p("A new submission was received and is ready for admin review.") +
          metaHtml +
          ctaButton("Review submission", adminUrl)
        ),
        textBody: [
          "Hello,",
          "",
          "A new submission was received and is ready for admin review.",
          "",
          ...(submitterName ? [`Submitter: ${submitterName}`] : []),
          ...(submissionType ? [`Type: ${submissionType}`] : []),
          "",
          `Review submission: ${adminUrl}`,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    // ── Admin: new contact message alert ───────────────────────────────────
    case "admin_new_contact": {
      const adminUrl = v(vars, "admin_contact_url", "https://mein.world/admin/contact");
      const senderName = v(vars, "sender_name");
      const contactType = v(vars, "contact_type");
      const subject = "New Mein contact message";

      const metaRows = [
        senderName ? `<tr><td style="font-size:13px;color:#6B7280;padding:4px 0;white-space:nowrap;">From:</td><td style="font-size:13px;color:#111111;padding:4px 0 4px 12px;">${esc(senderName)}</td></tr>` : "",
        contactType ? `<tr><td style="font-size:13px;color:#6B7280;padding:4px 0;white-space:nowrap;">Type:</td><td style="font-size:13px;color:#111111;padding:4px 0 4px 12px;">${esc(contactType)}</td></tr>` : "",
      ].filter(Boolean).join("");

      const metaHtml = metaRows
        ? `<table cellpadding="0" cellspacing="0" border="0" style="margin:12px 0 4px 0;">${metaRows}</table>`
        : "";

      return {
        subject,
        htmlBody: layout(
          adultGreetHtml() +
          p("A new contact message was received.") +
          metaHtml +
          ctaButton("Open contact message", adminUrl)
        ),
        textBody: [
          "Hello,",
          "",
          "A new contact message was received.",
          "",
          ...(senderName ? [`From: ${senderName}`] : []),
          ...(contactType ? [`Type: ${contactType}`] : []),
          "",
          `Open contact message: ${adminUrl}`,
          TEXT_FOOTER,
        ].join("\n"),
      };
    }

    default:
      throw new Error(`No template defined for email_type: ${emailType}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed.", 405);
  }

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

  const resolvedAlias = TEMPLATE_ALIASES[email_type];

  // ── Build email content server-side before touching the database ────────────
  // Fail early rather than creating orphan pending events.
  let emailContent: EmailContent;
  try {
    const mergedVars: Vars = { recipient_name: recipient_name ?? "", ...template_data };
    emailContent = buildEmail(email_type, mergedVars);
  } catch (buildErr) {
    const msg = buildErr instanceof Error ? buildErr.message : "Template build error";
    console.error("buildEmail failed:", msg);
    return errorResponse("Failed to build email content.", 500);
  }

  // ── Supabase admin client ───────────────────────────────────────────────────
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return errorResponse("Server configuration error.", 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // ── Log email_events row (status = pending) ─────────────────────────────────
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
    console.error("email_events insert failed:", insertError?.message);
    return errorResponse("Failed to log email event. Email not sent.", 500);
  }

  const eventId = eventRow.id as string;

  // ── Dry run ─────────────────────────────────────────────────────────────────
  if (dry_run) {
    await supabase
      .from("email_events")
      .update({ status: "sent", error_message: "dry_run_no_send", sent_at: new Date().toISOString() })
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

  // ── Postmark token check ────────────────────────────────────────────────────
  const postmarkToken = Deno.env.get("POSTMARK_SERVER_TOKEN");
  if (!postmarkToken) {
    await supabase
      .from("email_events")
      .update({ status: "failed", error_message: "POSTMARK_SERVER_TOKEN is not configured." })
      .eq("id", eventId);
    return errorResponse("Email service is not configured. Contact the administrator.", 500);
  }

  const fromEmail = Deno.env.get("POSTMARK_FROM_EMAIL") ?? "hello@meintoday.com";
  const messageStream = Deno.env.get("POSTMARK_MESSAGE_STREAM");

  // ── Send via Postmark /email with server-generated content ──────────────────
  // Subject, HtmlBody, TextBody, and From are always generated server-side.
  // No caller-supplied values reach the Postmark payload.
  const postmarkPayload: Record<string, unknown> = {
    From: fromEmail,
    To: recipient_email,
    Subject: emailContent.subject,
    HtmlBody: emailContent.htmlBody,
    TextBody: emailContent.textBody,
  };

  if (messageStream) {
    postmarkPayload.MessageStream = messageStream;
  }

  let postmarkResponse: Response;
  try {
    postmarkResponse = await fetch("https://api.postmarkapp.com/email", {
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
    const postmarkMessage = (postmarkData.Message as string | undefined) ?? "Unknown error from email provider.";
    console.error("Postmark error:", postmarkResponse.status, postmarkMessage);
    await supabase
      .from("email_events")
      .update({
        status: "failed",
        error_message: `Postmark error ${postmarkResponse.status}: ${postmarkMessage}`,
      })
      .eq("id", eventId);
    return errorResponse("Failed to send email. The issue has been logged.", 500);
  }

  // ── Success ─────────────────────────────────────────────────────────────────
  const messageId = (postmarkData.MessageID as string | undefined) ?? null;

  await supabase
    .from("email_events")
    .update({ status: "sent", postmark_message_id: messageId, sent_at: new Date().toISOString() })
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
