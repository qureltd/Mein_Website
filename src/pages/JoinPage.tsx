import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import {
  OpenMIcon,
  HandwrittenAccent,
  SectionDivider,
  StarAccent,
  ConsentBadge,
} from '../components/BrandElements'

const belongingBadges = [
  { text: 'For the quiet ones.', variant: 'blue' },
  { text: 'For the bold ones.', variant: 'gold' },
  { text: 'For the ones still figuring it out.', variant: 'light' },
  { text: 'For the ones with ideas.', variant: 'blue' },
  { text: 'For the ones building anyway.', variant: 'gold' },
  { text: "For the ones who haven't started yet.", variant: 'light' },
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
]

const badgeStyles = {
  blue: 'bg-blue-pale text-blue-mein border border-blue-mein/15',
  gold: 'bg-gold-pale text-gold-dark border border-yellow-200',
  light: 'bg-white text-charcoal border border-gray-support',
}

export default function JoinPage() {
  return (
    <div className="with-mobile-cta">

      {/* ─── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none select-none flex items-center justify-end pr-8">
          <OpenMIcon size={520} />
        </div>

        <div className="container-wide section-padding relative z-10 max-w-4xl">
          <FadeUp>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-mein" />
              <span className="font-sora text-xs font-semibold text-white/80 tracking-wider uppercase">
                Join Mein
              </span>
            </div>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-white leading-tight max-w-3xl">
              Become a Mein{' '}
              <span className="font-caveat text-gold-mein">Mover.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={150}>
            <p className="mt-6 text-white/75 text-lg md:text-xl max-w-xl leading-relaxed font-sora">
              Any move counts. One is enough to start.
            </p>
          </FadeUp>

          <FadeUp delay={260}>
            <div className="mt-4">
              <ConsentBadge />
            </div>
          </FadeUp>

          <FadeUp delay={320}>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link to="/join#paths" className="btn-gold inline-flex text-sm py-3 px-7">
                Join the Movement
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/make-your-move"
                className="text-sm font-sora font-semibold text-white/70 hover:text-white transition-colors"
              >
                Make Your Move →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 2. BELONGING BADGES ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-10 max-w-xl mx-auto">
              <SectionDivider className="mx-auto mb-5" />
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                There is room for you here.
              </h2>
              <p className="mt-3 text-gray-dark font-sora">
                You do not need to have it all figured out to belong.
              </p>
            </div>
          </FadeUp>

          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {belongingBadges.map((badge, i) => (
              <FadeUp key={badge.text} delay={i * 70}>
                <span
                  className={`inline-block ${badgeStyles[badge.variant]} font-sora font-bold text-sm md:text-base px-6 py-3 rounded-full`}
                >
                  {badge.text}
                </span>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={480}>
            <p className="text-center mt-8 font-caveat text-xl text-gray-mid">
              All of these people belong here.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── 3. AUDIENCE PATHS ───────────────────────────────────────────── */}
      <section id="paths" className="py-16 md:py-24 bg-[#FAFAF8]">
        <div className="container-wide section-padding max-w-3xl mx-auto">
          <FadeUp>
            <div className="text-center mb-12">
              <SectionDivider className="mx-auto mb-5" />
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Choose how you fit.
              </h2>
              <p className="mt-3 text-gray-dark font-sora">
                There is more than one way to be part of Mein.
              </p>
            </div>
          </FadeUp>

          <div className="flex flex-col gap-3">
            {audiencePaths.map((path, i) => {
              const isGold = path.accent === 'gold'
              return (
                <FadeUp key={path.number} delay={i * 80}>
                  <Link
                    to={path.href}
                    className="group flex items-center gap-5 md:gap-7 bg-white rounded-2xl border border-gray-support hover:border-blue-mein/40 hover:shadow-md transition-all duration-200 px-6 py-5 md:px-8 md:py-6"
                  >
                    {/* Number */}
                    <span
                      className={`font-sora font-black text-4xl md:text-5xl leading-none tracking-tight flex-shrink-0 select-none ${
                        isGold ? 'text-gold-mein/30' : 'text-blue-mein/20'
                      }`}
                    >
                      {path.number}
                    </span>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-sora font-bold text-base md:text-lg text-charcoal group-hover:${
                          isGold ? 'text-gold-dark' : 'text-blue-mein'
                        } transition-colors`}
                      >
                        {path.label}
                      </p>
                      <p className="text-sm text-gray-dark font-sora mt-0.5 leading-snug">
                        {path.desc}
                      </p>
                    </div>

                    {/* CTA */}
                    <div
                      className={`hidden sm:flex items-center gap-1.5 flex-shrink-0 text-sm font-sora font-semibold ${
                        isGold ? 'text-gold-dark' : 'text-blue-mein'
                      } group-hover:gap-2.5 transition-all duration-200`}
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
      </section>

      {/* ─── 4. MOVEMENT PLEDGE ──────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-wide section-padding max-w-2xl mx-auto text-center">
          <FadeUp>
            <div className="flex justify-center gap-2 mb-6">
              <StarAccent />
              <StarAccent />
              <StarAccent />
            </div>
            <HandwrittenAccent
              text="When you join, you're not just joining a platform. You're joining a movement."
              className="text-2xl md:text-3xl block mb-5"
            />
            <p className="text-gray-dark font-sora leading-relaxed max-w-xl mx-auto">
              Mein is a space for young people to be seen, supported, and encouraged as they take one step toward who they are becoming.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/make-your-move" className="btn-primary inline-flex justify-center">
                Join the Movement
                <ArrowRight size={16} />
              </Link>
              <Link to="/community-rules" className="btn-secondary inline-flex justify-center">
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
                <p className="font-sora font-bold text-sm text-charcoal">
                  Staff-reviewed · Consent-aware · Youth-safe
                </p>
                <p className="text-xs text-gray-dark font-sora mt-1">
                  Public stories, videos, images, or names are reviewed before they appear.
                </p>
              </div>
              <Link
                to="/parents"
                className="text-sm font-sora font-semibold text-blue-mein hover:underline flex-shrink-0"
              >
                Parents &amp; Consent Info
                <span className="ml-1">→</span>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
