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

Status: In progress
Started: 2026-06-28
Completed: —

Changes: (to be filled in after completion)

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
## MEIN Midday Checkpoint — Phase 5 Complete — 2026-06-28

### Branch
feature/mein-phases2-to-10-buildout

### Checkpoint Tag
checkpoint-mein-midday-20260628-phase5-consent-workflow-complete

### Completed Through
Phase 5 — Consent workflow and `/consent/:token` form

### Work Completed Since Start Checkpoint
- Phase 2: Postmark email infrastructure
- Phase 3: Public forms connected to correct tables
- Phase 4: Admin shell, auth, and dashboard structure
- Phase 5: Consent workflow and `/consent/:token` form

### Safety Notes
- Phase 0 security, RLS, admin protection, and route cleanup should remain intact.
- Phase 1 foundation tables and storage buckets should remain intact.
- This checkpoint marks the safe recovery point before moving into Phase 6.
- Do not begin Phase 6 until the current build/checks are confirmed.

### Checks Run
- `npm run build`: [pass/fail/not run]
- `npm run lint`: [pass/fail/not run]
- Manual QA: [summarize]

### Known Issues
- [List any known issues or write “None known at this checkpoint.”]

### Next Phase
Phase 6 — Submission review + Wall publishing workflow