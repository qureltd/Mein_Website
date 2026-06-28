import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Check, X, Archive } from 'lucide-react'
import { supabase, type Submission, type SubmissionStatus } from '../../lib/supabase'

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
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      if (!id) return
      const { data } = await supabase.from('submissions').select('*').eq('id', id).maybeSingle()
      if (!data) { setNotFound(true); setLoading(false); return }
      setSub(data as Submission)
      setLoading(false)
    }
    load()
  }, [id])

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
    setActionLoading(false)
  }

  async function publishAsStory() {
    if (!sub) return
    setActionLoading(true)
    const categoryMap: Record<string, string> = {
      create: 'creative_submissions', speak: 'mein_mover_videos',
      build: 'youth_stories', represent: 'youth_stories',
      feature: 'youth_stories', future_me: 'future_self_letters',
    }
    await supabase.from('stories').insert({
      submission_id: sub.id,
      title: sub.title || `Submission by ${sub.display_name || sub.name}`,
      excerpt: sub.content.slice(0, 200),
      category: categoryMap[sub.type] ?? 'youth_stories',
      author_display_name: sub.display_name || sub.name,
    })
    await updateStatus('published')
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
                  Flag: Needs Consent
                  <span className="ml-auto text-[10px] text-orange-400">Phase 5</span>
                </button>
              )}
              {['under_review', 'needs_consent'].includes(sub.status) && (
                <button
                  onClick={() => updateStatus('approved')}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-lg text-xs font-semibold font-sora hover:bg-green-100 transition-colors"
                >
                  <Check size={13} /> Approve
                </button>
              )}
              {sub.status === 'approved' && ['create', 'speak', 'build', 'represent', 'feature'].includes(sub.type) && (
                <button
                  onClick={publishAsStory}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-blue-mein text-white px-3 py-2 rounded-lg text-xs font-semibold font-sora hover:bg-blue-700 transition-colors"
                >
                  Publish to The Wall
                  <span className="ml-auto text-[10px] text-white/60">Phase 6</span>
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
