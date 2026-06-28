-- Phase 3: Explicit GRANTs for public-form tables
-- join_interests and contact_messages were created via migration and lack
-- explicit table-level GRANTs. The RLS INSERT policies reference anon/authenticated
-- but PostgreSQL also requires the table-level GRANT privilege.
-- These are additive — no existing data or policies are changed.

GRANT INSERT                                    ON join_interests   TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE            ON join_interests   TO authenticated;

GRANT INSERT                                    ON contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE            ON contact_messages TO authenticated;
