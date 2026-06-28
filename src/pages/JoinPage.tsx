import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import {
  OpenMIcon,
  HandwrittenAccent,
  SectionDivider,
  ConsentBadge,
} from '../components/BrandElements'

// ── Join path config ──────────────────────────────────────────────────────────

const JOIN_PATH_KEYS = ['young-person', 'parent', 'creator', 'partner'] as const
type JoinPathKey = typeof JOIN_PATH_KEYS[number]

const JOIN_PATH_OPTIONS: Record<JoinPathKey, {
  key: JoinPathKey
  label: string
  headline: string
  description: string
  activeBg: string
  activeText: string
}> = {
  'young-person': {
    key: 'young-person',
    label: 'Young person',
    headline: "You're joining as a young person.",
    description: 'Explore, create, speak, build, represent, or just start unsure.',
    activeBg: '#2F6BFF',
    activeText: '#ffffff',
  },
  parent: {
    key: 'parent',
    label: 'Parent or guardian',
    headline: "You're here as a parent or guardian.",
    description: 'Understand the movement and support a young person safely.',
    activeBg: '#F4B400',
    activeText: '#111111',
  },
  creator: {
    key: 'creator',
    label: 'Creator',
    headline: "You're joining as a creator.",
    description: 'Help shape content, stories, ideas, and youth-led energy.',
    activeBg: '#2F6BFF',
    activeText: '#ffffff',
  },
  partner: {
    key: 'partner',
    label: 'School or partner',
    headline: "You're here as a school or partner.",
    description: 'Support youth development, showcases, challenges, and opportunities.',
    activeBg: '#F4B400',
    activeText: '#111111',
  },
}

function normalizeJoinPathParam(raw: string | null): JoinPathKey | null {
  if (!raw) return null
  const s = raw.trim().toLowerCase()
  const aliases: Record<string, JoinPathKey> = {
    youth: 'young-person',
    young: 'young-person',
    guardian: 'parent',
    'parent-guardian': 'parent',
    school: 'partner',
    sponsor: 'partner',
    organisation: 'partner',
    organization: 'partner',
  }
  if (aliases[s]) return aliases[s]
  if ((JOIN_PATH_KEYS as readonly string[]).includes(s)) return s as JoinPathKey
  return null
}



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
    key: 'young-person' as JoinPathKey,
    label: 'Young person',
    desc: 'Explore, create, speak, build, represent, or just start unsure.',
    ctaLabel: 'Start here',
    href: '/make-your-move',
    accent: 'blue' as const,
  },
  {
    number: '02',
    key: 'parent' as JoinPathKey,
    label: 'Parent or guardian',
    desc: 'Understand the movement and support a young person safely.',
    ctaLabel: 'Learn how it works',
    href: '/parents',
    accent: 'gold' as const,
  },
  {
    number: '03',
    key: 'creator' as JoinPathKey,
    label: 'Creator',
    desc: 'Help shape content, stories, ideas, and youth-led energy.',
    ctaLabel: 'Collaborate with Mein',
    href: '/contact?type=creator',
    accent: 'blue' as const,
  },
  {
    number: '04',
    key: 'partner' as JoinPathKey,
    label: 'School or partner',
    desc: 'Support youth development, showcases, challenges, and opportunities.',
    ctaLabel: 'Partner with Mein',
    href: '/schools',
    accent: 'gold' as const,
  },
] as const

const badgeStyles = {
  blue: 'bg-blue-pale text-blue-mein border-2 border-blue-mein/30 shadow-md',
  gold: 'bg-gold-pale text-gold-dark border-2 border-yellow-300/60 shadow-md',
}

