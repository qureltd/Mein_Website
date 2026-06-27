import { useState } from 'react'
import { ArrowRight, Check, AlertCircle } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import {
  HandwrittenAccent,
  SectionDivider,
  OpenMIcon,
  MeinTagBadge,
} from '../components/BrandElements'
import { supabase } from '../lib/supabase'

import futureMePortal   from '../assets/Portal_Icon.png'
import futureMeNoteCard from '../assets/Future_Me_Letter.png'

// Individual doodle accents (2 on the page)
import futureMessageBackground from '../assets/Minamalist_Background.png'
import doodleSquiqqle from '../assets/Squiqqle.png'
import doodleArrow    from '../assets/Arrow.png'

// ─── Live card data ────────────────────────────────────────────────────────────
const moveCards = [
  {
    step: '01',
    title: 'See yourself.',
    body: 'Picture the person you are becoming.',
    accent: 'blue' as const,
    rotate: '-1deg',
    ty: '0px',
  },
  {
    step: '02',
    title: 'Step in.',
    body: 'Answer like future you is already here.',
    accent: 'gold' as const,
    rotate: '1.2deg',
    ty: '20px',
  },
  {
    step: '03',
    title: 'Say it.',
    body: 'Create the message you need to hear.',
    accent: 'blue' as const,
    rotate: '-0.8deg',
    ty: '0px',
  },
  {
    step: '04',
    title: 'Keep the proof.',
    body: 'Save it for the days you need belief.',
    accent: 'gold' as const,
    rotate: '1deg',
    ty: '-6px',
  },
  {
    step: '05',
    title: 'Make one move.',
    body: 'Turn the message into one step today.',
    accent: 'blue' as const,
    rotate: '-0.8deg',
    ty: '14px',
  },
]

// ─── Reusable move card ────────────────────────────────────────────────────────
function MoveCard({
  step,
  title,
  body,
  accent,
}: {
  step: string
  title: string
  body: string
  accent: 'blue' | 'gold'
}) {
  const isGold = accent === 'gold'
  return (
    <div className="relative h-full bg-white rounded-3xl border border-blue-mein/20 shadow-lg p-6 md:p-8 min-h-[240px] md:min-h-[260px] overflow-hidden flex flex-col">
      {/* Top accent strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl ${
          isGold
            ? 'bg-gradient-to-r from-gold-mein to-gold-light'
            : 'bg-gradient-to-r from-blue-mein to-blue-light'
        }`}
      />
      {/* Faint Open M watermark */}
      <div className="absolute bottom-2 right-2 pointer-events-none select-none opacity-[0.05]">
        <OpenMIcon size={80} />
      </div>
      {/* Step badge */}
      <span
        className={`text-xs font-sora font-bold uppercase tracking-widest mb-4 ${
          isGold ? 'text-gold-dark' : 'text-blue-mein'
        }`}
      >
        Step {step}
      </span>
      {/* Title */}
      <h3 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal leading-tight mb-3">
        {title}
      </h3>
      {/* Body */}
      <p className="font-sora text-gray-dark text-base md:text-lg leading-relaxed flex-1">
        {body}
      </p>
    </div>
  )
}

