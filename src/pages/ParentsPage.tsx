import { ArrowRight, Shield, Eye, FileCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'

const consentTypes = [
  {
    icon: Eye,
    label: 'Name or first name',
    description: 'How a young person may be identified.',
    why: 'So families understand what personal details may appear publicly.',
  },
  {
    icon: FileCheck,
    label: 'Photo or video',
    description: 'Images or videos that include a young person.',
    why: 'So no young person is shown publicly without clear permission.',
  },
  {
    icon: FileCheck,
    label: 'Story or quote',
    description: 'Written submissions, reflections, or quotes.',
    why: 'So young people are represented accurately and respectfully.',
  },
  {
    icon: FileCheck,
    label: 'Creative work',
    description: 'Artwork, designs, ideas, or other creative submissions.',
    why: 'So ownership and permission are clear before sharing.',
  },
  {
    icon: FileCheck,
    label: 'Social handle',
    description: 'A link to the young person\'s social media profile.',
    why: 'So families decide whether any external profiles are connected to public content.',
  },
]

const timelineSteps = [
  {
    num: '01',
    title: 'Submitted',
    body: 'A young person shares a move, story, idea, or creative piece.',
  },
  {
    num: '02',
    title: 'Reviewed',
    body: 'The Mein team reviews it for safety, tone, and suitability.',
  },
  {
    num: '03',
    title: 'Consent Sent',
    body: 'If consent is needed, a parent or guardian is contacted before anything is published.',
  },
  {
    num: '04',
    title: 'Published',
    body: 'Approved submissions may be shared on Mein spaces with care and context.',
  },
]

function ConsentTimeline() {
  return (
    <div className="mt-10 mb-14">
      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-start gap-0 relative">
        {/* Connector line */}
        <div className="absolute top-6 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px bg-blue-mein/20 z-0" />
        {timelineSteps.map((step, i) => (
          <div key={step.num} className="flex-1 flex flex-col items-center text-center relative z-10 px-3">
            <div className="w-12 h-12 rounded-full bg-blue-pale border-2 border-blue-mein/30 flex items-center justify-center mb-4 shadow-sm">
              <span className="font-sora font-black text-xs text-blue-mein tracking-wider">{step.num}</span>
            </div>
            <p className="font-sora font-bold text-charcoal text-sm mb-1.5">{step.title}</p>
            <p className="font-sora text-gray-dark text-xs leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="flex md:hidden flex-col gap-0 relative pl-6">
        <div className="absolute left-5 top-5 bottom-5 w-px bg-blue-mein/20" />
        {timelineSteps.map((step) => (
          <div key={step.num} className="relative flex gap-4 pb-8 last:pb-0">
            <div className="w-10 h-10 rounded-full bg-blue-pale border-2 border-blue-mein/30 flex items-center justify-center flex-shrink-0 -ml-6 z-10 shadow-sm">
              <span className="font-sora font-black text-[11px] text-blue-mein tracking-wider">{step.num}</span>
            </div>
            <div className="pt-1.5">
              <p className="font-sora font-bold text-charcoal text-sm mb-1">{step.title}</p>
              <p className="font-sora text-gray-dark text-xs leading-relaxed">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

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
              We want your child to be seen, heard, and supported — safely. Mein gives young people
              space to express who they are becoming, while making sure parents and guardians understand
              how participation, consent, and publishing work.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── CONSENT TIMELINE ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-wide section-padding max-w-4xl mx-auto">
          <FadeUp>
            <SectionDivider />
            <h2 className="mt-5 font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
              How a submission becomes public
            </h2>
            <p className="mt-2 font-sora text-gray-dark text-base max-w-xl">
              Nothing goes live automatically. Every step below happens before anything is shared publicly.
            </p>
          </FadeUp>
          <FadeUp delay={100}>
            <ConsentTimeline />
          </FadeUp>
        </div>
      </section>

      {/* ─── SAFETY PROCESS ─── */}
      <section className="py-20 md:py-28 bg-blue-pale">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-12">
              <SectionDivider className="mx-auto" />
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
            <p className="mt-3 text-gray-dark font-sora">
              For anyone under 18, we require explicit parent or guardian consent for each of the following.
              We explain why we ask for each one.
            </p>
          </FadeUp>
          <div className="mt-8 space-y-3">
            {consentTypes.map((item, i) => (
              <FadeUp key={item.label} delay={i * 60}>
                <div className="bg-gray-support/30 rounded-xl overflow-hidden">
                  <div className="flex items-start gap-4 p-5">
                    <div className="w-9 h-9 rounded-xl bg-blue-pale flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon size={16} className="text-blue-mein" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sora font-semibold text-charcoal capitalize">{item.label}</p>
                      <p className="mt-0.5 text-sm text-gray-dark font-sora">{item.description}</p>
                      <div className="mt-3 pt-3 border-t border-gray-support/60 flex items-start gap-2">
                        <span className="text-[10px] font-sora font-bold text-blue-mein uppercase tracking-widest mt-0.5 flex-shrink-0">
                          Why we ask
                        </span>
                        <p className="text-xs text-gray-dark font-sora leading-relaxed">{item.why}</p>
                      </div>
                    </div>
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
