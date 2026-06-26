import { ArrowRight, Shield, Eye, FileCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'

const consentTypes = [
  { icon: Eye, label: 'Display name', description: 'Permission to show the young person\'s chosen name alongside their submission.' },
  { icon: FileCheck, label: 'Photo', description: 'Permission to display a photo or image submitted by or featuring the young person.' },
  { icon: FileCheck, label: 'Video', description: 'Permission to publish a video in which the young person appears or speaks.' },
  { icon: FileCheck, label: 'Creative work', description: 'Permission to feature written, artistic, or other creative submissions publicly.' },
  { icon: FileCheck, label: 'Social handle', description: 'Permission to display or link to the young person\'s social media handle.' },
]

export default function ParentsPage() {
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
              Keeping young people safe while helping them{' '}
              <HandwrittenAccent text="be seen." className="text-5xl md:text-6xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="mt-6 text-xl text-gray-dark font-sora leading-relaxed max-w-xl">
              Mein gives young people space to express themselves, but public sharing is handled with care, review, and consent.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── SAFETY PROCESS ─── */}
      <section className="py-20 md:py-28 bg-blue-pale">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-12">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                How we keep it safe
              </h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: 'Review before publish', body: 'All public features are reviewed by the Mein team before any content goes live. Nothing appears automatically.' },
              { icon: FileCheck, title: 'Under-18 consent required', body: 'If a young person is under 18, a parent or guardian must provide consent before their submission can be published publicly.' },
              { icon: Eye, title: 'Clear consent types', body: 'Consent is specific — name, image, video, creative work, and social handle are each handled separately with clear permissions.' },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 80}>
                <div className="bg-white rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-blue-pale flex items-center justify-center mx-auto mb-4">
                    <item.icon size={22} className="text-blue-mein" />
                  </div>
                  <h3 className="font-sora font-bold text-charcoal text-lg">{item.title}</h3>
                  <p className="mt-3 text-gray-dark text-sm leading-relaxed font-sora">{item.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONSENT TYPES ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide section-padding max-w-3xl mx-auto">
          <FadeUp>
            <SectionDivider />
            <h2 className="mt-5 font-sora font-extrabold text-3xl text-charcoal">What we ask consent for</h2>
            <p className="mt-3 text-gray-dark font-sora">For anyone under 18, we require explicit parent or guardian consent for each of the following:</p>
          </FadeUp>
          <div className="mt-8 space-y-3">
            {consentTypes.map((item, i) => (
              <FadeUp key={item.label} delay={i * 60}>
                <div className="flex items-start gap-4 bg-gray-support/30 rounded-xl p-5">
                  <div className="w-9 h-9 rounded-xl bg-blue-pale flex items-center justify-center flex-shrink-0">
                    <item.icon size={16} className="text-blue-mein" />
                  </div>
                  <div>
                    <p className="font-sora font-semibold text-charcoal capitalize">{item.label}</p>
                    <p className="mt-0.5 text-sm text-gray-dark font-sora">{item.description}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 bg-gray-support/30">
        <div className="container-wide section-padding max-w-2xl mx-auto text-center">
          <FadeUp>
            <HandwrittenAccent text="Your child belongs here — safely." className="text-2xl block mb-4" />
            <p className="text-gray-dark font-sora">
              If you have questions about how Mein handles young people's data and content, read our Privacy Policy or get in touch.
            </p>
            <div className="mt-7 flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="btn-primary">
                Contact Us <ArrowRight size={16} />
              </Link>
              <Link to="/privacy" className="btn-secondary">Privacy Policy</Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
