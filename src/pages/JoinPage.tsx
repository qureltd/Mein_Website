import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Pen, Play, Hammer, Megaphone, Building2, Mail } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider, StarAccent } from '../components/BrandElements'

const belongingBadges = [
  { text: 'For the quiet ones.', variant: 'blue' },
  { text: 'For the bold ones.', variant: 'gold' },
  { text: 'For the ones still figuring it out.', variant: 'light' },
  { text: 'For the ones with ideas.', variant: 'blue' },
  { text: 'For the ones building anyway.', variant: 'gold' },
  { text: "For the ones who haven't started yet.", variant: 'light' },
] as const

const movePaths = [
  {
    number: '01',
    icon: Pen,
    label: 'Create',
    tagline: 'Express it.',
    desc: 'Submit art, writing, photography, designs, or ideas. This is your canvas.',
    href: '/make-your-move?type=create',
    accent: '#2F6BFF',
    bg: '#EBF0FF',
  },
  {
    number: '02',
    icon: Play,
    label: 'Speak',
    tagline: 'Say it.',
    desc: 'Share a video, a story, or a future-self message. Your voice belongs here.',
    href: '/make-your-move?type=speak',
    accent: '#111111',
    bg: '#F5F5F5',
  },
  {
    number: '03',
    icon: Hammer,
    label: 'Build',
    tagline: 'Start it.',
    desc: 'Explore the youth entrepreneur route and start shaping an idea into something real.',
    href: '/make-your-move?type=build',
    accent: '#F4B400',
    bg: '#FFF8E1',
  },
  {
    number: '04',
    icon: Megaphone,
    label: 'Represent',
    tagline: 'Own it.',
    desc: 'Apply as a Mein creator or youth voice and help shape this movement.',
    href: '/make-your-move?type=represent',
    accent: '#2F6BFF',
    bg: '#EBF0FF',
  },
]

const secondaryPaths = [
  { icon: Hammer, label: 'Youth Entrepreneur Route', href: '/make-your-move?type=build' },
  { icon: Building2, label: 'Partner or Sponsor', href: '/schools' },
  { icon: Building2, label: 'Schools & Programmes', href: '/schools' },
  { icon: Mail, label: 'General Enquiry', href: '/contact' },
]

