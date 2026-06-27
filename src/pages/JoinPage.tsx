import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import {
  OpenMIcon,
  HandwrittenAccent,
  SectionDivider,
  ConsentBadge,
} from '../components/BrandElements'

// ── Static data ───────────────────────────────────────────────────────────────

const belongingBadges = [
  { text: 'For the quiet ones.', variant: 'blue' },
  { text: 'For the bold ones.', variant: 'gold' },
  { text: 'For the ones still figuring it out.', variant: 'blue' },
  { text: 'For the ones with ideas.', variant: 'gold' },
  { text: 'For the ones building anyway.', variant: 'blue' },
  { text: "For the ones who haven't started yet.", variant: 'gold' },
] as const

const audiencePaths = [
  {
    number: '01',
    label: 'Young person',
    desc: 'Explore, create, speak, build, represent, or just start unsure.',
    ctaLabel: 'Start here',
    href: '/make-your-move',
    accent: 'blue' as const,
  },
  {
    number: '02',
    label: 'Parent or guardian',
    desc: 'Understand the movement and support a young person safely.',
    ctaLabel: 'Learn more',
    href: '/parents',
    accent: 'gold' as const,
  },
  {
    number: '03',
    label: 'Creator',
    desc: 'Help shape content, stories, ideas, and youth-led energy.',
    ctaLabel: 'Create with Mein',
    href: '/make-your-move',
    accent: 'blue' as const,
  },
  {
    number: '04',
    label: 'School or partner',
    desc: 'Support youth development, showcases, challenges, and opportunities.',
    ctaLabel: 'Partner with us',
    href: '/schools',
    accent: 'gold' as const,
  },
] as const

