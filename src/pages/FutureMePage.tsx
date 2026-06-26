import { useState } from 'react'
import { ArrowRight, Check, AlertCircle } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider, StarAccent, StickerNote } from '../components/BrandElements'
import { supabase } from '../lib/supabase'

const steps = [
  {
    number: '01',
    title: 'See yourself',
    body: 'Picture the person you are becoming. Fast forward 10 years. Who are you?',
    bg: 'bg-blue-pale',
    accent: 'text-blue-mein',
    rotate: '-rotate-1',
  },
  {
    number: '02',
    title: 'Step in',
    body: 'Answer like future you is already here. Use "I am," not "I want to be."',
    bg: 'bg-gold-pale',
    accent: 'text-gold-dark',
    rotate: 'rotate-1',
  },
  {
    number: '03',
    title: 'Say it',
    body: 'Create the message you need to hear. Speak it directly to yourself, right now.',
    bg: 'bg-white',
    accent: 'text-blue-mein',
    rotate: '-rotate-1',
  },
  {
    number: '04',
    title: 'Keep the proof',
    body: 'Save it for the days you need belief. Your own voice, your own clarity.',
    bg: 'bg-gold-pale',
    accent: 'text-gold-dark',
    rotate: 'rotate-1',
  },
  {
    number: '05',
    title: 'Make one move',
    body: 'Turn the message into one step today. The future starts with a single action.',
    bg: 'bg-blue-pale',
    accent: 'text-blue-mein',
    rotate: '-rotate-1',
  },
]

const defaultForm = { name: '', email: '', age: '', guardianName: '', guardianEmail: '', message: '' }

export default function FutureMePage() {
  const [form, setForm] = useState(defaultForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedStep, setExpandedStep] = useState<string | null>(null)

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

      {/* ─── YOUR MESSAGE FROM FUTURE YOU ────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-14">
              <SectionDivider className="mx-auto" />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Your message from future you.
              </h2>
              <p className="mt-2 text-gray-mid font-sora text-sm">
                Five simple moves. One future-facing message.
              </p>
            </div>
          </FadeUp>

          {/* Mobile: clean stacked cards */}
          <div className="md:hidden max-w-sm mx-auto space-y-4">
            {steps.map((step, i) => {
              const isOpen = expandedStep === step.number
              return (
                <FadeUp key={step.number} delay={i * 70}>
                  <button
                    onClick={() => setExpandedStep(isOpen ? null : step.number)}
                    className={`w-full text-left rounded-2xl border border-gray-support shadow-sm transition-all duration-300 overflow-hidden ${step.bg} ${isOpen ? 'shadow-md' : ''}`}
                  >
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`font-sora font-bold text-xs uppercase tracking-widest ${step.accent}`}>
                            {step.number}
                          </span>
                          <p className={`font-caveat text-xl leading-none ${step.accent}`}>{step.title}</p>
                        </div>
                        <span className={`text-sm font-sora transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${step.accent}`}>
                          ↓
                        </span>
                      </div>
                      {isOpen && (
                        <p className="mt-3 text-sm text-gray-dark font-sora leading-relaxed border-t border-black/5 pt-3">
                          {step.body}
                        </p>
                      )}
                    </div>
                  </button>
                </FadeUp>
              )
            })}
          </div>

          {/* Desktop: two-column staggered card grid */}
          <div className="hidden md:block relative max-w-4xl mx-auto">
            {/* Faint Open M watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <OpenMIcon size={360} className="opacity-[0.03]" />
            </div>

            {/* Row 1 */}
            <FadeUp>
              <div className="flex gap-8 items-start">
                {[steps[0], steps[1]].map((step, idx) => {
                  const isOpen = expandedStep === step.number
                  return (
                    <div key={step.number} className="flex-1" style={{ marginTop: idx === 1 ? 40 : 0 }}>
                      <button
                        onClick={() => setExpandedStep(isOpen ? null : step.number)}
                        className={`w-full text-left rounded-2xl border shadow-md transition-all duration-300 ${step.bg} ${step.rotate} ${isOpen ? 'shadow-xl scale-[1.02] border-blue-mein/30' : 'border-gray-support hover:shadow-lg hover:scale-[1.01]'}`}
                      >
                        <div className="px-6 py-6">
                          <p className={`font-sora text-[10px] font-bold uppercase tracking-[0.18em] mb-1 ${step.accent}`}>Move {step.number}</p>
                          <p className={`font-caveat text-2xl leading-tight mb-3 ${step.accent}`}>{step.title}</p>
                          <p className="text-sm text-gray-dark font-sora leading-relaxed">{step.body}</p>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </FadeUp>

            {/* Row 2 */}
            <FadeUp delay={120}>
              <div className="flex gap-8 items-start mt-8">
                {[steps[2], steps[3]].map((step, idx) => {
                  const isOpen = expandedStep === step.number
                  return (
                    <div key={step.number} className="flex-1" style={{ marginTop: idx === 1 ? 40 : 0 }}>
                      <button
                        onClick={() => setExpandedStep(isOpen ? null : step.number)}
                        className={`w-full text-left rounded-2xl border shadow-md transition-all duration-300 ${step.bg} ${step.rotate} ${isOpen ? 'shadow-xl scale-[1.02] border-blue-mein/30' : 'border-gray-support hover:shadow-lg hover:scale-[1.01]'}`}
                      >
                        <div className="px-6 py-6">
                          <p className={`font-sora text-[10px] font-bold uppercase tracking-[0.18em] mb-1 ${step.accent}`}>Move {step.number}</p>
                          <p className={`font-caveat text-2xl leading-tight mb-3 ${step.accent}`}>{step.title}</p>
                          <p className="text-sm text-gray-dark font-sora leading-relaxed">{step.body}</p>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </FadeUp>

            {/* Row 3: card 5 centred */}
            <FadeUp delay={240}>
              <div className="flex justify-center mt-8">
                {(() => {
                  const step = steps[4]
                  const isOpen = expandedStep === step.number
                  return (
                    <div style={{ width: '46%' }}>
                      <button
                        onClick={() => setExpandedStep(isOpen ? null : step.number)}
                        className={`w-full text-left rounded-2xl border shadow-md transition-all duration-300 ${step.bg} ${step.rotate} ${isOpen ? 'shadow-xl scale-[1.02] border-blue-mein/30' : 'border-gray-support hover:shadow-lg hover:scale-[1.01]'}`}
                      >
                        <div className="px-6 py-6">
                          <p className={`font-sora text-[10px] font-bold uppercase tracking-[0.18em] mb-1 ${step.accent}`}>Move {step.number}</p>
                          <p className={`font-caveat text-2xl leading-tight mb-3 ${step.accent}`}>{step.title}</p>
                          <p className="text-sm text-gray-dark font-sora leading-relaxed">{step.body}</p>
                        </div>
                      </button>
                    </div>
                  )
                })()}
              </div>
            </FadeUp>
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
