# MEIN Website — Recovery Log

This file tracks phase checkpoints, build status, and safety notes for the MEIN website buildout.
Update this file at the start and end of every phase before moving to the next.

---

## Checkpoint: Start of Day — 2026-06-28

### Git / Branch Status

**Note:** This project has no local `.git` directory as of this checkpoint. The project is managed by
Bolt's internal version control. A GitHub remote has not been connected.

Intended branch target: `feature/mein-phases2-to-10-buildout`

**Required action before implementation begins (manual — cannot be done via code):**
1. Connect the Bolt project to a GitHub repository via the Bolt dashboard if not already done.
2. Create or switch to branch: `feature/mein-phases2-to-10-buildout`
3. After this file is created, commit it with message:
   `Add MEIN start-of-day checkpoint for phases 2 to 10`
4. Create the Git tag:
   `checkpoint-mein-start-20260628-phase2-postmark`
5. Push the branch and tag to remote.

---

### Completed Phases

#### Phase 0 — Emergency Security and Routing Cleanup (Completed 2026-06-28)

Changes made:
- `/admin` protected by `AdminRouteGuard` + Supabase Auth check against `admin_users` table
- `/admin/login` created (`AdminLoginPage.tsx`)
- `/consent/:token` placeholder route created (`ConsentPlaceholderPage.tsx`)
- `/wall` added as canonical route for StoriesPage; `/stories` now redirects to `/wall`
- Route aliases added: `/home` → `/`, `/start-here` → `/`, `/what-is-mein` → `/about`
- `AdminRouteGuard.tsx` created — checks session AND admin_users table email
- RLS fixed: anon cannot SELECT from submissions, consent_requests, or admin_users
- Stories: anon can only SELECT where `published_at IS NOT NULL`
- Public INSERT preserved on submissions for all public forms
- Nav and Footer updated to use `/wall` as canonical Wall link
- Build: clean (pre-existing chunk size warning only)

Files changed in Phase 0:
- `src/App.tsx`
- `src/components/Nav.tsx`
- `src/components/Footer.tsx`
- `src/pages/StoryDetailPage.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/MakeYourMovePage.tsx`
- `src/pages/AdminLoginPage.tsx` (new)
- `src/components/AdminRouteGuard.tsx` (new)
- `src/pages/ConsentPlaceholderPage.tsx` (new)
- `supabase/migrations/20260628045349_20260628_phase0_initial_schema_with_secure_rls.sql` (new, applied)

#### Phase 1 — Foundation Database Tables and Storage Buckets (Completed 2026-06-28)

Changes made:
- 7 new tables created: `join_interests`, `contact_messages`, `shop_drops`, `shop_products`,
  `email_events`, `media_assets`, `audit_logs`
- Additive columns added to existing tables:
  - `submissions`: admin_notes, rejection_reason, reviewed_at, published_at, consent_scope, public_display_name
  - `stories`: sort_order, updated_at, admin_notes, unpublished_at
  - `consent_requests`: consent_type, consent_scope, signed_name, consent_text_version, withdrawn_at, admin_notes, responded_ip
  - `admin_users`: role (with CHECK constraint), full_name, last_login
- RLS applied to all new tables:
  - `join_interests`, `contact_messages`: anon INSERT only; authenticated full CRUD
  - `shop_drops`, `shop_products`: anon SELECT where visible=true only; authenticated full CRUD
  - `email_events`, `media_assets`: authenticated only
  - `audit_logs`: authenticated SELECT + INSERT; no UPDATE/DELETE (immutable)
- FK: `shop_drops.hero_product_id → shop_products.id` (SET NULL on delete)
- FK: `shop_products.drop_id → shop_drops.id` (SET NULL on delete)
- 4 storage buckets created:
  - `submission-media` (private, 50MB, images/video/pdf)
  - `shop-products` (public, 20MB, images)
  - `wall-content` (public, 15MB, images)
  - `consent-documents` (private, 10MB, pdf/images)
- Storage RLS: private buckets admin-only; public buckets allow anon read
- `updated_at` triggers added to: stories, join_interests, contact_messages, shop_drops, shop_products
- Indexes added to all new tables
- Seed data for Drop 001 deferred to Phase 7
- Build: clean (pre-existing chunk size warning only)
- No public page behavior changed

