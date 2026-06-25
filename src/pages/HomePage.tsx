import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Pen, Hammer, Megaphone, Star } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider, StarAccent } from '../components/BrandElements'

const moveCards = [
  {
    icon: Pen,
    label: 'Create',
    tagline: 'Express it.',
    description: 'Submit art, writing, ideas, designs, photography, or poetry. This is your canvas.',
    cta: 'Make this move',
    href: '/make-your-move?type=create',
    accent: '#2F6BFF',
    bg: '#EBF0FF',
  },
  {
    icon: Play,
    label: 'Speak',
    tagline: 'Say it.',
    description: 'Upload a video, share a story, or send a future-self message. Your voice belongs here.',
    cta: 'Make this move',
    href: '/make-your-move?type=speak',
    accent: '#111111',
    bg: '#F5F5F5',
  },
  {
    icon: Hammer,
    label: 'Build',
    tagline: 'Start it.',
    description: 'Explore the youth entrepreneur route and start shaping an idea into something real.',
    cta: 'Make this move',
    href: '/make-your-move?type=build',
    accent: '#F4B400',
    bg: '#FFF8E1',
  },
  {
    icon: Megaphone,
    label: 'Represent',
    tagline: 'Own it.',
    description: 'Apply as a Mein content creator or youth voice and shape this movement from the inside.',
    cta: 'Make this move',
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

export default function HomePage() {
  return (
    <div className="with-mobile-cta">
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
        {/* Background M icon */}
        <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/4 opacity-[0.04] pointer-events-none select-none">
          <OpenMIcon size={700} />
        </div>

        <div className="container-wide section-padding relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="max-w-3xl">
            {/* Badge */}
            <FadeUp>
              <div className="flex items-center gap-2 mb-6">
                <StarAccent />
                <span className="tag-badge">Youth Movement</span>
                <span className="font-caveat text-gray-mid text-base ml-1">Create. Express. Build. Become.</span>
              </div>
            </FadeUp>

            {/* Headline */}
            <FadeUp delay={100}>
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

            {/* Subline */}
            <FadeUp delay={200}>
              <p className="mt-6 text-lg md:text-xl text-gray-dark max-w-xl leading-relaxed font-sora">
                A youth movement for young people ready to build who they are becoming — one move, one idea, one story, one step at a time.
              </p>
            </FadeUp>

            {/* CTAs */}
            <FadeUp delay={300}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/join" className="btn-primary text-base py-4 px-8">
                  Join the Movement
                  <ArrowRight size={16} />
                </Link>
                <Link to="/stories" className="btn-secondary text-base py-4 px-8">
                  See the Stories
                </Link>
              </div>
            </FadeUp>

            {/* First interaction */}
            <FadeUp delay={400}>
              <div className="mt-10 flex items-center gap-3">
                <div className="w-8 h-px bg-blue-mein" />
                <p className="font-caveat text-lg text-gray-mid">What move are you making today?</p>
              </div>
            </FadeUp>
          </div>

          {/* Floating Open M */}
          <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 animate-float">
            <OpenMIcon size={180} className="opacity-90" />
          </div>
        </div>
      </section>

      {/* ─── CHOOSE YOUR MOVE ─────────────────────────────────────────── */}
      <section className="bg-gray-support/30 py-20 md:py-28">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="flex flex-col items-center text-center mb-14">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Choose your move
              </h2>
              <p className="mt-3 text-gray-dark max-w-lg font-sora">
                You do not need to know every step. Choose one move and start there.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {moveCards.map((card, i) => (
              <FadeUp key={card.label} delay={i * 80}>
                <Link
                  to={card.href}
                  className="move-card flex flex-col h-full group"
                  style={{ '--accent': card.accent } as React.CSSProperties}
                >
                  {/* Icon circle */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: card.bg }}
                  >
                    <card.icon size={22} style={{ color: card.accent }} strokeWidth={2} />
                  </div>

                  <span className="tag-badge mb-3 self-start" style={{ color: card.accent, backgroundColor: card.bg }}>
                    {card.label}
                  </span>

                  <HandwrittenAccent text={card.tagline} className="text-2xl mb-2" />
                  <p className="text-sm text-gray-dark leading-relaxed flex-1 font-sora">{card.description}</p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold font-sora transition-colors duration-200 group-hover:text-blue-mein" style={{ color: card.accent }}>
                    {card.cta}
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY YOU BELONG HERE ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="container-wide section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left: visual */}
            <FadeUp className="relative">
              <div className="relative">
                {/* Large background circle */}
                <div className="absolute inset-0 rounded-3xl bg-blue-pale scale-105" />
                <div className="relative rounded-3xl bg-white border-2 border-blue-pale p-10 md:p-12">
                  <OpenMIcon size={120} className="mb-6" />
                  <HandwrittenAccent text="You belong before you have it all figured out." className="text-2xl md:text-3xl leading-tight block" />
                  <div className="mt-6 flex flex-wrap gap-2">
                    {['confident', 'creative', 'figuring it out', 'ambitious', 'shy', 'ready'].map((tag) => (
                      <span key={tag} className="bg-white border border-gray-support rounded-full px-3 py-1 text-xs font-sora font-medium text-gray-dark">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Gold star accent */}
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

      {/* ─── STORIES PREVIEW ──────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-charcoal overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <OpenMIcon size={600} className="absolute -right-20 -bottom-20" />
        </div>
        <div className="container-wide section-padding relative z-10">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="w-10 h-1 bg-blue-mein rounded-full mb-5" />
                <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-white leading-tight">
                  Real moves.<br />Real stories.<br />Real futures.
                </h2>
              </div>
              <Link to="/stories" className="btn-outline-blue text-white border-white hover:bg-white hover:text-charcoal self-start md:self-auto">
                See all stories
                <ArrowRight size={16} />
              </Link>
            </div>
          </FadeUp>

          {/* Story cards placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { cat: 'Future-Self Letter', title: 'The first Mein stories are coming soon.', note: 'Want yours to be one of them?' },
              { cat: 'Youth Story', title: 'Your voice deserves to be heard.', note: 'Submit your story today.' },
              { cat: 'Creative Work', title: 'Your art belongs on this wall.', note: 'Make your creative move.' },
            ].map((item, i) => (
              <FadeUp key={item.cat} delay={i * 100}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-colors duration-200 group cursor-pointer">
                  <span className="tag-badge bg-blue-mein/20 text-blue-light border-0 mb-4 inline-flex">
                    {item.cat}
                  </span>
                  <h3 className="font-sora font-bold text-white text-lg leading-snug">{item.title}</h3>
                  <p className="mt-2 font-caveat text-gold-mein text-xl">{item.note}</p>
                  <Link
                    to="/make-your-move"
                    className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/60 group-hover:text-white transition-colors"
                  >
                    Make this move <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MEET FUTURE ME TEASER ────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <FadeUp>
              <span className="tag-badge mb-5 inline-flex">Future Me</span>
              <h2 className="font-sora font-extrabold text-3xl md:text-5xl text-charcoal leading-tight">
                Meet the future you.
              </h2>
              <p className="mt-5 text-gray-dark text-lg leading-relaxed font-sora">
                Meet Future Me is a guided experience where you imagine who you are becoming, speak as your future self, and use that message to build confidence, clarity, and action today.
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
                <p className="tag-badge mb-3 inline-flex">Drop Coming</p>
                <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
                  Wear what you're building.
                </h2>
                <p className="mt-2 text-gray-dark font-sora font-caveat text-xl">
                  This is not just merch. It is a reminder: I'm building it.
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
