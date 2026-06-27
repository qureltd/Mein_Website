import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type SubmissionType = 'create' | 'speak' | 'build' | 'represent' | 'feature' | 'school' | 'partner' | 'contact' | 'future_me'
export type SubmissionStatus = 'received' | 'under_review' | 'needs_consent' | 'approved' | 'not_approved' | 'published' | 'archived'
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
  created_at: string
  updated_at: string
}

export interface Story {
  id: string
  submission_id: string
  title: string
  excerpt: string | null
  category: StoryCategory
  author_display_name: string
  media_url: string | null
  featured: boolean
  published_at: string
  submission?: Submission
}

export interface ConsentRequest {
  id: string
  submission_id: string
  guardian_email: string
  consent_token: string
  status: 'pending' | 'approved' | 'declined'
  created_at: string
  responded_at: string | null
}
