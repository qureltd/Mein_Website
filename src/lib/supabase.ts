import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type SubmissionType = 'create' | 'speak' | 'build' | 'represent' | 'feature' | 'school' | 'partner' | 'contact' | 'future_me'
export type SubmissionStatus = 'received' | 'under_review' | 'needs_consent' | 'consent_sent' | 'consent_received' | 'approved' | 'not_approved' | 'published' | 'archived'
export type StoryCategory = 'future_self_letters' | 'mein_mover_videos' | 'youth_stories' | 'creative_submissions' | 'art_gallery' | 'writing' | 'behind_the_scenes' | 'merch_drops'

export interface Submission {
  id: string
  name: string
  display_name: string | null
  email: string
  age: number | null
  type: SubmissionType
  title: string | null
  content: string
  media_url: string | null
  status: SubmissionStatus
  is_under_18: boolean
  guardian_email: string | null
  guardian_name: string | null
  admin_notes: string | null
  rejection_reason: string | null
  reviewed_at: string | null
  published_at: string | null
  consent_scope: string | null
  consent_required: boolean
  public_display_name: string | null
  created_at: string
  updated_at: string
}

export interface Story {
  id: string
  submission_id: string | null
  title: string
  excerpt: string | null
  category: StoryCategory
  author_display_name: string
  media_url: string | null
  featured: boolean
  published_at: string
  sort_order: number
  created_at: string
  updated_at: string
  admin_notes: string | null
  unpublished_at: string | null
}

export interface ConsentRequest {
  id: string
  submission_id: string
  guardian_email: string
  consent_token: string
  status: 'pending' | 'sent' | 'approved' | 'declined' | 'withdrawn'
  consent_type: string[] | null
  consent_scope: string | null
  signed_name: string | null
  consent_text_version: string | null
  created_at: string
  responded_at: string | null
  withdrawn_at: string | null
  admin_notes: string | null
}

export type ContactMessageStatus = 'new' | 'read' | 'in_progress' | 'waiting' | 'resolved' | 'archived'
export type ContactType = 'young_person' | 'parent' | 'school' | 'organisation' | 'creator' | 'shop' | 'general'
export type Priority = 'low' | 'normal' | 'high' | 'urgent'

export interface ContactMessage {
  id: string
  contact_type: ContactType
  name: string | null
  email: string
  subject: string | null
  message: string
  status: ContactMessageStatus
  admin_notes: string | null
  priority: Priority
  follow_up_required: boolean
  follow_up_date: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}

export type JoinInterestStatus = 'new' | 'reviewed' | 'contacted' | 'invited' | 'active' | 'followed_up' | 'archived'
export type JoinPath = 'young_person' | 'parent_guardian' | 'creator' | 'school_partner' | 'supporter' | 'partner'

export interface JoinInterest {
  id: string
  name: string | null
  email: string
  path: JoinPath
  age_range: string | null
  location: string | null
  interests: string[] | null
  parent_guardian_email: string | null
  consent_required: boolean
  consent_status: 'not_required' | 'required' | 'pending' | 'received' | 'declined'
  status: JoinInterestStatus
  message: string | null
  consented_to_updates: boolean
  admin_notes: string | null
  priority: Priority
  follow_up_required: boolean
  follow_up_date: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export type EmailEventStatus = 'pending' | 'sent' | 'failed' | 'bounced'

export interface EmailEvent {
  id: string
  recipient_email: string
  recipient_name: string | null
  email_type: string
  template_alias: string | null
  related_table: string | null
  related_id: string | null
  postmark_message_id: string | null
  status: EmailEventStatus
  error_message: string | null
  sent_at: string | null
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: 'super_admin' | 'content_reviewer' | 'consent_manager' | 'shop_manager' | 'viewer'
  last_login: string | null
  created_at: string
}

export type ShopProductStatus = 'coming_soon' | 'live' | 'sold_out' | 'hidden' | 'archived'
export type ShopProductPlatform = 'shopify' | 'gelato' | 'printful' | 'external' | 'coming_soon'

export interface ShopProduct {
  id: string
  drop_id: string | null
  name: string
  slug: string
  short_description: string | null
  full_description: string | null
  product_type: string | null
  status: ShopProductStatus
  price_display: string | null
  shopify_url: string | null
  gelato_url: string | null
  printful_url: string | null
  external_product_url: string | null
  external_url: string | null
  external_platform: ShopProductPlatform
  image_url: string | null
  image_alt: string | null
  image_fit: 'contain' | 'cover'
  image_bg: string | null
  image_scale: string | null
  featured: boolean
  visible: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type ShopDropStatus = 'draft' | 'preview' | 'active' | 'closed' | 'archived'

export interface ShopDrop {
  id: string
  name: string
  slug: string
  description: string | null
  status: ShopDropStatus
  launch_date: string | null
  featured: boolean
  hero_product_id: string | null
  visible: boolean
  sort_order: number
  created_at: string
  updated_at: string
}
