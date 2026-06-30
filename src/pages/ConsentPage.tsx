import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShieldCheck, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { OpenMIcon } from '../components/BrandElements'

type PageState = 'loading' | 'ready' | 'already_responded' | 'not_active' | 'not_found' | 'submitted_approved' | 'submitted_declined' | 'error'

interface ConsentData {
  consent_request_id: string
  status: string
  consent_type: string[] | null
  consent_scope: string | null
  consent_text_version: string | null
  created_at: string
  guardian_email_hint: string
  submission: {
    name: string
    type: string
    title: string | null
  } | null
}

const TYPE_LABELS: Record<string, string> = {
  create: 'creative submission', speak: 'spoken piece', build: 'project',
  represent: 'representation', feature: 'feature', future_me: 'Future Me letter',
}

const CONSENT_TYPE_LABELS: Record<string, string> = {
  story_on_wall: 'display their story on The Wall',
  use_display_name: 'show their display name publicly',
  use_photo: 'use submitted photos',
  newsletter: 'include them in newsletters',
  social_media: 'share on social media',
}

export default function ConsentPage() {
  const { token } = useParams<{ token: string }>()
  const [state, setState] = useState<PageState>('loading')
  const [consentData, setConsentData] = useState<ConsentData | null>(null)
  const [signedName, setSignedName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [pendingDecision, setPendingDecision] = useState<'approved' | 'declined' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) { setState('not_found'); return }
    fetchConsentRequest()
  }, [token])

  async function fetchConsentRequest() {
    setState('loading')
    const { data, error } = await supabase.functions.invoke('get-consent-request', {
      body: { token },
    })

    if (error || !data?.success) {
      const msg: string = data?.error ?? error?.message ?? ''
      setState(msg.includes('not found') || msg.includes('invalid') ? 'not_found' : 'error')
      return
    }

    setConsentData(data as ConsentData)

    if (data.status === 'approved' || data.status === 'declined') {
      setState('already_responded')
    } else if (data.status !== 'sent') {
      setState('not_active')
    } else {
      setState('ready')
    }
  }

  async function handleSubmit(decision: 'approved' | 'declined') {
    if (!token) return
    if (!signedName.trim()) {
      setError('Please enter your full name to confirm your decision.')
      return
    }
    setError(null)
    setSubmitting(true)
    setPendingDecision(decision)

    const { data, error: fnError } = await supabase.functions.invoke('submit-consent-response', {
      body: { token, decision, signed_name: signedName.trim() },
    })

    if (fnError || !data?.success) {
      setError(data?.error ?? fnError?.message ?? 'Something went wrong. Please try again.')
      setSubmitting(false)
      setPendingDecision(null)
      return
    }

    setState(decision === 'approved' ? 'submitted_approved' : 'submitted_declined')
    setSubmitting(false)
    setPendingDecision(null)
  }

  return (
    <div className="min-h-screen bg-blue-pale flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <OpenMIcon size={40} />
        </div>

        {state === 'loading' && (
          <div className="flex justify-center py-12">
            <Loader size={28} className="text-blue-mein animate-spin" />
          </div>
        )}

        {state === 'not_found' && (
          <NoticeCard
            icon={<AlertCircle size={28} className="text-red-500" />}
            title="Link not found"
            body="This consent link is invalid or has expired. If you received this by email, please contact the Mein team."
          />
        )}

        {state === 'not_active' && (
          <NoticeCard
            icon={<AlertCircle size={28} className="text-yellow-500" />}
            title="Not yet active"
            body="This consent request has not been activated yet. Please wait for an email from the Mein team or contact us if you have questions."
          />
        )}

        {state === 'already_responded' && consentData && (
          <NoticeCard
            icon={
              consentData.status === 'approved'
                ? <CheckCircle size={28} className="text-green-500" />
                : <XCircle size={28} className="text-red-500" />
            }
            title={consentData.status === 'approved' ? 'Consent already given' : 'Response already recorded'}
            body={
              consentData.status === 'approved'
                ? "You have already given consent for this submission. Thank you — the Mein team will be in touch."
                : "You have already declined consent for this submission. If you have changed your mind, please contact us."
            }
          />
        )}

        {state === 'submitted_approved' && (
          <NoticeCard
            icon={<CheckCircle size={28} className="text-green-500" />}
            title="Consent recorded — thank you"
            body="Your consent has been saved. The Mein team will review the submission and may be in touch with next steps."
          />
        )}

        {state === 'submitted_declined' && (
          <NoticeCard
            icon={<XCircle size={28} className="text-gray-500" />}
            title="Response recorded"
            body="Your decision not to consent has been recorded. The submission will not proceed. If you have questions, please contact us."
          />
        )}

        {state === 'error' && (
          <NoticeCard
            icon={<AlertCircle size={28} className="text-red-500" />}
            title="Something went wrong"
            body="We couldn't load this consent request. Please try refreshing, or contact the Mein team for help."
          />
        )}

        {state === 'ready' && consentData && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-blue-mein px-6 py-5">
              <div className="flex items-center gap-3">
                <ShieldCheck size={22} className="text-white opacity-90" />
                <div>
                  <p className="font-sora font-bold text-white text-lg leading-tight">Guardian Consent</p>
                  <p className="font-sora text-white/70 text-xs mt-0.5">Secure consent form — Mein</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Who this is for */}
              <div>
                <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide mb-2">This request is for</p>
                <p className="font-sora font-semibold text-charcoal text-base">
                  {consentData.submission?.name ?? 'a young person'}
                </p>
                {consentData.submission?.title && (
                  <p className="text-sm text-gray-mid font-sora mt-1">"{consentData.submission.title}"</p>
                )}
                <p className="text-sm text-gray-mid font-sora mt-1">
                  {TYPE_LABELS[consentData.submission?.type ?? ''] ?? consentData.submission?.type ?? 'submission'}
                </p>
              </div>

              {/* What consent covers */}
              {consentData.consent_type && consentData.consent_type.length > 0 && (
                <div>
                  <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide mb-2">This consent covers permission to</p>
                  <ul className="space-y-1.5">
                    {consentData.consent_type.map((ct) => (
                      <li key={ct} className="flex items-start gap-2 text-sm font-sora text-charcoal">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                        {CONSENT_TYPE_LABELS[ct] ?? ct.replace(/_/g, ' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {consentData.consent_scope && (
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                  <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide mb-1.5">Scope of consent</p>
                  <p className="text-sm font-sora text-charcoal leading-relaxed">{consentData.consent_scope}</p>
                </div>
              )}

              {/* Legal text */}
              <div className="bg-blue-pale rounded-xl border border-blue-mein/15 p-4 text-xs font-sora text-gray-dark leading-relaxed">
                By signing below, you confirm that you are the parent or legal guardian of the young person named above.
                Giving consent means Mein may use their submission as described. Declining means their submission will not proceed.
                You can contact <a href="mailto:hello@meintoday.com" className="text-blue-mein hover:underline">hello@meintoday.com</a> at any time with questions.
              </div>

              {/* Email hint */}
              <p className="text-xs text-gray-mid font-sora text-center">
                Sent to: {consentData.guardian_email_hint}
              </p>

              {/* Signature input — required for BOTH approve and decline */}
              <div>
                <label className="block text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide mb-2">
                  Your full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={signedName}
                  onChange={(e) => { setSignedName(e.target.value); setError(null) }}
                  placeholder="Type your full name to confirm your decision"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 font-sora text-sm text-charcoal placeholder-gray-mid focus:outline-none focus:ring-2 focus:ring-blue-mein/30 focus:border-blue-mein transition"
                />
                <p className="mt-1.5 text-xs text-gray-mid font-sora">Required for both giving and declining consent — creates a formal record of who made this decision.</p>
                {error && (
                  <p className="mt-2 text-xs text-red-600 font-sora">{error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleSubmit('approved')}
                  disabled={submitting}
                  className="w-full bg-blue-mein text-white font-sora font-semibold text-sm py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting && pendingDecision === 'approved' ? 'Submitting…' : 'I give consent'}
                </button>
                <button
                  onClick={() => handleSubmit('declined')}
                  disabled={submitting}
                  className="w-full bg-white text-red-600 border border-red-200 font-sora font-semibold text-sm py-3 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting && pendingDecision === 'declined' ? 'Submitting…' : 'I do not give consent'}
                </button>
              </div>

              <p className="text-center text-xs text-gray-mid font-sora">
                Questions?{' '}
                <Link to="/contact" className="text-blue-mein hover:underline">Contact Mein</Link>
              </p>
            </div>
          </div>
        )}

        <p className="mt-8 text-center font-sora text-xs text-gray-mid">
          <Link to="/" className="hover:text-blue-mein transition-colors">Return to mein.world</Link>
        </p>
      </div>
    </div>
  )
}

function NoticeCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h2 className="font-sora font-bold text-lg text-charcoal mb-3">{title}</h2>
      <p className="font-sora text-sm text-gray-dark leading-relaxed mb-6">{body}</p>
      <Link to="/contact" className="btn-primary inline-flex text-sm">Contact Mein</Link>
    </div>
  )
}
