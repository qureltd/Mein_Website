
-- Phase 9B: Add new email types to email_events CHECK constraint
-- Drops old constraint and replaces with expanded set

ALTER TABLE email_events
  DROP CONSTRAINT IF EXISTS email_events_email_type_check;

ALTER TABLE email_events
  ADD CONSTRAINT email_events_email_type_check CHECK (email_type IN (
    'consent_request',
    'consent_confirmation',
    'consent_declined',
    'submission_received',
    'future_me_received',
    'submission_approved',
    'submission_published',
    'contact_confirmation',
    'school_enquiry_confirmation',
    'admin_new_contact',
    'admin_new_submission',
    'join_confirmation',
    'drop_signup_confirmation',
    'drop_launch_notification'
  ));
