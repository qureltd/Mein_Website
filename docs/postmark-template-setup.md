# Mein Email Setup Guide

Mein sends transactional email via [Postmark](https://postmarkapp.com).

Templates are generated **server-side** in the `send-email` Edge Function.  
**No templates need to be created in the Postmark dashboard.** You only need a Postmark server with a verified sender address.

---

## Required Environment Variables

Set these as Supabase Edge Function secrets:

| Variable | Description |
|---|---|
| `POSTMARK_SERVER_TOKEN` | Your Postmark server API token |
| `POSTMARK_FROM_EMAIL` | Verified sender address — e.g. `hello@meintoday.com` |
| `POSTMARK_MESSAGE_STREAM` | Message stream ID — use `outbound` for transactional emails |
| `SITE_URL` | Public site URL — e.g. `https://mein.world` |
| `ADMIN_ALERT_EMAIL` | Email address to receive admin alert emails |

> **Warning:** Never use the broadcast stream for transactional consent or submission emails. Use `outbound` (Postmark default) or a dedicated transactional stream.

---

## Architecture

The `send-email` Edge Function:

1. Accepts `email_type`, `recipient_email`, `recipient_name`, and `template_data` from internal callers only.
2. Resolves the internal tracking key (`template_alias`) from a fixed server-side map.
3. Calls `buildEmail(email_type, vars)` to generate `Subject`, `HtmlBody`, and `TextBody` entirely in code.
4. Sends via Postmark `/email` (not `/email/withTemplate` — no Postmark templates are used).
5. Logs the result to `email_events`.

The public client can never supply `Subject`, `HtmlBody`, `TextBody`, or `From`. All email content is fixed in code.

---

## Internal Tracking Keys

These values are stored in `email_events.template_alias` for audit and filtering.  
They are internal identifiers — they do not correspond to any Postmark dashboard object.

| email_type | template_alias | Audience | Triggered by |
|---|---|---|---|
| `submission_received` | `mein-submission-received` | Youth | `submit-submission` |
| `future_me_received` | `mein-future-me-received` | Youth | `submit-submission` |
| `contact_confirmation` | `mein-contact-confirmation` | Adult | `submit-contact` |
| `school_enquiry_confirmation` | `mein-school-enquiry-confirmation` | Adult | `submit-contact` |
| `drop_signup_confirmation` | `mein-drop-signup-confirmation` | Youth/adult | `submit-contact` |
| `consent_request` | `mein-consent-request` | Guardian | Admin UI (`AdminSubmissionDetailPage`) |
| `consent_confirmation` | `mein-consent-confirmation` | Guardian | Not yet triggered (template ready) |
| `consent_declined` | `mein-consent-declined` | Guardian | Not yet triggered (template ready) |
| `submission_approved` | `mein-submission-approved` | Youth | Not yet triggered (template ready) |
| `submission_published` | `mein-submission-published` | Youth | Not yet triggered (template ready) |
| `admin_new_submission` | `mein-admin-new-submission` | Admin | `submit-submission` |
| `admin_new_contact` | `mein-admin-new-contact` | Admin | `submit-contact` |
| `join_confirmation` | `mein-join-confirmation` | Adult | Not yet triggered (JoinPage has no form) |
| `drop_launch_notification` | `mein-drop-launch-notification` | Youth/adult | Not yet triggered (prepared for future drop) |

---

## Template Variables Reference

Variables are passed as `template_data` by the caller. All are optional unless marked required.

### `submission_received`
| Variable | Required | Notes |
|---|---|---|
| `first_name` | No | Used in greeting |
| `site_url` | No | CTA link — defaults to `https://mein.world` |

### `future_me_received`
| Variable | Required | Notes |
|---|---|---|
| `first_name` | No | Used in greeting |
| `make_move_url` | No | CTA link — defaults to `/make-your-move` |

### `contact_confirmation`
| Variable | Required | Notes |
|---|---|---|
| `first_name` | No | Used in greeting |
| `site_url` | No | CTA link — defaults to `https://mein.world` |

### `school_enquiry_confirmation`
| Variable | Required | Notes |
|---|---|---|
| `first_name` | No | Used in greeting |
| `why_url` | No | CTA link — defaults to `/why-this-matters` |

### `drop_signup_confirmation`
| Variable | Required | Notes |
|---|---|---|
| `first_name` | No | Used in greeting |
| `shop_url` | No | CTA link — defaults to `/shop` |

### `consent_request`
| Variable | Required | Notes |
|---|---|---|
| `recipient_name` | No | Guardian name — passed as top-level field, not in `template_data` |
| `submitter_name` | No | Young person's display name — defaults to "a young person" |
| `consent_link` | Yes | Secure consent URL including token. Also accepts `consent_url` as fallback. |
| `consent_scope` | No | Description of what consent covers — shown as a callout block |

### `consent_confirmation` / `consent_declined`
| Variable | Required | Notes |
|---|---|---|
| `recipient_name` | No | Guardian name — passed as top-level field |
| `contact_url` | No | CTA link — defaults to `/contact` |

### `submission_approved`
| Variable | Required | Notes |
|---|---|---|
| `first_name` | No | Used in greeting |
| `wall_url` | No | CTA link — defaults to `/stories` |

### `submission_published`
| Variable | Required | Notes |
|---|---|---|
| `first_name` | No | Used in greeting |
| `story_url` | No | Direct link to the published story |
| `wall_url` | No | Link to The Wall — defaults to `/stories` |

### `admin_new_submission`
| Variable | Required | Notes |
|---|---|---|
| `admin_submission_url` | Yes | Direct link to submission in admin |
| `submitter_name` | No | Shown in meta row if present |
| `submission_type` | No | Shown in meta row if present |

### `admin_new_contact`
| Variable | Required | Notes |
|---|---|---|
| `admin_contact_url` | Yes | Direct link to message in admin |
| `sender_name` | No | Shown in meta row if present |
| `contact_type` | No | Shown in meta row if present |

### `join_confirmation`
| Variable | Required | Notes |
|---|---|---|
| `first_name` | No | Used in greeting |
| `start_url` | No | CTA link — defaults to `https://mein.world` |

### `drop_launch_notification`
| Variable | Required | Notes |
|---|---|---|
| `first_name` | No | Used in greeting |
| `shop_url` | No | CTA link — defaults to `/shop` |
| `drop_name` | No | Name of the drop, e.g. "Drop 001" — defaults to "The drop" |

---

## Greeting and Signature Rules

These are enforced in code in `buildEmail()`. Reference only.

### Youth-facing templates
```
Hey {first_name},
```
or if no name:
```
Hey Mein Builder,
```

Signature:
```
Keep moving,
Eva
Co-Creator, Mein
Live your future today.
```

### Adult / guardian / admin-facing templates
```
Hello {first_name},
```
or if no name:
```
Hello,
```

Signature:
```
Warmly,
Eva
Co-Creator, Mein
Live your future today.
```

> Do NOT use "Co-Founder". Use **Co-Creator, Mein**.

---

## Brand Styles (applied in code)

```
Background:       #F5F8FF  (pale blue)
Card background:  #FFFFFF
Card border:      #E5E7EB
Primary text:     #111111  (charcoal)
Muted text:       #6B7280
Primary blue:     #2F6BFF  (Electric Blue)
Gold accent:      #F4B400
Button bg:        #2F6BFF
Button text:      #FFFFFF
Button radius:    8px
Font:             system-ui, sans-serif
```

---

## Testing

### Dry run (no email sent, event logged)

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

A dry run logs to `email_events` with `status: sent` and `error_message: dry_run_no_send` without contacting Postmark.

### Dry-run payloads for all 14 email types

Replace `<url>` and `test@example.com` in the curl command above.

**submission_received**
```json
{ "email_type": "submission_received", "recipient_email": "test@example.com", "template_data": { "first_name": "Jordan", "site_url": "https://mein.world" }, "dry_run": true }
```

**future_me_received**
```json
{ "email_type": "future_me_received", "recipient_email": "test@example.com", "template_data": { "first_name": "Jordan", "make_move_url": "https://mein.world/make-your-move" }, "dry_run": true }
```

**contact_confirmation**
```json
{ "email_type": "contact_confirmation", "recipient_email": "test@example.com", "template_data": { "first_name": "Sam", "site_url": "https://mein.world" }, "dry_run": true }
```

**school_enquiry_confirmation**
```json
{ "email_type": "school_enquiry_confirmation", "recipient_email": "test@example.com", "template_data": { "first_name": "Alex", "why_url": "https://mein.world/why-this-matters" }, "dry_run": true }
```

**drop_signup_confirmation**
```json
{ "email_type": "drop_signup_confirmation", "recipient_email": "test@example.com", "template_data": { "shop_url": "https://mein.world/shop" }, "dry_run": true }
```

**consent_request**
```json
{ "email_type": "consent_request", "recipient_email": "guardian@example.com", "recipient_name": "Sarah Smith", "template_data": { "submitter_name": "Jordan", "consent_link": "https://mein.world/consent/test-token-here", "consent_scope": "Display submission content and name on the Mein platform." }, "dry_run": true }
```

**consent_confirmation**
```json
{ "email_type": "consent_confirmation", "recipient_email": "guardian@example.com", "recipient_name": "Sarah Smith", "template_data": { "contact_url": "https://mein.world/contact" }, "dry_run": true }
```

**consent_declined**
```json
{ "email_type": "consent_declined", "recipient_email": "guardian@example.com", "recipient_name": "Sarah Smith", "template_data": { "contact_url": "https://mein.world/contact" }, "dry_run": true }
```

**submission_approved**
```json
{ "email_type": "submission_approved", "recipient_email": "test@example.com", "template_data": { "first_name": "Jordan", "wall_url": "https://mein.world/stories" }, "dry_run": true }
```

**submission_published**
```json
{ "email_type": "submission_published", "recipient_email": "test@example.com", "template_data": { "first_name": "Jordan", "story_url": "https://mein.world/stories/abc123", "wall_url": "https://mein.world/stories" }, "dry_run": true }
```

**admin_new_submission**
```json
{ "email_type": "admin_new_submission", "recipient_email": "admin@example.com", "template_data": { "admin_submission_url": "https://mein.world/admin/submissions/abc123", "submitter_name": "Jordan", "submission_type": "create" }, "dry_run": true }
```

**admin_new_contact**
```json
{ "email_type": "admin_new_contact", "recipient_email": "admin@example.com", "template_data": { "admin_contact_url": "https://mein.world/admin/contact", "sender_name": "Sam", "contact_type": "school" }, "dry_run": true }
```

**join_confirmation**
```json
{ "email_type": "join_confirmation", "recipient_email": "test@example.com", "template_data": { "first_name": "Sam", "start_url": "https://mein.world" }, "dry_run": true }
```

**drop_launch_notification**
```json
{ "email_type": "drop_launch_notification", "recipient_email": "test@example.com", "template_data": { "first_name": "Jordan", "shop_url": "https://mein.world/shop", "drop_name": "Drop 001" }, "dry_run": true }
```

---

## Checklist Before Launch

- [ ] `POSTMARK_SERVER_TOKEN` secret is set
- [ ] `POSTMARK_FROM_EMAIL` is a verified Postmark sender
- [ ] `POSTMARK_MESSAGE_STREAM` is set to `outbound`
- [ ] `SITE_URL` is set to the live domain
- [ ] `ADMIN_ALERT_EMAIL` is set for submission/contact alerts
- [ ] All 14 email types dry-run tested (check `email_events` for `status: sent`)
- [ ] Each actively triggered type real-send tested to a test address
- [ ] Consent request template end-to-end tested with a real guardian email and real consent link
