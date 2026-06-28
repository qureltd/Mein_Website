-- ============================================================
-- Phase 1: Foundation Database Additions
-- All new tables, additive columns, indexes, triggers, RLS.
-- Additive only — no existing tables dropped, no data lost.
-- ============================================================


-- ── ADDITIVE COLUMNS ON EXISTING TABLES ──────────────────────

-- submissions: admin/workflow fields
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS admin_notes        TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason   TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS published_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_scope      TEXT,
  ADD COLUMN IF NOT EXISTS public_display_name TEXT;

-- stories: admin/workflow fields
-- Note: published_at already exists (NOT NULL DEFAULT now()) — not added
ALTER TABLE stories
  ADD COLUMN IF NOT EXISTS sort_order     INT         NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS admin_notes    TEXT,
  ADD COLUMN IF NOT EXISTS unpublished_at TIMESTAMPTZ;

-- consent_requests: extended consent tracking
ALTER TABLE consent_requests
  ADD COLUMN IF NOT EXISTS consent_type         TEXT[],
  ADD COLUMN IF NOT EXISTS consent_scope        TEXT,
  ADD COLUMN IF NOT EXISTS signed_name          TEXT,
  ADD COLUMN IF NOT EXISTS consent_text_version TEXT,
  ADD COLUMN IF NOT EXISTS withdrawn_at         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS admin_notes          TEXT,
  ADD COLUMN IF NOT EXISTS responded_ip         TEXT;

-- admin_users: roles and profile
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS role       TEXT NOT NULL DEFAULT 'super_admin'
                                      CHECK (role IN ('super_admin','content_reviewer','consent_manager','shop_manager','viewer')),
  ADD COLUMN IF NOT EXISTS full_name  TEXT,
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;


-- ── TRIGGERS ────────────────────────────────────────────────
-- Reuse the existing update_updated_at() function from Phase 0.

-- stories: add updated_at trigger
CREATE TRIGGER stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- consent_requests: add updated_at (no updated_at column yet — skip; Phase 5 can add if needed)
-- admin_users: no updated_at column — skip


