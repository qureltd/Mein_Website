ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_type_check;
ALTER TABLE submissions ADD CONSTRAINT submissions_type_check
  CHECK (type IN ('create','speak','build','represent','feature','school','partner','contact','future_me'));
