import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Pen, Play, Hammer, Megaphone, HelpCircle, Check, AlertCircle } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import {
  OpenMIcon,
  HandwrittenAccent,
  SectionDivider,
  ConsentBadge,
} from '../components/BrandElements'
import { supabase } from '../lib/supabase'

// ─── Move config ─────────────────────────────────────────────────────────────

const VALID_KEYS = ['create', 'speak', 'build', 'represent', 'unsure'] as const
type MoveKey = typeof VALID_KEYS[number]

const MOVE_OPTIONS: Record<MoveKey, {
  key: MoveKey
  label: string
  headline: string
  description: string
  placeholder: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  activeBg: string
  activeText: string
  stripFrom: string
  stripTo: string
}> = {
  create: {
    key: 'create',
    label: 'Create',
    headline: "You're starting with Create.",
    description: 'Share art, music, writing, design, video, or something you made.',
    placeholder: 'Tell us about your creative work — what is it, what inspired it, and what you want to share.',
    icon: Pen,
    iconBg: '#EBF0FF',
    iconColor: '#2F6BFF',
    activeBg: '#2F6BFF',
    activeText: '#ffffff',
    stripFrom: '#2F6BFF',
    stripTo: '#5B8FFF',
  },
  speak: {
    key: 'speak',
    label: 'Speak',
    headline: "You're starting with Speak.",
    description: 'Share your voice, your story, your message, or something you believe.',
    placeholder: 'Share your story, what you want to say, or paste a link to your video.',
    icon: Play,
    iconBg: '#F5F5F5',
    iconColor: '#111111',
    activeBg: '#111111',
    activeText: '#ffffff',
    stripFrom: '#111111',
    stripTo: '#4A5568',
  },
  build: {
    key: 'build',
    label: 'Build',
    headline: "You're starting with Build.",
    description: 'Start an idea, project, product, business, group, or solution.',
    placeholder: 'Tell us about the idea or project you are building. What is it? What problem does it solve?',
    icon: Hammer,
    iconBg: '#FFF8E1',
    iconColor: '#C48F00',
    activeBg: '#F4B400',
    activeText: '#111111',
    stripFrom: '#F4B400',
    stripTo: '#FFCF3D',
  },
  represent: {
    key: 'represent',
    label: 'Represent',
    headline: "You're starting with Represent.",
    description: 'Show up for the movement, the merch, the culture, or your community.',
    placeholder: 'Tell us why you want to represent Mein — your voice, your story, why this movement matters to you.',
    icon: Megaphone,
    iconBg: '#EBF0FF',
    iconColor: '#2F6BFF',
    activeBg: '#2F6BFF',
    activeText: '#ffffff',
    stripFrom: '#2F6BFF',
    stripTo: '#5B8FFF',
  },
  unsure: {
    key: 'unsure',
    label: 'Not sure yet',
    headline: 'Not sure yet? Start there.',
    description: "Tell us what you're into. We'll help you find a first move.",
    placeholder: "e.g. I love drawing but also want to start a business...",
    icon: HelpCircle,
    iconBg: '#F5F5F5',
    iconColor: '#888888',
    activeBg: '#111111',
    activeText: '#ffffff',
    stripFrom: '#F4B400',
    stripTo: '#FFCF3D',
  },
}

function normalizeMoveParam(raw: string | null): MoveKey | null {
  if (!raw) return null
  const s = raw.trim().toLowerCase()
  if (s === 'not-sure' || s === 'unknown') return 'unsure'
  if ((VALID_KEYS as readonly string[]).includes(s)) return s as MoveKey
  return null
}

// ─── Form types ───────────────────────────────────────────────────────────────

interface FormData {
  moveType: string
  name: string
  displayName: string
  email: string
  age: string
  title: string
  content: string
  guardianName: string
  guardianEmail: string
  consentGiven: boolean
  _trap: string
}

const defaultForm: FormData = {
  moveType: '',
  name: '',
  displayName: '',
  email: '',
  age: '',
  title: '',
  content: '',
  guardianName: '',
  guardianEmail: '',
  consentGiven: false,
  _trap: '',
}

// ─── What happens next ────────────────────────────────────────────────────────