Files changed in Phase 1:
- `supabase/migrations/20260628160540_20260628_phase1_foundation_tables.sql` (new, applied)

---

### Today's Work Range: 2026-06-28

**Starting phase:** Phase 2 — Postmark email infrastructure
**End checkpoint target:** Phase 10 — Final QA / release readiness checkpoint

### Roadmap Status

| Phase | Description | Status |
|---|---|---|
| 0 | Emergency security, RLS, admin protection, route cleanup | Completed |
| 1 | Foundation database tables + storage buckets | Completed |
| 2 | Postmark email infrastructure | Starting |
| 3 | Connect public forms to correct tables | Pending |
| 4 | Admin shell, auth, dashboard structure | Pending |
| 5 | Consent workflow and /consent/:token form | Pending |
| 6 | Submission review + Wall publishing workflow | Pending |
| 7 | Shop product manager + Shopify link-out setup | Pending |
| 8 | Contact messages + members/join interests admin sections | Pending |
| 9 | Hardening, roles, audit logs, exports, QA | Pending |
| 10 | Final QA, release readiness, cleanup, documentation, deployment readiness | Pending |

### Intended Work Today

- Phase 2: Supabase Edge Function for email sending via Postmark; email_events table logging;
  template plan; secret configuration
- Phase 3: Connect MakeYourMovePage, FutureMePage, ContactPage, SchoolsPage forms to correct
  Supabase tables (submissions, contact_messages, join_interests)
- Phase 4: AdminDashboard shell — tab structure, stats overview, navigation; submission inbox;
  role-aware layout
- Phase 5: Consent workflow — /consent/:token reads consent_requests by token (safe lookup);
  guardian approval/decline flow; consent_requests status update
- Phase 6: Submission review workflow — status transitions (received → under_review → approved →
  published); Wall publishing (creates stories row); admin_notes; rejection_reason
- Phase 7: Shop product manager — seed Drop 001 data; admin CRUD for shop_products/shop_drops;
  ShopPage migrated from hardcoded to database-driven
- Phase 8: Contact messages admin section; join interests admin section
- Phase 9: Role enforcement; audit_logs wiring; CSV export; hardening; QA
- Phase 10: Final QA pass; release readiness checklist; documentation update

### Safety Notes — Must Not Break

- `/admin` must remain protected. AdminRouteGuard must not be weakened.
- Phase 0 RLS policies must not be removed or weakened.
- Public forms (Make Your Move, Future Me, Contact, Schools) must continue to work.
- `/wall` must continue to show published stories only.
- Anonymous users must never be able to SELECT submissions, consent_requests, or admin_users.
- `shop_products` and `shop_drops` anon SELECT must remain limited to `visible = true`.
- Storage bucket privacy settings must not be changed (submission-media and consent-documents
  must remain private).
- `audit_logs` must remain INSERT-only (no UPDATE/DELETE policy).
- The `stories.published_at IS NOT NULL` anon filter must not be removed.
- No public page design or copy should be changed unless explicitly scoped in the phase.
- Build must pass after every phase.

---

## Phase Log

### Phase 2 — Postmark Email Infrastructure

Status: Completed
Started: 2026-06-28
Completed: 2026-06-28

Changes:
- Audited existing project: no prior email provider, no prior Edge Functions, no Postmark secret present
- Created Supabase Edge Function: `send-email` (deployed ACTIVE, verifyJWT: true)
  - File: `supabase/functions/send-email/index.ts`
  - Accepts POST with: email_type, recipient_email, recipient_name, template_alias (optional override),
    template_data (optional), related_table (optional), related_id (optional), dry_run (optional)
  - Validates: email_type (against 12-value allowlist), recipient_email format, template resolution
  - Uses SUPABASE_SERVICE_ROLE_KEY (server-side only) to write to email_events table
  - Reads POSTMARK_SERVER_TOKEN from secrets only — never exposed to frontend
  - Reads POSTMARK_FROM_EMAIL (default: hello@mein.world) and POSTMARK_MESSAGE_STREAM from secrets
  - Dry run mode: logs email_events row, skips Postmark call, returns dry_run: true
  - Full send: inserts pending row → calls Postmark template API → updates to sent/failed
  - Stores postmark_message_id on success; stores error_message on failure
  - Returns only safe error messages to callers; internal errors logged via console.error only
  - Missing POSTMARK_SERVER_TOKEN: returns safe 500 and logs failed event
  - Unknown template alias (Postmark 422): surfaces safe template error to caller

