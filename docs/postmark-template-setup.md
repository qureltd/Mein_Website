# Postmark Template Setup Guide

Mein uses [Postmark](https://postmarkapp.com) for transactional email.  
All templates must be created in your Postmark account **before** emails will send.

---

## Required Environment Variables

Set these in Supabase Edge Function secrets (they are already configured via the Supabase MCP):

| Variable | Description |
|---|---|
| `POSTMARK_SERVER_TOKEN` | Your Postmark server API token |
| `POSTMARK_FROM_EMAIL` | Sender address — e.g. `hello@mein.world` (must be a verified Postmark sender) |
| `POSTMARK_MESSAGE_STREAM` | Message stream ID — use `outbound` for transactional emails |
| `SITE_URL` | Your public site URL — e.g. `https://mein.world` |
| `ADMIN_ALERT_EMAIL` | Email address to receive admin alert emails |

> **Warning:** Never use the broadcast stream for transactional consent or submission emails. Use `outbound` (Postmark default) or a dedicated transactional stream.

---

## Template Aliases

Create exactly these template aliases in Postmark (Dashboard → Templates → New Template → set the alias field):

| Alias | Purpose | Audience |
|---|---|---|
| `mein-submission-received` | Confirms a Make Your Move submission | Youth |
| `mein-future-me-received` | Confirms a Future Me message | Youth |
| `mein-contact-confirmation` | Confirms a contact message | Adult/general |
| `mein-school-enquiry-confirmation` | Confirms a school/org enquiry | Adult/professional |
| `mein-join-confirmation` | Confirms a join interest registration | Adult |
| `mein-drop-signup-confirmation` | Confirms shop notify/early access signup | Youth/adult |
| `mein-drop-launch-notification` | Notifies signups when a drop goes live | Youth/adult |
| `mein-consent-request` | Sends consent link to guardian | Guardian |
| `mein-consent-confirmation` | Confirms consent was recorded | Guardian |
| `mein-consent-declined` | Confirms consent was declined | Guardian |
| `mein-submission-approved` | Notifies submitter of review outcome | Youth |
| `mein-submission-published` | Notifies submitter their story is live | Youth |
| `mein-admin-new-submission` | Alerts admin of a new submission | Admin |
| `mein-admin-new-contact` | Alerts admin of a new contact message | Admin |

---

## Greeting and Signature Rules

### Youth-facing templates
Use:
```
Hey {{first_name}},
```
Or if `first_name` is not available:
```
Hey Mein Builder,
```

**Signature:**
```
Keep moving,
Eva
Co-Creator, Mein
Live your future today.
```

### Adult / guardian / school / partner / admin-facing templates
Use:
```
Hello {{first_name}},
```
Or if `first_name` is not available:
```
Hello,
```

**Signature:**
```
Warmly,
Eva
Co-Creator, Mein
Live your future today.
```

> Do NOT use "Co-Founder". Use **Co-Creator, Mein**.  
> "Mein Builder" is a community phrase for young people, not a title.

---

## Brand Styles

Apply these styles consistently across all templates:

```
Background:      #F5F8FF  (pale blue)
Card background: #FFFFFF
Primary text:    #111111  (charcoal)
Muted text:      #6B7280
Primary blue:    #2F6BFF
Gold accent:     #F4B400
Button bg:       #2F6BFF
Button text:     #FFFFFF
Button radius:   8px
Font:            system-ui, sans-serif (Sora not available in email)
```

**Header text wordmark** (if no hosted logo image available):
```html
<p style="font-size:22px; font-weight:800; color:#111111; letter-spacing:-0.5px; margin:0;">
  Mein
</p>
<p style="font-size:11px; color:#6B7280; margin:4px 0 0 0; letter-spacing:0.5px;">
  Live your future today.
</p>
```

**Footer (all templates):**
```html
<p style="font-size:12px; color:#9CA3AF; text-align:center; margin-top:32px;">
  Mein — Live your future today.<br>
  This email was sent because you interacted with Mein.<br>
  Questions? Contact us at hello@mein.world
</p>
```

---

## Template Specifications

### 1. `mein-submission-received`
**Subject:** We got your move  
**Preview:** Your first move matters. Thanks for sharing it with Mein.

**Template variables:**
```
{{first_name}}       - Optional. Used in greeting.
{{site_url}}         - Link for CTA button.
```

**Body:**
```
{{#if first_name}}Hey {{first_name}},{{else}}Hey Mein Builder,{{/if}}

We got your move — and that matters.

You do not need a perfect plan to begin. You took a step, and the Mein team will review your submission with care.

If your story is a good fit to share publicly, we may follow up about consent and next steps.

Keep moving. Your future starts with moments like this.

[Visit Mein] → {{site_url}}
```

---

### 2. `mein-future-me-received`
**Subject:** Your Future Me message was received  
**Preview:** You gave your future a voice. We got it.

**Template variables:**
```
{{first_name}}       - Optional. Used in greeting.
{{make_move_url}}    - Link to Make Your Move page.
```

**Body:**
```
{{#if first_name}}Hey {{first_name}},{{else}}Hey Mein Builder,{{/if}}

Your Future Me message was received.

That is not just a form. It is a small promise to the person you are becoming.

Take your time. Keep showing up. One move is enough to begin.

[Make another move] → {{make_move_url}}
```

---

### 3. `mein-contact-confirmation`
**Subject:** We got your message  
**Preview:** Thanks for reaching out to Mein.

**Template variables:**
```
{{first_name}}    - Optional. Used in greeting.
{{site_url}}      - Link for CTA button.
```

**Body:**
```
{{#if first_name}}Hello {{first_name}},{{else}}Hello,{{/if}}

Thanks for reaching out.

We got your message and someone from the Mein team will review it.

If your note is about a young person, school, partnership, or collaboration, we will handle it with care.

[Back to Mein] → {{site_url}}
```

---

### 4. `mein-school-enquiry-confirmation`
**Subject:** Thanks for reaching out to Mein  
**Preview:** We received your school or organisation enquiry.

**Template variables:**
```
{{first_name}}    - Optional. Used in greeting.
{{why_url}}       - Link to Why This Matters page.
```

**Body:**
```
{{#if first_name}}Hello {{first_name}},{{else}}Hello,{{/if}}

Thank you for reaching out about Mein.

We built Mein to help young people feel seen, supported, and ready to take their next move.

Someone from our team will review your enquiry and follow up.

[Learn why Mein matters] → {{why_url}}
```

---

### 5. `mein-join-confirmation`
**Subject:** You are in the Mein movement  
**Preview:** Thanks for choosing your way in.

**Template variables:**
```
{{first_name}}    - Optional. Used in greeting.
{{start_url}}     - Link to site homepage or start page.
```

**Body:**
```
{{#if first_name}}Hello {{first_name}},{{else}}Hello,{{/if}}

Welcome to Mein.

Whether you are a young person, parent, creator, school, partner, or supporter, there is room for you here.

Mein is about starting where you are and moving toward who you are becoming.

[Start here] → {{start_url}}
```

---

### 6. `mein-drop-signup-confirmation`
**Subject:** You are on the Drop 001 list  
**Preview:** We will let you know when the first Mein drop is ready.

**Template variables:**
```
{{first_name}}    - Optional. Used in greeting.
{{shop_url}}      - Link to Shop page.
```

**Body:**
```
{{#if first_name}}Hey {{first_name}},{{else}}Hey Mein Builder,{{/if}}

You are on the list for Drop 001.

Mein merch is not just something to wear. It is a reminder to live your future today.

We will let you know when the drop is ready.

[Visit the shop] → {{shop_url}}
```

---

### 7. `mein-drop-launch-notification`
**Subject:** The drop is here  
**Preview:** The Mein drop you signed up for is now live.

**Template variables:**
```
{{first_name}}    - Optional. Used in greeting.
{{shop_url}}      - Link to Shop page.
{{drop_name}}     - Name of the drop (e.g. "Drop 001").
```

**Body:**
```
{{#if first_name}}Hey {{first_name}},{{else}}Hey Mein Builder,{{/if}}

{{drop_name}} is here.

The drop you signed up for is now live. Head to the shop to see it.

[Shop now] → {{shop_url}}
```

---

### 8. `mein-consent-request`
**Subject:** Parent/guardian consent requested for Mein  
**Preview:** Please review and respond to a Mein consent request.

**Template variables:**
```
{{guardian_name}}     - Guardian's name.
{{submitter_name}}    - Young person's display name.
{{consent_url}}       - Secure consent link (includes token).
{{consent_scope}}     - Optional. Description of what consent covers.
```

**Body:**
```
{{#if guardian_name}}Hello {{guardian_name}},{{else}}Hello,{{/if}}

A young person — {{submitter_name}} — has submitted something to Mein that may be considered for sharing publicly.

Before anything is published, we need your review and consent.

Please open the secure link below to see what is being requested and choose whether to approve or decline.

[Review consent request] → {{consent_url}}

Nothing will be published unless consent is approved and the Mein team completes review.
```

---

### 9. `mein-consent-confirmation`
**Subject:** Consent response received  
**Preview:** Thank you. Your consent response has been recorded.

**Template variables:**
```
{{guardian_name}}    - Guardian's name.
{{contact_url}}      - Link to contact page.
```

**Body:**
```
{{#if guardian_name}}Hello {{guardian_name}},{{else}}Hello,{{/if}}

Thank you. Your consent response has been recorded.

If you approved, the Mein team will complete its review before anything is shared publicly.

If you have questions or need to request removal later, contact us.

[Contact Mein] → {{contact_url}}
```

---

### 10. `mein-consent-declined`
**Subject:** Consent declined  
**Preview:** Your response has been recorded.

**Template variables:**
```
{{guardian_name}}    - Guardian's name.
{{contact_url}}      - Link to contact page.
```

**Body:**
```
{{#if guardian_name}}Hello {{guardian_name}},{{else}}Hello,{{/if}}

Your response has been recorded.

Because consent was declined, the related content will not be published by Mein.

Thank you for reviewing it.

[Contact Mein] → {{contact_url}}
```

---

### 11. `mein-submission-approved`
**Subject:** Your move has been reviewed  
**Preview:** The Mein team reviewed your submission.

**Template variables:**
```
{{first_name}}    - Optional. Used in greeting.
{{wall_url}}      - Link to The Wall page.
```

**Body:**
```
{{#if first_name}}Hey {{first_name}},{{else}}Hey Mein Builder,{{/if}}

The Mein team reviewed your submission.

Your move matters, and we are glad you shared it.

If your story is being considered for The Wall, we will only move forward with the right review and consent steps.

[Visit The Wall] → {{wall_url}}
```

---

### 12. `mein-submission-published`
**Subject:** Your story is live on The Wall  
**Preview:** Your move is now part of the Mein Wall.

**Template variables:**
```
{{first_name}}    - Optional. Used in greeting.
{{story_url}}     - Direct link to the published story.
{{wall_url}}      - Link to The Wall page.
```

**Body:**
```
{{#if first_name}}Hey {{first_name}},{{else}}Hey Mein Builder,{{/if}}

Your story is now live on The Wall.

Thank you for sharing a piece of your journey.

Someone else may see your move and feel brave enough to start too.

[View your story] → {{story_url}}
```

---

### 13. `mein-admin-new-submission`
**Subject:** New Mein submission received  
**Preview:** A new submission is waiting for review.

**Template variables:**
```
{{admin_submission_url}}    - Direct link to the submission in admin.
{{submitter_name}}          - Optional. Submitter's name.
{{submission_type}}         - Optional. Submission type (create, speak, etc.).
```

**Body:**
```
Hello,

A new submission was received and is ready for admin review.

{{#if submitter_name}}Submitter: {{submitter_name}}{{/if}}
{{#if submission_type}}Type: {{submission_type}}{{/if}}

[Review submission] → {{admin_submission_url}}
```

---

### 14. `mein-admin-new-contact`
**Subject:** New Mein contact message  
**Preview:** A new contact message is waiting in admin.

**Template variables:**
```
{{admin_contact_url}}    - Direct link to the message in admin.
{{sender_name}}          - Optional. Sender's name.
{{contact_type}}         - Optional. Contact type.
```

**Body:**
```
Hello,

A new contact message was received.

{{#if sender_name}}From: {{sender_name}}{{/if}}
{{#if contact_type}}Type: {{contact_type}}{{/if}}

[Open contact message] → {{admin_contact_url}}
```

---

## How to Create Templates in Postmark

1. Log in to [postmarkapp.com](https://account.postmarkapp.com)
2. Select your server
3. Go to **Templates** in the left navigation
4. Click **New Template**
5. Choose **Templated** (not Layout-based unless you prefer)
6. Set the **Template Alias** exactly as listed above (e.g. `mein-submission-received`)
7. Fill in Subject, HTML Body, and Text Body
8. Use `{{variable_name}}` for dynamic values
9. Use `{{#if variable_name}}...{{/if}}` for conditional content
10. Save and test with the **Send Test** button

---

## Testing

Use the Supabase Edge Function `dry_run` feature to test without sending:

```bash
curl -X POST https://<your-project>.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer <your-service-role-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "email_type": "submission_received",
    "recipient_email": "test@example.com",
    "recipient_name": "Test User",
    "template_data": { "first_name": "Test", "site_url": "https://mein.world" },
    "dry_run": true
  }'
```

A `dry_run` will log to `email_events` with `status: sent` and `error_message: dry_run_no_send`, without contacting Postmark.

---

## Checklist Before Launch

- [ ] `POSTMARK_SERVER_TOKEN` secret is set
- [ ] `POSTMARK_FROM_EMAIL` is a verified Postmark sender
- [ ] `POSTMARK_MESSAGE_STREAM` is set to `outbound`
- [ ] `SITE_URL` is set to the live domain
- [ ] `ADMIN_ALERT_EMAIL` is set for submission/contact alerts
- [ ] All 14 template aliases created in Postmark dashboard
- [ ] Each template tested with a dry run
- [ ] Each template tested with a real send to a test address
- [ ] Consent request template tested end-to-end with a real guardian email
