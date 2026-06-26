import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Pen, Hammer, Megaphone, Play, Star } from 'lucide-react'
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
]

const whyCards = [
  { text: 'You are creative' },
  { text: 'You have a story to tell' },
  { text: 'You want to build something' },
  { text: 'You are still figuring things out' },
  { text: 'You want to be part of something positive' },
  { text: 'You want your future to feel possible' },
]

const cardDoodles = [
  // Create — pencil strokes
  <svg key="d0" width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <line x1="12" y1="50" x2="50" y2="12" stroke="#2F6BFF" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="18" y1="55" x2="55" y2="18" stroke="#2F6BFF" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 6" />
  </svg>,
  // Speak — sound wave
  <svg key="d1" width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <path d="M6 30Q16 18 26 30Q36 42 46 30Q52 24 56 30" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M10 40Q20 28 30 40Q40 50 50 40" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>,
  // Build — bar chart columns
  <svg key="d2" width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <rect x="8" y="26" width="14" height="26" rx="2" stroke="#F4B400" strokeWidth="2.5" />
    <rect x="30" y="12" width="14" height="40" rx="2" stroke="#F4B400" strokeWidth="2.5" />
  </svg>,
  // Represent — star outline
  <svg key="d3" width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <path d="M30 8L35.5 23.5H52L38.5 32.5L43 48L30 39L17 48L21.5 32.5L8 23.5H24.5L30 8Z" stroke="#2F6BFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
]