Secrets required (to be added via Supabase dashboard or secrets manager):
  - POSTMARK_SERVER_TOKEN — required for live sends; function degrades safely without it
  - POSTMARK_FROM_EMAIL — optional, defaults to hello@mein.world
  - POSTMARK_MESSAGE_STREAM — optional, omitted from Postmark payload if not set
  - ADMIN_NOTIFICATION_EMAIL — reserved for Phase 4/5 use; not used in Phase 2

Email type → template alias map (templates must be created in Postmark dashboard):
  - consent_request          → mein-consent-request
  - consent_confirmation     → mein-consent-confirmation
  - consent_declined         → mein-consent-declined
  - submission_received      → mein-submission-received
  - submission_approved      → mein-submission-approved
  - submission_published     → mein-submission-published
  - contact_confirmation     → mein-contact-confirmation
  - admin_new_contact        → mein-admin-new-contact
  - admin_new_submission     → mein-admin-new-submission
  - join_confirmation        → mein-join-confirmation
  - drop_signup_confirmation → mein-drop-signup-confirmation
  - drop_launch_notification → mein-drop-launch-notification

Security/access:
  - verifyJWT: true — only authenticated callers (admin or trusted server) can invoke
  - Public forms do NOT call send-email directly in Phase 2
  - Arbitrary email dispatch is admin/server-only to prevent abuse

Test (curl dry_run example — requires valid JWT):
  curl -X POST https://bjimkxrangfaiwofrzkf.supabase.co/functions/v1/send-email \
    -H "Authorization: Bearer <admin-jwt>" \
    -H "Content-Type: application/json" \
    -d '{
      "email_type": "submission_received",
      "recipient_email": "test@example.com",
      "recipient_name": "Test Person",
      "template_data": { "submission_type": "future_me" },
      "dry_run": true
    }'

Verification results:
  - send-email deployed ACTIVE in Supabase Edge Functions
  - email_events insert/update cycle tested and confirmed (insert pending → update sent with dry_run marker)
  - No POSTMARK_ string anywhere in frontend src/ code
  - email_events table accepts all fields the function writes
  - Build: clean (pre-existing chunk size warning only)
  - No public page or form behavior changed

Manual Postmark dashboard steps required before live sends:
  1. Create a Postmark account and server at postmarkapp.com
  2. Add sender domain/email (must match POSTMARK_FROM_EMAIL, e.g. hello@mein.world)
  3. Verify sender domain DNS records in Postmark
  4. Create each of the 12 template aliases listed above
  5. Set POSTMARK_SERVER_TOKEN secret in Supabase (dashboard → Settings → Edge Functions → Secrets)
  6. Optionally set POSTMARK_FROM_EMAIL and POSTMARK_MESSAGE_STREAM

---

### Phase 3 — Connect Public Forms to Correct Tables

Status: Pending
Started: —
Completed: —

---

### Phase 4 — Admin Shell, Auth, Dashboard Structure

Status: Pending
Started: —
Completed: —

---

### Phase 5 — Consent Workflow and /consent/:token Form

Status: Pending
Started: —
Completed: —

---

### Phase 6 — Submission Review and Wall Publishing Workflow

Status: Pending
Started: —
Completed: —

---

### Phase 7 — Shop Product Manager and Shopify Link-out Setup

Status: Pending
Started: —
Completed: —

---

### Phase 8 — Contact Messages and Members/Join Interests Admin Sections

Status: Pending
Started: —
Completed: —

---

### Phase 9 — Hardening, Roles, Audit Logs, Exports, QA

Status: Pending
Started: —
Completed: —

---

### Phase 10 — Final QA, Release Readiness, Cleanup, Documentation

Status: Pending
Started: —
Completed: —
