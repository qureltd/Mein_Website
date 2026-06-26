import { useState } from 'react'
import { ArrowRight, Check, AlertCircle } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { HandwrittenAccent, SectionDivider } from '../components/BrandElements'
import { supabase } from '../lib/supabase'

import futureMePortal from '../assets/Portal_Icon.png'
import futureMeNoteCard from '../assets/Future_Me_Letter.png'
import futureCardSeeYourself from '../assets/See_Yourself.png'
import futureCardStepIn from '../assets/Step_In.png'
import futureCardSayIt from '../assets/Say_It.png'
import futureCardKeepProof from '../assets/Keep_the_Proof.png'
import futureCardMakeMove from '../assets/Make_One_Move.png'
import futureMeDoodles from '../assets/Doodle_Pack.png'

const moveCards = [
  {
    img: futureCardSeeYourself,
    alt: 'See yourself message card',
    rotate: '-2deg',
    offsetY: 0,
  },
  {
    img: futureCardStepIn,
    alt: 'Step in message card',
    rotate: '1.5deg',
    offsetY: 28,
  },
  {
    img: futureCardSayIt,
    alt: 'Say it message card',
    rotate: '-1deg',
    offsetY: 0,
  },
  {
    img: futureCardKeepProof,
    alt: 'Keep the proof message card',
    rotate: '2deg',
    offsetY: 28,
  },
  {
    img: futureCardMakeMove,
    alt: 'Make one move message card',
    rotate: '-1.5deg',
    offsetY: 0,
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
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden bg-white">
        {/* Doodle accent — top-right, faint */}
        <div className="absolute top-10 right-0 w-52 md:w-72 opacity-[0.12] pointer-events-none select-none">
          <img src={futureMeDoodles} alt="" className="w-full object-contain" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left — copy */}
            <div className="max-w-lg mx-auto lg:mx-0">
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
              <FadeUp delay={250}>
                <blockquote className="mt-7 font-caveat text-2xl md:text-3xl text-blue-mein leading-snug">
                  "Sometimes the voice you need to hear is your own."
                </blockquote>
              </FadeUp>
              <FadeUp delay={350}>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a href="#take-the-challenge" className="btn-primary inline-flex justify-center">
                    Take the challenge
                    <ArrowRight size={16} />
                  </a>
                  <a href="#how-it-works" className="btn-outline-blue inline-flex justify-center">
                    See how it works
                  </a>
                </div>
              </FadeUp>
            </div>

            {/* Right — portal image */}
            <FadeUp delay={200}>
              <div className="flex justify-center lg:justify-end">
                <img
                  src={futureMePortal}
                  alt="Mein Open M portal graphic representing the Future Me challenge"
                  className="w-full max-w-xs md:max-w-sm lg:max-w-md object-contain animate-float drop-shadow-xl pointer-events-none select-none"
                />
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ─── NOTE CARD SECTION ────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* Note card image */}
            <FadeUp>
              <div className="flex justify-center md:justify-end">
                <img
                  src={futureMeNoteCard}
                  alt="Future Me message card beginning with Dear your name, in 10 years you will have"
                  className="w-full max-w-sm md:max-w-md object-contain drop-shadow-lg pointer-events-none select-none"
                  style={{ transform: 'rotate(-2deg)' }}
                />
              </div>
            </FadeUp>

            {/* Copy */}
            <FadeUp delay={120}>
              <div className="max-w-md mx-auto md:mx-0">
                <SectionDivider className="mb-5" />
                <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal leading-tight">
                  A message from the future you.
                </h2>
                <p className="mt-4 font-sora text-gray-dark text-lg leading-relaxed">
                  Write as the person you are becoming — then use that message when you need belief, direction, or one small move forward.
                </p>
                <p className="mt-5 font-caveat text-xl text-gray-mid">
                  Your message will look different. That's the point.
                </p>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ─── FUTURE MESSAGE CARDS ─────────────────────────────────────── */}
      <section id="how-it-works" className="relative py-20 md:py-28 bg-white overflow-hidden">
        {/* Doodle accent bottom-left, low opacity */}
        <div className="absolute bottom-0 left-0 w-40 md:w-56 opacity-[0.10] pointer-events-none select-none rotate-180">
          <img src={futureMeDoodles} alt="" className="w-full object-contain" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <FadeUp>
            <div className="text-center mb-14">
              <SectionDivider className="mx-auto" />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Your message from future you.
              </h2>
              <p className="mt-2 font-sora text-gray-mid text-sm">
                Five simple moves. One future-facing message.
              </p>
            </div>
          </FadeUp>

          {/* Mobile: horizontal snap scroll */}
          <div className="md:hidden -mx-5 px-5">
            <p className="font-caveat text-lg text-blue-mein mb-4 text-center">Swipe through the moves →</p>
            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar">
              {moveCards.map((card, i) => (
                <div
                  key={i}
                  className="min-w-[82vw] snap-start flex-shrink-0"
                >
                  <img
                    src={card.img}
                    alt={card.alt}
                    className="w-full object-contain drop-shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: staggered 3-2 grid */}
          <div className="hidden md:block max-w-5xl mx-auto">
            {/* Row 1: three cards */}
            <div className="grid grid-cols-3 gap-6 lg:gap-8 items-end">
              {moveCards.slice(0, 3).map((card, i) => (
                <FadeUp key={i} delay={i * 80}>
                  <div style={{ transform: `rotate(${card.rotate})`, marginTop: card.offsetY }}>
                    <img
                      src={card.img}
                      alt={card.alt}
                      className="w-full object-contain drop-shadow-lg hover:drop-shadow-xl transition-all duration-300 hover:scale-[1.03]"
                    />
                  </div>
                </FadeUp>
              ))}
            </div>
            {/* Row 2: two cards centred */}
            <div className="grid grid-cols-2 gap-6 lg:gap-8 mt-6 max-w-2xl mx-auto items-end">
              {moveCards.slice(3).map((card, i) => (
                <FadeUp key={i} delay={(i + 3) * 80}>
                  <div style={{ transform: `rotate(${card.rotate})`, marginTop: card.offsetY }}>
                    <img
                      src={card.img}
                      alt={card.alt}
                      className="w-full object-contain drop-shadow-lg hover:drop-shadow-xl transition-all duration-300 hover:scale-[1.03]"
                    />
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TAKE THE CHALLENGE (form) ────────────────────────────────── */}
      <section id="take-the-challenge" className="py-20 md:py-28 bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto px-5 md:px-8 pb-6 md:pb-0">
          <FadeUp>
            <SectionDivider />
            <h2 className="mt-5 font-sora font-extrabold text-3xl text-charcoal">
              Take the challenge.
            </h2>
            <p className="mt-3 font-sora text-gray-dark">
              Send a message to the version of you that is already becoming.
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
