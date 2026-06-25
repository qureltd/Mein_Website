-- Submissions table: all youth/partner/contact submissions
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_name TEXT,
  email TEXT NOT NULL,
  age INTEGER,
  type TEXT NOT NULL CHECK (type IN ('create','speak','build','represent','feature','school','partner','contact')),
  title TEXT,
  content TEXT NOT NULL,
  media_url TEXT,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received','under_review','needs_consent','approved','not_approved','published','archived')),
  is_under_18 BOOLEAN NOT NULL DEFAULT FALSE,
  guardian_email TEXT,
  guardian_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stories table: published content shown on The Wall
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL CHECK (category IN ('future_self_letters','mein_mover_videos','youth_stories','creative_submissions','art_gallery','writing','behind_the_scenes','merch_drops')),
  author_display_name TEXT NOT NULL,
  media_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Consent requests table: guardian consent for under-18 submissions
CREATE TABLE IF NOT EXISTS consent_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  guardian_email TEXT NOT NULL,
  consent_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on submissions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Submissions: anyone can insert; no public read (privacy); admins via service role
CREATE POLICY "insert_submissions" ON submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "select_own_submission_by_email" ON submissions FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "update_submissions_authenticated" ON submissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_submissions_authenticated" ON submissions FOR DELETE
  TO authenticated USING (true);

-- Stories: public read for published stories
CREATE POLICY "select_published_stories" ON stories FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_stories" ON stories FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "update_stories" ON stories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_stories" ON stories FOR DELETE
  TO authenticated USING (true);

-- Consent requests: insert by anyone; read/update by authenticated
CREATE POLICY "insert_consent_requests" ON consent_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "select_consent_requests" ON consent_requests FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "update_consent_requests" ON consent_requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Admin users: authenticated only
CREATE POLICY "select_admin_users" ON admin_users FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_admin_users" ON admin_users FOR INSERT
  TO authenticated WITH CHECK (true);
