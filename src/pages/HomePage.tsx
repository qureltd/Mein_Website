import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Pen, Hammer, Megaphone, Play, Star, HelpCircle } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import {
  OpenMIcon,
  HandwrittenAccent,
  SectionDivider,
  StarAccent,
  ConsentBadge,
  StickerNote,
  MovementFragment,
} from '../components/BrandElements'
import PortalZone from '../components/PortalZone'
import MeinEnergyTexture from '../components/MeinEnergyTexture'

const moveCards = [
  {
    number: '01',
    icon: Pen,
    label: 'Create',
    tagline: 'Express it.',
    description: 'Submit art, writing, ideas, designs, photography, or poetry. This is your canvas.',
    href: '/make-your-move?type=create',
    accent: '#2F6BFF',
    bg: '#EBF0FF',
  },
  {
    number: '02',
    icon: Play,
    label: 'Speak',
    tagline: 'Say it.',
    description: 'Upload a video, share a story, or send a future-self message. Your voice belongs here.',
    href: '/make-your-move?type=speak',
    accent: '#111111',
    bg: '#F5F5F5',
  },
  {
    number: '03',
    icon: Hammer,
    label: 'Build',
    tagline: 'Start it.',
    description: 'Explore the youth entrepreneur route and start shaping an idea into something real.',
    href: '/make-your-move?type=build',
    accent: '#F4B400',
    bg: '#FFF8E1',
  },
  {
    number: '04',
    icon: Megaphone,
    label: 'Represent',
    tagline: 'Own it.',
    description: 'Apply as a Mein content creator or youth voice and shape this movement from the inside.',
    href: '/make-your-move?type=represent',
    accent: '#2F6BFF',
    bg: '#EBF0FF',
  },
  {
    number: '05',
    icon: HelpCircle,
    label: 'Not sure yet?',
    tagline: "That's okay.",
    description: "You don't have to know your move yet. Tell us what you're into and we'll help you find your first step.",
    href: '/make-your-move',
    accent: '#6B7280',
    bg: '#F3F4F6',
  },
]

const benefitStrip = [
  { label: 'Get featured', sub: 'Share your story, art, video, or idea.' },
  { label: 'Find your move', sub: 'Create, speak, build, represent — or start unsure.' },
  { label: 'Join drops', sub: 'Be part of challenges, merch, and what\'s coming next.' },
  { label: 'Build something real', sub: 'Start with one move and grow it.' },
  { label: 'Share your story', sub: 'Let your voice live on The Wall.' },
  { label: 'Start unsure', sub: 'You do not have to know yet.' },
]

const belongingBadges = [
  { text: 'For the quiet ones.', rotate: '-2deg', color: 'blue' },
  { text: 'For the bold ones.', rotate: '1.5deg', color: 'gold' },
  { text: 'For the ones still figuring it out.', rotate: '-1deg', color: 'light' },
  { text: 'For the ones with ideas.', rotate: '2deg', color: 'blue' },
  { text: "For the ones who haven't started yet.", rotate: '-1.5deg', color: 'light' },
  { text: 'For the ones building anyway.', rotate: '1deg', color: 'gold' },
] as const

const cardDoodles = [
  <svg key="d0" width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <line x1="12" y1="50" x2="50" y2="12" stroke="#2F6BFF" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="18" y1="55" x2="55" y2="18" stroke="#2F6BFF" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 6" />
  </svg>,
  <svg key="d1" width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <path d="M6 30Q16 18 26 30Q36 42 46 30Q52 24 56 30" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M10 40Q20 28 30 40Q40 50 50 40" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>,
  <svg key="d2" width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <rect x="8" y="26" width="14" height="26" rx="2" stroke="#F4B400" strokeWidth="2.5" />
    <rect x="30" y="12" width="14" height="40" rx="2" stroke="#F4B400" strokeWidth="2.5" />
  </svg>,
  <svg key="d3" width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <path d="M30 8L35.5 23.5H52L38.5 32.5L43 48L30 39L17 48L21.5 32.5L8 23.5H24.5L30 8Z" stroke="#2F6BFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="d4" width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <path d="M22 20C22 14.477 26.477 10 32 10C37.523 10 42 14.477 42 20C42 24.5 39 27.5 34.5 30C33 30.9 32 32.3 32 34" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="42" r="2.5" fill="#9CA3AF" />
  </svg>,
]

