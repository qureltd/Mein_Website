import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Pen, Play, Star, Users, ShoppingBag } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider, StarAccent, DoodleArrow } from '../components/BrandElements'

// ─── Data ─────────────────────────────────────────────────────────────────────

const meanings = [
  {
    tag: 'ME IN THE FUTURE',
    tagColor: 'blue' as const,
    headline: 'The person I am becoming',
    body: 'Mein starts with a simple but powerful idea: you are already becoming someone. The question is, who?',
    num: '01',
    rotate: '-rotate-1',
  },
  {
    tag: 'ME IN 10 YEARS',
    tagColor: 'gold' as const,
    headline: 'The bigger version of what I can become',
    body: 'Ten years from now, a version of you exists who built something, said something, and became something. Mein helps you start today.',
    num: '02',
    rotate: 'rotate-1',
  },
  {
    tag: 'ME IN THE STORY',
    tagColor: 'blue' as const,
    headline: 'I am not left out of my own future',
    body: "Too many young people feel like life is happening around them, not for them. Mein puts you at the centre of your own story.",
    num: '03',
    rotate: 'rotate-1',
  },
  {
    tag: 'ME IN MOTION',
    tagColor: 'gold' as const,
    headline: 'I am not waiting. I am moving.',
    body: "Waiting for the right moment is the wrong move. Mein helps you take practical steps today — however small — toward who you are becoming.",
    num: '04',
    rotate: '-rotate-1',
  },
]

const gains = [
  'Confidence',
  'Belonging',
  'Creative expression',
  'Positive identity',
  'Direction',
  'Visibility',
  'Entrepreneurial thinking',
  'Safe participation',
]

