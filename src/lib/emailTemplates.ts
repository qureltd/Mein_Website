// Mein transactional email template definitions.
// These mirror the templates that must be created in the Postmark dashboard.
// See docs/postmark-template-setup.md for full HTML templates and setup guide.

export interface EmailTemplateSpec {
  alias: string
  emailType: string
  audience: 'youth' | 'adult' | 'admin' | 'guardian'
  subject: string
  previewText: string
  requiredVars: string[]
  optionalVars?: string[]
}

export const EMAIL_TEMPLATES: Record<string, EmailTemplateSpec> = {

  // ── Submissions ────────────────────────────────────────────────────────────
  submission_received: {
    alias: 'mein-submission-received',
    emailType: 'submission_received',
    audience: 'youth',
    subject: 'We got your move',
    previewText: 'Your first move matters. Thanks for sharing it with Mein.',
    requiredVars: ['site_url'],
    optionalVars: ['first_name', 'submission_type'],
  },

  future_me_received: {
    alias: 'mein-future-me-received',
    emailType: 'future_me_received',
    audience: 'youth',
    subject: 'Your Future Me message was received',
    previewText: 'You gave your future a voice. We got it.',
    requiredVars: ['make_move_url'],
    optionalVars: ['first_name'],
  },

  submission_approved: {
    alias: 'mein-submission-approved',
    emailType: 'submission_approved',
    audience: 'youth',
    subject: 'Your move has been reviewed',
    previewText: 'The Mein team reviewed your submission.',
    requiredVars: ['wall_url'],
    optionalVars: ['first_name'],
  },

  submission_published: {
    alias: 'mein-submission-published',
    emailType: 'submission_published',
    audience: 'youth',
    subject: 'Your story is live on The Wall',
    previewText: 'Your move is now part of the Mein Wall.',
    requiredVars: ['story_url', 'wall_url'],
    optionalVars: ['first_name'],
  },

  // ── Contact ────────────────────────────────────────────────────────────────
  contact_confirmation: {
    alias: 'mein-contact-confirmation',
    emailType: 'contact_confirmation',
    audience: 'adult',
    subject: 'We got your message',
    previewText: 'Thanks for reaching out to Mein.',
    requiredVars: ['site_url'],
    optionalVars: ['first_name'],
  },

  school_enquiry_confirmation: {
    alias: 'mein-school-enquiry-confirmation',
    emailType: 'school_enquiry_confirmation',
    audience: 'adult',
    subject: 'Thanks for reaching out to Mein',
    previewText: 'We received your school or organisation enquiry.',
    requiredVars: ['why_url'],
    optionalVars: ['first_name'],
  },

  // ── Join / Shop ────────────────────────────────────────────────────────────
  join_confirmation: {
    alias: 'mein-join-confirmation',
    emailType: 'join_confirmation',
    audience: 'adult',
    subject: 'You are in the Mein movement',
    previewText: 'Thanks for choosing your way in.',
    requiredVars: ['start_url'],
    optionalVars: ['first_name'],
  },

  drop_signup_confirmation: {
    alias: 'mein-drop-signup-confirmation',
    emailType: 'drop_signup_confirmation',
    audience: 'youth',
    subject: 'You are on the Drop 001 list',
    previewText: 'We will let you know when the first Mein drop is ready.',
    requiredVars: ['shop_url'],
    optionalVars: ['first_name'],
  },

  drop_launch_notification: {
    alias: 'mein-drop-launch-notification',
    emailType: 'drop_launch_notification',
    audience: 'youth',
    subject: 'The drop is here',
    previewText: 'The Mein drop you signed up for is now live.',
    requiredVars: ['shop_url', 'drop_name'],
    optionalVars: ['first_name'],
  },

  // ── Consent ────────────────────────────────────────────────────────────────
  consent_request: {
    alias: 'mein-consent-request',
    emailType: 'consent_request',
    audience: 'guardian',
    subject: 'Parent/guardian consent requested for Mein',
    previewText: 'Please review and respond to a Mein consent request.',
    requiredVars: ['consent_url', 'guardian_name', 'submitter_name'],
    optionalVars: ['consent_scope'],
  },

  consent_confirmation: {
    alias: 'mein-consent-confirmation',
    emailType: 'consent_confirmation',
    audience: 'guardian',
    subject: 'Consent response received',
    previewText: 'Thank you. Your consent response has been recorded.',
    requiredVars: ['contact_url', 'guardian_name'],
    optionalVars: [],
  },

  consent_declined: {
    alias: 'mein-consent-declined',
    emailType: 'consent_declined',
    audience: 'guardian',
    subject: 'Consent declined',
    previewText: 'Your response has been recorded.',
    requiredVars: ['contact_url', 'guardian_name'],
    optionalVars: [],
  },

  // ── Admin ──────────────────────────────────────────────────────────────────
  admin_new_submission: {
    alias: 'mein-admin-new-submission',
    emailType: 'admin_new_submission',
    audience: 'admin',
    subject: 'New Mein submission received',
    previewText: 'A new submission is waiting for review.',
    requiredVars: ['admin_submission_url'],
    optionalVars: ['submitter_name', 'submission_type'],
  },

  admin_new_contact: {
    alias: 'mein-admin-new-contact',
    emailType: 'admin_new_contact',
    audience: 'admin',
    subject: 'New Mein contact message',
    previewText: 'A new contact message is waiting in admin.',
    requiredVars: ['admin_contact_url'],
    optionalVars: ['sender_name', 'contact_type'],
  },
}

// Greeting helpers — used to generate the right greeting in Postmark templates.
// Youth-facing: "Hey {{first_name}}," or "Hey Mein Builder,"
// Adult/guardian/admin-facing: "Hello {{first_name}}," or "Hello,"
export function youthGreeting(firstName?: string): string {
  return firstName ? `Hey ${firstName},` : 'Hey Mein Builder,'
}

export function adultGreeting(firstName?: string): string {
  return firstName ? `Hello ${firstName},` : 'Hello,'
}

// Signature text blocks — embed these in Postmark templates.
export const YOUTH_SIGNATURE = `Keep moving,\nEva\nCo-Creator, Mein\nLive your future today.`
export const ADULT_SIGNATURE = `Warmly,\nEva\nCo-Creator, Mein\nLive your future today.`
