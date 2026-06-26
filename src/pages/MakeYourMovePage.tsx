import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Pen, Play, Hammer, Megaphone, Star, Upload, Check, AlertCircle } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider, StarAccent } from '../components/BrandElements'
import { supabase } from '../lib/supabase'

const moveTypes = [
  {
    id: 'create',
    icon: Pen,
    label: 'Create',
    tagline: 'Express it.',
    description: 'Submit art, writing, poetry, photos, designs, ideas, or any creative work.',
    placeholder: 'Tell us about your creative work — what is it, what inspired it, and what you want to share.',
    bg: '#EBF0FF',
    accent: '#2F6BFF',
  },
  {
    id: 'speak',
    icon: Play,
    label: 'Speak',
    tagline: 'Say it.',
    description: 'Share a story, video, future-self message, or Mein Mover clip.',
    placeholder: 'Share your story, what you want to say, or paste a link to your video.',
    bg: '#F5F5F5',
    accent: '#111111',
  },
  {
    id: 'build',
    icon: Hammer,
    label: 'Build',
    tagline: 'Start it.',
    description: 'Business idea, creative project, product, or hustle you want to grow.',
    placeholder: 'Tell us about the idea or project you are building. What is it? What problem does it solve?',
    bg: '#FFF8E1',
    accent: '#F4B400',
  },
  {
    id: 'represent',
    icon: Megaphone,
    label: 'Represent',
    tagline: 'Own it.',
    description: 'Apply to become a Mein content creator or youth voice.',
    placeholder: 'Tell us why you want to represent Mein — your voice, your story, why this movement matters to you.',
    bg: '#EBF0FF',
    accent: '#2F6BFF',
  },
  {
    id: 'feature',
    icon: Star,
    label: 'Be Featured',
    tagline: 'Stand out.',
    description: 'Submit for possible feature on The Wall after review.',
    placeholder: 'What would you like to be featured for? Tell us about what you want to share.',
    bg: '#FFF8E1',
    accent: '#F4B400',
  },
]

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
}

