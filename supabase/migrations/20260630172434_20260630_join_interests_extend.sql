ALTER TABLE public.join_interests
  ADD COLUMN IF NOT EXISTS message TEXT,
  ADD COLUMN IF NOT EXISTS consented_to_updates BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.join_interests
  DROP CONSTRAINT IF EXISTS join_interests_path_check;
ALTER TABLE public.join_interests
  ADD CONSTRAINT join_interests_path_check
    CHECK (path IN (
      'young_person', 'parent_guardian', 'creator',
      'school_partner', 'supporter', 'partner'
    ));

GRANT INSERT, SELECT, UPDATE ON public.join_interests TO service_role;
