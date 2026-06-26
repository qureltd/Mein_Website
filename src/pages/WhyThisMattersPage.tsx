import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'

const gains = [
  'Confidence', 'Belonging', 'Creative expression', 'Positive identity',
  'Direction', 'Visibility', 'Entrepreneurial thinking', 'Safe participation',
  'A platform to be seen and supported',
]

const partnerTypes = [
  { title: 'Schools & Educators', body: 'Bring Mein into your school or curriculum as a structured programme to support student identity, confidence, and career exploration.', href: '/schools' },
  { title: 'Corporate Sponsors', body: 'Support a generation of young people building their future. Partner with Mein to fund access, resources, and opportunities for young Movers.', href: '/schools' },
  { title: 'Community Organisations', body: 'Collaborate to reach young people in your community and give them a safe, empowering creative and entrepreneurial space.', href: '/contact' },
]

export default function WhyThisMattersPage() {
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
              Young people need more than{' '}
              <HandwrittenAccent text="motivation." className="text-5xl md:text-6xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="mt-6 text-xl text-gray-dark font-sora leading-relaxed max-w-xl">
              They need space to be seen, tools to grow, opportunities to express themselves, and support to take real steps toward their future.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── WHAT THEY GAIN ─── */}
      <section className="py-20 md:py-28 bg-blue-pale">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-12">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                What young people gain through Mein
              </h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {gains.map((gain, i) => (
              <FadeUp key={gain} delay={i * 60}>
                <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-3 h-3 rounded-full bg-blue-mein flex-shrink-0" />
                  <span className="font-sora font-semibold text-charcoal text-sm">{gain}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE PROBLEM ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide section-padding max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <FadeUp>
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal leading-tight">
                The challenge for young people today
              </h2>
              <p className="mt-5 text-gray-dark leading-relaxed font-sora">
                Many young people aged 13–25 feel confused, directionless, unseen, and unsure about their future. They have access to more information than any previous generation — but less clarity about who they are and where they're going.
              </p>
              <p className="mt-4 text-gray-dark leading-relaxed font-sora">
                Mein addresses this by providing a structured, safe, and creatively engaging space where young people can express who they are, explore what they care about, and take practical steps toward the life they want.
              </p>
            </FadeUp>
            <FadeUp delay={150}>
              <div className="bg-charcoal rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-10">
                  <OpenMIcon size={150} className="brightness-0 invert" />
                </div>
                <p className="font-sora font-bold text-sm uppercase tracking-widest text-white/40 mb-5">The Mein approach</p>
                {[
                  'Structured self-expression through creative work',
                  'Guided future-self identity exercises',
                  'Youth entrepreneurship exploration',
                  'Safe digital community with consent-first policies',
                  'Peer-to-peer inspiration through The Wall',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
                    <div className="w-5 h-5 rounded-full bg-blue-mein flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <p className="text-white/80 text-sm font-sora">{point}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── PARTNER PATHS ─── */}
      <section className="py-20 md:py-28 bg-gray-support/30">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-12">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Get involved
              </h2>
              <p className="mt-3 text-gray-dark font-sora max-w-lg mx-auto">
                Support the movement at whatever level makes sense for your organisation.
              </p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {partnerTypes.map((p, i) => (
              <FadeUp key={p.title} delay={i * 80}>
                <div className="bg-white rounded-2xl p-7 border-2 border-gray-support hover:border-blue-mein transition-colors duration-300 flex flex-col h-full group">
                  <h3 className="font-sora font-bold text-xl text-charcoal group-hover:text-blue-mein transition-colors">{p.title}</h3>
                  <p className="mt-3 text-gray-dark text-sm leading-relaxed font-sora flex-1">{p.body}</p>
                  <Link to={p.href} className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-blue-mein font-sora">
                    Learn more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
