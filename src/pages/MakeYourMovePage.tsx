import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Pen, Play, Hammer, Megaphone, Star, Upload, Check, AlertCircle } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'
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
        <div className="absolute right-0 top-0 translate-x-1/3 opacity-[0.04] pointer-events-none">
          <OpenMIcon size={500} />
        </div>
        <div className="container-wide section-padding relative z-10 max-w-3xl">
          <FadeUp>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-charcoal leading-tight">
              Your next move{' '}
              <HandwrittenAccent text="starts here." className="text-5xl md:text-6xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="mt-5 text-lg text-gray-dark font-sora">
              You do not need to know every step. Choose one move and start there.
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
                  <h2 className="mt-4 font-sora font-bold text-2xl text-charcoal">What move are you making?</h2>
                </div>
              </FadeUp>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {moveTypes.map((move, i) => (
                  <FadeUp key={move.id} delay={i * 70}>
                    <button
                      onClick={() => handleSelect(move.id)}
                      className="move-card text-left w-full flex flex-col group"
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: move.bg }}
                      >
                        <move.icon size={20} style={{ color: move.accent }} strokeWidth={2} />
                      </div>
                      <span className="tag-badge mb-3 self-start text-xs" style={{ color: move.accent, backgroundColor: move.bg }}>
                        {move.label}
                      </span>
                      <HandwrittenAccent text={move.tagline} className="text-xl mb-2" />
                      <p className="text-sm text-gray-dark font-sora">{move.description}</p>
                      <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold font-sora text-blue-mein">
                        Make this move <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
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

              <div className="bg-gray-support/20 rounded-3xl p-7 md:p-10 border-2 border-gray-support">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: selectedMove.bg }}
                >
                  <selectedMove.icon size={24} style={{ color: selectedMove.accent }} strokeWidth={2} />
                </div>
                <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
                  {selectedMove.tagline}
                </h2>
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
                          <p className="font-sora font-bold text-sm text-charcoal">Parent or Guardian Required</p>
                          <p className="text-xs text-gray-dark mt-0.5 font-sora">
                            Because you are under 18, we need parent or guardian details before your work can be published publicly.
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
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-blue-pale flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-blue-mein" strokeWidth={2.5} />
                </div>
                <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                  Your move has landed.
                </h2>
                <HandwrittenAccent text="We've got it." className="text-2xl block mt-3" />
                <p className="mt-5 text-gray-dark font-sora max-w-md mx-auto leading-relaxed">
                  Your submission is now under review. We'll be in touch at the email you provided.
                  {form.age && parseInt(form.age) < 18 && (
                    <> A consent request has been sent to your guardian's email.</>
                  )}
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
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