const NEXT_STEPS = [
  {
    num: '01',
    title: 'You send your move',
    body: 'Tell us what you want to try or share.',
  },
  {
    num: '02',
    title: 'We review it',
    body: 'The Mein team checks submissions before anything goes public.',
  },
  {
    num: '03',
    title: 'Your move can grow',
    body: 'You may get support, be invited to share more, or be featured on The Wall with consent.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MakeYourMovePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const normalizedMove = normalizeMoveParam(searchParams.get('move'))

  const [form, setForm] = useState<FormData>(() => ({
    ...defaultForm,
    moveType: normalizedMove && normalizedMove !== 'unsure' ? normalizedMove : '',
  }))
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [notSureForm, setNotSureForm] = useState({ name: '', email: '', interests: '', _trap: '' })
  const [notSureDone, setNotSureDone] = useState(false)
  const [notSureLoading, setNotSureLoading] = useState(false)

  const formRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (normalizedMove && normalizedMove !== 'unsure') {
      setForm((f) => ({ ...f, moveType: normalizedMove }))
    }
  }, [normalizedMove]) // eslint-disable-line react-hooks/exhaustive-deps

  const isUnder18 = form.age !== '' && parseInt(form.age) < 18
  const activeMove = normalizedMove ? MOVE_OPTIONS[normalizedMove] : null

  function handleChipClick(key: MoveKey) {
    setSearchParams({ move: key })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleReset() {
    setForm(defaultForm)
    setSubmitted(false)
    setError(null)
    setSearchParams({})
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form._trap) return  // honeypot triggered
    setLoading(true)
    setError(null)
    try {
      const age = parseInt(form.age) || null
      const under18 = age !== null && age < 18
      const { error: dbError } = await supabase.from('submissions').insert({
        name: form.name,
        display_name: form.displayName || null,
        email: form.email,
        age,
        type: form.moveType,
        title: form.title || null,
        content: form.content,
        is_under_18: under18,
        guardian_email: under18 ? form.guardianEmail : null,
        guardian_name: under18 ? form.guardianName : null,
        status: 'received',
      })
      if (dbError) throw dbError
      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleNotSureSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (notSureForm._trap) return  // honeypot triggered
    setNotSureLoading(true)
    await supabase.from('submissions').insert({
      name: notSureForm.name,
      email: notSureForm.email,
      type: 'contact',
      title: 'Not sure yet — help me find my move',
      content: notSureForm.interests || 'No details provided.',
      status: 'received',
      is_under_18: false,
    })
    setNotSureLoading(false)
    setNotSureDone(true)
  }

  return (
    <div className="with-mobile-cta">

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-10 md:pt-36 md:pb-14 bg-white overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/3 opacity-[0.04] pointer-events-none select-none">
          <OpenMIcon size={500} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8">
          <FadeUp>
            {activeMove ? (
              <>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-widest">
                    Selected move
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-sora font-semibold"
                    style={{ backgroundColor: activeMove.activeBg, color: activeMove.activeText }}
                  >
                    <Check size={11} strokeWidth={3} />
                    {activeMove.label}
                  </span>
                </div>
                <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-charcoal leading-tight">
                  {normalizedMove === 'unsure' ? (
                    <>Not sure yet?{' '}<HandwrittenAccent text="Start there." className="text-5xl md:text-6xl" /></>
                  ) : (
                    <>Your move{' '}<HandwrittenAccent text="starts here." className="text-5xl md:text-6xl" /></>
                  )}
                </h1>
                <p className="mt-4 text-lg text-gray-dark font-sora max-w-xl">
                  {activeMove.description}
                </p>
              </>
            ) : (
              <>
                <p className="font-caveat text-blue-mein text-xl mb-3">
                  Choose the move that feels closest.
                </p>
                <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-charcoal leading-tight">
                  Make Your Move.
                </h1>
                <p className="mt-5 text-lg text-gray-dark font-sora max-w-xl">
                  You do not need a perfect plan. Pick a starting point, or choose{' '}
                  <span className="font-semibold text-charcoal">Not sure yet</span>{' '}
                  if you want help finding one.
                </p>
              </>
            )}
          </FadeUp>

          {/* Compact chip switcher */}
          <FadeUp delay={120}>
            <div className="mt-6">
              <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-widest mb-3">
                {activeMove ? 'Change move' : 'Pick your move'}
              </p>
              <div className="flex flex-wrap gap-2">
                {VALID_KEYS.map((key) => {
                  const opt = MOVE_OPTIONS[key]
                  const isActive = normalizedMove === key
                  return (
                    <button
                      key={key}
                      onClick={() => handleChipClick(key)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-sora font-semibold border transition-all duration-150 ${
                        isActive
                          ? 'border-transparent'
                          : 'border-gray-support bg-white text-gray-dark hover:border-blue-mein/50 hover:text-blue-mein'
                      }`}
                      style={isActive ? { backgroundColor: opt.activeBg, color: opt.activeText } : undefined}
                    >
                      {isActive && <Check size={12} strokeWidth={3} />}
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── FORM SECTION ──────────────────────────────────────────────────── */}
      <section className="pb-16 bg-gradient-to-b from-blue-pale/25 via-blue-pale/10 to-white">
        <div className="max-w-3xl mx-auto px-5 md:px-8">

          {/* Scroll anchor */}
          <div ref={formRef} className="scroll-mt-28 md:scroll-mt-32" />

          {submitted ? (
            /* ── Success state ── */
            <FadeUp>
              <div className="text-center py-14 md:py-20 bg-white rounded-3xl px-6 md:px-12 border border-blue-mein/15 shadow-xl">
                <div className="w-20 h-20 rounded-full bg-blue-pale ring-4 ring-blue-mein/10 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-mein/10">
                  <OpenMIcon size={44} />
                </div>
                <h2 className="font-caveat text-4xl md:text-5xl text-charcoal leading-tight">
                  Your move has landed.
                </h2>
                <HandwrittenAccent text="The Mein team has got it." className="text-2xl block mt-3" />
                <p className="mt-5 text-gray-dark font-sora max-w-md mx-auto leading-relaxed">
                  The Mein team will review your submission and get back to you.
                  {form.age && parseInt(form.age) < 18 && (
                    <> A consent request has been sent to your guardian's email.</>
                  )}
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <button onClick={handleReset} className="btn-primary">
                    Make Another Move <ArrowRight size={16} />
                  </button>
                  <a href="/wall" className="btn-secondary">See Stories</a>
                </div>
              </div>
            </FadeUp>

          ) : normalizedMove === 'unsure' ? (
            /* ── Not sure yet form ── */
            <FadeUp>
              <div className="relative bg-white rounded-3xl border border-blue-mein/20 shadow-2xl overflow-hidden">
                {/* Gold accent strip */}
                <div className="h-1.5 bg-gradient-to-r from-gold-mein via-gold-light to-gold-mein" />

                {/* Faint Open M watermark */}
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 pointer-events-none select-none opacity-[0.05]" aria-hidden="true">
                  <OpenMIcon size={280} />
                </div>

                <div className="relative z-10 p-6 md:p-10">
                  {notSureDone ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-gold-pale border-2 border-gold-mein/40 flex items-center justify-center mx-auto mb-4">
                        <Check size={24} className="text-gold-dark" strokeWidth={2.5} />
                      </div>
                      <h3 className="font-sora font-bold text-2xl text-charcoal">Your first step landed.</h3>
                      <HandwrittenAccent text="We'll help you find your move." className="text-lg block mt-2" />
                      <p className="mt-4 text-sm text-gray-dark font-sora max-w-sm mx-auto">
                        The Mein team will reach out to help you figure out your first move.
                      </p>
                      <button
                        onClick={() => {
                          setNotSureDone(false)
                          setNotSureForm({ name: '', email: '', interests: '', _trap: '' })
                          setSearchParams({})
                        }}
                        className="mt-6 btn-outline-blue inline-flex text-sm"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Card header */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFF8E1' }}>
                          <HelpCircle size={20} style={{ color: '#C48F00' }} strokeWidth={2} />
                        </div>
                        <div>
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sora font-bold"
                            style={{ backgroundColor: '#111111', color: '#ffffff' }}
                          >
                            <Check size={10} strokeWidth={3} />
                            Not sure yet
                          </span>
                        </div>
                      </div>

                      <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal leading-tight">
                        Not sure yet?{' '}
                        <HandwrittenAccent text="That's okay." className="text-2xl md:text-3xl" />
                      </h2>
                      <p className="mt-2 text-gray-dark font-sora text-base leading-relaxed">
                        You do not need to know your move yet. Tell us what you're into and we'll help you find your first move.
                      </p>
                      <p className="mt-1 font-caveat text-gray-mid text-lg">
                        Short answers are okay. You do not need a perfect plan to begin.
                      </p>

                      <SectionDivider className="mt-5 mb-6" />

                      <form onSubmit={handleNotSureSubmit} className="space-y-4">
                        <div style={{ display: 'none' }} aria-hidden="true">
                          <input tabIndex={-1} autoComplete="off" type="text" value={notSureForm._trap}
                            onChange={(e) => setNotSureForm((f) => ({ ...f, _trap: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Your Name *</label>
                            <input
                              type="text"
                              required maxLength={100}
                              value={notSureForm.name}
                              onChange={(e) => setNotSureForm((f) => ({ ...f, name: e.target.value }))}
                              placeholder="Your name"
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Email *</label>
                            <input
                              type="email"
                              required maxLength={254}
                              value={notSureForm.email}
                              onChange={(e) => setNotSureForm((f) => ({ ...f, email: e.target.value }))}
                              placeholder="your@email.com"
                              className="input-field"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">
                            What are you into?{' '}
                            <span className="font-normal text-gray-mid">(optional)</span>
                          </label>
                          <textarea
                            rows={4} maxLength={2000}
                            value={notSureForm.interests}
                            onChange={(e) => setNotSureForm((f) => ({ ...f, interests: e.target.value }))}
                            placeholder="e.g. I love drawing but also want to start a business..."
                            className="textarea-field"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={notSureLoading}
                          className="btn-primary w-full justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {notSureLoading ? 'Sending...' : 'Help me start.'}
                          {!notSureLoading && <ArrowRight size={14} />}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </FadeUp>

          ) : (
            /* ── Main move submission form ── */
            <FadeUp>
              <div className="relative bg-white rounded-3xl border border-blue-mein/20 shadow-2xl overflow-hidden">
                {/* Accent strip — color-keyed to selected move */}
                <div
                  className="h-1.5"
                  style={{
                    background: activeMove
                      ? `linear-gradient(to right, ${activeMove.stripFrom}, ${activeMove.stripTo})`
                      : 'linear-gradient(to right, #2F6BFF, #5B8FFF)',
                  }}
                />

                {/* Faint Open M watermark */}
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 pointer-events-none select-none opacity-[0.05]" aria-hidden="true">
                  <OpenMIcon size={320} />
                </div>

                <div className="relative z-10 p-6 md:p-10">

                  {/* Form header — selected move identity */}
                  <div className="flex items-start gap-4 mb-6">
                    {activeMove ? (
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: activeMove.iconBg }}
                      >
                        <activeMove.icon size={22} style={{ color: activeMove.iconColor }} strokeWidth={2} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-blue-pale flex items-center justify-center flex-shrink-0 mt-0.5">
                        <OpenMIcon size={28} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {activeMove && (
                        <div className="mb-2">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sora font-bold"
                            style={{ backgroundColor: activeMove.activeBg, color: activeMove.activeText }}
                          >
                            <Check size={10} strokeWidth={3} />
                            Selected move — {activeMove.label}
                          </span>
                        </div>
                      )}
                      <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal leading-tight">
                        Tell us your{' '}
                        <HandwrittenAccent text="first move." className="text-2xl md:text-3xl" />
                      </h2>
                      <p className="mt-1.5 font-caveat text-gray-mid text-lg">
                        Short answers are okay. You do not need a perfect plan to begin.
                      </p>
                    </div>
                  </div>

                  <SectionDivider className="mb-7" />

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div style={{ display: 'none' }} aria-hidden="true">
                      <input tabIndex={-1} autoComplete="off" type="text" name="_trap" value={form._trap} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          required maxLength={100}
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">
                          Display Name
                          <span className="font-normal text-gray-mid ml-1.5">(shown publicly)</span>
                        </label>
                        <input
                          type="text"
                          name="displayName"
                          maxLength={60}
                          value={form.displayName}
                          onChange={handleChange}
                          placeholder="e.g. @username or first name"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Email *</label>
                        <input
                          type="email"
                          name="email"
                          required maxLength={254}
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Age *</label>
                        <input
                          type="number"
                          name="age"
                          required
                          min={10}
                          max={25}
                          value={form.age}
                          onChange={handleChange}
                          placeholder="Your age"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Title / Subject</label>
                      <input
                        type="text"
                        name="title"
                        maxLength={200}
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Give your submission a title (optional)"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Your Move *</label>
                      <textarea
                        name="content"
                        required maxLength={5000}
                        value={form.content}
                        onChange={handleChange}
                        rows={6}
                        placeholder={
                          activeMove
                            ? activeMove.placeholder
                            : 'Tell us what you want to try or share. Short answers are okay.'
                        }
                        className="textarea-field"
                      />
                    </div>

                    {/* Move type selector — only when no move is pre-selected via URL */}
                    {!activeMove && (
                      <div>
                        <label className="block text-sm font-sora font-semibold text-charcoal mb-2">
                          Move type *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {VALID_KEYS.filter((k) => k !== 'unsure').map((key) => {
                            const opt = MOVE_OPTIONS[key]
                            const isSelected = form.moveType === key
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setForm((f) => ({ ...f, moveType: key }))}
                                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-sora font-semibold border transition-all duration-150 ${
                                  isSelected
                                    ? 'border-transparent'
                                    : 'border-gray-support bg-white text-gray-dark hover:border-blue-mein/50'
                                }`}
                                style={isSelected ? { backgroundColor: opt.activeBg, color: opt.activeText } : undefined}
                              >
                                {isSelected && <Check size={12} strokeWidth={3} />}
                                {opt.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {isUnder18 && (
                      <div className="bg-gold-pale border-2 border-gold-mein/30 rounded-2xl p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <AlertCircle size={18} className="text-gold-dark mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-sora font-bold text-sm text-charcoal">We keep it safe. We need your guardian's details.</p>
                            <p className="text-xs text-gray-dark mt-0.5 font-sora">
                              Your submission is safe with us. We'll contact your guardian and get their consent before anything goes live.
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Guardian's Name *</label>
                            <input
                              type="text"
                              name="guardianName"
                              required={isUnder18} maxLength={100}
                              value={form.guardianName}
                              onChange={handleChange}
                              placeholder="Parent / guardian name"
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Guardian's Email *</label>
                            <input
                              type="email"
                              name="guardianEmail"
                              required={isUnder18} maxLength={254}
                              value={form.guardianEmail}
                              onChange={handleChange}
                              placeholder="guardian@email.com"
                              className="input-field"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-colors ${
                          form.consentGiven ? 'bg-blue-mein border-blue-mein' : 'border-gray-support group-hover:border-blue-mein'
                        }`}
                        onClick={() => setForm((f) => ({ ...f, consentGiven: !f.consentGiven }))}
                      >
                        {form.consentGiven && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                      <p className="text-sm text-gray-dark font-sora leading-relaxed">
                        I agree to the{' '}
                        <a href="/community-rules" className="text-blue-mein underline">Community Rules</a>{' '}
                        and confirm this is my original work. I understand that public sharing is reviewed before it goes live.
                      </p>
                    </label>

                    {error && (
                      <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-sora">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !form.consentGiven || (!activeMove && !form.moveType)}
                      className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting your move...' : 'Submit Your Move'}
                      {!loading && <ArrowRight size={16} />}
                    </button>
                  </form>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ─── WHAT HAPPENS NEXT ─────────────────────────────────────────────── */}
      {!submitted && !notSureDone && (
        <section className="py-12 md:py-16 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto px-5 md:px-8">
            <FadeUp>
              <div className="text-center mb-8">
                <SectionDivider className="mx-auto mb-4" />
                <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
                  What happens next?
                </h2>
                <p className="mt-2 font-sora text-gray-mid text-sm">
                  Here is what to expect after you submit.
                </p>
              </div>
            </FadeUp>

            {/* Desktop: row with connector line / Mobile: stacked */}
            <div className="relative">
              {/* Connector line — desktop only */}
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-blue-mein/15 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
                {NEXT_STEPS.map((step, i) => (
                  <FadeUp key={step.num} delay={i * 80}>
                    <div className="bg-white rounded-2xl border border-blue-mein/10 p-6 shadow-sm h-full flex flex-col items-start md:items-center md:text-center">
                      {/* Numbered badge */}
                      <div className="w-10 h-10 rounded-full bg-blue-pale flex items-center justify-center mb-4 flex-shrink-0">
                        <span className="text-xs font-sora font-black text-blue-mein tracking-wider">{step.num}</span>
                      </div>
                      <h3 className="font-sora font-bold text-base text-charcoal mb-1.5">{step.title}</h3>
                      <p className="font-sora text-gray-dark text-sm leading-relaxed">{step.body}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>

            <FadeUp delay={280}>
              <div className="mt-7 flex justify-center">
                <ConsentBadge />
              </div>
            </FadeUp>
          </div>
        </section>
      )}

    </div>
  )
}