const actions = [
  {
    icon: Clock,
    iconBg: '#EBF0FF',
    iconColor: '#2F6BFF',
    label: 'Future',
    title: 'Take the Future Me Challenge',
    body: 'Write a message from the version of you you are becoming.',
    href: '/future-me',
    cta: 'Start writing',
  },
  {
    icon: Pen,
    iconBg: '#EBF0FF',
    iconColor: '#2F6BFF',
    label: 'Action',
    title: 'Make your move',
    body: 'Create, speak, build, represent, or start unsure. One move is enough.',
    href: '/make-your-move',
    cta: 'Make a move',
  },
  {
    icon: Play,
    iconBg: '#F5F5F5',
    iconColor: '#111111',
    label: 'Voice',
    title: 'Share your story',
    body: 'Tell us what you are making, learning, or becoming.',
    href: '/make-your-move?move=speak',
    cta: 'Share it',
  },
  {
    icon: Star,
    iconBg: '#FFF8E1',
    iconColor: '#C48F00',
    label: 'Visibility',
    title: 'Get featured on The Wall',
    body: 'Some stories and moves may be featured after review and consent.',
    href: '/stories',
    cta: 'See The Wall',
  },
  {
    icon: Users,
    iconBg: '#EBF0FF',
    iconColor: '#2F6BFF',
    label: 'Movement',
    title: 'Join the movement',
    body: 'Become a Mein Mover and stay connected to the community.',
    href: '/join',
    cta: 'Join now',
  },
  {
    icon: ShoppingBag,
    iconBg: '#F5F5F5',
    iconColor: '#111111',
    label: 'Merch',
    title: 'Wear the movement',
    body: 'Explore merch and drops that carry the message.',
    href: '/shop',
    cta: 'Explore shop',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="with-mobile-cta">

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-white overflow-hidden">
        {/* Open M watermark */}
        <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/4 opacity-[0.04] pointer-events-none select-none">
          <OpenMIcon size={620} />
        </div>

        {/* Curved path accent — desktop only */}
        <div className="hidden md:block absolute bottom-0 left-0 pointer-events-none select-none opacity-[0.07]">
          <svg width="420" height="200" viewBox="0 0 420 200" fill="none">
            <path
              d="M-20 180 C60 140 120 60 220 80 C320 100 370 20 440 10"
              stroke="#2F6BFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="8 5"
            />
          </svg>
        </div>

        <div className="container-wide section-padding relative z-10">
          <FadeUp>
            {/* Eyebrow with gold dot accent */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-2 h-2 rounded-full bg-gold-mein flex-shrink-0" />
              <p className="font-caveat text-blue-mein text-2xl leading-none">What's Mein?</p>
            </div>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl lg:text-7xl text-charcoal leading-[1.05] max-w-4xl tracking-tight">
              A youth movement for becoming who you are —{' '}
              <HandwrittenAccent text="one move at a time." className="text-5xl md:text-6xl lg:text-7xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="mt-7 text-lg md:text-xl text-gray-dark max-w-2xl leading-relaxed font-sora">
              Mein is a space to explore your future, express your voice, create something real, and start before you have it all figured out.
            </p>
          </FadeUp>
          <FadeUp delay={240}>
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link to="/join" className="btn-primary">
                Join the Movement
                <ArrowRight size={16} />
              </Link>
              <Link to="/make-your-move" className="btn-secondary">
                Make Your Move
              </Link>
              <DoodleArrow className="hidden md:block opacity-50" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── WHAT DOES MEIN MEAN ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#FAFAF8] overflow-hidden relative">
        {/* Faint Open M behind card cluster */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.025]">
          <OpenMIcon size={700} />
        </div>

        <div className="container-wide section-padding relative z-10">
          <FadeUp>
            <div className="text-center mb-12 md:mb-16">
              <SectionDivider className="mx-auto mb-4" />
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                What does Mein mean?
              </h2>
              <p className="mt-3 text-gray-dark font-sora max-w-sm mx-auto">
                One name. Four meanings. One movement.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            {meanings.map((m, i) => (
              <FadeUp key={m.num} delay={i * 80}>
                <div
                  className={`relative bg-white rounded-3xl p-8 border-2 border-gray-support shadow-lg hover:border-blue-mein hover:shadow-2xl hover:shadow-blue-mein/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden group md:${m.rotate} hover:rotate-0`}
                >
                  {/* Stamp circle — top right corner */}
                  <div
                    className={`absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-xs font-sora font-black leading-none select-none ${
                      m.tagColor === 'blue'
                        ? 'bg-blue-pale text-blue-mein'
                        : 'bg-gold-pale text-gold-dark'
                    }`}
                    aria-hidden="true"
                  >
                    {m.num}
                  </div>

                  {/* Faint big number watermark */}
                  <span
                    className="absolute bottom-4 right-5 font-sora font-black text-[7rem] leading-none select-none pointer-events-none text-charcoal opacity-[0.04]"
                    aria-hidden="true"
                  >
                    {m.num}
                  </span>

                  {/* Tag */}
                  <span
                    className={`inline-flex items-center text-[10px] font-sora font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.18em] mb-5 ${
                      m.tagColor === 'blue'
                        ? 'bg-blue-pale text-blue-mein'
                        : 'bg-gold-pale text-gold-dark'
                    }`}
                  >
                    {m.tag}
                  </span>

                  <h3 className="font-sora font-bold text-xl text-charcoal leading-snug group-hover:text-blue-mein transition-colors duration-200 pr-8">
                    {m.headline}
                  </h3>
                  <p className="mt-3 text-gray-dark text-sm leading-relaxed font-sora">{m.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MORE THAN ADVICE ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeUp>
              <SectionDivider className="mb-5" />
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal leading-tight">
                Because young people need more than advice.
              </h2>

              {/* Brand pull quote */}
              <div className="mt-8 relative">
                <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-mein to-gold-light rounded-full" />
                <blockquote className="pl-6">
                  <p className="font-caveat text-3xl md:text-4xl text-charcoal leading-tight">
                    You do not need a plan.{' '}
                    <span className="text-blue-mein">You need a start.</span>
                  </p>
                </blockquote>
              </div>

              <p className="mt-7 text-gray-dark text-base leading-relaxed font-sora">
                Young people need space to be seen, heard, guided, and supported. They need real ways to express who they are, explore what they care about, and take steps toward the life they want.
              </p>
              <p className="mt-4 text-gray-dark text-base leading-relaxed font-sora">
                Mein provides that space — a creative movement where young people can create, speak, build, and represent, with the tools, community, and support to make it real.
              </p>
            </FadeUp>

            <FadeUp delay={160}>
              <div className="bg-blue-pale/50 rounded-3xl p-7 md:p-9 border border-blue-mein/10">
                <p className="font-sora font-bold text-xs uppercase tracking-widest text-blue-mein mb-6">
                  What young people gain
                </p>
                <div className="flex flex-wrap gap-3">
                  {gains.map((g, i) => (
                    <span
                      key={g}
                      className={`inline-flex items-center px-4 py-2.5 rounded-full text-sm font-sora font-semibold leading-none ${
                        i % 3 === 0
                          ? 'bg-blue-mein text-white shadow-md shadow-blue-mein/20'
                          : i % 3 === 1
                          ? 'bg-white text-charcoal border-2 border-blue-mein/20 shadow-sm'
                          : 'bg-gold-mein text-charcoal shadow-md shadow-gold-mein/20'
                      }`}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── WHAT CAN YOU DO WITH MEIN ─────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#FAFAF8]">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-12">
              <SectionDivider className="mx-auto mb-4" />
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                What can you do with Mein?
              </h2>
              <p className="mt-3 text-gray-dark font-sora max-w-sm mx-auto">
                Start where you are. One step is enough.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action, i) => {
              const isFeatured = i < 2
              return (
                <FadeUp key={action.title} delay={i * 60}>
                  <Link
                    to={action.href}
                    className={`flex flex-col rounded-2xl p-6 hover:-translate-y-0.5 transition-all duration-200 group h-full ${
                      isFeatured
                        ? 'bg-blue-mein border-2 border-blue-mein hover:border-blue-dark hover:bg-blue-dark shadow-lg shadow-blue-mein/20'
                        : 'bg-white border-2 border-gray-support hover:border-blue-mein hover:shadow-lg hover:shadow-blue-mein/8'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                          isFeatured ? 'bg-white/20' : ''
                        }`}
                        style={!isFeatured ? { backgroundColor: action.iconBg } : undefined}
                      >
                        <action.icon
                          size={18}
                          style={{ color: isFeatured ? '#ffffff' : action.iconColor }}
                          strokeWidth={2}
                        />
                      </div>
                      <span className={`text-[10px] font-sora font-semibold uppercase tracking-widest ${isFeatured ? 'text-white/60' : 'text-gray-mid'}`}>
                        {action.label}
                      </span>
                    </div>
                    <h3 className={`font-sora font-bold text-base leading-snug mb-1.5 transition-colors duration-200 ${isFeatured ? 'text-white' : 'text-charcoal group-hover:text-blue-mein'}`}>
                      {action.title}
                    </h3>
                    <p className={`text-sm font-sora leading-relaxed flex-1 ${isFeatured ? 'text-white/80' : 'text-gray-dark'}`}>
                      {action.body}
                    </p>
                    <div className={`mt-4 flex items-center gap-1.5 text-sm font-semibold font-sora group-hover:gap-2.5 transition-all duration-200 ${isFeatured ? 'text-gold-mein' : 'text-blue-mein'}`}>
                      {action.cta}
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── MISSION BRIDGE ────────────────────────────────────────────────── */}
      <section className="py-10 md:py-14 bg-white">
        <div className="container-wide section-padding text-center">
          <FadeUp>
            <p className="font-caveat text-2xl md:text-3xl text-charcoal">
              Everything starts with one simple belief.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── MISSION POSTER ────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28 bg-charcoal overflow-hidden">
        {/* Gold top accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-mein via-gold-light to-gold-mein" />

        {/* Open M watermark */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none opacity-[0.06]">
          <OpenMIcon size={520} />
        </div>

        {/* Star accents */}
        <div className="absolute top-10 left-10 md:top-14 md:left-16 opacity-60 pointer-events-none select-none">
          <StarAccent />
        </div>
        <div className="absolute bottom-10 right-10 md:bottom-14 md:right-16 opacity-40 pointer-events-none select-none">
          <StarAccent />
        </div>

        <div className="container-wide section-padding relative z-10 text-center">
          <FadeUp>
            <p className="font-sora text-white/40 text-xs uppercase tracking-widest mb-6">Our Mission</p>
            <h2 className="font-sora font-extrabold text-3xl md:text-4xl lg:text-5xl text-white leading-tight max-w-3xl mx-auto">
              To provide young people with tools, support, hope, and direction to shape the future they desire.
            </h2>
            <HandwrittenAccent
              text="Live your future today."
              className="block text-3xl mt-8"
            />
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link
                to="/join"
                className="bg-gold-mein text-charcoal font-sora font-semibold px-7 py-3.5 rounded-full text-sm tracking-wide transition-all duration-200 hover:bg-gold-light hover:shadow-lg active:scale-95 inline-flex items-center gap-2"
              >
                Join the Movement
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/make-your-move"
                className="border-2 border-white/30 text-white font-sora font-semibold px-7 py-3.5 rounded-full text-sm tracking-wide transition-all duration-200 hover:border-white hover:bg-white/10 active:scale-95 inline-flex items-center gap-2"
              >
                Make Your Move
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
