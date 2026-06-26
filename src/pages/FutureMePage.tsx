import { useState } from 'react'
import { ArrowRight, Check, AlertCircle } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider, StarAccent, StickerNote } from '../components/BrandElements'
import { supabase } from '../lib/supabase'

const steps = [
  {
    number: '01',
    title: 'See yourself',
    body: 'Imagine the person you are becoming. Fast forward 10 years. Who are you?',
  },
  {
    number: '02',
    title: 'Step in',
    body: 'Answer as your future self. Not who you are today — who you are becoming.',
  },
  {
    number: '03',
    title: 'Say it',
    body: 'Write your message. Speak directly to the person you are right now.',
  },
  {
    number: '04',
    title: 'Keep the proof',
    body: 'Read it back. Hear yourself. Use it when you need belief.',
  },
  {
    number: '05',
    title: 'Make one move',
    body: 'Turn the future into action today. One step toward that version of you.',
  },
]

const defaultForm = { name: '', email: '', age: '', guardianName: '', guardianEmail: '', message: '' }

export default function FutureMePage() {
  const [form, setForm] = useState(defaultForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isUnder18 = form.age !== '' && parseInt(form.age) < 18

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const age = parseInt(form.age) || null
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
        guardian_name: under18 ? form.guardianName : null,
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

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-0 md:pt-40 overflow-hidden bg-white">
        {/* Faint background M */}
        <div className="absolute right-0 top-0 translate-x-1/3 opacity-[0.04] pointer-events-none select-none">
          <OpenMIcon size={600} />
        </div>

        <div className="container-wide section-padding relative z-10 max-w-3xl">
          <FadeUp>
            <p className="font-caveat text-blue-mein text-xl mb-4">Meet Future Me</p>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-charcoal leading-tight">
              Take the Future Me{' '}
              <HandwrittenAccent text="Challenge." className="text-5xl md:text-6xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="mt-5 font-caveat text-2xl md:text-3xl text-charcoal">
              Future you has something to say.
            </p>
          </FadeUp>
        </div>

        {/* ── Portal graphic ── */}
        <div className="flex justify-center mt-10 mb-0 relative">
          {/* Outer dashed ring — slow spin */}
          <div
            className="absolute w-56 h-56 md:w-64 md:h-64 rounded-full border-2 border-dashed border-gold-mein/50 animate-spin-slow"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
          {/* Inner solid ring */}
          <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full bg-blue-pale border-4 border-blue-mein/20 shadow-xl shadow-blue-mein/10 flex items-center justify-center animate-float">
            {/* Gold accent dot top-right */}
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-mein shadow-md" />
            <OpenMIcon size={80} />
          </div>
        </div>

        {/* Quote anchor */}
        <FadeUp delay={200}>
          <div className="text-center mt-8 pb-16 md:pb-20 px-6">
            <p className="font-caveat text-3xl md:text-4xl text-charcoal max-w-xl mx-auto leading-snug">
              "Sometimes the voice you need to hear is your own."
            </p>
          </div>
        </FadeUp>
      </section>

      {/* ─── SAMPLE MESSAGE CARD ──────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-gray-support/20">
        <div className="container-wide section-padding max-w-2xl mx-auto">
          <FadeUp>
            <div className="text-center mb-8">
              <SectionDivider className="mx-auto" />
              <p className="mt-4 font-sora text-sm font-semibold uppercase tracking-widest text-gray-mid">
                What it looks like
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="relative">
              {/* Star accent */}
              <div className="absolute -top-3 -right-3 md:-right-5">
                <StarAccent className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              {/* Note card */}
              <div className="bg-white border border-gray-support rounded-3xl p-8 md:p-10 shadow-lg shadow-blue-mein/5">
                {/* Sticker label */}
                <div className="mb-5">
                  <StickerNote text="Future Me · 10 years from now" color="gold" rotate={-1} />
                </div>
                <p className="font-caveat text-2xl md:text-3xl text-charcoal leading-relaxed">
                  Dear [your name],
                </p>
                <p className="mt-3 font-caveat text-xl md:text-2xl text-gray-dark leading-relaxed">
                  In 10 years you will have built something real. You will know your worth. You won't need anyone's permission to take up space.
                </p>
                <p className="mt-4 font-caveat text-xl md:text-2xl text-gray-dark leading-relaxed">
                  The thing you're scared to start? Start it. I did. And it changed everything.
                </p>
                <p className="mt-5 font-caveat text-lg text-blue-mein">— Future You</p>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={180}>
            <p className="mt-6 text-center text-sm text-gray-mid font-sora">
              Your message will look different. That's the point.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── THE EXPERIENCE ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-14">
              <SectionDivider className="mx-auto" />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                The experience.
              </h2>
              <p className="mt-2 text-gray-mid font-sora text-sm">Five steps. Your own voice.</p>
            </div>
          </FadeUp>

          {/* Mobile: vertical path. Desktop: alternating. */}
          <div className="max-w-3xl mx-auto">

            {/* Mobile layout — simple vertical cards with dashed connector */}
            <div className="md:hidden space-y-0">
              {steps.map((step, i) => (
                <FadeUp key={step.number} delay={i * 80}>
                  <div className="flex gap-4">
                    {/* Connector column */}
                    <div className="flex flex-col items-center flex-shrink-0 w-10">
                      <div className="w-10 h-10 rounded-xl bg-blue-pale flex items-center justify-center flex-shrink-0">
                        <span className="font-sora font-bold text-blue-mein text-xs">{step.number}</span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className="flex-1 mt-1 mb-1" style={{ width: 1, borderLeft: '2px dashed rgba(47,107,255,0.2)', minHeight: 28 }} />
                      )}
                    </div>
                    {/* Card */}
                    <div className="flex-1 pb-5">
                      <div className="bg-gray-support/20 rounded-2xl p-5 border border-gray-support hover:border-blue-mein transition-colors duration-300">
                        <HandwrittenAccent text={step.title} className="text-xl block mb-1" />
                        <p className="text-sm text-gray-dark font-sora leading-relaxed">{step.body}</p>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* Desktop layout — alternating left/right with dashed centre line */}
            <div className="hidden md:block relative">
              {/* Dashed centre line */}
              <div
                className="absolute left-1/2 top-6 bottom-6 -translate-x-1/2 pointer-events-none"
                style={{ width: 1, borderLeft: '2px dashed rgba(47,107,255,0.2)' }}
              />

              <div className="space-y-8">
                {steps.map((step, i) => {
                  const isLeft = i % 2 === 0
                  return (
                    <FadeUp key={step.number} delay={i * 80}>
                      <div className={`flex items-center gap-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                        {/* Card */}
                        <div className="flex-1">
                          <div className="bg-gray-support/20 rounded-2xl p-6 border border-gray-support hover:border-blue-mein hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-9 h-9 rounded-xl bg-blue-pale flex items-center justify-center flex-shrink-0">
                                <span className="font-sora font-bold text-blue-mein text-xs">{step.number}</span>
                              </div>
                              <HandwrittenAccent text={step.title} className="text-xl" />
                            </div>
                            <p className="text-sm text-gray-dark font-sora leading-relaxed">{step.body}</p>
                          </div>
                        </div>
                        {/* Centre dot */}
                        <div className="flex-shrink-0 w-4 flex justify-center">
                          <div className="w-3 h-3 rounded-full bg-blue-mein ring-4 ring-blue-pale" />
                        </div>
                        {/* Spacer */}
                        <div className="flex-1" />
                      </div>
                    </FadeUp>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TAKE THE CHALLENGE (form) ────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-support/20">
        <div className="container-wide section-padding max-w-2xl mx-auto pb-6 md:pb-0">
          <FadeUp>
            <SectionDivider />
            <h2 className="mt-5 font-sora font-extrabold text-3xl text-charcoal">
              Take the challenge.
            </h2>
            <p className="mt-3 text-gray-dark font-sora">
              Speak as your future self. Share what you know, what you've built, and what you want your present self to hear.
            </p>
          </FadeUp>

          {submitted ? (
            <FadeUp>
              <div className="mt-10 text-center py-12 bg-blue-pale rounded-3xl px-6">
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
            <FadeUp delay={100}>
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="input-field"
                    />
                  </div>
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

                <div>
                  <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">
                    Your Future Me Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    rows={7}
                    placeholder={"Dear [your name],\n\nIn 10 years, you will have..."}
                    className="textarea-field"
                  />
                </div>

                {/* Under-18 guardian section */}
                {isUnder18 && (
                  <div className="bg-gold-pale border-2 border-gold-mein/30 rounded-2xl p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle size={18} className="text-gold-dark mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-sora font-bold text-sm text-charcoal">We keep it safe. We need your guardian's details.</p>
                        <p className="text-xs text-gray-dark mt-0.5 font-sora">
                          Your message is safe with us. We'll contact your guardian before anything goes live.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Guardian's Name *</label>
                        <input
                          type="text"
                          name="guardianName"
                          required={isUnder18}
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
                          required={isUnder18}
                          value={form.guardianEmail}
                          onChange={handleChange}
                          placeholder="guardian@email.com"
                          className="input-field"
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
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send My Future Me Message'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            </FadeUp>
          )}
        </div>
      </section>
    </div>
  )
}
