import type { Submission, ConsentRequest, StoryCategory } from './supabase'

export const PUBLISHABLE_TYPES = ['create', 'speak', 'build', 'represent', 'feature'] as const
export type PublishableType = typeof PUBLISHABLE_TYPES[number]

export const SUBMISSION_TYPE_TO_CATEGORY: Record<string, StoryCategory> = {
  create:    'creative_submissions',
  speak:     'youth_stories',
  build:     'youth_stories',
  represent: 'youth_stories',
  feature:   'youth_stories',
}

export const STORY_CATEGORY_LABELS: Record<StoryCategory, string> = {
  future_self_letters: 'Future Me Letter',
  mein_mover_videos:   'Mover Video',
  youth_stories:       'Youth Voice',
  creative_submissions:'Creative Work',
  art_gallery:         'Art Gallery',
  writing:             'Writing',
  behind_the_scenes:   'Behind the Movement',
  merch_drops:         'Merch Drop',
}

export function derivePublicDisplayName(sub: Submission): string {
  if (sub.public_display_name?.trim()) return sub.public_display_name.trim()
  if (sub.display_name?.trim()) return sub.display_name.trim()
  const firstName = sub.name?.split(' ')[0]?.trim()
  if (firstName) return firstName
  return 'Mein Mover'
}

export function derivePublicTitle(sub: Submission): string {
  if (sub.title?.trim()) return sub.title.trim()
  return `A move from ${derivePublicDisplayName(sub)}`
}

export function derivePublicExcerpt(sub: Submission): string {
  const content = sub.content ?? ''
  return content.length > 600 ? content.slice(0, 600).trimEnd() + '…' : content
}

export interface PublishEligibility {
  eligible: boolean
  reason: string | null
  consentBlocked: boolean
  consentStatus: string | null
}

export function checkPublishEligibility(
  sub: Submission,
  consentReq: ConsentRequest | null | undefined
): PublishEligibility {
  if (!(PUBLISHABLE_TYPES as readonly string[]).includes(sub.type)) {
    return {
      eligible: false,
      reason: `Submission type '${sub.type}' cannot be published to The Wall.`,
      consentBlocked: false,
      consentStatus: null,
    }
  }

  if (sub.status !== 'approved') {
    const readableStatus = sub.status.replace(/_/g, ' ')
    return {
      eligible: false,
      reason: `Submission must be approved before publishing. Current status: ${readableStatus}.`,
      consentBlocked: false,
      consentStatus: null,
    }
  }

  if (sub.is_under_18 || sub.consent_required) {
    const status = consentReq?.status ?? 'none'
    if (status !== 'approved') {
      const messages: Record<string, string> = {
        none:      'Approved parent/guardian consent is required before this can be published.',
        pending:   'Consent request has not been sent yet.',
        sent:      'Consent request is pending — waiting for guardian response.',
        declined:  'Consent was declined. This submission cannot be published.',
        withdrawn: 'Consent was withdrawn. A new consent request is needed.',
      }
      return {
        eligible: false,
        reason: messages[status] ?? 'Guardian consent is required but not yet approved.',
        consentBlocked: true,
        consentStatus: status,
      }
    }
    if (!consentReq?.signed_name) {
      return {
        eligible: false,
        reason: 'Consent record is incomplete — missing guardian signature.',
        consentBlocked: true,
        consentStatus: 'approved',
      }
    }
  }

  return {
    eligible: true,
    reason: null,
    consentBlocked: false,
    consentStatus: consentReq?.status ?? null,
  }
}
