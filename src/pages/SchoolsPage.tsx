import { useState } from 'react'
import { ArrowRight, Check, Building2, GraduationCap } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'
import { supabase } from '../lib/supabase'

const benefits = [
  'Structured youth identity and confidence programmes',
  'Curriculum-linked creative expression projects',
  'Future-self guided experiences for students',
  'Youth entrepreneurship exploration',
  'Safe digital community for students',
  'Staff training and facilitation support',
]

export default function SchoolsPage() {
  const [formType, setFormType] = useState<'school' | 'partner'>('school')
  const [form, setForm] = useState({ name: '', orgName: '', email: '', role: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.from('submissions').insert({
      name: form.name,
      email: form.email,
      type: formType,
      content: `Organisation: ${form.orgName}\nRole: ${form.role}\nMessage: ${form.message}`,
      status: 'received',
      is_under_18: false,
    })
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="with-mobile-cta">
      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-white overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/3 opacity-[0.04] pointer-events-none">
          <OpenMIcon size={600} />
        </div>
        <div className="container-wide section-padding relative z-10 max-w-3xl">
          <FadeUp>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-charcoal leading-tight">
              Bring Mein to your{' '}
              <HandwrittenAccent text="community." className="text-5xl md:text-6xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="mt-6 text-xl text-gray-dark font-sora leading-relaxed max-w-xl">
              Partner with Mein to give young people in your school, organisation, or community access to tools, space, and support to build who they're becoming.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── BENEFITS ─── */}
      <section className="py-20 md:py-28 bg-gray-support/30">
        <div className="container-wide section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <FadeUp>
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal leading-tight">
                What Mein offers schools and partners
              </h2>
              <p className="mt-4 text-gray-dark font-sora leading-relaxed">
                Mein can be integrated as a structured programme, a one-off project, or an ongoing community resource — shaped around the needs of your students and community.
              </p>
              <div className="mt-7 space-y-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-mein flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <p className="text-sm font-sora text-charcoal">{b}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={150}>
              <div className="grid grid-cols-1 gap-5">
                <div className="bg-blue-mein rounded-2xl p-7 text-white">
                  <GraduationCap size={32} className="mb-4 text-white" />
                  <h3 className="font-sora font-bold text-xl">Schools & Educators</h3>
                  <p className="mt-2 text-white/80 text-sm font-sora leading-relaxed">
                    Integrate Mein as a structured programme within existing curriculum or pastoral care. We can work with you to shape the right format for your year groups.
                  </p>
                </div>
                <div className="bg-charcoal rounded-2xl p-7 text-white">
                  <Building2 size={32} className="mb-4 text-white" />
                  <h3 className="font-sora font-bold text-xl">Corporate Sponsors & Partners</h3>
                  <p className="mt-2 text-white/80 text-sm font-sora leading-relaxed">
                    Support the movement financially or through in-kind resources. Your investment gives young people access, opportunities, and a platform to grow.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── ENQUIRY FORM ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide section-padding max-w-2xl mx-auto">
          <FadeUp>
            <SectionDivider />
            <h2 className="mt-5 font-sora font-extrabold text-3xl text-charcoal">Send an enquiry</h2>
          </FadeUp>

          {submitted ? (
            <FadeUp>
              <div className="mt-10 text-center py-12 bg-blue-pale rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-blue-mein flex items-center justify-center mx-auto mb-5">
                  <Check size={28} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-sora font-bold text-2xl text-charcoal">Enquiry received.</h3>
                <HandwrittenAccent text="We'll be in touch soon." className="text-xl block mt-2" />
                <p className="mt-4 text-gray-dark font-sora text-sm max-w-sm mx-auto">
                  The Mein team will review your enquiry and get back to you at the email provided.
                </p>
              </div>
            </FadeUp>
          ) : (
            <FadeUp delay={100}>
              <div className="mt-8">
                <div className="flex gap-3 mb-6">
                  {(['school', 'partner'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormType(type)}
                      className={`flex-1 py-3 rounded-xl text-sm font-sora font-semibold transition-colors border-2 ${
                        formType === type
                          ? 'bg-blue-mein text-white border-blue-mein'
                          : 'bg-white text-gray-dark border-gray-support hover:border-blue-mein'
                      }`}
                    >
                      {type === 'school' ? 'School or Programme' : 'Partner or Sponsor'}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Your Name *</label>
                      <input type="text" required className="input-field" placeholder="Your full name"
                        value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Organisation *</label>
                      <input type="text" required className="input-field" placeholder="School or organisation name"
                        value={form.orgName} onChange={(e) => setForm(f => ({ ...f, orgName: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Email *</label>
                      <input type="email" required className="input-field" placeholder="your@email.com"
                        value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Your Role</label>
                      <input type="text" className="input-field" placeholder="e.g. Head of Year, CEO"
                        value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Message *</label>
                    <textarea required rows={5} className="textarea-field"
                      placeholder="Tell us about your school or organisation and how you'd like to work with Mein."
                      value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4">
                    {loading ? 'Sending...' : 'Send Enquiry'}
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </form>
              </div>
            </FadeUp>
          )}
        </div>
      </section>
    </div>
  )
}
