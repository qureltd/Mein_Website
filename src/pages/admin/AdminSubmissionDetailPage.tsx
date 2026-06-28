import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Check, X, Archive, ShieldCheck, Send, RefreshCw, Copy, CheckCheck, AlertTriangle, Globe } from 'lucide-react'
import { supabase, type Submission, type SubmissionStatus, type ConsentRequest, type StoryCategory } from '../../lib/supabase'
import {
  PUBLISHABLE_TYPES,
  SUBMISSION_TYPE_TO_CATEGORY,
  STORY_CATEGORY_LABELS,
  checkPublishEligibility,
  derivePublicDisplayName,
  derivePublicTitle,
  derivePublicExcerpt,
} from '../../lib/publishingRules'

// Submission types that can enter the consent workflow
const CONSENT_ELIGIBLE_TYPES = ['create', 'speak', 'build', 'represent', 'feature', 'future_me']

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  received:         'bg-blue-pale text-blue-mein',
  under_review:     'bg-yellow-50 text-yellow-700',
  needs_consent:    'bg-orange-50 text-orange-700',
  consent_sent:     'bg-blue-50 text-blue-700',
  consent_received: 'bg-teal-50 text-teal-700',
  approved:         'bg-green-50 text-green-700',
  not_approved:     'bg-red-50 text-red-700',
  published:        'bg-green-100 text-green-800',
  archived:         'bg-gray-100 text-gray-600',
}

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  received:         'Received',
  under_review:     'Under Review',
  needs_consent:    'Needs Consent',
  consent_sent:     'Consent Sent',
  consent_received: 'Consent Received',
  approved:         'Approved',
  not_approved:     'Not Approved',
  published:        'Published',
  archived:         'Archived',
}

const TYPE_LABELS: Record<string, string> = {
  create: 'Create', speak: 'Speak', build: 'Build', represent: 'Represent',
  feature: 'Feature', future_me: 'Future Me', school: 'School', partner: 'Partner', contact: 'Contact',
}

const CONSENT_STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700',
  sent:      'bg-blue-50 text-blue-700',
  approved:  'bg-green-50 text-green-700',
  declined:  'bg-red-50 text-red-700',
  withdrawn: 'bg-orange-50 text-orange-700',
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-gray-mid text-xs font-semibold font-sora uppercase tracking-wide mb-1">{label}</p>
      <p className="font-sora text-sm text-charcoal">{value ?? '—'}</p>
    </div>
  )
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      className="shrink-0 text-gray-mid hover:text-blue-mein transition-colors"
      title={copied ? 'Copied!' : 'Copy link'}
    >
      {copied ? <CheckCheck size={13} className="text-green-600" /> : <Copy size={13} />}
    </button>
  )
}