// ─── Form default ──────────────────────────────────────────────────────────────
const defaultForm = {
  name: '',
  email: '',
  age: '',
  guardianName: '',
  guardianEmail: '',
  message: '',
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function FutureMePage() {
  const [form, setForm]           = useState(defaultForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const isUnder18 = form.age !== '' && parseInt(form.age) < 18

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const age     = parseInt(form.age) || null
      const under18 = age !== null && age < 18
      const { error: dbError } = await supabase.from('submissions').insert({
        name: form.name,
        email: form.email,
        age,
        type: 'future_me',
        title: 'Future Me Message',
        content: form.message,
        status: 'received',
        is_under_18: under18,
        guardian_name:  under18 ? form.guardianName  : null,
        guardian_email: under18 ? form.guardianEmail : null,
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

  return (
    <div className="with-mobile-cta">

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-8 md:pt-16 md:pb-12 overflow-hidden bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Copy */}
            <div className="max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <FadeUp>
                <p className="font-caveat text-blue-mein text-xl mb-3">Meet Future Me</p>
                <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-charcoal leading-tight">
                  Take the Future Me{' '}
                  <HandwrittenAccent text="Challenge." className="text-5xl md:text-6xl" />
                </h1>
              </FadeUp>
              <FadeUp delay={150}>
                <blockquote className="mt-5 font-caveat text-2xl md:text-3xl text-blue-mein leading-snug">
                  "Sometimes the voice you need to hear is your own."
                </blockquote>
              </FadeUp>
              <FadeUp delay={250}>
                <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <a href="#take-the-challenge" className="btn-primary inline-flex justify-center">
                    Take the challenge <ArrowRight size={16} />
                  </a>
                  <a href="#how-it-works" className="btn-outline-blue inline-flex justify-center">
                    See how it works
                  </a>
                </div>
              </FadeUp>
            </div>

            {/* Portal image */}
            <FadeUp delay={180}>
              <div className="flex justify-center lg:justify-end">
                <img
                  src={futureMePortal}
                  alt="Mein Open M portal graphic representing the Future Me challenge"
                  className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[440px] object-contain animate-float drop-shadow-xl pointer-events-none select-none"
                />
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ─── NOTE CARD ─────────────────────────────────────────────────────── */}
      <section className="py-8 md:py-10 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">

            {/* Note card — white-space cropped via overflow-hidden + scale */}
            <FadeUp>
              <div className="flex justify-center md:justify-end">
                <div
                  className="overflow-hidden w-full max-w-sm sm:max-w-md md:max-w-lg"
                  style={{ transform: 'rotate(-2deg)' }}
                >
                  <img
                    src={futureMeNoteCard}
                    alt="Future Me letter card starting with Dear your name, in 10 years you will have"
                    className="w-full object-contain drop-shadow-xl pointer-events-none select-none scale-[1.16]"
                  />
                </div>
              </div>
            </FadeUp>

            {/* Copy */}
            <FadeUp delay={100}>
              <div className="max-w-md mx-auto md:mx-0 text-center md:text-left">
                <SectionDivider className="mb-4 mx-auto md:mx-0" />
                <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal leading-tight">
                  A message from the future you.
                </h2>
                <p className="mt-4 font-sora text-gray-dark text-lg leading-relaxed">
                  Write as the person you are becoming — then use that message when you need belief, direction, or one small move forward.
                </p>
                {/* Inline doodle arrow next to the CTA */}
                <div className="mt-7 flex items-center gap-3 justify-center md:justify-start">
                  <a href="#take-the-challenge" className="btn-primary inline-flex">
                    Take the challenge <ArrowRight size={16} />
                  </a>
                  <img
                    src={doodleArrow} alt="" aria-hidden="true"
                    className="pointer-events-none select-none w-12 -rotate-12 hidden md:block"
                  />
                </div>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ─── FIVE MOVE CARDS ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative py-8 md:py-12 overflow-hidden">
        {/* Section background */}
        <img
          src={futureMessageBackground}
          alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 h-full w-full object-cover"
        />
        {/* Subtle white wash to keep cards readable */}
        <div className="absolute inset-0 bg-white/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">

          <FadeUp>
            <div className="text-center mb-6">
              <SectionDivider className="mx-auto mb-4" />
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Your message from future you.
              </h2>
              <p className="mt-1.5 font-sora text-gray-mid text-sm">
                Five simple moves. One future-facing message.
              </p>
            </div>
          </FadeUp>

          {/* ── MOBILE: horizontal snap-scroll ─────────────────────────────── */}
          <div className="md:hidden">
            <p className="font-caveat text-lg text-gray-mid mb-4 text-center">
              Swipe through the moves →
            </p>
            {/* -mx-5 px-5 allows full-bleed scroll without page overflow */}
            <div className="-mx-5 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth px-5">
              <div className="flex gap-4 pb-4">
                {moveCards.map((card) => (
                  <div
                    key={card.step}
                    className="shrink-0 snap-start min-w-[86vw] max-w-[86vw]"
                  >
                    <MoveCard
                      step={card.step}
                      title={card.title}
                      body={card.body}
                      accent={card.accent}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── DESKTOP: staggered 3+2 card deck ──────────────────────────── */}
          <div className="hidden md:block">
            {/* Row 1 */}
            <div className="grid grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {moveCards.slice(0, 3).map((card, i) => (
                <FadeUp key={card.step} delay={i * 70}>
                  <div
                    className="transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                    style={{ transform: `rotate(${card.rotate}) translateY(${card.ty})` }}
                  >
                    <MoveCard
                      step={card.step}
                      title={card.title}
                      body={card.body}
                      accent={card.accent}
                    />
                  </div>
                </FadeUp>
              ))}
            </div>
            {/* Row 2 — centred */}
            <div className="grid grid-cols-2 gap-6 lg:gap-8 mt-6 max-w-[66%] mx-auto">
              {moveCards.slice(3).map((card, i) => (
                <FadeUp key={card.step} delay={(i + 3) * 70}>
                  <div
                    className="transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                    style={{ transform: `rotate(${card.rotate}) translateY(${card.ty})` }}
                  >
                    <MoveCard
                      step={card.step}
                      title={card.title}
                      body={card.body}
                      accent={card.accent}
                    />
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ─── TAKE THE CHALLENGE (form) ─────────────────────────────────────── */}
      <section id="take-the-challenge" className="py-8 md:py-12 bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto px-5 md:px-8 pb-6 md:pb-0">

          <FadeUp>
            <div className="text-center mb-6">
              <SectionDivider className="mx-auto mb-4" />
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Take the challenge.
              </h2>
              <p className="mt-2.5 font-sora text-gray-dark text-lg">
                Send a message to the version of you that is already becoming.
              </p>
            </div>
          </FadeUp>

          {submitted ? (
            <FadeUp>
              <div className="text-center py-14 bg-blue-pale rounded-3xl px-6 border border-blue-mein/15 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-blue-mein flex items-center justify-center mx-auto mb-5">
                  <Check size={28} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-sora font-bold text-2xl text-charcoal">Message received.</h3>
                <HandwrittenAccent text="Your future self has spoken." className="text-xl block mt-2" />
                <p className="mt-4 text-gray-dark font-sora text-sm max-w-sm mx-auto">
                  Your Future Me message is now under review. When approved, it could appear on The Wall to inspire others.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm(defaultForm) }}
                  className="mt-7 btn-outline-blue inline-flex"
                >
                  Write another message
                </button>
              </div>
            </FadeUp>
          ) : (
            <FadeUp delay={80}>
              <div className="relative bg-white rounded-3xl border border-blue-mein/20 shadow-2xl overflow-hidden">
                {/* Gold accent strip */}
                <div className="h-1.5 bg-gradient-to-r from-gold-mein via-gold-light to-gold-mein" />

                {/* Faint Open M watermark */}
                <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/4 pointer-events-none select-none opacity-[0.05]">
                  <OpenMIcon size={300} />
                </div>

                {/* Doodle: squiqqle loop near the submit button — desktop only */}
                <img
                  src={doodleSquiqqle} alt="" aria-hidden="true"
                  className="pointer-events-none select-none absolute -bottom-3 -left-3 w-16 opacity-90 hidden md:block rotate-[15deg]"
                />

                <div className="relative z-10 p-6 md:p-10">
                  {/* Final step badge */}
                  <div className="mb-6">
                    <MeinTagBadge label="Final step" color="gold" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text" name="name" required value={form.name}
                          onChange={handleChange} placeholder="Your name"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email" name="email" required value={form.email}
                          onChange={handleChange} placeholder="your@email.com"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">
                        Age *
                      </label>
                      <input
                        type="number" name="age" required min={10} max={25}
                        value={form.age} onChange={handleChange}
                        placeholder="Your age" className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">
                        Your Future Me Message *
                      </label>
                      <textarea
                        name="message" required value={form.message}
                        onChange={handleChange} rows={7}
                        placeholder={"Dear [your name],\n\nIn 10 years, you will have..."}
                        className="textarea-field"
                      />
                    </div>

                    {isUnder18 && (
                      <div className="bg-gold-pale border-2 border-gold-mein/30 rounded-2xl p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <AlertCircle size={18} className="text-gold-dark mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-sora font-bold text-sm text-charcoal">
                              We keep it safe. We need your guardian's details.
                            </p>
                            <p className="text-xs text-gray-dark mt-0.5 font-sora">
                              Your message is safe with us. We'll contact your guardian before anything goes live.
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">
                              Guardian's Name *
                            </label>
                            <input
                              type="text" name="guardianName" required={isUnder18}
                              value={form.guardianName} onChange={handleChange}
                              placeholder="Parent / guardian name" className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">
                              Guardian's Email *
                            </label>
                            <input
                              type="email" name="guardianEmail" required={isUnder18}
                              value={form.guardianEmail} onChange={handleChange}
                              placeholder="guardian@email.com" className="input-field"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-sora">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit" disabled={loading}
                      className="btn-primary w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Send My Future Me Message'}
                      {!loading && <ArrowRight size={16} />}
                    </button>
                  </form>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

    </div>
  )
}
