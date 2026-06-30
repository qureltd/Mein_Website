import { useState, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import {
  OpenMIcon,
  HandwrittenAccent,
  SectionDivider,
  ConsentBadge,
} from '../components/BrandElements'

// ── Join path config ──────────────────────────────────────────────────────────

const JOIN_PATH_KEYS = ['young-person', 'parent', 'creator', 'school-educator', 'supporter', 'partner'] as const
type JoinPathKey = typeof JOIN_PATH_KEYS[number]

interface JoinPathOption {
  key: JoinPathKey
  label: string
  dbValue: string
  accent: 'blue' | 'gold'
}

const JOIN_PATHS: JoinPathOption[] = [
  { key: 'young-person',     label: 'Young person',          dbValue: 'young_person',    accent: 'blue' },
  { key: 'parent',           label: 'Parent or guardian',    dbValue: 'parent_guardian', accent: 'gold' },
  { key: 'creator',          label: 'Creator',               dbValue: 'creator',         accent: 'blue' },
  { key: 'school-educator',  label: 'School or educator',    dbValue: 'school_educator', accent: 'gold' },
  { key: 'supporter',        label: 'Supporter',             dbValue: 'supporter',       accent: 'blue' },
  { key: 'partner',          label: 'Partner',               dbValue: 'partner',         accent: 'gold' },
]

const JOIN_PATH_MAP = Object.fromEntries(JOIN_PATHS.map(p => [p.key, p])) as Record<JoinPathKey, JoinPathOption>

function normalizeJoinPathParam(raw: string | null): JoinPathKey | null {
  if (!raw) return null
  const s = raw.trim().toLowerCase()
  const aliases: Record<string, JoinPathKey> = {
    youth:            'young-person',
    young:            'young-person',
    'young_person':   'young-person',
    guardian:         'parent',
    'parent-guardian':'parent',
    'parent_guardian':'parent',
    school:           'school-educator',
    'school_partner': 'school-educator',
    'school-partner': 'school-educator',
    organisation:     'partner',
    organization:     'partner',
    support:          'supporter',
  }
  if (aliases[s]) return aliases[s]
  if ((JOIN_PATH_KEYS as readonly string[]).includes(s)) return s as JoinPathKey
  return null
}

// ── Interest options ──────────────────────────────────────────────────────────

const INTEREST_OPTIONS = [
  'Movement updates',
  'Merch / product drops',
  'Youth opportunities',
  'School sessions',
  'Creative calls',
  'Future Me activities',
]

// ── Belonging badges ──────────────────────────────────────────────────────────

const belongingBadges = [
  { text: 'For the quiet ones.', variant: 'blue' },
  { text: 'For the bold ones.', variant: 'gold' },
  { text: 'For the ones still figuring it out.', variant: 'blue' },
  { text: 'For the ones with ideas.', variant: 'gold' },
  { text: 'For the ones building anyway.', variant: 'blue' },
  { text: "For the ones who haven't started yet.", variant: 'gold' },
] as const

const badgeStyles = {
  blue: 'bg-blue-pale text-blue-mein border-2 border-blue-mein/30 shadow-md',
  gold: 'bg-gold-pale text-gold-dark border-2 border-yellow-300/60 shadow-md',
}

// ── Orbit graphic ─────────────────────────────────────────────────────────────

function BelongingOrbit() {
  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <circle cx="130" cy="130" r="114" stroke="#2F6BFF" strokeWidth="1" strokeDasharray="6 5" opacity="0.18" />
      <circle cx="130" cy="130" r="82" stroke="#F4B400" strokeWidth="1" strokeDasharray="4 6" opacity="0.25" />
      <circle cx="130" cy="130" r="48" fill="#EBF0FF" opacity="0.6" />
      <g opacity="0.12" transform="translate(98,94) scale(0.044)">
        <path d="M 1436 35 L 735 458 L 36 80 L 37 1542 L 284 1460 L 285 468 L 732 718 L 1185 450 L 1188 1470 L 1438 1547 Z" fill="#2F6BFF" fillRule="evenodd" />
        <path d="M 1054 664 L 841 797 L 841 1353 L 1056 1432 L 1059 667 Z" fill="#F4B400" fillRule="evenodd" />
      </g>
      <path d="M 28 148 Q 60 68 130 60 Q 200 52 228 128" stroke="#2F6BFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.22" fill="none" />
      <circle cx="130" cy="16"  r="5" fill="#2F6BFF" opacity="0.55" />
      <circle cx="244" cy="130" r="5" fill="#2F6BFF" opacity="0.40" />
      <circle cx="32"  cy="102" r="4" fill="#2F6BFF" opacity="0.35" />
      <circle cx="68"  cy="220" r="4" fill="#2F6BFF" opacity="0.30" />
      <circle cx="200" cy="34"  r="5" fill="#F4B400" opacity="0.60" />
      <circle cx="222" cy="186" r="4" fill="#F4B400" opacity="0.45" />
      <circle cx="52"  cy="174" r="4" fill="#F4B400" opacity="0.38" />
      <circle cx="130" cy="48"  r="3.5" fill="#2F6BFF" opacity="0.45" />
      <circle cx="212" cy="130" r="3"   fill="#F4B400" opacity="0.50" />
      <circle cx="48"  cy="130" r="3"   fill="#2F6BFF" opacity="0.40" />
      <circle cx="130" cy="212" r="3.5" fill="#F4B400" opacity="0.40" />
      <path d="M190 52 L191.5 56 L196 57.5 L191.5 59 L190 63 L188.5 59 L184 57.5 L188.5 56 Z" fill="#F4B400" opacity="0.80" />
      <path d="M72 188 L73.2 191.2 L76.4 192.4 L73.2 193.6 L72 196.8 L70.8 193.6 L67.6 192.4 L70.8 191.2 Z" fill="#2F6BFF" opacity="0.65" />
      <path d="M58 72 L58.9 74.7 L61.6 75.6 L58.9 76.5 L58 79.2 L57.1 76.5 L54.4 75.6 L57.1 74.7 Z" fill="#F4B400" opacity="0.55" />
      <line x1="130" y1="16"  x2="130" y2="82"  stroke="#2F6BFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.15" />
      <line x1="200" y1="34"  x2="162" y2="80"  stroke="#F4B400" strokeWidth="1" strokeDasharray="3 4" opacity="0.18" />
      <line x1="32"  y1="102" x2="82"  y2="118" stroke="#2F6BFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.15" />
      <line x1="244" y1="130" x2="178" y2="130" stroke="#2F6BFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.15" />
    </svg>
  )
}

