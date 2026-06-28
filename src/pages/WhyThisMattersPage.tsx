import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'

// ─── Data ─────────────────────────────────────────────────────────────────────

const gains = [
  {
    title: 'Confidence',
    body: 'They start to believe their voice, ideas, and story matter.',
  },
  {
    title: 'Clarity',
    body: 'They begin to see what they want, what they care about, and what step they can take next.',
  },
  {
    title: 'Creativity',
    body: 'They get space to express themselves in ways that feel real to them.',
  },
  {
    title: 'Courage',
    body: 'They practise starting before everything feels perfect.',
  },
  {
    title: 'Belonging',
    body: 'They feel part of something bigger than themselves.',
  },
  {
    title: 'Action',
    body: 'They move from thinking about the future to doing something now.',
  },
]

const principles = [
  {
    num: '01',
    title: 'Start with identity',
    body: 'Young people need room to explore who they are becoming.',
  },
  {
    num: '02',
    title: 'Make the first move small',
    body: 'The future feels less overwhelming when the next step is clear.',
  },
  {
    num: '03',
    title: 'Let expression lead',
    body: 'Voice, creativity, and story can open the door to action.',
  },
  {
    num: '04',
    title: 'Build in public, safely',
    body: 'Young people should be able to share, learn, and be seen with care.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhyThisMattersPage() {
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
              Young people need more than{' '}
              <HandwrittenAccent text="motivation." className="text-4xl md:text-5xl lg:text-6xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="mt-5 text-xl md:text-2xl font-sora font-semibold text-charcoal leading-snug max-w-lg">
              They need to be seen. They need to build. They need to{' '}
              <HandwrittenAccent text="belong." className="text-xl md:text-2xl" />
            </p>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="mt-5 text-lg text-gray-dark font-sora leading-relaxed max-w-[480px]">
              Mein exists because young people need more than advice. They need space to see who they
              are becoming — and courage to make one move now.
            </p>
          </FadeUp>
          <FadeUp delay={280}>
            <div className="mt-6 inline-block bg-blue-pale border border-blue-mein/20 rounded-xl px-5 py-3">
              <p className="font-caveat text-blue-mein text-xl md:text-2xl leading-snug">
                This is not a programme. It is a movement.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── WHY THIS MATTERS NOW ────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white border-t border-gray-support/40">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <FadeUp>
            <SectionDivider />
            <h2 className="mt-4 font-sora font-extrabold text-2xl md:text-3xl text-charcoal leading-tight mb-8">
              Why this matters now
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                num: '01',
                title: 'Too many young people feel unseen.',
                body: 'They are growing up with pressure, noise, and comparison — but not always enough space to be heard.',
                accent: 'bg-blue-pale border-blue-mein/20',
                numColor: 'text-blue-mein',
              },
              {
                num: '02',
                title: 'The future can feel far away.',
                body: 'Big dreams can feel overwhelming when no one helps you find the next step.',
                accent: 'bg-[#FFF8E6] border-yellow-200',
                numColor: 'text-[#C48F00]',
              },
              {
                num: '03',
                title: 'One move can change momentum.',
                body: 'When a young person starts, shares, creates, or builds, they begin to see themselves differently.',
                accent: 'bg-[#F0F5FF] border-blue-mein/20',
                numColor: 'text-blue-mein',
              },
            ].map((item, i) => (
              <FadeUp key={item.num} delay={i * 70}>
                <div className={`rounded-2xl border p-6 h-full ${item.accent}`}>
                  <span className={`font-sora font-black text-[11px] tracking-widest ${item.numColor}`}>
                    {item.num}
                  </span>
                  <h3 className="mt-2 font-sora font-bold text-charcoal text-base leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="font-sora text-gray-dark text-sm leading-relaxed">{item.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT ACTUALLY CHANGES ───────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-blue-pale">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <FadeUp>
            <div className="text-center mb-10">
              <SectionDivider className="mx-auto" />
              <h2 className="mt-4 font-sora font-extrabold text-2xl md:text-3xl text-charcoal">
                What actually changes.
              </h2>
              <p className="mt-2 font-sora text-gray-dark text-base max-w-md mx-auto">
                Not outcomes on a slide deck. Real shifts in how young people see themselves.
              </p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gains.map((gain, i) => (
              <FadeUp key={gain.title} delay={i * 55}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-mein flex-shrink-0" />
                    <h3 className="font-sora font-bold text-charcoal text-base">{gain.title}</h3>
                  </div>
                  <p className="font-sora text-gray-dark text-sm leading-relaxed flex-1">{gain.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE MEIN APPROACH ───────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

            {/* Left: intro */}
            <div className="lg:col-span-2">
              <FadeUp>
                <SectionDivider />
                <h2 className="mt-4 font-sora font-extrabold text-2xl md:text-3xl text-charcoal leading-tight">
                  The Mein approach
                </h2>
                <p className="mt-4 font-sora text-gray-dark text-base leading-relaxed">
                  Mein works because it starts where young people are — not where adults think they
                  should already be.
                </p>
              </FadeUp>
            </div>

            {/* Right: premium dark principle panel */}
            <div className="lg:col-span-3">
              <FadeUp delay={120}>
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#131927] shadow-2xl p-7 md:p-10">
                  {/* Watermark — bottom-right, hidden on mobile to reduce clutter */}
                  <div className="absolute -right-10 -bottom-10 opacity-[0.055] pointer-events-none select-none hidden sm:block">
                    <OpenMIcon size={220} />
                  </div>

                  {/* Panel label */}
                  <div className="relative z-10 mb-7 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-mein" />
                      <span className="font-sora text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">
                        Mein principles
                      </span>
                    </span>
                  </div>

                  {/* Principle cards */}
                  <div className="relative z-10 space-y-2">
                    {principles.map((p) => (
                      <div
                        key={p.num}
                        className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5 hover:bg-white/[0.06] transition-colors"
                      >
                        {/* Gold number badge */}
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-mein font-sora text-sm font-black text-charcoal">
                          {p.num}
                        </span>
                        <div>
                          <p className="font-sora font-bold text-white text-sm mb-1 leading-snug">
                            {p.title}
                          </p>
                          <p className="font-sora text-white/65 text-xs leading-relaxed">{p.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>

          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-[#F0F5FF]">
        <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
          <FadeUp>
            <p className="font-sora font-extrabold text-2xl md:text-3xl text-charcoal leading-snug">
              The future does not start later.
            </p>
            <HandwrittenAccent
              text="Help a young person make their first move today."
              className="text-xl md:text-2xl block mt-3 mb-6"
            />
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/make-your-move" className="btn-primary">
                Make your move <ArrowRight size={15} />
              </Link>
              <Link to="/join" className="btn-secondary">
                Join Mein
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
