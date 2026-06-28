import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Check, X, Archive, ShieldCheck, Send, RefreshCw } from 'lucide-react'
import { supabase, type Submission, type SubmissionStatus, type ConsentRequest } from '../../lib/supabase'

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  received:      'bg-blue-pale text-blue-mein',
  under_review:  'bg-yellow-50 text-yellow-700',
  needs_consent: 'bg-orange-50 text-orange-700',
  approved:      'bg-green-50 text-green-700',
  not_approved:  'bg-red-50 text-red-700',
  published:     'bg-green-100 text-green-800',
  archived:      'bg-gray-100 text-gray-600',
}

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  received: 'Received', under_review: 'Under Review', needs_consent: 'Needs Consent',
  approved: 'Approved', not_approved: 'Not Approved', published: 'Published', archived: 'Archived',
}

const TYPE_LABELS: Record<string, string> = {
  create: 'Create', speak: 'Speak', build: 'Build', represent: 'Represent',
  feature: 'Feature', future_me: 'Future Me', school: 'School', partner: 'Partner', contact: 'Contact',
}

const CONSENT_STATUS_COLORS: Record<string, string> = {
  pending:   'bg-gray-100 text-gray-600',
  sent:      'bg-yellow-50 text-yellow-700',
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

export default function AdminSubmissionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [sub, setSub] = useState<Submission | null>(null)
  const [consentReq, setConsentReq] = useState<ConsentRequest | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [consentSending, setConsentSending] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    loadAll(id)
  }, [id])

  async function loadAll(subId: string) {
    const [{ data: subData }, { data: crData }] = await Promise.all([
      supabase.from('submissions').select('*').eq('id', subId).maybeSingle(),
      supabase.from('consent_requests').select('*').eq('submission_id', subId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ])
    if (!subData) { setNotFound(true); setLoading(false); return }
    setSub(subData as Submission)
    setConsentReq(crData as ConsentRequest | null)
    setLoading(false)
  }

  async function updateStatus(status: SubmissionStatus, extra?: Record<string, unknown>) {
    if (!sub) return
    setActionLoading(true)
    const { data } = await supabase
      .from('submissions')
      .update({ status, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...extra })
      .eq('id', sub.id)
      .select()
      .maybeSingle()
    if (data) setSub(data as Submission)
    await supabase.from('audit_logs').insert({
      admin_id: (await supabase.auth.getUser()).data.user?.id ?? null,
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

    const { data: cr, error: crErr } = await supabase
      .from('consent_requests')
      .insert({
        submission_id: sub.id,
        guardian_email: sub.guardian_email,
        consent_type: ['story_on_wall', 'use_display_name'],
        consent_scope: sub.consent_scope ?? 'Display submission content on the Mein platform.',
      })
      .select('*')
      .single()

    if (crErr || !cr) {
      setConsentSending(false)
      return
    }

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

    await supabase
      .from('submissions')
      .update({ consent_required: true, updated_at: new Date().toISOString() })
      .eq('id', sub.id)

    setSub((prev) => prev ? { ...prev, consent_required: true } : prev)
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

  // Consent state helpers
  const consentApproved = consentReq?.status === 'approved'
  const canApprove = !sub.consent_required || consentApproved

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

          {/* Consent panel — only for under-18 submissions */}
          {sub.is_under_18 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide">Guardian Consent</p>
                <button
                  onClick={() => loadAll(sub.id)}
                  className="text-gray-mid hover:text-blue-mein transition-colors"
                  title="Refresh"
                >
                  <RefreshCw size={12} />
                </button>
              </div>

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
                      {consentReq.status}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs font-sora text-gray-mid">
                    <p>Sent to: {consentReq.guardian_email}</p>
                    <p>Created: {new Date(consentReq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    {consentReq.responded_at && (
                      <p>Responded: {new Date(consentReq.responded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    )}
                    {consentReq.signed_name && (
                      <p>Signed by: {consentReq.signed_name}</p>
                    )}
                  </div>

                  {(consentReq.status === 'declined' || consentReq.status === 'withdrawn') && sub.guardian_email && (
                    <button
                      onClick={sendConsentRequest}
                      disabled={consentSending}
                      className="flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 px-3 py-2 rounded-lg text-xs font-semibold font-sora hover:bg-orange-100 transition-colors w-full justify-center disabled:opacity-60"
                    >
                      <Send size={12} />
                      {consentSending ? 'Sending…' : 'Resend Consent Request'}
                    </button>
                  )}
                </div>
              )}
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
              {sub.is_under_18 && sub.status !== 'needs_consent' && (
                <button
                  onClick={() => updateStatus('needs_consent')}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 px-3 py-2 rounded-lg text-xs font-semibold font-sora hover:bg-orange-100 transition-colors"
                >
                  <ShieldCheck size={13} /> Flag: Needs Consent
                </button>
              )}
              {['under_review', 'needs_consent'].includes(sub.status) && (
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
              {sub.status === 'approved' && ['create', 'speak', 'build', 'represent', 'feature'].includes(sub.type) && (
                <button
                  disabled
                  title="Publishing requires the Phase 6 consent-verified workflow before stories go public."
                  className="flex items-center gap-2 bg-gray-100 text-gray-400 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold font-sora cursor-not-allowed"
                >
                  Publish to The Wall
                  <span className="ml-auto text-[10px] text-gray-400">Phase 6</span>
                </button>
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