export default function JoinPage() {
  return (
    <div className="with-mobile-cta">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-charcoal overflow-hidden">
        {/* Faint Open M watermark */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none select-none flex items-center justify-end pr-8">
          <OpenMIcon size={500} />
        </div>

        <div className="container-wide section-padding relative z-10 max-w-4xl">
          <FadeUp>
            {/* Movement label */}
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-mein" />
              <span className="font-sora text-xs font-semibold text-white/80 tracking-wider uppercase">
                Youth Movement
              </span>
            </div>

            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-white leading-tight max-w-3xl">
              Become a Mein{' '}
              <span className="font-caveat text-gold-mein">Mover.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={150}>
            <p className="mt-6 text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed font-sora">
              A Mein Mover is someone building who they are becoming — one move, one idea, one story, one step at a time.
            </p>
            <span className="block mt-4 font-caveat text-gold-mein text-2xl">
              Any move counts. One is enough to start.
            </span>
          </FadeUp>

          <FadeUp delay={250}>
            <Link to="/make-your-move" className="mt-9 btn-gold inline-flex text-base py-4 px-9">
              Make Your Move
              <ArrowRight size={16} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ─── BENEFITS STRIP ───────────────────────────────────────────── */}
      <section className="py-7 bg-white border-b border-gray-support">
        <div className="container-wide section-padding">
          <div className="flex flex-wrap gap-2 justify-center">
            {([
              { text: 'Get featured on The Wall', variant: 'blue' },
              { text: 'Submit art, writing, and videos', variant: 'blue' },
              { text: 'Share your story', variant: 'gold' },
              { text: 'Join creator calls', variant: 'blue' },
              { text: 'Be part of drops', variant: 'gold' },
              { text: 'Explore entrepreneurship', variant: 'blue' },
              { text: 'Start even if unsure', variant: 'light' },
            ] as const).map(({ text, variant }) => {
              const styles = {
                blue: 'bg-blue-pale text-blue-mein border border-blue-mein/20',
                gold: 'bg-gold-pale text-gold-dark border border-yellow-200',
                light: 'bg-gray-support/50 text-charcoal border border-gray-support',
              }
              return (
                <span
                  key={text}
                  className={`inline-flex items-center gap-1.5 ${styles[variant]} rounded-full px-4 py-2 text-xs font-sora font-semibold`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${variant === 'gold' ? 'bg-gold-mein' : 'bg-blue-mein'}`} />
                  {text}
                </span>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── BELONGING BADGES ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-12">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                This is your space.
              </h2>
              <p className="mt-3 text-gray-dark font-sora max-w-md mx-auto">
                You do not need to have it figured out. You just need to show up.
              </p>
            </div>
          </FadeUp>

          {/* Expressive belonging badges — natural wrap, not a grid */}
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {belongingBadges.map((badge, i) => {
              const styles: Record<string, string> = {
                blue: 'bg-blue-pale text-blue-mein border border-blue-mein/15',
                gold: 'bg-gold-pale text-gold-dark border border-yellow-200',
                light: 'bg-white text-charcoal border border-gray-support',
              }
              return (
                <FadeUp key={badge.text} delay={i * 60}>
                  <span
                    className={`inline-block ${styles[badge.variant]} font-sora font-semibold text-sm md:text-base px-6 py-3 rounded-full`}
                  >
                    {badge.text}
                  </span>
                </FadeUp>
              )
            })}
          </div>

          <FadeUp delay={420}>
            <p className="text-center mt-8 font-caveat text-xl text-gray-mid">
              All of these people belong here.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── MOVEMENT PATHS ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-support/30">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-14">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Choose your way in.
              </h2>
              <p className="mt-3 text-gray-dark font-sora max-w-lg mx-auto">
                Every path leads to the same place: moving forward.
              </p>
            </div>
          </FadeUp>

          {/* Primary 4 movement paths */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {movePaths.map((path, i) => (
              <FadeUp key={path.label} delay={i * 80}>
                <Link
                  to={path.href}
                  className="move-card flex flex-col group h-full"
                  style={{ '--accent': path.accent } as React.CSSProperties}
                >
                  {/* Number + icon */}
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className="font-sora font-black text-4xl leading-none tracking-tight"
                      style={{ color: path.bg }}
                    >
                      {path.number}
                    </span>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: path.bg }}
                    >
                      <path.icon size={20} style={{ color: path.accent }} strokeWidth={2} />
                    </div>
                  </div>

                  <p
                    className="text-[10px] font-sora font-semibold uppercase tracking-[0.18em] mb-1"
                    style={{ color: path.accent }}
                  >
                    Path {path.number} — {path.label}
                  </p>
                  <HandwrittenAccent text={path.tagline} className="text-2xl mb-2" />
                  <p className="text-sm text-gray-dark leading-relaxed flex-1 font-sora">{path.desc}</p>

                  <div
                    className="mt-5 flex items-center gap-2 text-sm font-semibold font-sora group-hover:gap-3 transition-all duration-200"
                    style={{ color: path.accent }}
                  >
                    Start here.
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>

          {/* Secondary paths — flat pill links */}
          <FadeUp delay={400}>
            <div className="mt-10 max-w-3xl mx-auto flex flex-wrap gap-3 items-center justify-center">
              <span className="text-xs font-sora text-gray-mid uppercase tracking-widest">Also:</span>
              {secondaryPaths.map((p) => (
                <Link
                  key={p.label}
                  to={p.href}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-support rounded-full px-4 py-2 text-xs font-sora font-semibold text-gray-dark hover:border-blue-mein hover:text-blue-mein transition-colors duration-200"
                >
                  <p.icon size={12} />
                  {p.label}
                  <ArrowRight size={11} />
                </Link>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={480}>
            <p className="mt-7 text-center">
              <Link
                to="/make-your-move"
                className="text-sm font-sora text-gray-mid hover:text-blue-mein transition-colors underline underline-offset-2"
              >
                Not sure which move fits? Start here.
              </Link>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── COMMUNITY PLEDGE ─────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-wide section-padding max-w-3xl mx-auto text-center">
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
            <p className="text-gray-dark font-sora leading-relaxed">
              Mein Movers create, speak, build, and represent. They show up for themselves and for each other. They read the community rules and take them seriously — because this movement is built on respect.
            </p>
            <div className="mt-7 flex flex-wrap gap-4 justify-center">
              <Link to="/make-your-move" className="btn-primary">
                Join the Movement
                <ArrowRight size={16} />
              </Link>
              <Link to="/community-rules" className="btn-secondary">
                Read Community Rules
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