const badgeStyles = {
  blue: 'bg-blue-pale text-blue-mein border border-blue-mein/20 shadow-sm',
  gold: 'bg-gold-pale text-gold-dark border border-yellow-200 shadow-sm',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function JoinPage() {
  return (
    <div className="with-mobile-cta">

      {/* ─── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-charcoal overflow-hidden">

        {/* Open M — large, faint, right-side background anchor */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-end pr-0 opacity-[0.06]">
          <OpenMIcon size={560} />
        </div>
        {/* Subtle radial glow on the left where the text lives */}
        <div
          className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 0% 30%, rgba(47,107,255,0.10) 0%, transparent 65%)',
          }}
        />

        <div className="container-wide section-padding relative z-10 max-w-4xl">
          <FadeUp>
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3.5 py-1.5 mb-7">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-mein" />
              <span className="font-sora text-xs font-semibold text-white/80 tracking-widest uppercase">
                Join Mein
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] max-w-2xl">
              Become a{' '}
              <br className="hidden sm:block" />
              Mein{' '}
              <span className="font-caveat text-gold-mein">Mover.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={150}>
            <p className="mt-6 text-white/70 text-lg md:text-xl max-w-md leading-relaxed font-sora">
              Any move counts.{' '}
              <span className="text-white font-semibold">One is enough to start.</span>
            </p>
          </FadeUp>

          <FadeUp delay={240}>
            <div className="mt-5">
              <ConsentBadge />
            </div>
          </FadeUp>

          <FadeUp delay={310}>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link to="/join#paths" className="btn-gold inline-flex text-sm py-3 px-8">
                Join the Movement
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/make-your-move"
                className="text-sm font-sora font-semibold text-white/60 hover:text-white/90 transition-colors"
              >
                Make Your Move →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 2. BELONGING BADGES ─────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-10 max-w-xl mx-auto">
              <SectionDivider className="mx-auto mb-5" />
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                There is room for you here.
              </h2>
              <p className="mt-3 text-gray-dark font-sora text-base md:text-lg">
                You do not need to have it all figured out to belong.
              </p>
            </div>
          </FadeUp>

          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {belongingBadges.map((badge, i) => (
              <FadeUp key={badge.text} delay={i * 70}>
                <span
                  className={`inline-block ${badgeStyles[badge.variant]} font-sora font-bold text-base md:text-lg py-3 md:py-4 px-5 md:px-7 rounded-full`}
                >
                  {badge.text}
                </span>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={500}>
            <p className="text-center mt-7 font-caveat text-2xl text-gray-mid">
              All of these people belong here.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── 3. AUDIENCE PATHS ───────────────────────────────────────────── */}
      <section id="paths" className="py-16 md:py-20 bg-[#FAFAF8]">
        <div className="container-wide section-padding max-w-3xl mx-auto">
          <FadeUp>
            <div className="text-center mb-12">
              <SectionDivider className="mx-auto mb-5" />
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Choose how you fit.
              </h2>
              <p className="mt-3 text-gray-dark font-sora text-base md:text-lg">
                There is more than one way to be part of Mein.
              </p>
            </div>
          </FadeUp>

          {/* Vertical path list with connecting line on desktop */}
          <div className="relative">
            {/* Vertical connector — desktop only */}
            <div className="hidden md:block absolute left-[38px] top-10 bottom-10 w-px bg-blue-mein/10" />

            <div className="flex flex-col gap-3">
              {audiencePaths.map((path, i) => {
                const isGold = path.accent === 'gold'
                return (
                  <FadeUp key={path.number} delay={i * 80}>
                    <Link
                      to={path.href}
                      className="group relative flex items-center gap-5 md:gap-6 bg-white rounded-2xl border border-gray-support hover:border-blue-mein/30 hover:shadow-md active:scale-[0.99] transition-all duration-200 px-5 py-5 md:px-7 md:py-6"
                    >
                      {/* Number bubble */}
                      <div
                        className={`relative z-10 flex-shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center font-sora font-black text-lg transition-colors duration-200 ${
                          isGold
                            ? 'bg-gold-pale text-gold-dark group-hover:bg-gold-mein group-hover:text-white'
                            : 'bg-blue-pale text-blue-mein group-hover:bg-blue-mein group-hover:text-white'
                        }`}
                      >
                        {path.number}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="font-sora font-extrabold text-base md:text-lg text-charcoal group-hover:text-blue-mein transition-colors leading-snug">
                          {path.label}
                        </p>
                        <p className="text-sm text-gray-dark font-sora mt-1 leading-snug">
                          {path.desc}
                        </p>
                      </div>

                      {/* CTA — hidden on tiny mobile, visible sm+ */}
                      <div
                        className={`hidden sm:flex items-center gap-1.5 flex-shrink-0 text-sm font-sora font-semibold whitespace-nowrap ${
                          isGold ? 'text-gold-dark' : 'text-blue-mein'
                        } group-hover:gap-3 transition-all duration-200`}
                      >
                        {path.ctaLabel}
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform duration-200"
                        />
                      </div>
                    </Link>
                  </FadeUp>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. PLEDGE ───────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-charcoal overflow-hidden relative">
        {/* Faint Open M watermark */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.04]">
          <OpenMIcon size={500} />
        </div>

        <div className="container-wide section-padding max-w-2xl mx-auto text-center relative z-10">
          <FadeUp>
            {/* Gold accent line */}
            <div className="w-12 h-1 bg-gold-mein rounded-full mx-auto mb-7" />

            <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-white leading-snug">
              When you join, you're not just joining a platform.
            </h2>
            <HandwrittenAccent
              text="You're joining a movement."
              className="text-3xl md:text-4xl block mt-2 text-gold-mein"
            />

            <p className="mt-7 text-white/65 font-sora leading-relaxed text-base md:text-lg max-w-xl mx-auto">
              Mein is a space for young people to be seen, supported, and encouraged as they take one step toward who they are becoming.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/make-your-move" className="btn-gold inline-flex justify-center">
                Join the Movement
                <ArrowRight size={16} />
              </Link>
              <Link to="/community-rules" className="btn-outline-blue inline-flex justify-center border-white/20 text-white/80 hover:text-white hover:border-white/50">
                Read Community Rules
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 5. SAFETY REASSURANCE ───────────────────────────────────────── */}
      <section className="py-8 md:py-10 bg-blue-pale border-t border-blue-mein/10">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
              <div className="text-center sm:text-left">
                <p className="font-sora font-bold text-sm text-charcoal tracking-wide">
                  Staff-reviewed · Consent-aware · Youth-safe
                </p>
                <p className="text-xs text-gray-dark font-sora mt-1">
                  Public stories, videos, images, or names are reviewed before they appear.
                </p>
              </div>
              <Link
                to="/parents"
                className="text-sm font-sora font-semibold text-blue-mein hover:underline flex-shrink-0 whitespace-nowrap"
              >
                Parents &amp; Consent Info →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 6. BOTTOM CTA ───────────────────────────────────────────────── */}
      <section className="py-14 md:py-16 bg-white">
        <div className="container-wide section-padding text-center max-w-xl mx-auto">
          <FadeUp>
            <SectionDivider className="mx-auto mb-5" />
            <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
              Ready to join the movement?
            </h2>
            <p className="mt-3 text-gray-dark font-sora">
              Start where you are. One step is enough.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/make-your-move" className="btn-primary inline-flex justify-center">
                Join Mein
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/future-me"
                className="btn-secondary inline-flex justify-center"
              >
                Take the Future Me Challenge
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