export default function HomePage() {
  return (
    <div className="with-mobile-cta">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white">
        {/* Faint background watermark */}
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-[0.035] pointer-events-none select-none">
          <OpenMIcon size={600} />
        </div>

        <div className="container-wide section-padding relative z-10 pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── Left: text content ── */}
            <div>
              {/* Eyebrow line */}
              <FadeUp>
                <div className="flex items-center gap-2 mb-4">
                  <StarAccent />
                  <span className="font-caveat text-gray-mid text-base ml-1">
                    Create. Express. Build. Become.
                  </span>
                </div>
              </FadeUp>

              {/* The key question — moved to the top */}
              <FadeUp delay={60}>
                <p className="font-caveat text-3xl md:text-4xl text-blue-mein leading-snug mb-4">
                  What move are you making today?
                </p>
              </FadeUp>

              {/* Main headline */}
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

              {/* Belonging line */}
              <FadeUp delay={200}>
                <p className="mt-5 font-caveat text-xl md:text-2xl text-charcoal leading-snug">
                  "You belong before you have it all figured out."
                </p>
              </FadeUp>

              {/* Supporting copy */}
              <FadeUp delay={260}>
                <p className="mt-4 text-base md:text-lg text-gray-dark max-w-lg leading-relaxed font-sora">
                  A youth movement for young people ready to build who they are becoming — one move at a time.
                </p>
              </FadeUp>

              {/* CTAs */}
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

              {/* Consent / safety badge */}
              <FadeUp delay={400}>
                <div className="mt-5">
                  <ConsentBadge />
                </div>
              </FadeUp>

              {/* Mobile portal cue — compact portal identity for small screens */}
              <FadeUp delay={460}>
                <div className="mt-8 flex items-center gap-4 lg:hidden">
                  <div className="relative flex-shrink-0 w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-mein/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <OpenMIcon size={30} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StickerNote text="Future me." rotate={-2} color="blue" />
                    <MovementFragment text="Step in. Pick your move." className="text-sm text-gray-mid" />
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* ── Right: Portal Zone (desktop only) ── */}
            <div className="hidden lg:flex items-center justify-center py-6">
              <PortalZone />
            </div>

          </div>
        </div>
      </section>

      {/* ─── MOVE CARDS ───────────────────────────────────────────────── */}
      <section className="relative bg-gray-support/30 py-20 md:py-28">
        {/* Youth energy texture — artwork-inspired decorative fragments */}
        <MeinEnergyTexture />
        <div className="container-wide section-padding relative z-10">
          <FadeUp>
            <div className="flex flex-col items-center text-center mb-14">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Choose your move.
              </h2>
              <p className="mt-3 text-gray-dark max-w-lg font-sora">
                You do not need to know every step. Choose one and start there.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {moveCards.map((card, i) => (
              <FadeUp key={card.label} delay={i * 80}>
                <Link
                  to={card.href}
                  className="move-card flex flex-col h-full group"
                  style={{
                    '--accent': card.accent,
                    transform: `rotate(${i % 2 === 0 ? '-0.8' : '0.8'}deg)`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.transform = 'rotate(0deg) translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.transform = `rotate(${i % 2 === 0 ? '-0.8' : '0.8'}deg)`
                  }}
                >
                  {/* Number + icon row */}
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

                  {/* Move label */}
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
                    Make this move.
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>

                  {/* Doodle background accent */}
                  <div className="absolute bottom-4 right-4 opacity-[0.07] pointer-events-none select-none">
                    {cardDoodles[i]}
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── YOU BELONG HERE ──────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="container-wide section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left: visual card */}
            <FadeUp className="relative">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-blue-pale scale-105" />
                <div className="relative rounded-3xl bg-white border-2 border-blue-pale p-10 md:p-12">
                  <OpenMIcon size={120} className="mb-6" />
                  <HandwrittenAccent
                    text="You belong before you have it all figured out."
                    className="text-2xl md:text-3xl leading-tight block"
                  />
                  <div className="mt-6 flex flex-wrap gap-2">
                    {['confident', 'creative', 'figuring it out', 'ambitious', 'shy', 'ready'].map((tag) => (
                      <span
                        key={tag}
                        className="bg-white border border-gray-support rounded-full px-3 py-1 text-xs font-sora font-medium text-gray-dark"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Star size={24} fill="#F4B400" stroke="none" />
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Right: copy */}
            <div>
              <FadeUp>
                <SectionDivider />
                <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal leading-tight">
                  You belong here.
                </h2>
              </FadeUp>
              <FadeUp delay={100}>
                <p className="mt-4 text-gray-dark text-lg leading-relaxed font-sora">
                  Whether you are confused, uncertain, discouraged, ambitious, creative, or simply unsure — Mein is built for exactly where you are right now.
                </p>
              </FadeUp>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {whyCards.map((card, i) => (
                  <FadeUp key={card.text} delay={i * 60}>
                    <div className="flex items-start gap-3 bg-gray-support/40 rounded-xl p-4">
                      <div className="w-5 h-5 rounded-full bg-blue-mein flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <p className="text-sm font-sora text-charcoal font-medium">{card.text}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>

              <FadeUp delay={400}>
                <Link to="/join" className="mt-8 btn-outline-blue inline-flex">
                  Become a Mein Mover
                  <ArrowRight size={16} />
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE WALL — STORIES PREVIEW ───────────────────────────────── */}
      <section className="py-20 md:py-28 bg-charcoal overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none">
          <OpenMIcon size={560} className="absolute -right-16 -bottom-16" />
        </div>
        <div className="container-wide section-padding relative z-10">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="w-10 h-1 bg-blue-mein rounded-full mb-4" />
                {/* "The Wall" sticker label */}
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

          {/* Asymmetric wall layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">

            {/* Featured large card */}
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

            {/* Two smaller stacked cards */}
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
              {/* Mini portal doorway graphic */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-mein/30" />
                <div className="absolute inset-[18%] rounded-full border border-dashed border-gold-mein/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <OpenMIcon size={36} />
                </div>
              </div>
              <SectionDivider className="mx-auto mb-5" />
              <h2 className="font-sora font-extrabold text-3xl md:text-5xl text-charcoal leading-tight">
                Meet the future you.
              </h2>
              <p className="mt-5 text-gray-dark text-lg leading-relaxed font-sora">
                A guided experience where you imagine who you are becoming, speak as your future self, and use that voice to build confidence today.
              </p>
              <HandwrittenAccent
                text={'"Sometimes the voice you need to hear is your own."'}
                className="block text-2xl md:text-3xl mt-6"
              />
              <Link to="/future-me" className="mt-9 btn-primary text-base py-4 px-9 inline-flex">
                Start your Future Me
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
