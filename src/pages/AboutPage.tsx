import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'

const meanings = [
  {
    tag: 'Me in the future',
    headline: 'The person I am becoming',
    body: 'Mein starts with a simple but powerful idea: you are already becoming someone. The question is, who?',
  },
  {
    tag: 'Me in 10 years',
    headline: 'The bigger version of what I can become',
    body: 'Ten years from now, a version of you exists who built something, said something, and became something. Mein helps you see that version today.',
  },
  {
    tag: 'Me in the story',
    headline: 'I am not left out of my own future',
    body: "Too many young people feel like life is happening around them, not for them. Mein puts you at the centre of your own story — not the edge.",
  },
  {
    tag: 'Me in motion',
    headline: "I am not waiting. I am moving.",
    body: "Waiting for the right moment is the wrong move. Mein helps you take practical steps today — however small — toward who you are becoming.",
  },
]

const values = [
  'Confidence',
  'Belonging',
  'Creative expression',
  'Positive identity',
  'Direction',
  'Visibility',
  'Entrepreneurial thinking',
  'Safe participation',
]

export default function AboutPage() {
  return (
    <div className="with-mobile-cta">
      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-white overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/3 opacity-[0.04] pointer-events-none">
          <OpenMIcon size={600} />
        </div>
        <div className="container-wide section-padding relative z-10">
          <FadeUp>
            <span className="tag-badge mb-5 inline-flex">What's Mein?</span>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-charcoal leading-tight max-w-3xl">
              Mein is for the person{' '}
              <HandwrittenAccent text="you're becoming." className="text-5xl md:text-6xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="mt-7 text-lg md:text-xl text-gray-dark max-w-2xl leading-relaxed font-sora">
              It is for the version of you that is still forming. The dream you are still figuring out. The idea you are scared to start. The story you have not told yet. The future you are ready to step into.
            </p>
          </FadeUp>
          <FadeUp delay={250}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/join" className="btn-primary">
                Join the Movement
                <ArrowRight size={16} />
              </Link>
              <Link to="/make-your-move" className="btn-secondary">
                Make Your Move
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── WHAT DOES MEIN MEAN ─── */}
      <section className="py-20 md:py-28 bg-gray-support/30">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-14">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                What does Mein mean?
              </h2>
              <p className="mt-3 text-gray-dark font-sora max-w-lg mx-auto">
                Four ideas. One name. One movement.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {meanings.map((m, i) => (
              <FadeUp key={m.tag} delay={i * 80}>
                <div className="bg-white rounded-2xl p-8 border-2 border-gray-support hover:border-blue-mein transition-colors duration-300 group">
                  <span className="tag-badge mb-4 inline-flex">{m.tag}</span>
                  <h3 className="font-sora font-bold text-xl text-charcoal leading-snug group-hover:text-blue-mein transition-colors">
                    {m.headline}
                  </h3>
                  <p className="mt-3 text-gray-dark text-sm leading-relaxed font-sora">{m.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MORE THAN ADVICE ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal leading-tight">
                Because young people need more than advice.
              </h2>
              <p className="mt-5 text-gray-dark text-lg leading-relaxed font-sora">
                Young people need space to be seen, heard, guided, and supported. They need real ways to express who they are, explore what they care about, and take steps toward the life they want.
              </p>
              <p className="mt-4 text-gray-dark text-lg leading-relaxed font-sora">
                Mein provides that space — a creative movement where young people can create, speak, build, and represent, with the tools, community, and support to make it real.
              </p>
              <Link to="/join" className="mt-8 btn-primary inline-flex">
                Become a Mein Mover
                <ArrowRight size={16} />
              </Link>
            </FadeUp>

            <FadeUp delay={150}>
              <div className="bg-blue-pale rounded-3xl p-8 md:p-10">
                <p className="font-sora font-bold text-sm uppercase tracking-widest text-blue-mein mb-6">What young people gain</p>
                <div className="grid grid-cols-2 gap-3">
                  {values.map((v) => (
                    <div key={v} className="flex items-center gap-3 bg-white rounded-xl p-3.5">
                      <div className="w-2 h-2 rounded-full bg-blue-mein flex-shrink-0" />
                      <span className="text-sm font-sora font-medium text-charcoal">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── MISSION STATEMENT ─── */}
      <section className="py-20 md:py-28 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-end">
          <OpenMIcon size={500} />
        </div>
        <div className="container-wide section-padding relative z-10 text-center">
          <FadeUp>
            <p className="font-sora text-white/50 text-sm uppercase tracking-widest mb-5">Our Mission</p>
            <h2 className="font-sora font-extrabold text-3xl md:text-4xl lg:text-5xl text-white leading-tight max-w-3xl mx-auto">
              To provide young people with tools, support, hope, and direction to shape the future they desire.
            </h2>
            <HandwrittenAccent
              text="Live your future today."
              className="block text-3xl mt-8"
            />
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