// Inline SVG — abstract "belonging orbit" graphic. Purely decorative.
function BelongingOrbit() {
  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <circle cx="130" cy="130" r="114" stroke="#2F6BFF" strokeWidth="1" strokeDasharray="6 5" opacity="0.18" />
      <circle cx="130" cy="130" r="82" stroke="#F4B400" strokeWidth="1" strokeDasharray="4 6" opacity="0.25" />
      <circle cx="130" cy="130" r="48" fill="#EBF0FF" opacity="0.6" />
      <g opacity="0.12" transform="translate(98,94) scale(0.044)">
        <path d="M 1436 35 L 735 458 L 36 80 L 37 1542 L 284 1460 L 285 468 L 732 718 L 1185 450 L 1188 1470 L 1438 1547 Z" fill="#2F6BFF" fillRule="evenodd" />
        <path d="M 1054 664 L 841 797 L 841 1353 L 1056 1432 L 1059 667 Z" fill="#F4B400" fillRule="evenodd" />
      </g>
      <path d="M 28 148 Q 60 68 130 60 Q 200 52 228 128" stroke="#2F6BFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.22" fill="none" />
      <circle cx="130" cy="16" r="5" fill="#2F6BFF" opacity="0.55" />
      <circle cx="244" cy="130" r="5" fill="#2F6BFF" opacity="0.40" />
      <circle cx="32"  cy="102" r="4" fill="#2F6BFF" opacity="0.35" />
      <circle cx="68"  cy="220" r="4" fill="#2F6BFF" opacity="0.30" />
      <circle cx="200" cy="34"  r="5" fill="#F4B400" opacity="0.60" />
      <circle cx="222" cy="186" r="4" fill="#F4B400" opacity="0.45" />
      <circle cx="52"  cy="174" r="4" fill="#F4B400" opacity="0.38" />
      <circle cx="130" cy="48" r="3.5" fill="#2F6BFF" opacity="0.45" />
      <circle cx="212" cy="130" r="3"   fill="#F4B400" opacity="0.50" />
      <circle cx="48"  cy="130" r="3"   fill="#2F6BFF" opacity="0.40" />
      <circle cx="130" cy="212" r="3.5" fill="#F4B400" opacity="0.40" />
      <path d="M190 52 L191.5 56 L196 57.5 L191.5 59 L190 63 L188.5 59 L184 57.5 L188.5 56 Z" fill="#F4B400" opacity="0.80" />
      <path d="M72 188 L73.2 191.2 L76.4 192.4 L73.2 193.6 L72 196.8 L70.8 193.6 L67.6 192.4 L70.8 191.2 Z" fill="#2F6BFF" opacity="0.65" />
      <path d="M58 72 L58.9 74.7 L61.6 75.6 L58.9 76.5 L58 79.2 L57.1 76.5 L54.4 75.6 L57.1 74.7 Z" fill="#F4B400" opacity="0.55" />
      <line x1="130" y1="16"  x2="130" y2="82"  stroke="#2F6BFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.15" />
      <line x1="200" y1="34"  x2="162" y2="80"  stroke="#F4B400" strokeWidth="1" strokeDasharray="3 4" opacity="0.18" />
      <line x1="32"  y1="102" x2="82"  y2="118" stroke="#2F6BFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.15" />
      <line x1="244" y1="130" x2="178" y2="130" stroke="#2F6BFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.15" />
    </svg>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function JoinPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const normalizedPath = normalizeJoinPathParam(searchParams.get('path'))
  const pathsRef = useRef<HTMLDivElement>(null)

  function handleChipClick(key: JoinPathKey) {
    setSearchParams({ path: key })
    requestAnimationFrame(() => {
      pathsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div>

      {/* ─── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-end pr-0 opacity-[0.06]">
          <OpenMIcon size={560} />
        </div>
        <div
          className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 0% 30%, rgba(47,107,255,0.10) 0%, transparent 65%)' }}
        />

        <div className="container-wide section-padding relative z-10 max-w-4xl">
          <FadeUp>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3.5 py-1.5 mb-7">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-mein" />
              <span className="font-sora text-xs font-semibold text-white/80 tracking-widest uppercase">
                Join Mein
              </span>
            </div>
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
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16 max-w-5xl mx-auto">
            <div className="flex-1 min-w-0">
              <FadeUp>
                <div className="mb-8">
                  <SectionDivider className="mb-5" />
                  <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                    There is room for you here.
                  </h2>
                  <p className="mt-3 text-gray-dark font-sora text-base md:text-lg">
                    You do not need to have it all figured out to belong.
                  </p>
                </div>
              </FadeUp>

              <div className="flex flex-wrap gap-4">
                {belongingBadges.map((badge, i) => (
                  <FadeUp key={badge.text} delay={i * 70}>
                    <span
                      className={`inline-block ${badgeStyles[badge.variant]} font-sora font-bold text-base md:text-lg py-3.5 md:py-4 px-6 md:px-8 rounded-full tracking-tight`}
                    >
                      {badge.text}
                    </span>
                  </FadeUp>
                ))}
              </div>

              <FadeUp delay={500}>
                <p className="mt-7 font-caveat text-2xl text-gray-mid">
                  All of these people belong here.
                </p>
              </FadeUp>
            </div>

            <div className="hidden lg:flex flex-shrink-0 items-center justify-center w-64 xl:w-72" aria-hidden="true">
              <BelongingOrbit />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. AUDIENCE PATHS ───────────────────────────────────────────── */}
      <section id="paths" className="py-16 md:py-20 bg-[#FAFAF8]" ref={pathsRef}>
        <div className="container-wide section-padding max-w-3xl mx-auto">
          <FadeUp>
            <div className="text-center mb-8">
              <SectionDivider className="mx-auto mb-5" />
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Choose your way in.
              </h2>
              <p className="mt-3 text-gray-dark font-sora text-base md:text-lg">
                There is more than one way to be part of Mein.
              </p>
            </div>
          </FadeUp>

          {/* Compact path chip switcher */}
          <FadeUp delay={80}>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {JOIN_PATH_KEYS.map((key) => {
                const opt = JOIN_PATH_OPTIONS[key]
                const isActive = normalizedPath === key
                return (
                  <button
                    key={key}
                    onClick={() => handleChipClick(key)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-sora font-semibold border transition-all duration-150 ${
                      isActive
                        ? 'border-transparent'
                        : 'border-gray-support bg-white text-gray-dark hover:border-blue-mein/50 hover:text-blue-mein'
                    }`}
                    style={isActive ? { backgroundColor: opt.activeBg, color: opt.activeText } : undefined}
                  >
                    {isActive && <Check size={12} strokeWidth={3} />}
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </FadeUp>

          {/* Contextual banner — shown when a path is selected */}
          {normalizedPath && (
            <FadeUp>
              <div className="mb-8 rounded-2xl bg-blue-pale/60 border border-blue-mein/20 px-5 py-4 flex items-start gap-3">
                <div className="flex-shrink-0 flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-widest whitespace-nowrap">
                    Selected path
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-sora font-semibold"
                    style={{
                      backgroundColor: JOIN_PATH_OPTIONS[normalizedPath].activeBg,
                      color: JOIN_PATH_OPTIONS[normalizedPath].activeText,
                    }}
                  >
                    <Check size={10} strokeWidth={3} />
                    {JOIN_PATH_OPTIONS[normalizedPath].label}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sora font-bold text-sm text-charcoal leading-snug">
                    {JOIN_PATH_OPTIONS[normalizedPath].headline}
                  </p>
                  <p className="mt-0.5 font-sora text-xs text-gray-dark leading-snug">
                    {JOIN_PATH_OPTIONS[normalizedPath].description}
                  </p>
                </div>
              </div>
            </FadeUp>
          )}

          {/* Vertical path list */}
          <div className="relative">
            <div className="hidden md:block absolute left-[38px] top-10 bottom-10 w-0.5 bg-blue-mein/15" />

            <div className="flex flex-col gap-3.5">
              {audiencePaths.map((path, i) => {
                const isGold = path.accent === 'gold'
                const isSelected = normalizedPath === path.key
                return (
                  <FadeUp key={path.number} delay={i * 80}>
                    <Link
                      to={path.href}
                      className={`group relative flex items-center gap-5 md:gap-6 bg-white rounded-2xl border hover:shadow-lg active:scale-[0.99] transition-all duration-200 px-5 py-6 md:px-8 md:py-7 ${
                        isSelected
                          ? 'border-blue-mein/40 shadow-md'
                          : 'border-gray-support hover:border-blue-mein/40'
                      }`}
                    >
                      <div
                        className={`relative z-10 flex-shrink-0 w-[56px] h-[56px] rounded-full flex items-center justify-center font-sora font-black text-base transition-colors duration-200 ${
                          isGold
                            ? 'bg-gold-pale text-gold-dark group-hover:bg-gold-mein group-hover:text-white'
                            : 'bg-blue-pale text-blue-mein group-hover:bg-blue-mein group-hover:text-white'
                        }`}
                      >
                        {path.number}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-sora font-extrabold text-base md:text-lg text-charcoal group-hover:text-blue-mein transition-colors leading-snug">
                          {path.label}
                        </p>
                        <p className="text-sm text-gray-dark font-sora mt-1 leading-snug">
                          {path.desc}
                        </p>
                      </div>

                      <div
                        className={`hidden sm:flex items-center gap-1.5 flex-shrink-0 text-sm font-sora font-semibold whitespace-nowrap ${
                          isGold ? 'text-gold-dark' : 'text-blue-mein'
                        } group-hover:gap-3 transition-all duration-200`}
                      >
                        {path.ctaLabel}
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
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
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.04]">
          <OpenMIcon size={500} />
        </div>

        <div className="container-wide section-padding max-w-2xl mx-auto text-center relative z-10">
          <FadeUp>
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
              <Link to="/make-your-move?move=unsure" className="btn-gold inline-flex justify-center">
                Make Your First Move
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
                Make Your Move
                <ArrowRight size={16} />
              </Link>
              <Link to="/future-me" className="btn-secondary inline-flex justify-center">
                Take the Future Me Challenge
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
