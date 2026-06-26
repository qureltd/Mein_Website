import { useState } from 'react'
import { ArrowRight, Check, AlertCircle } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'
import { supabase } from '../lib/supabase'

const steps = [
  {
    number: '01',
    title: 'Imagine your future self',
    body: 'Close your eyes. Fast forward 10 years. Who are you? What have you built? What do you know now that you wish you knew today?',
  },
  {
    number: '02',
    title: 'Step into that version of you',
    body: 'Speak as your future self. Not who you are today — who you are becoming. Use "I am," not "I want to be."',
  },
  {
    number: '03',
    title: 'Record the message',
    body: 'Write it, record it, or film it. A message from your future self to your present self.',
  },
  {
    number: '04',
    title: 'Listen to your own belief',
    body: "Read it back. Watch it back. Hear yourself. This message is built from your own clarity, not someone else's expectations.",
  },
  {
    number: '05',
    title: 'Make your next move',
    body: "Your future self just told you what to do. Now take one small step toward that version of you.",
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
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
        <div className="absolute right-0 top-0 translate-x-1/3 opacity-[0.04] pointer-events-none">
          <OpenMIcon size={600} />
        </div>
        <div className="container-wide section-padding relative z-10 max-w-3xl">
          <FadeUp>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-charcoal leading-tight">
              Meet the{' '}
              <HandwrittenAccent text="future you." className="text-5xl md:text-6xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="mt-6 text-xl text-gray-dark font-sora leading-relaxed max-w-xl">
              Meet Future Me is a guided experience where you imagine who you are becoming, speak as your future self, and use that message to build confidence, clarity, and action today.
            </p>
          </FadeUp>
          <FadeUp delay={250}>
            <div className="mt-8 bg-blue-pale rounded-2xl px-6 py-5 border-l-4 border-blue-mein inline-block">
              <HandwrittenAccent
                text={'"Sometimes the voice you need to hear is your own."'}
                className="text-xl md:text-2xl"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-support/30">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-14">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                How it works
              </h2>
            </div>
          </FadeUp>
          <div className="max-w-3xl mx-auto space-y-5">
            {steps.map((step, i) => (
              <FadeUp key={step.number} delay={i * 80}>
                <div className="bg-white rounded-2xl p-7 border-2 border-gray-support hover:border-blue-mein transition-all duration-300 flex gap-5 items-start group">
                  <div className="w-12 h-12 rounded-xl bg-blue-pale flex items-center justify-center flex-shrink-0 group-hover:bg-blue-mein transition-colors">
                    <span className="font-sora font-bold text-blue-mein group-hover:text-white text-sm transition-colors">
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-sora font-bold text-charcoal text-lg">{step.title}</h3>
                    <p className="mt-2 text-gray-dark text-sm leading-relaxed font-sora">{step.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SUBMIT YOUR FUTURE ME ────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide section-padding max-w-2xl mx-auto">
          <FadeUp>
            <SectionDivider />
            <h2 className="mt-5 font-sora font-extrabold text-3xl text-charcoal">
              Write your Future Me message
            </h2>
            <p className="mt-3 text-gray-dark font-sora">
              Speak as your future self. Share what you know, what you've built, and what you want your present self to hear.
            </p>
          </FadeUp>

          {submitted ? (
            <FadeUp>
              <div className="mt-10 text-center py-12 bg-blue-pale rounded-3xl">
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
                  {loading ? 'Sending...' : 'Send to My Future Self'}
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