-- ── NEW TABLE: join_interests ────────────────────────────────
CREATE TABLE join_interests (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT,
  email                 TEXT        NOT NULL,
  path                  TEXT        NOT NULL
                          CHECK (path IN ('young_person','parent_guardian','creator','school_partner','supporter')),
  age_range             TEXT,
  location              TEXT,
  interests             TEXT[],
  parent_guardian_email TEXT,
  consent_required      BOOLEAN     NOT NULL DEFAULT FALSE,
  consent_status        TEXT        NOT NULL DEFAULT 'not_required'
                          CHECK (consent_status IN ('not_required','required','pending','received','declined')),
  status                TEXT        NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new','reviewed','contacted','followed_up','archived')),
  admin_notes           TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE join_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "join_interests_insert_anon"    ON join_interests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "join_interests_select_admin"   ON join_interests FOR SELECT TO authenticated USING (true);
CREATE POLICY "join_interests_update_admin"   ON join_interests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "join_interests_delete_admin"   ON join_interests FOR DELETE TO authenticated USING (true);

CREATE TRIGGER join_interests_updated_at
  BEFORE UPDATE ON join_interests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_join_interests_email      ON join_interests (email);
CREATE INDEX idx_join_interests_path       ON join_interests (path);
CREATE INDEX idx_join_interests_status     ON join_interests (status);
CREATE INDEX idx_join_interests_created_at ON join_interests (created_at DESC);


-- ── NEW TABLE: contact_messages ──────────────────────────────
CREATE TABLE contact_messages (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_type TEXT        NOT NULL DEFAULT 'general'
                 CHECK (contact_type IN ('young_person','parent','school','organisation','creator','shop','general')),
  name         TEXT,
  email        TEXT        NOT NULL,
  subject      TEXT,
  message      TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'new'
                 CHECK (status IN ('new','read','in_progress','resolved','archived')),
  admin_notes  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_messages_insert_anon"   ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact_messages_select_admin"  ON contact_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "contact_messages_update_admin"  ON contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "contact_messages_delete_admin"  ON contact_messages FOR DELETE TO authenticated USING (true);

CREATE TRIGGER contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_contact_messages_contact_type ON contact_messages (contact_type);
CREATE INDEX idx_contact_messages_status       ON contact_messages (status);
CREATE INDEX idx_contact_messages_created_at   ON contact_messages (created_at DESC);


-- ── NEW TABLE: shop_drops ────────────────────────────────────
-- hero_product_id FK to shop_products added after shop_products is created below.
CREATE TABLE shop_drops (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  description     TEXT,
  status          TEXT        NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','preview','active','closed','archived')),
  launch_date     TIMESTAMPTZ,
  featured        BOOLEAN     NOT NULL DEFAULT FALSE,
  hero_product_id UUID,       -- FK added after shop_products exists
  sort_order      INT         NOT NULL DEFAULT 0,
  visible         BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE shop_drops ENABLE ROW LEVEL SECURITY;

-- Public: only visible drops
CREATE POLICY "shop_drops_select_public"  ON shop_drops FOR SELECT TO anon      USING (visible = true);
CREATE POLICY "shop_drops_select_admin"   ON shop_drops FOR SELECT TO authenticated USING (true);
CREATE POLICY "shop_drops_insert_admin"   ON shop_drops FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "shop_drops_update_admin"   ON shop_drops FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "shop_drops_delete_admin"   ON shop_drops FOR DELETE TO authenticated USING (true);

CREATE TRIGGER shop_drops_updated_at
  BEFORE UPDATE ON shop_drops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_shop_drops_slug     ON shop_drops (slug);
CREATE INDEX idx_shop_drops_status   ON shop_drops (status);
CREATE INDEX idx_shop_drops_visible  ON shop_drops (visible);
CREATE INDEX idx_shop_drops_featured ON shop_drops (featured);


-- ── NEW TABLE: shop_products ─────────────────────────────────
CREATE TABLE shop_products (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id              UUID        REFERENCES shop_drops(id) ON DELETE SET NULL,
  name                 TEXT        NOT NULL,
  slug                 TEXT        NOT NULL UNIQUE,
  short_description    TEXT,
  full_description     TEXT,
  product_type         TEXT,
  status               TEXT        NOT NULL DEFAULT 'coming_soon'
                         CHECK (status IN ('coming_soon','live','sold_out','hidden','archived')),
  price_display        TEXT,
  shopify_url          TEXT,
  gelato_url           TEXT,
  printful_url         TEXT,
  external_product_url TEXT,
  image_url            TEXT,
  image_alt            TEXT,
  -- contain is the correct default: product mockup compositions must not be cropped
  image_fit            TEXT        NOT NULL DEFAULT 'contain',
  image_bg             TEXT,
  image_scale          TEXT,
  featured             BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order           INT         NOT NULL DEFAULT 0,
  visible              BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shop_products_select_public"  ON shop_products FOR SELECT TO anon      USING (visible = true);
CREATE POLICY "shop_products_select_admin"   ON shop_products FOR SELECT TO authenticated USING (true);
CREATE POLICY "shop_products_insert_admin"   ON shop_products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "shop_products_update_admin"   ON shop_products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "shop_products_delete_admin"   ON shop_products FOR DELETE TO authenticated USING (true);

CREATE TRIGGER shop_products_updated_at
  BEFORE UPDATE ON shop_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_shop_products_slug       ON shop_products (slug);
CREATE INDEX idx_shop_products_drop_id    ON shop_products (drop_id);
CREATE INDEX idx_shop_products_status     ON shop_products (status);
CREATE INDEX idx_shop_products_visible    ON shop_products (visible);
CREATE INDEX idx_shop_products_featured   ON shop_products (featured);
CREATE INDEX idx_shop_products_sort_order ON shop_products (sort_order);


-- ── FK: shop_drops.hero_product_id → shop_products ──────────
-- Both tables now exist. Add the deferred FK safely.
ALTER TABLE shop_drops
  ADD CONSTRAINT fk_shop_drops_hero_product
  FOREIGN KEY (hero_product_id) REFERENCES shop_products(id) ON DELETE SET NULL;


-- ── NEW TABLE: email_events ──────────────────────────────────
CREATE TABLE email_events (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email      TEXT        NOT NULL,
  recipient_name       TEXT,
  email_type           TEXT        NOT NULL
                         CHECK (email_type IN (
                           'consent_request','consent_confirmation','consent_declined',
                           'submission_received','submission_approved','submission_published',
                           'contact_confirmation','admin_new_contact','admin_new_submission',
                           'join_confirmation','drop_signup_confirmation','drop_launch_notification'
                         )),
  template_alias       TEXT,
  related_table        TEXT,
  related_id           UUID,
  postmark_message_id  TEXT,
  status               TEXT        NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','sent','failed','bounced')),
  error_message        TEXT,
  sent_at              TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

-- No anon access. Admin only.
CREATE POLICY "email_events_select_admin" ON email_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "email_events_insert_admin" ON email_events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "email_events_update_admin" ON email_events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX idx_email_events_recipient_email          ON email_events (recipient_email);
CREATE INDEX idx_email_events_email_type               ON email_events (email_type);
CREATE INDEX idx_email_events_status                   ON email_events (status);
CREATE INDEX idx_email_events_related                  ON email_events (related_table, related_id);


-- ── NEW TABLE: media_assets ──────────────────────────────────
CREATE TABLE media_assets (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url          TEXT,
  file_path         TEXT        NOT NULL,
  file_type         TEXT,
  mime_type         TEXT,
  original_filename TEXT,
  uploaded_by       UUID,
  usage_type        TEXT
                      CHECK (usage_type IN (
                        'submission_image','submission_video','product_mockup',
                        'wall_thumbnail','hero_image','consent_attachment'
                      )),
  related_table     TEXT,
  related_id        UUID,
  alt_text          TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- No anon access. Public display happens via public storage bucket URLs, not this table.
CREATE POLICY "media_assets_select_admin" ON media_assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "media_assets_insert_admin" ON media_assets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "media_assets_update_admin" ON media_assets FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "media_assets_delete_admin" ON media_assets FOR DELETE TO authenticated USING (true);

CREATE INDEX idx_media_assets_usage_type ON media_assets (usage_type);
CREATE INDEX idx_media_assets_related    ON media_assets (related_table, related_id);


-- ── NEW TABLE: audit_logs ────────────────────────────────────
CREATE TABLE audit_logs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id        UUID,       -- nullable: allows system-generated entries
  action          TEXT        NOT NULL
                    CHECK (action IN (
                      'submission_reviewed','consent_requested','consent_received',
                      'content_published','content_rejected','content_unpublished',
                      'product_created','product_updated','product_published',
                      'message_resolved','join_reviewed','consent_withdrawn'
                    )),
  entity_type     TEXT,
  entity_id       UUID,
  previous_status TEXT,
  new_status      TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- No anon access. Admin can SELECT and INSERT; no UPDATE/DELETE (logs are immutable).
CREATE POLICY "audit_logs_select_admin" ON audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "audit_logs_insert_admin" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX idx_audit_logs_admin_id     ON audit_logs (admin_id);
CREATE INDEX idx_audit_logs_action       ON audit_logs (action);
CREATE INDEX idx_audit_logs_entity       ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at   ON audit_logs (created_at DESC);