export default function MakeYourMovePage() {
  const [searchParams] = useSearchParams()
  const [selected, setSelected] = useState<string>(searchParams.get('type') || '')
  const [step, setStep] = useState<'select' | 'form' | 'success'>(
    searchParams.get('type') ? 'form' : 'select'
  )
  const [form, setForm] = useState<FormData>({ ...defaultForm, moveType: searchParams.get('type') || '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isUnder18 = parseInt(form.age) < 18 && form.age !== ''
  const selectedMove = moveTypes.find((m) => m.id === selected)

  function handleSelect(id: string) {
    setSelected(id)
    setForm((f) => ({ ...f, moveType: id }))
    setStep('form')
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
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
      setStep('success')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="with-mobile-cta">
      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-14 md:pt-40 md:pb-20 bg-white overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/3 opacity-[0.04] pointer-events-none select-none">
          <OpenMIcon size={500} />
        </div>
        <div className="container-wide section-padding relative z-10 max-w-3xl">
          <FadeUp>
            <p className="font-caveat text-blue-mein text-xl mb-3">
              How do you want to make your move?
            </p>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-charcoal leading-tight">
              Your move{' '}
              <HandwrittenAccent text="starts here." className="text-5xl md:text-6xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="mt-5 text-lg text-gray-dark font-sora">
              Choose one lane. Start there. One move is enough.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="pb-24 bg-white">
        <div className="container-wide section-padding max-w-4xl">

          {/* Step: Select move */}
          {step === 'select' && (
            <>
              <FadeUp>
                <div className="mb-10">
                  <SectionDivider />
                  <h2 className="mt-4 font-sora font-bold text-2xl text-charcoal">Choose your move.</h2>
                  <p className="mt-1 text-sm text-gray-mid font-sora md:hidden">Swipe to see all options.</p>
                </div>
              </FadeUp>

              {/* Mobile: horizontal swipeable scroll. md+: grid. */}
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5 no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0 items-stretch">
                {moveTypes.map((move, i) => (
                  <FadeUp
                    key={move.id}
                    delay={i * 60}
                    className="snap-start flex-shrink-0 w-[82vw] md:w-auto"
                  >
                    <button
                      onClick={() => handleSelect(move.id)}
                      className="move-card text-left w-full h-full flex flex-col group"
                      style={{ '--accent': move.accent } as React.CSSProperties}
                    >
                      {/* Number + icon */}
                      <div className="flex items-start justify-between mb-4">
                        <span
                          className="font-sora font-black text-4xl leading-none tracking-tight"
                          style={{ color: move.bg }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: move.bg }}
                        >
                          <move.icon size={20} style={{ color: move.accent }} strokeWidth={2} />
                        </div>
                      </div>
                      <p
                        className="text-[10px] font-sora font-semibold uppercase tracking-[0.18em] mb-1"
                        style={{ color: move.accent }}
                      >
                        Move {String(i + 1).padStart(2, '0')} — {move.label}
                      </p>
                      <HandwrittenAccent text={move.tagline} className="text-xl mb-2" />
                      <p className="text-sm text-gray-dark font-sora flex-1">{move.description}</p>
                      <div
                        className="mt-5 flex items-center gap-1.5 text-sm font-semibold font-sora group-hover:gap-3 transition-all duration-200"
                        style={{ color: move.accent }}
                      >
                        Make this move
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </FadeUp>
                ))}
              </div>
            </>
          )}

          {/* Step: Form */}
          {step === 'form' && selectedMove && (
            <FadeUp>
              <div className="mb-8 flex items-center gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="text-sm text-gray-mid hover:text-blue-mein transition-colors font-sora"
                >
                  ← Back
                </button>
                <span className="text-gray-support">|</span>
                <span className="tag-badge">{selectedMove.label}</span>
              </div>

              {/* Path connector — visual bridge from selection to form */}
              <div className="flex justify-center mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-mein" />
                  <div className="mt-0.5 h-10" style={{ width: 1, borderLeft: '2px dashed rgba(47,107,255,0.3)' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-mein/30" />
                </div>
              </div>

              <div className="bg-gray-support/20 rounded-3xl p-7 md:p-10 border-2 border-gray-support">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: selectedMove.bg }}
                >
                  <selectedMove.icon size={24} style={{ color: selectedMove.accent }} strokeWidth={2} />
                </div>
                <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
                  Your move starts here.
                </h2>
                <HandwrittenAccent text={selectedMove.tagline} className="text-xl mt-1 block" />
                <p className="mt-2 text-gray-dark font-sora">{selectedMove.description}</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
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
                        required
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
                      required
                      value={form.content}
                      onChange={handleChange}
                      rows={6}
                      placeholder={selectedMove.placeholder}
                      className="textarea-field"
                    />
                  </div>

                  {/* Under 18 guardian section */}
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

                  {/* Terms agreement */}
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
                    disabled={loading || !form.consentGiven}
                    className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting your move...' : 'Submit Your Move'}
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </form>
              </div>
            </FadeUp>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <FadeUp>
              <div className="text-center py-16 md:py-20">
                {/* Celebration graphic: stars + Open M */}
                <div className="flex items-center justify-center gap-5 mb-6">
                  <StarAccent className="opacity-60" />
                  <div className="w-24 h-24 rounded-full bg-blue-pale flex items-center justify-center shadow-lg shadow-blue-mein/10">
                    <OpenMIcon size={52} />
                  </div>
                  <StarAccent className="opacity-60" />
                </div>

                <h2 className="font-sora font-extrabold text-3xl md:text-5xl text-charcoal">
                  Your move has landed.
                </h2>
                <HandwrittenAccent text="The Mein team has got it." className="text-2xl block mt-3" />

                <p className="mt-5 text-gray-dark font-sora max-w-md mx-auto leading-relaxed">
                  The Mein team will review it and get back to you at the email you provided.
                  {form.age && parseInt(form.age) < 18 && (
                    <> A consent request has been sent to your guardian's email.</>
                  )}
                </p>

                <div className="mt-9 flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => { setStep('select'); setForm(defaultForm); setSelected('') }}
                    className="btn-primary"
                  >
                    Make Another Move
                    <ArrowRight size={16} />
                  </button>
                  <a href="/stories" className="btn-secondary">See Stories</a>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </section>
    </div>
  )
}