const wallStrip = [
  { text: 'Future letters loading', dot: 'bg-blue-mein' },
  { text: 'Creator call open', dot: 'bg-gold-mein' },
  { text: 'First drop coming', dot: 'bg-gold-mein' },
  { text: 'Art wall opening soon', dot: 'bg-blue-mein' },
]

export default function HomePage() {
  return (
    <div className="with-mobile-cta">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-[0.035] pointer-events-none select-none">
          <OpenMIcon size={600} />
        </div>

        <div className="container-wide section-padding relative z-10 pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <div>
              <FadeUp>
                <div className="flex items-center gap-2 mb-4">
                  <StarAccent />
                  <span className="font-caveat text-gray-mid text-base ml-1">
                    Create. Express. Build. Become.
                  </span>
                </div>
              </FadeUp>

              <FadeUp delay={60}>
                <p className="font-caveat text-3xl md:text-4xl text-blue-mein leading-snug mb-4">
                  What move are you making today?
                </p>
              </FadeUp>

              <FadeUp delay={130}>
                <h1 className="font-sora font-extrabold text-5xl md:text-6xl lg:text-7xl text-charcoal leading-[1.1] tracking-tight">
                  Building the right{' '}
                  <span className="relative inline-block">
                    <span className="text-blue-mein">Mein</span>
                    <HandwrittenAccent
                      text="Set."
                      className="block text-4xl md:text-5xl lg:text-6xl mt-1"
                    />
                  </span>
                </h1>
              </FadeUp>

              <FadeUp delay={200}>
                <p className="mt-5 font-caveat text-xl md:text-2xl text-charcoal leading-snug">
                  "You belong before you have it all figured out."
                </p>
              </FadeUp>

              <FadeUp delay={260}>
                <p className="mt-4 text-base md:text-lg text-gray-dark max-w-lg leading-relaxed font-sora">
                  A youth movement for young people ready to build who they are becoming — one move at a time.
                </p>
              </FadeUp>

              <FadeUp delay={330}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/join" className="btn-primary text-base py-4 px-8">
                    Join the Movement
                    <ArrowRight size={16} />
                  </Link>
                  <Link to="/stories" className="btn-secondary text-base py-4 px-8">
                    See the Stories
                  </Link>
                </div>
              </FadeUp>

              <FadeUp delay={400}>
                <div className="mt-5">
                  <ConsentBadge />
                </div>
              </FadeUp>

              <FadeUp delay={460}>
                {/* Mobile-only compact portal identity strip */}
                <div className="mt-7 lg:hidden">
                  <div className="flex items-center gap-4">
                    {/* Small portal circle */}
                    <div className="relative flex-shrink-0 w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-mein/40 animate-spin-slow" />
                      <div className="absolute inset-[10%] rounded-full border border-dashed border-gold-mein/30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <OpenMIcon size={32} />
                      </div>
                      {/* Small gold dot on orbit */}
                      <div className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-gold-mein" />
                    </div>
                    {/* One sticker + fragment */}
                    <div className="flex flex-col gap-1.5">
                      <StickerNote text="Future me." rotate={-2} color="blue" />
                      <MovementFragment text="Step in. Pick your move." className="text-sm text-gray-mid" />
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>

            <div className="hidden lg:flex items-center justify-center py-6">
              <PortalZone />
            </div>

          </div>
        </div>
      </section>

      {/* ─── MOVE CARDS ───────────────────────────────────────────────── */}
      <section className="relative bg-gray-support/30 pt-12 pb-16 md:py-28">
        <MeinEnergyTexture />
        <div className="container-wide section-padding relative z-10">
          <FadeUp>
            <div className="flex flex-col items-center text-center mb-10 md:mb-14">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Choose your move.
              </h2>
              <p className="mt-3 text-gray-dark max-w-lg font-sora">
                You do not need to know every step. Choose one and start there.
              </p>
              {/* Mobile-only swipe hint */}
              <p className="mt-2 font-caveat text-gray-mid text-base md:hidden">
                Swipe to see all moves.
              </p>
            </div>
          </FadeUp>

          {/* Mobile: horizontal snap-scroll. sm+: grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5 no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-5 md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-5 items-stretch">
            {moveCards.map((card, i) => (
              <FadeUp key={card.label} delay={i * 80} className="snap-start flex-shrink-0 w-[82vw] md:w-auto">
                <Link
                  to={card.href}
                  className={`move-card flex flex-col h-full group${i === moveCards.length - 1 ? ' border-dashed' : ''}`}
                  style={{
                    '--accent': card.accent,
                    transform: `rotate(${i % 2 === 0 ? '-0.5' : '0.5'}deg)`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.transform = 'rotate(0deg) translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.transform = `rotate(${i % 2 === 0 ? '-0.5' : '0.5'}deg)`
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className="font-sora font-black text-4xl leading-none tracking-tight"
                      style={{ color: card.bg }}
                    >
                      {card.number}
                    </span>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: card.bg }}
                    >
                      <card.icon size={20} style={{ color: card.accent }} strokeWidth={2} />
                    </div>
                  </div>

                  <p
                    className="text-[10px] font-sora font-semibold uppercase tracking-[0.18em] mb-1"
                    style={{ color: card.accent }}
                  >
                    Move {card.number} — {card.label}
                  </p>

                  <HandwrittenAccent text={card.tagline} className="text-2xl mb-2" />
                  <p className="text-sm text-gray-dark leading-relaxed flex-1 font-sora">
                    {card.description}
                  </p>

                  <div
                    className="mt-5 flex items-center gap-2 text-sm font-semibold font-sora group-hover:gap-3 transition-all duration-200"
                    style={{ color: card.accent }}
                  >
                    {i === moveCards.length - 1 ? 'Help me start' : 'Make this move.'}
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>

                  <div className="absolute bottom-4 right-4 opacity-[0.07] pointer-events-none select-none">
                    {cardDoodles[i]}
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY JOIN MEIN? — BENEFIT BAND ───────────────────────────── */}
      <section className="bg-gray-support/40 border-y border-gray-support">
        <div className="container-wide section-padding py-9 md:py-11">

          {/* Desktop: two-column — heading left, pills + CTA right */}
          <div className="hidden md:grid md:grid-cols-[auto_1fr] md:gap-10 md:items-center">
            <div className="flex-shrink-0 flex items-stretch gap-4">
              {/* Left accent bar */}
              <div className="w-1 rounded-full bg-blue-mein flex-shrink-0" />
              <div>
                <h2 className="font-sora font-extrabold text-2xl text-charcoal leading-tight">
                  Why join Mein?
                </h2>
                <p className="mt-1 font-caveat text-lg text-blue-mein">
                  One move can open a door.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {benefitStrip.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-support rounded-full px-4 py-2 font-sora font-semibold text-charcoal text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-mein flex-shrink-0" />
                  {item.label}
                </span>
              ))}
              {/* Visual separator before CTA */}
              <span className="w-px h-6 bg-gray-support mx-1 flex-shrink-0" />
              <Link
                to="/join"
                className="inline-flex items-center gap-1.5 bg-blue-mein text-white font-sora font-bold text-xs rounded-full px-5 py-2 hover:bg-blue-dark transition-colors"
              >
                Join the Movement
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* Mobile: heading, scrollable pills, CTA */}
          <div className="md:hidden">
            <div className="flex items-stretch gap-3 mb-4">
              <div className="w-1 rounded-full bg-blue-mein flex-shrink-0" />
              <div>
                <h2 className="font-sora font-extrabold text-xl text-charcoal leading-tight">
                  Why join Mein?
                </h2>
                <p className="mt-0.5 font-caveat text-lg text-blue-mein">
                  One move can open a door.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {benefitStrip.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-support rounded-full px-4 py-2 font-sora font-semibold text-charcoal text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-mein flex-shrink-0" />
                  {item.label}
                </span>
              ))}
            </div>

            <Link
              to="/join"
              className="mt-5 inline-flex items-center gap-1.5 bg-blue-mein text-white font-sora font-bold text-sm rounded-full px-5 py-2.5 hover:bg-blue-dark transition-colors"
            >
              Join the Movement
              <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </section>

      {/* ─── BELONGING MANIFESTO WALL ─────────────────────────────────── */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 bg-blue-mein overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none flex items-center justify-center">
          <OpenMIcon size={560} />
        </div>

        <div className="container-wide section-padding relative z-10">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12 md:mb-16">
                <p className="font-caveat text-white/65 text-xl mb-3">This space is yours.</p>
                <h2 className="font-sora font-extrabold text-4xl md:text-5xl text-white leading-tight">
                  You belong here.
                </h2>
                <p className="mt-3 font-sora text-white/70 text-lg">
                  Not when you have it all figured out. Right now.
                </p>
              </div>
            </FadeUp>

            {/* Sticker badges — natural wrap, small rotations */}
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
              {belongingBadges.map((badge, i) => {
                const styles = {
                  blue: 'bg-white text-blue-mein',
                  gold: 'bg-gold-mein text-charcoal',
                  light: 'bg-white/18 text-white',
                }
                return (
                  <FadeUp key={badge.text} delay={i * 70}>
                    <span
                      className={`inline-block ${styles[badge.color]} font-sora font-bold text-sm md:text-base px-5 py-3 rounded-2xl shadow-md`}
                      style={{ transform: `rotate(${badge.rotate})` }}
                    >
                      {badge.text}
                    </span>
                  </FadeUp>
                )
              })}
            </div>

            <FadeUp delay={500}>
              <p className="text-center mt-12 font-caveat text-white/55 text-xl">
                No perfect story needed. Start with one move.
              </p>
            </FadeUp>

            <FadeUp delay={580}>
              <div className="text-center mt-7">
                <Link to="/join" className="btn-gold text-base py-4 px-9 inline-flex">
                  Become a Mein Mover
                  <ArrowRight size={16} />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── THE WALL — STORIES PREVIEW ───────────────────────────────── */}
      <section className="pt-12 pb-20 md:pt-16 md:pb-28 bg-charcoal overflow-hidden relative">
        {/* Gradient bridge from blue manifesto — inside charcoal section so it's never clipped */}
        <div
          className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-0"
          style={{ background: 'linear-gradient(to bottom, #2F6BFF, #111111)' }}
        />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none">
          <OpenMIcon size={560} className="absolute -right-16 -bottom-16" />
        </div>
        <div className="container-wide section-padding relative z-10">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
              <div>
                <div className="w-10 h-1 bg-blue-mein rounded-full mb-4" />
                <div className="mb-2" style={{ transform: 'rotate(-1deg)', display: 'inline-block' }}>
                  <span className="font-caveat text-4xl md:text-5xl text-gold-mein leading-none">
                    The Wall.
                  </span>
                </div>
                <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-white leading-tight">
                  Real moves.<br />Real stories.
                </h2>
                <HandwrittenAccent
                  text="Every move on this wall started with one person going first."
                  className="block text-lg mt-2 text-white/60"
                />
              </div>
              <Link
                to="/stories"
                className="btn-outline-blue text-white border-white hover:bg-white hover:text-charcoal self-start md:self-auto flex-shrink-0"
              >
                See the Wall
                <ArrowRight size={16} />
              </Link>
            </div>
          </FadeUp>

          {/* Latest Moves status strip */}
          <FadeUp delay={80}>
            <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4 mb-8">
              {wallStrip.map((item) => (
                <div
                  key={item.text}
                  className="flex-shrink-0 flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2"
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 animate-pulse ${item.dot}`} />
                  <span className="font-sora text-white/90 text-xs font-medium whitespace-nowrap">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Asymmetric wall layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">

            <FadeUp className="md:col-span-7">
              <Link
                to="/make-your-move"
                className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="inline-block bg-blue-mein/20 text-blue-light font-caveat text-sm px-3 py-1 rounded-md"
                    style={{ transform: 'rotate(-1.5deg)' }}
                  >
                    Future-Self Letter
                  </span>
                  <span className="font-caveat text-white/30 text-base">First drop coming</span>
                </div>
                <HandwrittenAccent
                  text="The first Mein stories are coming soon."
                  className="text-3xl md:text-4xl leading-tight block mb-3 text-white"
                />
                <p className="font-caveat text-gold-mein text-xl mt-2">
                  Want yours to be one of them?
                </p>
                <p className="mt-3 text-white/50 font-sora text-sm leading-relaxed">
                  Every story on this wall belongs to someone who decided to go first.
                </p>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-white/50 group-hover:text-white transition-colors">
                  Make this move
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </FadeUp>

            <div className="md:col-span-5 flex flex-col gap-5">
              <FadeUp delay={100}>
                <Link
                  to="/make-your-move"
                  className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
                >
                  <span
                    className="inline-block bg-gold-mein/15 text-gold-light font-caveat text-sm px-3 py-1 rounded-md mb-4 self-start"
                    style={{ transform: 'rotate(1.5deg)' }}
                  >
                    Youth Story
                  </span>
                  <h3 className="font-sora font-bold text-white text-base leading-snug">
                    Your voice deserves to be heard.
                  </h3>
                  <p className="mt-2 font-caveat text-gold-mein text-lg">
                    Submit your story today.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/50 group-hover:text-white transition-colors">
                    Make this move <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </FadeUp>

              <FadeUp delay={200}>
                <Link
                  to="/make-your-move"
                  className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
                >
                  <span
                    className="inline-block bg-white/10 text-white/70 font-caveat text-sm px-3 py-1 rounded-md mb-4 self-start"
                    style={{ transform: 'rotate(-1deg)' }}
                  >
                    Creative Work
                  </span>
                  <h3 className="font-sora font-bold text-white text-base leading-snug">
                    Your art belongs on this wall.
                  </h3>
                  <p className="mt-2 font-caveat text-gold-mein text-lg">
                    Make your creative move.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/50 group-hover:text-white transition-colors">
                    Make this move <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </FadeUp>
            </div>

          </div>
        </div>
      </section>

      {/* ─── MEET FUTURE ME TEASER ────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <FadeUp>
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-mein/30" />
                <div className="absolute inset-[18%] rounded-full border border-dashed border-gold-mein/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <OpenMIcon size={36} />
                </div>
              </div>
              <p className="font-caveat text-blue-mein text-xl mb-3">Meet Future Me</p>
              <SectionDivider className="mx-auto mb-5" />
              <h2 className="font-sora font-extrabold text-3xl md:text-5xl text-charcoal leading-tight">
                Take the Future Me Challenge.
              </h2>
              <p className="mt-4 font-caveat text-2xl md:text-3xl text-charcoal">
                Future you has something to say.
              </p>
              <p className="mt-5 text-gray-dark text-lg leading-relaxed font-sora">
                A guided experience where you imagine who you are becoming, speak as your future self, and use that voice to build confidence today.
              </p>
              <HandwrittenAccent
                text={'"Sometimes the voice you need to hear is your own."'}
                className="block text-2xl md:text-3xl mt-6"
              />
              <Link to="/future-me" className="mt-9 btn-primary text-base py-4 px-9 inline-flex">
                Take the Future Me Challenge
                <ArrowRight size={16} />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── SHOP TEASER ──────────────────────────────────────────────── */}
      <section className="py-16 bg-blue-pale">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="font-caveat text-blue-mein text-lg mb-1">Drop 001 — loading.</p>
                <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
                  Wear what you're building.
                </h2>
                <p className="mt-2 font-caveat text-xl text-gray-dark">
                  Built for Mein Movers. I'm building it.
                </p>
              </div>
              <Link to="/shop" className="btn-primary flex-shrink-0">
                Shop the Drop
                <ArrowRight size={16} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-pale opacity-50 blur-3xl" />
        </div>
        <div className="container-wide section-padding relative z-10 text-center">
          <FadeUp>
            <OpenMIcon size={60} className="mx-auto mb-6" />
            <h2 className="font-sora font-extrabold text-4xl md:text-5xl text-charcoal leading-tight">
              Ready to make<br />your move?
            </h2>
            <p className="mt-4 text-gray-dark text-lg font-sora max-w-md mx-auto">
              The future you is already in motion. Start with one move.
            </p>
            <div className="mt-9 flex flex-wrap gap-4 justify-center">
              <Link to="/make-your-move" className="btn-primary text-base py-4 px-9">
                Make Your Move
                <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn-secondary text-base py-4 px-9">
                What's Mein?
              </Link>
            </div>
            <p className="mt-6 font-caveat text-xl text-gray-mid">It's you, upgraded.</p>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