export default function AdminSubmissionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [sub, setSub] = useState<Submission | null>(null)
  const [consentReq, setConsentReq] = useState<ConsentRequest | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [consentSending, setConsentSending] = useState(false)
  const [emailFailed, setEmailFailed] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Publish form state
  const [publishTitle, setPublishTitle] = useState('')
  const [publishExcerpt, setPublishExcerpt] = useState('')
  const [publishAuthor, setPublishAuthor] = useState('')
  const [publishCategory, setPublishCategory] = useState<StoryCategory | ''>('')
  const [publishFeatured, setPublishFeatured] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [publishedStoryId, setPublishedStoryId] = useState<string | null>(null)

  const loadAll = useCallback(async (subId: string) => {
    const [{ data: subData }, { data: crData }] = await Promise.all([
      supabase.from('submissions').select('*').eq('id', subId).maybeSingle(),
      supabase.from('consent_requests').select('*').eq('submission_id', subId)
        .order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ])
    if (!subData) { setNotFound(true); setLoading(false); return }
    setSub(subData as Submission)
    setConsentReq(crData as ConsentRequest | null)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (id) loadAll(id)
  }, [id, loadAll])

  // Pre-fill publish form when submission loads
  useEffect(() => {
    if (!sub) return
    setPublishTitle(derivePublicTitle(sub))
    setPublishExcerpt(derivePublicExcerpt(sub))
    setPublishAuthor(derivePublicDisplayName(sub))
    const defaultCategory = SUBMISSION_TYPE_TO_CATEGORY[sub.type] ?? 'youth_stories'
    setPublishCategory(defaultCategory as StoryCategory)
  }, [sub?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function publishStory() {
    if (!sub || !publishTitle.trim() || !publishExcerpt.trim() || !publishAuthor.trim() || !publishCategory) return
    setPublishing(true)
    setPublishError(null)

    const { data, error } = await supabase.functions.invoke('publish-story', {
      body: {
        submission_id: sub.id,
        title: publishTitle.trim(),
        excerpt: publishExcerpt.trim(),
        author_display_name: publishAuthor.trim(),
        category: publishCategory,
        featured: publishFeatured,
      },
    })

    if (error || !data?.success) {
      setPublishError(data?.error ?? error?.message ?? 'Failed to publish story.')
      setPublishing(false)
      return
    }

    setPublishedStoryId(data.story_id)
    setSub((prev) => prev ? { ...prev, status: 'published' as SubmissionStatus } : prev)
    setPublishing(false)
  }

  async function updateStatus(status: SubmissionStatus) {
    if (!sub) return
    setActionLoading(true)
    const { data } = await supabase
      .from('submissions')
      .update({ status, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', sub.id)
      .select()
      .maybeSingle()
    if (data) setSub(data as Submission)
    const userId = (await supabase.auth.getUser()).data.user?.id ?? null
    await supabase.from('audit_logs').insert({
      admin_id: userId,
      action: `status_changed_to_${status}`,
      entity_type: 'submissions',
      entity_id: sub.id,
      previous_status: sub.status,
      new_status: status,
    })
    setActionLoading(false)
  }

  async function sendConsentRequest() {
    if (!sub || !sub.guardian_email) return
    setConsentSending(true)
    setEmailFailed(false)

    const userId = (await supabase.auth.getUser()).data.user?.id ?? null

    // Create consent_request record
    const { data: cr, error: crErr } = await supabase
      .from('consent_requests')
      .insert({
        submission_id: sub.id,
        guardian_email: sub.guardian_email,
        consent_type: ['story_on_wall', 'use_display_name'],
        consent_scope: sub.consent_scope ?? 'Display submission content and name on the Mein platform.',
      })
      .select('*')
      .single()

    if (crErr || !cr) {
      setConsentSending(false)
      return
    }

    // Audit log: consent request created
    await supabase.from('audit_logs').insert({
      admin_id: userId,
      action: 'consent_request_created',
      entity_type: 'consent_requests',
      entity_id: cr.id,
      previous_status: null,
      new_status: 'pending',
      notes: `Consent request created for submission ${sub.id}`,
    })

    // Mark submission consent_required = true and status = consent_sent
    await supabase.from('submissions').update({
      consent_required: true,
      status: 'consent_sent',
      updated_at: new Date().toISOString(),
    }).eq('id', sub.id)

    // Update local sub state optimistically
    setSub((prev) => prev ? { ...prev, consent_required: true, status: 'consent_sent' } : prev)

    // Send email via edge function
    const origin = window.location.origin
    const consentLink = `${origin}/consent/${cr.consent_token}`
    const { error: emailErr } = await supabase.functions.invoke('send-email', {
      body: {
        email_type: 'consent_request',
        recipient_email: sub.guardian_email,
        recipient_name: sub.guardian_name ?? undefined,
        template_data: {
          submitter_name: sub.display_name || sub.name,
          consent_link: consentLink,
          consent_scope: sub.consent_scope ?? '',
        },
        related_table: 'consent_requests',
        related_id: cr.id,
      },
    })

    const newStatus = emailErr ? 'pending' : 'sent'
    const { data: updatedCr } = await supabase
      .from('consent_requests')
      .update({ status: newStatus })
      .eq('id', cr.id)
      .select('*')
      .single()

    // Audit log: consent request sent (or failed)
    await supabase.from('audit_logs').insert({
      admin_id: userId,
      action: emailErr ? 'consent_request_email_failed' : 'consent_request_sent',
      entity_type: 'consent_requests',
      entity_id: cr.id,
      previous_status: 'pending',
      new_status: newStatus,
      notes: emailErr ? `Email send failed: ${emailErr.message}` : `Email sent to ${sub.guardian_email}`,
    })

    if (emailErr) setEmailFailed(true)
    setConsentReq((updatedCr ?? cr) as ConsentRequest)
    setConsentSending(false)
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-7 h-7 rounded-full border-2 border-blue-mein border-t-transparent animate-spin" />
    </div>
  )

  if (notFound) return (
    <div className="text-center py-20">
      <p className="font-sora text-gray-mid">Submission not found.</p>
      <Link to="/admin/submissions" className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-mein hover:underline font-sora">
        <ArrowLeft size={13} /> Back to submissions
      </Link>
    </div>
  )

  if (!sub) return null

  const consentApproved = consentReq?.status === 'approved'
  const canApprove = !sub.consent_required || consentApproved
  const isConsentEligible = sub.is_under_18 && CONSENT_ELIGIBLE_TYPES.includes(sub.type)
  const consentLink = consentReq ? `${window.location.origin}/consent/${consentReq.consent_token}` : null
  const isPublishable = (PUBLISHABLE_TYPES as readonly string[]).includes(sub.type)
  const consentLoading = isPublishable && (sub.is_under_18 || sub.consent_required) && consentReq === undefined
  const eligibility = isPublishable && !consentLoading ? checkPublishEligibility(sub, consentReq) : null
  const showPublishPanel = isPublishable && sub.status === 'approved'

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-mid hover:text-blue-mein transition-colors font-sora"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold font-sora ${STATUS_COLORS[sub.status]}`}>
          {STATUS_LABELS[sub.status]}
        </span>
        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-sora font-medium">
          {TYPE_LABELS[sub.type] ?? sub.type}
        </span>
        {sub.is_under_18 && (
          <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-xs font-semibold font-sora">Under 18</span>
        )}
        {sub.consent_required && (
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold font-sora ${consentApproved ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            <ShieldCheck size={11} />
            Consent {consentApproved ? 'approved' : 'required'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide mb-4">Submitter</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" value={sub.name} />
              <Field label="Display name" value={sub.display_name} />
              <Field label="Email" value={sub.email} />
              <Field label="Age" value={sub.age} />
              {sub.is_under_18 && <>
                <Field label="Guardian name" value={sub.guardian_name} />
                <Field label="Guardian email" value={sub.guardian_email} />
              </>}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide mb-4">Submission</p>
            {sub.title && <p className="font-sora font-bold text-base text-charcoal mb-3">{sub.title}</p>}
            <div className="bg-gray-50 rounded-xl p-4 text-sm font-sora text-charcoal leading-relaxed whitespace-pre-wrap border border-gray-100">
              {sub.content}
            </div>
            {sub.media_url && (
              <a href={sub.media_url} target="_blank" rel="noopener noreferrer" className="mt-3 text-xs text-blue-mein hover:underline font-sora block">
                View media →
              </a>
            )}
          </div>

          {sub.admin_notes && (
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
              <p className="text-xs font-sora font-semibold text-yellow-700 mb-1">Admin Notes</p>
              <p className="text-sm font-sora text-charcoal">{sub.admin_notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide mb-4">Details</p>
            <div className="space-y-3">
              <Field label="Submitted" value={new Date(sub.created_at).toLocaleString('en-GB')} />
              <Field label="Updated" value={new Date(sub.updated_at).toLocaleString('en-GB')} />
              {sub.reviewed_at && <Field label="Reviewed" value={new Date(sub.reviewed_at).toLocaleString('en-GB')} />}
              {sub.published_at && <Field label="Published" value={new Date(sub.published_at).toLocaleString('en-GB')} />}
            </div>
          </div>

          {/* Guardian consent panel — only for under-18 creative submissions */}
          {isConsentEligible && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide">Guardian Consent</p>
                <button
                  onClick={() => id && loadAll(id)}
                  className="text-gray-mid hover:text-blue-mein transition-colors"
                  title="Refresh consent status"
                >
                  <RefreshCw size={12} />
                </button>
              </div>

              {/* Email failure warning */}
              {emailFailed && (
                <div className="mb-3 flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs font-sora text-yellow-800">
                  <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                  Email not sent — Postmark may not be configured. Copy the consent link below and share it manually.
                </div>
              )}

              {consentReq === undefined ? (
                <p className="text-xs text-gray-mid font-sora">Loading…</p>
              ) : consentReq === null ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-mid font-sora leading-relaxed">
                    No consent request sent yet.
                    {!sub.guardian_email && ' Guardian email is missing from this submission.'}
                  </p>
                  {sub.guardian_email && (
                    <button
                      onClick={sendConsentRequest}
                      disabled={consentSending}
                      className="flex items-center gap-2 bg-blue-mein text-white px-3 py-2 rounded-lg text-xs font-semibold font-sora hover:bg-blue-700 transition-colors w-full justify-center disabled:opacity-60"
                    >
                      <Send size={12} />
                      {consentSending ? 'Sending…' : 'Send Consent Request'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora ${CONSENT_STATUS_COLORS[consentReq.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {consentReq.status === 'pending' ? 'Pending (email not sent)' : consentReq.status}
                    </span>
                  </div>

                  {/* Consent link — always visible for manual copy */}
                  {consentLink && (
                    <div>
                      <p className="text-xs font-sora font-semibold text-gray-mid mb-1">Consent link</p>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2">
                        <p className="text-xs font-sora text-gray-mid truncate flex-1 font-mono">{consentLink}</p>
                        <CopyButton value={consentLink} />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs font-sora text-gray-mid">
                    <p>Sent to: {consentReq.guardian_email}</p>
                    <p>Created: {new Date(consentReq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    {consentReq.responded_at && (
                      <p>Responded: {new Date(consentReq.responded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    )}
                    {consentReq.signed_name && (
                      <p>Signed by: <span className="text-charcoal font-medium">{consentReq.signed_name}</span></p>
                    )}
                  </div>

                  {/* Resend: available when email failed (pending) or consent was declined/withdrawn */}
                  {(['pending', 'declined', 'withdrawn'] as const).includes(consentReq.status as 'pending' | 'declined' | 'withdrawn') && sub.guardian_email && (
                    <button
                      onClick={sendConsentRequest}
                      disabled={consentSending}
                      className="flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 px-3 py-2 rounded-lg text-xs font-semibold font-sora hover:bg-orange-100 transition-colors w-full justify-center disabled:opacity-60"
                    >
                      <Send size={12} />
                      {consentSending ? 'Sending…' : consentReq.status === 'pending' ? 'Retry Send' : 'Resend Consent Request'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Prepare for Wall panel — for publishable types when approved */}
          {showPublishPanel && (
            <div className="bg-white rounded-xl border border-blue-mein/20 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={14} className="text-blue-mein" />
                <p className="text-xs font-sora font-semibold text-blue-mein uppercase tracking-wide">Prepare for The Wall</p>
              </div>

              {publishedStoryId ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
                    <Check size={14} className="shrink-0" />
                    <p className="text-xs font-sora font-semibold">Published successfully!</p>
                  </div>
                  <Link
                    to={`/stories/${publishedStoryId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-sora font-semibold text-blue-mein hover:underline"
                  >
                    View on The Wall →
                  </Link>
                </div>
              ) : consentLoading ? (
                <p className="text-xs text-gray-mid font-sora">Checking consent status…</p>
              ) : eligibility && !eligibility.eligible ? (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <AlertTriangle size={13} className="text-yellow-600 mt-0.5 shrink-0" />
                    <p className="text-xs font-sora text-yellow-800 leading-relaxed">{eligibility.reason}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {publishError && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                      <AlertTriangle size={13} className="text-red-600 mt-0.5 shrink-0" />
                      <p className="text-xs font-sora text-red-700">{publishError}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Public title *</label>
                    <input
                      type="text"
                      value={publishTitle}
                      onChange={(e) => setPublishTitle(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Excerpt / display text *</label>
                    <textarea
                      value={publishExcerpt}
                      onChange={(e) => setPublishExcerpt(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Display name *</label>
                    <input
                      type="text"
                      value={publishAuthor}
                      onChange={(e) => setPublishAuthor(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Category *</label>
                    <select
                      value={publishCategory}
                      onChange={(e) => setPublishCategory(e.target.value as StoryCategory)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30 bg-white"
                    >
                      <option value="">Select category…</option>
                      {(Object.entries(STORY_CATEGORY_LABELS) as [StoryCategory, string][]).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={publishFeatured}
                      onChange={(e) => setPublishFeatured(e.target.checked)}
                      className="rounded border-gray-300 text-blue-mein focus:ring-blue-mein/30"
                    />
                    <span className="text-xs font-sora text-charcoal">Feature this story</span>
                  </label>

                  <button
                    onClick={publishStory}
                    disabled={publishing || !publishTitle.trim() || !publishExcerpt.trim() || !publishAuthor.trim() || !publishCategory}
                    className="w-full flex items-center justify-center gap-2 bg-blue-mein text-white px-4 py-2.5 rounded-lg text-xs font-semibold font-sora hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Globe size={12} />
                    {publishing ? 'Publishing…' : 'Publish to The Wall'}
                  </button>

                  <p className="text-[10px] text-gray-mid font-sora leading-relaxed">
                    Eligibility is re-verified server-side before publishing. This cannot be undone from here — use the Wall Manager to unpublish.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Published story link */}
          {sub.status === 'published' && !publishedStoryId && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={13} className="text-green-700" />
                <p className="text-xs font-sora font-semibold text-green-700 uppercase tracking-wide">On The Wall</p>
              </div>
              <p className="text-xs font-sora text-green-800 leading-relaxed">
                This submission is published. Manage it in the{' '}
                <Link to="/admin/wall" className="font-semibold underline hover:no-underline">Wall Manager</Link>.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide mb-4">Actions</p>
            <div className="flex flex-col gap-2">
              {sub.status === 'received' && (
                <button
                  onClick={() => updateStatus('under_review')}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-2 rounded-lg text-xs font-semibold font-sora hover:bg-yellow-100 transition-colors"
                >
                  <Clock size={13} /> Mark Under Review
                </button>
              )}
              {isConsentEligible && !['needs_consent', 'consent_sent', 'consent_received'].includes(sub.status) && (
                <button
                  onClick={() => updateStatus('needs_consent')}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 px-3 py-2 rounded-lg text-xs font-semibold font-sora hover:bg-orange-100 transition-colors"
                >
                  <ShieldCheck size={13} /> Flag: Needs Consent
                </button>
              )}
              {['under_review', 'needs_consent', 'consent_sent', 'consent_received'].includes(sub.status) && (
                canApprove ? (
                  <button
                    onClick={() => updateStatus('approved')}
                    disabled={actionLoading}
                    className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-lg text-xs font-semibold font-sora hover:bg-green-100 transition-colors"
                  >
                    <Check size={13} /> Approve
                  </button>
                ) : (
                  <button
                    disabled
                    title="Guardian consent must be approved before this submission can be approved."
                    className="flex items-center gap-2 bg-gray-100 text-gray-400 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold font-sora cursor-not-allowed"
                  >
                    <Check size={13} /> Approve
                    <span className="ml-auto text-[10px] text-gray-400">Awaiting consent</span>
                  </button>
                )
              )}
              {sub.status !== 'not_approved' && (
                <button
                  onClick={() => updateStatus('not_approved')}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg text-xs font-semibold font-sora hover:bg-red-100 transition-colors"
                >
                  <X size={13} /> Not Approved
                </button>
              )}
              <button
                onClick={() => updateStatus('archived')}
                disabled={actionLoading}
                className="flex items-center gap-2 bg-gray-100 text-gray-600 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold font-sora hover:bg-gray-200 transition-colors"
              >
                <Archive size={13} /> Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