// ── Join form ─────────────────────────────────────────────────────────────────

interface FormState {
  first_name: string
  email: string
  joining_as: JoinPathKey | ''
  interests: string[]
  message: string
  consented_to_updates: boolean
}

function JoinForm({ initialPath }: { initialPath: JoinPathKey | null }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

  const [form, setForm] = useState<FormState>({
    first_name: '',
    email: '',
    joining_as: initialPath ?? '',
    interests: [],
    message: '',
    consented_to_updates: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [duplicate, setDuplicate] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)

  function setPath(key: JoinPathKey) {
    setForm(f => ({ ...f, joining_as: f.joining_as === key ? '' : key }))
  }

  function toggleInterest(label: string) {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(label)
        ? f.interests.filter(i => i !== label)
        : [...f.interests, label],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFieldError(null)

    if (!form.joining_as) { setFieldError('Please select how you are joining.'); return }
    if (!form.email.trim()) { setFieldError('Please enter your email address.'); return }
    if (!form.consented_to_updates) { setFieldError('Please agree to receive MEIN updates to join.'); return }

    setSubmitting(true)

    try {
      const payload = {
        first_name:           form.first_name.trim() || undefined,
        email:                form.email.trim(),
        joining_as:           JOIN_PATH_MAP[form.joining_as].dbValue,
        interests:            form.interests.length > 0 ? form.interests : undefined,
        message:              form.message.trim() || undefined,
        consented_to_updates: true,
        _trap:                undefined,
      }

      const res = await fetch(`${supabaseUrl}/functions/v1/submit-join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': anonKey,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json() as { success: boolean; error?: string; duplicate?: boolean }

      if (!data.success) {
        setFieldError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      if (data.duplicate) {
        setDuplicate(true)
        setSubmitted(true)
      } else {
        setSubmitted(true)
      }
    } catch {
      setFieldError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    const isYoungPerson = form.joining_as === 'young-person'
    return (
      <div className="rounded-2xl bg-white border-2 border-blue-mein/20 p-8 md:p-10 text-center shadow-lg">
        <div className="w-12 h-12 rounded-full bg-blue-pale flex items-center justify-center mx-auto mb-4">
          <Check size={22} className="text-blue-mein" strokeWidth={2.5} />
        </div>
        <h3 className="font-sora font-extrabold text-xl text-charcoal mb-2">
          {duplicate ? "You're already in!" : "You're in the movement."}
        </h3>
        <p className="font-sora text-gray-dark text-sm leading-relaxed max-w-sm mx-auto">
          {duplicate
            ? "We already have your details. We'll be in touch when there's something for you."
            : `Thanks${form.first_name ? `, ${form.first_name}` : ''}. Check your inbox — a confirmation is on its way.`}
        </p>
        {isYoungPerson && !duplicate && (
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-mid font-sora mb-4">
              Ready to make your first move?
            </p>
            <Link
              to="/make-your-move"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-mein text-white rounded-full text-sm font-sora font-bold shadow-md hover:bg-blue-600 transition-colors"
            >
              Make Your Move
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Path pills */}
      <div>
        <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide mb-3">
          I am joining as
        </p>
        <div className="flex flex-wrap gap-2">
          {JOIN_PATHS.map((path) => {
            const isActive = form.joining_as === path.key
            const isGold = path.accent === 'gold'
            return (
              <button
                key={path.key}
                type="button"
                onClick={() => setPath(path.key)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-sora font-semibold border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-mein ${
                  isActive
                    ? isGold
                      ? 'bg-gold-mein border-gold-mein text-charcoal shadow-sm scale-[1.03]'
                      : 'bg-blue-mein border-blue-mein text-white shadow-sm scale-[1.03]'
                    : 'bg-white border-gray-200 text-gray-dark hover:border-blue-mein/60 hover:text-blue-mein'
                }`}
              >
                {isActive && <Check size={12} strokeWidth={3} />}
                {path.label}
              </button>
            )
          })}
        </div>
        {form.joining_as === 'young-person' && (
          <p className="mt-2.5 text-xs text-gray-mid font-sora leading-relaxed">
            If you are under 18, please make sure a parent or guardian knows you are joining MEIN updates.
          </p>
        )}
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-sora font-semibold text-gray-mid mb-1.5">
            First name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={form.first_name}
            onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
            placeholder="e.g. Amara"
            maxLength={100}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30 placeholder:text-gray-300"
          />
        </div>
        <div>
          <label className="block text-xs font-sora font-semibold text-gray-mid mb-1.5">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30 placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Interests */}
      <div>
        <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide mb-3">
          What are you interested in? <span className="normal-case font-normal">(optional)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((label) => {
            const checked = form.interests.includes(label)
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleInterest(label)}
                aria-pressed={checked}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sora font-semibold border transition-all duration-150 ${
                  checked
                    ? 'bg-blue-pale border-blue-mein text-blue-mein'
                    : 'bg-white border-gray-200 text-gray-dark hover:border-blue-mein/50 hover:text-blue-mein'
                }`}
              >
                {checked && <Check size={10} strokeWidth={3} className="inline mr-1 -mt-0.5" />}
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Optional message */}
      <div>
        <label className="block text-xs font-sora font-semibold text-gray-mid mb-1.5">
          Anything you'd like to add? <span className="font-normal">(optional)</span>
        </label>
        <textarea
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="Introduce yourself, ask a question, or just say hi."
          rows={3}
          maxLength={2000}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30 resize-none placeholder:text-gray-300"
        />
      </div>

      {/* Consent */}
      <div className="bg-blue-pale/40 border border-blue-mein/15 rounded-xl px-4 py-3.5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.consented_to_updates}
            onChange={e => setForm(f => ({ ...f, consented_to_updates: e.target.checked }))}
            className="mt-0.5 rounded border-gray-300 text-blue-mein focus:ring-blue-mein/30"
          />
          <span className="text-sm font-sora text-charcoal leading-snug">
            I agree to receive MEIN updates, movement news, opportunities, and drop announcements by email.
            <span className="block mt-1 text-xs text-gray-mid">Required to join. You can unsubscribe at any time.</span>
          </span>
        </label>
      </div>

      {fieldError && (
        <p className="text-sm text-red-600 font-sora">{fieldError}</p>
      )}

      {/* Honeypot — hidden from real users */}
      <input type="text" name="_trap" className="hidden" tabIndex={-1} aria-hidden="true" />

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-mein text-white rounded-xl text-sm font-sora font-bold shadow-md hover:bg-blue-600 transition-colors disabled:opacity-60"
      >
        {submitting ? (
          <><Loader2 size={16} className="animate-spin" /> Joining…</>
        ) : (
          <>Join the Movement <ArrowRight size={15} /></>
        )}
      </button>
    </form>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function JoinPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const normalizedPath = normalizeJoinPathParam(searchParams.get('path'))
  const formRef = useRef<HTMLDivElement>(null)

  function handlePillClick(key: JoinPathKey) {
    const next = normalizedPath === key ? null : key
    if (next) {
      setSearchParams({ path: next })
    } else {
      setSearchParams({})
    }
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div>

      {/* ─── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-end pr-0 opacity-[0.06]">
          <OpenMIcon size={560} />
        </div>
        <div
          className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 0% 30%, rgba(47,107,255,0.10) 0%, transparent 65%)' }}
        />

        <div className="container-wide section-padding relative z-10 max-w-4xl">
          <FadeUp>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3.5 py-1.5 mb-7">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-mein" />
              <span className="font-sora text-xs font-semibold text-white/80 tracking-widest uppercase">
                Join Mein
              </span>
            </div>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] max-w-2xl">
              Become a{' '}
              <br className="hidden sm:block" />
              Mein{' '}
              <span className="font-caveat text-gold-mein">Mover.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={150}>
            <p className="mt-6 text-white/70 text-lg md:text-xl max-w-md leading-relaxed font-sora">
              Any move counts.{' '}
              <span className="text-white font-semibold">One is enough to start.</span>
            </p>
          </FadeUp>

          <FadeUp delay={240}>
            <div className="mt-5">
              <ConsentBadge />
            </div>
          </FadeUp>

          <FadeUp delay={310}>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                href="#join-form"
                className="btn-gold inline-flex text-sm py-3 px-8"
                onClick={e => {
                  e.preventDefault()
                  formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                Join the Movement
                <ArrowRight size={15} />
              </a>
              <Link
                to="/make-your-move"
                className="text-sm font-sora font-semibold text-white/60 hover:text-white/90 transition-colors"
              >
                Make Your Move →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 2. BELONGING BADGES ─────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="container-wide section-padding">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16 max-w-5xl mx-auto">
            <div className="flex-1 min-w-0">
              <FadeUp>
                <div className="mb-8">
                  <SectionDivider className="mb-5" />
                  <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                    There is room for you here.
                  </h2>
                  <p className="mt-3 text-gray-dark font-sora text-base md:text-lg">
                    You do not need to have it all figured out to belong.
                  </p>
                </div>
              </FadeUp>

              <div className="flex flex-wrap gap-4">
                {belongingBadges.map((badge, i) => (
                  <FadeUp key={badge.text} delay={i * 70}>
                    <span
                      className={`inline-block ${badgeStyles[badge.variant]} font-sora font-bold text-base md:text-lg py-3.5 md:py-4 px-6 md:px-8 rounded-full tracking-tight`}
                    >
                      {badge.text}
                    </span>
                  </FadeUp>
                ))}
              </div>

              <FadeUp delay={500}>
                <p className="mt-7 font-caveat text-2xl text-gray-mid">
                  All of these people belong here.
                </p>
              </FadeUp>
            </div>

            <div className="hidden lg:flex flex-shrink-0 items-center justify-center w-64 xl:w-72" aria-hidden="true">
              <BelongingOrbit />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. JOIN FORM ────────────────────────────────────────────────── */}
      <section id="join-form" className="py-16 md:py-20 bg-[#FAFAF8]" ref={formRef}>
        <div className="container-wide section-padding max-w-2xl mx-auto">
          <FadeUp>
            <div className="text-center mb-10">
              <SectionDivider className="mx-auto mb-5" />
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Choose your way in.
              </h2>
              <p className="mt-3 text-gray-dark font-sora text-base md:text-lg">
                There is more than one way to be part of Mein.
              </p>
            </div>
          </FadeUp>

          {/* Quick-select pills — clicking pre-selects path in the form below */}
          <FadeUp delay={80}>
            <div className="flex flex-wrap gap-2.5 justify-center mb-8">
              {JOIN_PATHS.map((path) => {
                const isActive = normalizedPath === path.key
                const isGold = path.accent === 'gold'
                return (
                  <button
                    key={path.key}
                    onClick={() => handlePillClick(path.key)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-sora font-semibold border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-mein ${
                      isActive
                        ? isGold
                          ? 'bg-gold-mein border-gold-mein text-charcoal shadow-md scale-[1.04]'
                          : 'bg-blue-mein border-blue-mein text-white shadow-md scale-[1.04]'
                        : 'bg-white border-gray-200 text-gray-dark hover:border-blue-mein/60 hover:text-blue-mein hover:shadow-sm'
                    }`}
                  >
                    {isActive && <Check size={13} strokeWidth={3} />}
                    {path.label}
                  </button>
                )
              })}
            </div>
          </FadeUp>

          <FadeUp delay={140}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 md:p-9">
              <JoinForm key={normalizedPath ?? 'default'} initialPath={normalizedPath} />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 4. PLEDGE ───────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-charcoal overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.04]">
          <OpenMIcon size={500} />
        </div>

        <div className="container-wide section-padding max-w-2xl mx-auto text-center relative z-10">
          <FadeUp>
            <div className="w-12 h-1 bg-gold-mein rounded-full mx-auto mb-7" />
            <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-white leading-snug">
              When you join, you're not just joining a platform.
            </h2>
            <HandwrittenAccent
              text="You're joining a movement."
              className="text-3xl md:text-4xl block mt-2 text-gold-mein"
            />
            <p className="mt-7 text-white/65 font-sora leading-relaxed text-base md:text-lg max-w-xl mx-auto">
              Mein is a space for young people to be seen, supported, and encouraged as they take one step toward who they are becoming.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/make-your-move?move=unsure" className="btn-gold inline-flex justify-center">
                Make Your First Move
                <ArrowRight size={16} />
              </Link>
              <Link to="/community-rules" className="btn-outline-blue inline-flex justify-center border-white/20 text-white/80 hover:text-white hover:border-white/50">
                Read Community Rules
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 5. SAFETY REASSURANCE ───────────────────────────────────────── */}
      <section className="py-8 md:py-10 bg-blue-pale border-t border-blue-mein/10">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
              <div className="text-center sm:text-left">
                <p className="font-sora font-bold text-sm text-charcoal tracking-wide">
                  Staff-reviewed · Consent-aware · Youth-safe
                </p>
                <p className="text-xs text-gray-dark font-sora mt-1">
                  Public stories, videos, images, or names are reviewed before they appear.
                </p>
              </div>
              <Link
                to="/parents"
                className="text-sm font-sora font-semibold text-blue-mein hover:underline flex-shrink-0 whitespace-nowrap"
              >
                Parents &amp; Consent Info →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 6. BOTTOM CTA ───────────────────────────────────────────────── */}
      <section className="py-14 md:py-16 bg-white">
        <div className="container-wide section-padding text-center max-w-xl mx-auto">
          <FadeUp>
            <SectionDivider className="mx-auto mb-5" />
            <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
              Ready to make your first move?
            </h2>
            <p className="mt-3 text-gray-dark font-sora">
              Start where you are. One step is enough.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/make-your-move" className="btn-primary inline-flex justify-center">
                Make Your Move
                <ArrowRight size={16} />
              </Link>
              <Link to="/future-me" className="btn-secondary inline-flex justify-center">
                Take the Future Me Challenge
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
