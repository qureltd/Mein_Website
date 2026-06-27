import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Pen, Mic, Lightbulb, Megaphone, HelpCircle } from 'lucide-react'
import meinYouthCrew from '../assets/Youth_that_belong.png'
import { FadeUp } from '../hooks/useInView'
import {
  OpenMIcon,
  HandwrittenAccent,
  SectionDivider,
  StarAccent,
  ConsentBadge,
  StickerNote,
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
    href: '/make-your-move?move=create',
    accent: '#2F6BFF',
    bg: '#dce8ff',
  },
  {
    number: '02',
    icon: Mic,
    label: 'Speak',
    tagline: 'Say it.',
    description: 'Upload a video, share a story, or send a future-self message. Your voice belongs here.',
    href: '/make-your-move?move=speak',
    accent: '#111111',
    bg: '#efefef',
  },
  {
    number: '03',
    icon: Lightbulb,
    label: 'Build',
    tagline: 'Start it.',
    description: 'Explore the youth entrepreneur route and start shaping an idea into something real.',
    href: '/make-your-move?move=build',
    accent: '#b88000',
    bg: '#fff3c4',
  },
  {
    number: '04',
    icon: Megaphone,
    label: 'Represent',
    tagline: 'Own it.',
    description: 'Apply as a Mein content creator or youth voice and shape this movement from the inside.',
    href: '/make-your-move?move=represent',
    accent: '#1a4fdb',
    bg: '#e6eeff',
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
  /* Create — pencil + star + wavy paint stroke */
  <svg key="d0" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
    <path d="M50 10L58 10L58 62L54 70L50 62L50 10Z" stroke="#2F6BFF" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M50 62L54 72L58 62" stroke="#2F6BFF" strokeWidth="2" fill="none" />
    <line x1="50" y1="18" x2="58" y2="18" stroke="#2F6BFF" strokeWidth="3" strokeLinecap="round" />
    <path d="M20 20L22.5 27H30L24 31.5L26 38.5L20 34L14 38.5L16 31.5L10 27H17.5Z" stroke="#2F6BFF" strokeWidth="2" strokeLinejoin="round" />
    <path d="M10 80Q22 70 34 80Q44 88 56 80Q66 72 76 80" stroke="#2F6BFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>,
  /* Speak — mic body + stand + outward waves */
  <svg key="d1" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
    <rect x="36" y="8" width="24" height="40" rx="12" stroke="#111111" strokeWidth="2.5" />
    <path d="M22 42C22 58 34 68 48 68C62 68 74 58 74 42" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <line x1="48" y1="68" x2="48" y2="82" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="36" y1="82" x2="60" y2="82" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 24Q8 32 14 40" stroke="#111111" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M82 24Q88 32 82 40" stroke="#111111" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>,
  /* Build — lightbulb + filament arc + spark rays */
  <svg key="d2" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
    <path d="M48 10C34 10 22 22 22 36C22 46 28 54 36 58V68H60V58C68 54 74 46 74 36C74 22 62 10 48 10Z" stroke="#b88000" strokeWidth="2.5" strokeLinejoin="round" />
    <line x1="36" y1="64" x2="60" y2="64" stroke="#b88000" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="38" y1="70" x2="58" y2="70" stroke="#b88000" strokeWidth="2" strokeLinecap="round" />
    <path d="M38 36Q48 28 58 36" stroke="#b88000" strokeWidth="2" strokeLinecap="round" fill="none" />
    <line x1="76" y1="12" x2="82" y2="6" stroke="#b88000" strokeWidth="2" strokeLinecap="round" />
    <line x1="82" y1="20" x2="90" y2="18" stroke="#b88000" strokeWidth="2" strokeLinecap="round" />
    <line x1="72" y1="6" x2="76" y2="0" stroke="#b88000" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  /* Represent — shield with star inside */
  <svg key="d3" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
    <path d="M48 8L76 20V44C76 62 64 76 48 84C32 76 20 62 20 44V20Z" stroke="#1a4fdb" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M48 28L51.5 38H62L53.5 44L56.5 54L48 48L39.5 54L42.5 44L34 38H44.5Z" stroke="#1a4fdb" strokeWidth="2" strokeLinejoin="round" fill="#1a4fdb" fillOpacity="0.12" />
  </svg>,
  /* Not sure yet — compass rose */
  <svg key="d4" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
    <circle cx="48" cy="48" r="34" stroke="#9CA3AF" strokeWidth="2.5" />
    <path d="M48 18L54 48L48 54L42 48Z" stroke="#9CA3AF" strokeWidth="2" fill="#9CA3AF" fillOpacity="0.3" />
    <path d="M48 78L42 48L48 54L54 48Z" stroke="#9CA3AF" strokeWidth="2" />
    <circle cx="48" cy="48" r="4" fill="#9CA3AF" />
    <line x1="48" y1="14" x2="48" y2="18" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    <line x1="48" y1="78" x2="48" y2="82" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="48" x2="18" y2="48" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    <line x1="78" y1="48" x2="82" y2="48" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
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
                  <span className="font-caveat text-gray-dark text-lg md:text-xl ml-1">
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
                  <span className="block">Building the right</span>
                  <span className="block mt-1">
                    <span className="text-blue-mein">Mein</span>{' '}
                    <HandwrittenAccent text="Set." className="text-5xl md:text-6xl lg:text-7xl" />
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
                      <div className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-gold-mein" />
                    </div>
                    {/* Two readable sticker labels */}
                    <div className="flex flex-col gap-2">
                      <StickerNote text="Future me." rotate={-2} color="blue" className="text-base px-4 py-2 font-semibold shadow-md" />
                      <StickerNote text="My move." rotate={1.5} color="gold" className="text-base px-4 py-2 font-semibold shadow-md" />
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
              <p className="mt-2 font-caveat text-gray-mid text-lg md:hidden">
                Swipe to see all moves →
              </p>
            </div>
          </FadeUp>

          {/* ── Mobile: horizontal snap-scroll with all 5 cards + fade edge ── */}
          {/* ── Desktop/tablet: 4-column grid for primary cards only ─────── */}

          {/* Mobile scroll wrapper — right-edge fade signals more content */}
          <div className="relative md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5 no-scrollbar items-stretch">
              {/* 4 primary move cards */}
              {moveCards.map((card, i) => (
                <div key={card.label} className="snap-start flex-shrink-0 w-[78vw]">
                  <Link
                    to={card.href}
                    className="move-card flex flex-col h-full group"
                    style={{ '--accent': card.accent, background: card.bg } as React.CSSProperties}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="font-sora font-black text-5xl leading-none tracking-tight" style={{ color: card.accent, opacity: 0.12 }}>
                        {card.number}
                      </span>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/60">
                        <card.icon size={20} style={{ color: card.accent }} strokeWidth={2} />
                      </div>
                    </div>
                    <p className="text-[10px] font-sora font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: card.accent }}>
                      Move {card.number} — {card.label}
                    </p>
                    <HandwrittenAccent text={card.tagline} className="text-2xl mb-2" />
                    <p className="text-sm text-gray-dark leading-relaxed flex-1 font-sora">{card.description}</p>
                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold font-sora group-hover:gap-3 transition-all duration-200" style={{ color: card.accent }}>
                      Make this move.
                      <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                    <div className="absolute bottom-3 right-3 opacity-[0.15] pointer-events-none select-none">
                      {cardDoodles[i]}
                    </div>
                  </Link>
                </div>
              ))}

              {/* 5th card — Not sure yet? */}
              <div className="snap-start flex-shrink-0 w-[78vw]">
                <Link
                  to="/make-your-move?move=unsure"
                  className="flex flex-col h-full rounded-2xl border-2 border-dashed border-gray-support bg-white p-6 group hover:border-blue-mein/40 hover:bg-blue-pale/20 transition-all duration-200 relative overflow-hidden"
                >
                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mb-4 group-hover:bg-blue-pale transition-colors">
                    <HelpCircle size={20} className="text-gray-400 group-hover:text-blue-mein transition-colors" strokeWidth={1.8} />
                  </div>
                  <p className="text-[10px] font-sora font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">
                    Not sure yet?
                  </p>
                  <HandwrittenAccent text="That's okay." className="text-2xl mb-2" />
                  <p className="text-sm text-gray-dark leading-relaxed flex-1 font-sora">
                    You do not need to know your move yet. Start here and we'll help you find your first move.
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold font-sora text-gray-400 group-hover:text-blue-mein group-hover:gap-3 transition-all duration-200">
                    Help me start
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-[0.15] pointer-events-none select-none">
                    {cardDoodles[4]}
                  </div>
                </Link>
              </div>
            </div>

            {/* Right-edge fade — signals more cards to scroll to */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-14 bg-gradient-to-l from-gray-support/40 to-transparent" />

            {/* Dot scroll indicator — 5 dots */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all ${i === 0 ? 'w-4 h-1.5 bg-blue-mein' : 'w-1.5 h-1.5 bg-gray-300'}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop 4-column grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5 items-stretch">
            {moveCards.map((card, i) => (
              <FadeUp key={card.label} delay={i * 80}>
                <Link
                  to={card.href}
                  className="move-card flex flex-col h-full group"
                  style={{
                    '--accent': card.accent,
                    background: card.bg,
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
                    <span className="font-sora font-black text-5xl leading-none tracking-tight" style={{ color: card.accent, opacity: 0.12 }}>
                      {card.number}
                    </span>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/60">
                      <card.icon size={20} style={{ color: card.accent }} strokeWidth={2} />
                    </div>
                  </div>
                  <p className="text-[10px] font-sora font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: card.accent }}>
                    Move {card.number} — {card.label}
                  </p>
                  <HandwrittenAccent text={card.tagline} className="text-2xl mb-2" />
                  <p className="text-sm text-gray-dark leading-relaxed flex-1 font-sora">{card.description}</p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold font-sora group-hover:gap-3 transition-all duration-200" style={{ color: card.accent }}>
                    Make this move.
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-[0.15] pointer-events-none select-none">
                    {cardDoodles[i]}
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>

          {/* ── "Not sure yet?" fallback panel — desktop only ───────────── */}
          <FadeUp delay={400} className="hidden md:block">
            <div className="mt-8">
              <Link
                to="/make-your-move?move=unsure"
                className="group flex flex-col sm:flex-row items-center gap-6 rounded-2xl border-2 border-dashed border-gray-support bg-white/70 px-8 py-6 hover:border-blue-mein/40 hover:bg-blue-pale/20 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-blue-pale transition-colors">
                  <HelpCircle size={22} className="text-gray-400 group-hover:text-blue-mein transition-colors" strokeWidth={1.8} />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <p className="font-sora font-bold text-charcoal text-base">
                    Not sure yet?{' '}
                    <span className="font-caveat font-normal text-lg text-blue-mein">That's okay.</span>
                  </p>
                  <p className="mt-0.5 text-sm text-gray-dark font-sora">
                    You do not need to know your move yet. Start here and we'll help you find your first move.
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold font-sora text-gray-400 group-hover:text-blue-mein group-hover:gap-3 transition-all duration-200">
                  Help me start
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </FadeUp>

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
                <p className="mt-1 font-caveat text-xl text-blue-mein">
                  One move can open a door.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {benefitStrip.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-support rounded-full px-4 py-2 font-sora font-semibold text-charcoal text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-mein flex-shrink-0" />
                  {item.label}
                </span>
              ))}
              {/* Visual separator before CTA */}
              <span className="w-px h-6 bg-gray-support mx-1 flex-shrink-0" />
              <Link
                to="/join"
                className="inline-flex items-center gap-1.5 bg-blue-mein text-white font-sora font-bold text-sm rounded-full px-5 py-2 hover:bg-blue-dark transition-colors"
              >
                Join the Movement
                <ArrowRight size={12} />
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
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-support rounded-full px-4 py-2 font-sora font-semibold text-charcoal text-sm"
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
      <section
        className="relative py-14 md:py-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2F6BFF 0%, #2F6BFF 60%, #2456E8 100%)' }}
      >
        {/* Large intentional Open M watermark — anchored to right side behind image */}
        <div
          className="absolute right-[-80px] top-1/2 -translate-y-1/2 opacity-[0.13] pointer-events-none select-none"
          style={{ filter: 'brightness(0) invert(1)' }}
        >
          <OpenMIcon size={680} />
        </div>

        {/* Soft radial glow behind image area */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-0 lg:gap-14 items-center">

            {/* Left — text, badges, CTA */}
            <div>
              <FadeUp>
                <p className="font-caveat text-white/80 text-2xl mb-3 text-center lg:text-left">This space is yours.</p>
                <h2 className="font-sora font-extrabold text-4xl md:text-5xl text-white leading-tight text-center lg:text-left">
                  You belong here.
                </h2>
                <p className="mt-3 font-sora text-white/70 text-lg text-center lg:text-left">
                  Not when you have it all figured out. Right now.
                </p>
              </FadeUp>

              {/* Sticker badges */}
              <div className="flex flex-wrap gap-3 md:gap-4 justify-center lg:justify-start mt-8">
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
                <p className="mt-8 font-caveat text-white/75 text-2xl text-center lg:text-left">
                  No perfect story needed. Start with one move.
                </p>
              </FadeUp>

              <FadeUp delay={580}>
                <div className="mt-6 text-center lg:text-left">
                  <Link to="/join" className="btn-gold text-base py-4 px-9 inline-flex">
                    Become a Mein Mover
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </FadeUp>
            </div>

            {/* Right — youth group image */}
            <FadeUp delay={300}>
              <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
                <img
                  src={meinYouthCrew}
                  alt="Diverse young Mein Movers wearing Mein gear and celebrating together"
                  className="w-[115%] max-w-none sm:w-full lg:w-full lg:max-w-none object-contain drop-shadow-2xl pointer-events-none select-none"
                  style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.35))' }}
                />
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
                  className="block text-xl md:text-2xl mt-2 text-white/80"
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
                  <span className="font-sora text-white/90 text-sm font-medium whitespace-nowrap">
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
                to="/make-your-move?move=speak"
                className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="inline-block bg-blue-mein/20 text-blue-light font-caveat text-base px-3 py-1 rounded-md"
                    style={{ transform: 'rotate(-1.5deg)' }}
                  >
                    Future-Self Letter
                  </span>
                  <span className="font-caveat text-white/60 text-base">First drop coming</span>
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
                  to="/make-your-move?move=speak"
                  className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
                >
                  <span
                    className="inline-block bg-gold-mein/15 text-gold-light font-caveat text-base px-3 py-1 rounded-md mb-4 self-start"
                    style={{ transform: 'rotate(1.5deg)' }}
                  >
                    Youth Story
                  </span>
                  <h3 className="font-sora font-bold text-white text-lg leading-snug">
                    Your voice deserves to be heard.
                  </h3>
                  <p className="mt-2 font-caveat text-gold-mein text-lg">
                    Submit your story today.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white/60 group-hover:text-white transition-colors">
                    Make this move <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </FadeUp>

              <FadeUp delay={200}>
                <Link
                  to="/make-your-move?move=create"
                  className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
                >
                  <span
                    className="inline-block bg-white/10 text-white/80 font-caveat text-base px-3 py-1 rounded-md mb-4 self-start"
                    style={{ transform: 'rotate(-1deg)' }}
                  >
                    Creative Work
                  </span>
                  <h3 className="font-sora font-bold text-white text-lg leading-snug">
                    Your art belongs on this wall.
                  </h3>
                  <p className="mt-2 font-caveat text-gold-mein text-lg">
                    Make your creative move.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white/60 group-hover:text-white transition-colors">
                    Make this move <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
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
            <div className="mt-5 flex flex-col items-center gap-2">
              {/* Hand-drawn arrow pointing down at the tagline */}
              <svg width="28" height="36" viewBox="0 0 28 36" fill="none" aria-hidden="true" className="opacity-30">
                <path d="M14 2C13 10 12 18 11 24C10 28 9 31 8 34" stroke="#111111" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M4 30L8 34L12 30" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="font-caveat text-2xl md:text-3xl text-charcoal">It's you, upgraded.</p>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
