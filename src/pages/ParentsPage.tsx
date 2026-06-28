import { ArrowRight, Shield, Eye, FileCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'

// ─── Consent types data ───────────────────────────────────────────────────────

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
    description: 'A public username or profile connected to a submission.',
    why: 'So young people and families understand when an online identity may be connected to shared work.',
  },
]

// ─── Consent timeline data ────────────────────────────────────────────────────

const timelineSteps = [
  {
    num: '01',
    title: 'Submitted',
    body: 'A young person shares a move, story, idea, or piece of creative work.',
  },
  {
    num: '02',
    title: 'Reviewed',
    body: 'The Mein team reviews it for safety, tone, and suitability.',
  },
  {
    num: '03',
    title: 'Consent sent',
    body: 'If consent is needed, a parent or guardian is contacted before anything is published.',
  },
  {
    num: '04',
    title: 'Published',
    body: 'Approved submissions may be shared on Mein spaces with care and context.',
  },
]

// ─── Safety cards data ────────────────────────────────────────────────────────

const safetyCards = [
  {
    icon: Shield,
    title: 'Reviewed first',
    body: 'Every submission is seen by the Mein team before anything goes live. Nothing appears automatically.',
  },
  {
    icon: FileCheck,
    title: 'Consent-aware',
    body: 'If a young person is under 18, a parent or guardian is contacted and must give consent before their submission can be shared publicly.',
  },
  {
    icon: Eye,
    title: 'Youth-safe',
    body: 'Consent is specific — name, image, video, creative work, and social handle are handled separately with clear, individual permissions.',
  },
]

// ─── Consent timeline component ───────────────────────────────────────────────

function ConsentTimeline() {
  return (
    <>
      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-start relative mt-10">
        <div className="absolute top-5 left-[12.5%] right-[12.5%] h-px bg-blue-mein/15 z-0" />
        {timelineSteps.map((step) => (
          <div key={step.num} className="flex-1 flex flex-col items-center text-center relative z-10 px-4">
            <div className="w-10 h-10 rounded-full bg-blue-pale border border-blue-mein/20 flex items-center justify-center mb-4 shadow-sm">
              <span className="font-sora font-black text-[11px] text-blue-mein tracking-wider">{step.num}</span>
            </div>
            <p className="font-sora font-bold text-charcoal text-sm mb-1.5">{step.title}</p>
            <p className="font-sora text-gray-dark text-xs leading-relaxed max-w-[140px]">{step.body}</p>
          </div>
        ))}
      </div>

      {/* Mobile: vertical stacked cards */}
      <div className="flex md:hidden flex-col gap-3 mt-8">
        {timelineSteps.map((step, i) => (
          <div key={step.num} className="flex items-start gap-4 bg-white rounded-xl border border-gray-support/60 p-4 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-blue-pale border border-blue-mein/20 flex items-center justify-center flex-shrink-0">
              <span className="font-sora font-black text-[11px] text-blue-mein tracking-wider">{step.num}</span>
            </div>
            <div>
              <p className="font-sora font-bold text-charcoal text-sm mb-1">{step.title}</p>
              <p className="font-sora text-gray-dark text-xs leading-relaxed">{step.body}</p>
            </div>
            {i < timelineSteps.length - 1 && (
              <div className="hidden" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParentsPage() {
  return (
    <div className="with-mobile-cta">

      {/* ─── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 bg-white overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-2/5 -translate-y-8 opacity-[0.035] pointer-events-none select-none">
          <OpenMIcon size={560} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8">
          <FadeUp>
            <h1 className="font-sora font-extrabold text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.1] tracking-tight">
              Keeping young people safe{' '}
              <br className="hidden sm:block" />
              while helping them{' '}
              <HandwrittenAccent text="be seen." className="text-4xl md:text-5xl lg:text-6xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={140}>
            <p className="mt-5 text-lg md:text-xl text-gray-dark font-sora leading-relaxed max-w-[520px]">
              We want your child to be seen, heard, and supported — safely. Mein gives young people
              space to express who they are becoming, while making sure parents and guardians understand
              how participation, consent, and publishing work.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── CONSENT TIMELINE ────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <FadeUp>
            <SectionDivider />
            <h2 className="mt-4 font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
              How a submission becomes public
            </h2>
            <p className="mt-2 font-sora text-gray-dark text-base leading-relaxed max-w-lg">
              Nothing goes live automatically. Every step below happens before anything is shared publicly.
            </p>
          </FadeUp>
          <FadeUp delay={100}>
            <ConsentTimeline />
          </FadeUp>
        </div>
      </section>

      {/* ─── SAFETY GRID ─────────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-blue-pale">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <FadeUp>
            <div className="text-center mb-3">
              <SectionDivider className="mx-auto" />
            </div>
            <div className="text-center mb-2">
              <h2 className="mt-4 font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
                How we keep it safe
              </h2>
            </div>
            <p className="text-center font-sora text-gray-dark text-base max-w-md mx-auto mb-10">
              Every submission is reviewed with care before it is shared anywhere publicly.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {safetyCards.map((item, i) => (
              <FadeUp key={item.title} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="w-11 h-11 rounded-2xl bg-blue-pale flex items-center justify-center mx-auto mb-4">
                    <item.icon size={20} className="text-blue-mein" />
                  </div>
                  <h3 className="font-sora font-bold text-charcoal text-base mb-2">{item.title}</h3>
                  <p className="text-gray-dark text-sm leading-relaxed font-sora flex-1">{item.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONSENT TYPES ───────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <FadeUp>
            <SectionDivider />
            <h2 className="mt-4 font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
              What we ask consent for
            </h2>
            <p className="mt-2 font-sora text-gray-dark text-base leading-relaxed max-w-lg">
              For anyone under 18, we require explicit parent or guardian consent for each item below.
              We explain why we ask for each one.
            </p>
          </FadeUp>
          <div className="mt-7 space-y-3">
            {consentTypes.map((item, i) => (
              <FadeUp key={item.label} delay={i * 55}>
                <div className="bg-[#FAFAF8] rounded-xl border border-gray-support/60 overflow-hidden">
                  <div className="flex items-start gap-4 p-5">
                    <div className="w-9 h-9 rounded-xl bg-blue-pale flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon size={15} className="text-blue-mein" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sora font-semibold text-charcoal text-sm">{item.label}</p>
                      <p className="mt-1 text-sm text-gray-dark font-sora leading-relaxed">{item.description}</p>
                      <div className="mt-3 pt-3 border-t border-gray-support/70 flex items-start gap-2.5">
                        <span className="text-[10px] font-sora font-bold text-blue-mein uppercase tracking-widest mt-0.5 flex-shrink-0 whitespace-nowrap">
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

      {/* ─── BOTTOM REASSURANCE / CTA ────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-[#F0F5FF]">
        <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
          <FadeUp>
            <HandwrittenAccent text="Your child belongs here — safely." className="text-2xl md:text-3xl block mb-4" />
            <p className="text-gray-dark font-sora text-base leading-relaxed max-w-md mx-auto">
              Mein is built to help young people express who they are becoming while protecting their
              safety, privacy, and dignity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="btn-primary">
                Contact us <ArrowRight size={15} />
              </Link>
              <Link to="/community-rules" className="btn-secondary">
                Community rules
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
