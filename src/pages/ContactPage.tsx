import { useState } from 'react'
import { ArrowRight, Check, Mail, MessageCircle } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'
import { supabase } from '../lib/supabase'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.from('submissions').insert({
      name: form.name,
      email: form.email,
      type: 'contact',
      title: form.subject,
      content: form.message,
      status: 'received',
      is_under_18: false,
    })
    setLoading(false)
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
            <span className="tag-badge mb-5 inline-flex">Contact</span>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-charcoal leading-tight">
              Get in{' '}
              <HandwrittenAccent text="touch." className="text-5xl md:text-6xl" />
            </h1>
            <p className="mt-5 text-xl text-gray-dark font-sora max-w-xl">
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
            <FadeUp>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Your Name *</label>
                    <input type="text" required className="input-field" placeholder="Your full name"
                      value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Email *</label>
                    <input type="email" required className="input-field" placeholder="your@email.com"
                      value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Subject</label>
                  <input type="text" className="input-field" placeholder="What is this about?"
                    value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Message *</label>
                  <textarea required rows={6} className="textarea-field" placeholder="Tell us what's on your mind..."
                    value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4">
                  {loading ? 'Sending...' : 'Send Message'}
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
