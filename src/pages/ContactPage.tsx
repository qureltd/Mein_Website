import { useState, useEffect } from 'react'
import { ArrowRight, Check, Lightbulb, HelpCircle, Building2, Sparkles } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'
import { supabase } from '../lib/supabase'
import { useSearchParams } from 'react-router-dom'

const contactRoutes = [
  {
    key: 'young-person',
    icon: Lightbulb,
    title: "I'm a young person with an idea",
    support: 'Share what you are thinking, building, creating, or trying to start.',
    subject: 'Young person with an idea',
    iconBg: '#EBF0FF',
    iconColor: '#2F6BFF',
  },
  {
    key: 'parent',
    icon: HelpCircle,
    title: "I'm a parent with a question",
    support: 'Ask about consent, safety, participation, or how Mein works.',
    subject: 'Parent question',
    iconBg: '#FFF8E1',
    iconColor: '#C48F00',
  },
  {
    key: 'school',
    icon: Building2,
    title: 'I represent a school or organisation',
    support: 'Start a conversation about bringing Mein to young people you support.',
    subject: 'School or organisation enquiry',
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
  },
  {
    key: 'creator',
    icon: Sparkles,
    title: 'I want to collaborate or support Mein',
    support: 'For creators, mentors, sponsors, supporters, or anyone who wants to help the movement grow.',
    subject: 'Collaboration or support enquiry',
    iconBg: '#F5F0FF',
    iconColor: '#7C3AED',
  },
]

// Normalise ?type= query param to a route key
function normalizeTypeParam(raw: string | null): string | null {
  if (!raw) return null
  const s = raw.trim().toLowerCase()
  const aliases: Record<string, string> = {
    young_person: 'young-person',
    'young-person': 'young-person',
    young: 'young-person',
    youth: 'young-person',
    parent: 'parent',
    guardian: 'parent',
    school: 'school',
    organisation: 'school',
    organization: 'school',
    partner: 'school',
    creator: 'creator',
    collaborate: 'creator',
    collaboration: 'creator',
    support: 'creator',
    supporter: 'creator',
    general: 'creator',
  }
  return aliases[s] ?? null
}

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', _trap: '' })
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-select tile from ?type= param on mount
  useEffect(() => {
    const key = normalizeTypeParam(searchParams.get('type'))
    if (!key) return
    const route = contactRoutes.find((r) => r.key === key)
    if (route) {
      setSelectedRoute(route.key)
      setForm((f) => ({ ...f, subject: route.subject }))
    }
  }, [searchParams])

  function handleRouteSelect(route: typeof contactRoutes[number]) {
    setSelectedRoute(route.key)
    setForm(f => ({ ...f, subject: route.subject }))
  }

  // Map UI route key to contact_messages.contact_type DB enum
  function contactTypeFromRoute(key: string | null): string {
    if (key === 'young-person') return 'young_person'
    if (key === 'parent') return 'parent'
    if (key === 'school') return 'school'
    if (key === 'creator') return 'creator'
    return 'general'
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form._trap) return  // honeypot triggered — silently ignore
    setLoading(true)
    setError(null)
    const { error: dbError } = await supabase.from('contact_messages').insert({
      contact_type: contactTypeFromRoute(selectedRoute),
      name:         form.name,
      email:        form.email,
      subject:      form.subject || null,
      message:      form.message,
      status:       'new',
    })
    setLoading(false)
    if (dbError) {
      console.error('[ContactPage] contact_messages insert failed:', dbError.message)
      setError('Something went wrong. Please try again.')
      return
    }
    // TODO: Phase 4 — trigger contact_confirmation + admin_new_contact emails via server-side handler
    setSubmitted(true)
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
              Get in{' '}
              <HandwrittenAccent text="touch." className="text-5xl md:text-6xl" />
            </h1>
            <p className="mt-3 font-caveat text-blue-mein text-xl md:text-2xl">
              We read every message. We will reply.
            </p>
            <p className="mt-4 text-xl text-gray-dark font-sora max-w-xl">
              Questions, ideas, partnership enquiries, or just want to say hi — we'd love to hear from you.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── FORM ─── */}
      <section className="pb-24 bg-white">
        <div className="container-wide section-padding max-w-2xl mx-auto">
          {submitted ? (
            <FadeUp>
              <div className="text-center py-16 bg-blue-pale rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-blue-mein flex items-center justify-center mx-auto mb-5">
                  <Check size={28} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-sora font-bold text-2xl text-charcoal">Message received.</h3>
                <HandwrittenAccent text="We'll be in touch." className="text-xl block mt-2" />
                <p className="mt-4 text-gray-dark font-sora text-sm max-w-sm mx-auto">
                  The Mein team will get back to you at the email you provided.
                </p>
              </div>
            </FadeUp>
          ) : (
            <>
              {/* Contact route tiles */}
              <FadeUp>
                <div className="mb-8">
                  <SectionDivider className="mb-4" />
                  <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-widest mb-4">
                    Who is getting in touch?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {contactRoutes.map((route) => {
                      const isSelected = selectedRoute === route.key
                      return (
                        <button
                          key={route.key}
                          type="button"
                          onClick={() => handleRouteSelect(route)}
                          className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-mein focus-visible:ring-offset-2 ${
                            isSelected
                              ? 'border-blue-mein bg-blue-pale/40 shadow-sm'
                              : 'border-gray-support bg-white hover:border-blue-mein/40 hover:shadow-sm'
                          }`}
                          aria-pressed={isSelected}
                        >
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 flex-shrink-0"
                            style={{ backgroundColor: route.iconBg }}
                          >
                            <route.icon size={18} style={{ color: route.iconColor }} strokeWidth={2} />
                          </div>
                          <p className={`font-sora font-semibold text-sm leading-snug mb-1.5 ${isSelected ? 'text-blue-mein' : 'text-charcoal'}`}>
                            {route.title}
                          </p>
                          <p className="font-sora text-xs text-gray-dark leading-relaxed">
                            {route.support}
                          </p>
                          {isSelected && (
                            <div className="mt-2.5 flex items-center gap-1">
                              <Check size={11} className="text-blue-mein" strokeWidth={3} />
                              <span className="text-[10px] font-sora font-bold text-blue-mein uppercase tracking-widest">Selected</span>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={80}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot — hidden from real users, filled by bots */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <input tabIndex={-1} autoComplete="off" type="text" value={form._trap}
                      onChange={(e) => setForm(f => ({ ...f, _trap: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Your Name *</label>
                      <input type="text" required maxLength={100} className="input-field" placeholder="Your full name"
                        value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Email *</label>
                      <input type="email" required maxLength={254} className="input-field" placeholder="your@email.com"
                        value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Subject</label>
                    <input type="text" maxLength={200} className="input-field" placeholder="What is this about?"
                      value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Message *</label>
                    <textarea required maxLength={3000} rows={6} className="textarea-field" placeholder="Tell us what's on your mind..."
                      value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4">
                    {loading ? 'Sending...' : 'Send Message'}
                    {!loading && <ArrowRight size={16} />}
                  </button>
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 font-sora text-center">
                      {error}
                    </p>
                  )}
                </form>
              </FadeUp>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
