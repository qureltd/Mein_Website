import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'

const rules = [
  {
    number: '01',
    title: 'Be respectful',
    sub: 'Be there for each other.',
    body: 'No bullying, hate speech, or harassment of any kind. Every person in this movement deserves to feel safe.',
  },
  {
    number: '02',
    title: 'Be original',
    sub: 'Create, do not copy.',
    body: 'Share your own work, or clearly credit others. Do not pass off someone else\'s creativity as your own.',
  },
  {
    number: '03',
    title: 'Keep it safe',
    sub: 'Keep it safe.',
    body: 'No harmful, dangerous, explicit, or illegal content. If it could hurt someone — including yourself — it does not belong here.',
  },
  {
    number: '04',
    title: 'Protect privacy',
    sub: 'Protect the space.',
    body: "Do not share private or personal information about yourself or others. Your safety — and theirs — matters.",
  },
  {
    number: '05',
    title: 'Build, do not tear down',
    sub: 'Speak with respect.',
    body: 'Feedback should help people grow, not cut them down. This is a space for building up — not breaking down.',
  },
  {
    number: '06',
    title: 'Respect consent',
    sub: 'Move with purpose.',
    body: "Do not submit media of other people without their permission. Everyone has the right to decide how they are represented.",
  },
  {
    number: '07',
    title: 'Stay aligned with the movement',
    sub: 'Stay aligned. Stay moving.',
    body: 'Mein is built on creativity, growth, hope, and positive action. Stay aligned with those values — in what you submit and how you show up.',
  },
]

export default function CommunityRulesPage() {
  return (
    <div className="with-mobile-cta">
      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-white overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/3 opacity-[0.04] pointer-events-none">
          <OpenMIcon size={600} />
        </div>
        <div className="container-wide section-padding relative z-10 max-w-3xl">
          <FadeUp>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-charcoal leading-tight">
              This movement is built on{' '}
              <HandwrittenAccent text="respect." className="text-5xl md:text-6xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="mt-4 font-caveat text-blue-mein text-xl md:text-2xl">
              These rules exist because this movement matters. So do the people in it.
            </p>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="mt-4 text-xl text-gray-dark font-sora leading-relaxed max-w-xl">
              These rules exist to keep Mein a safe, positive, and empowering space for every young person who is part of this movement.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── RULES ─── */}
      <section className="py-20 md:py-28 bg-gray-support/20">
        <div className="container-wide section-padding max-w-3xl mx-auto">
          <FadeUp>
            <SectionDivider />
            <h2 className="mt-5 font-sora font-extrabold text-2xl md:text-3xl text-charcoal mb-8">Seven rules. One movement.</h2>
          </FadeUp>
          <div className="space-y-4">
            {rules.map((rule, i) => (
              <FadeUp key={rule.number} delay={i * 70}>
                <div className="bg-white rounded-2xl p-7 border-2 border-gray-support hover:border-blue-mein transition-all duration-300 flex gap-5 items-start group">
                  <div className="w-12 h-12 rounded-xl bg-blue-pale flex items-center justify-center flex-shrink-0 group-hover:bg-blue-mein transition-colors mt-0.5">
                    <span className="font-sora font-bold text-blue-mein group-hover:text-white text-sm transition-colors">
                      {rule.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-sora font-bold text-charcoal text-lg group-hover:text-blue-mein transition-colors">
                      {rule.title}
                    </h3>
                    <p className="font-caveat text-blue-mein text-base mt-0.5">{rule.sub}</p>
                    <p className="mt-2 text-gray-dark text-sm leading-relaxed font-sora">{rule.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={560}>
            <div className="mt-12 bg-[#1A2236] rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none select-none">
                <OpenMIcon size={300} className="absolute -right-10 -bottom-10" />
              </div>
              <p className="font-sora font-bold text-white text-base md:text-lg relative z-10 leading-snug">
                We protect this space so everyone in it stays safe.
              </p>
              <p className="mt-3 text-white/70 text-sm font-sora relative z-10 max-w-md mx-auto leading-relaxed">
                Anyone who harms the community will be removed — because this movement is built on respect, not rules.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
