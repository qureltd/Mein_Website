import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'

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
    body: 'Read it back. Watch it back. Hear yourself. This message is built from your own clarity, not someone else\'s expectations.',
  },
  {
    number: '05',
    title: 'Make your next move',
    body: "Your future self just told you what to do. Now take one small step toward that version of you.",
  },
]

export default function FutureMePage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', age: '' })
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="with-mobile-cta">
      {/* ─── HERO ─── */}
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

      {/* ─── HOW IT WORKS ─── */}
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

      {/* ─── SUBMIT YOUR FUTURE ME ─── */}
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
                  onClick={() => setSubmitted(false)}
                  className="mt-7 btn-outline-blue inline-flex"
                >
                  Write another message
                </button>
              </div>
            </FadeUp>
          ) : (
            <FadeUp delay={100}>
              <form
                className="mt-8 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Your Future Me Message *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                    rows={7}
                    placeholder={"Dear [your name],\n\nIn 10 years, you will have..."}
                    className="textarea-field"
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-4">
                  Send to My Future Self
                  <ArrowRight size={16} />
                </button>
              </form>
            </FadeUp>
          )}
        </div>
      </section>
    </div>
  )
}
