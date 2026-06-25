import { Link } from 'react-router-dom'
import { ArrowRight, Pen, Play, Hammer, Megaphone, Building2, Users, Mail, Star } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'

const whoCards = [
  { icon: Star, text: 'You are creative' },
  { icon: Play, text: 'You have a story to tell' },
  { icon: Hammer, text: 'You want to build something' },
  { icon: Star, text: 'You are still figuring things out' },
  { icon: Users, text: 'You want to be part of something positive' },
  { icon: ArrowRight, text: 'You want your future to feel possible' },
]

const participationOptions = [
  { icon: Users, label: 'Join the Movement', href: '/join', desc: 'Become a Mein Mover', color: 'blue' },
  { icon: Pen, label: 'Submit Creative Work', href: '/make-your-move?type=create', desc: 'Art, writing, photography, design', color: 'blue' },
  { icon: Megaphone, label: 'Apply as a Content Creator', href: '/make-your-move?type=represent', desc: 'Be a Mein youth voice', color: 'blue' },
  { icon: Play, label: 'Upload a Video', href: '/make-your-move?type=speak', desc: 'Share your future-self message', color: 'blue' },
  { icon: Hammer, label: 'Youth Entrepreneur Route', href: '/make-your-move?type=build', desc: 'Start building your idea', color: 'gold' },
  { icon: Building2, label: 'Partner or Sponsor', href: '/schools', desc: 'Support the movement', color: 'dark' },
  { icon: Building2, label: 'School or Programme Inquiry', href: '/schools', desc: 'Bring Mein to your community', color: 'dark' },
  { icon: Mail, label: 'General Contact', href: '/contact', desc: 'Get in touch', color: 'light' },
]

export default function JoinPage() {
  return (
    <div className="with-mobile-cta">
      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-blue-mein overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <OpenMIcon size={500} className="brightness-0 invert" />
        </div>
        <div className="container-wide section-padding relative z-10">
          <FadeUp>
            <span className="inline-flex items-center text-xs font-sora font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest bg-white/20 text-white mb-5">
              Join Mein
            </span>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-white leading-tight max-w-3xl">
              Become a Mein{' '}
              <HandwrittenAccent text="Mover." className="text-5xl md:text-6xl text-white/90" />
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="mt-6 text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed font-sora">
              A Mein Mover is someone building who they are becoming — one move, one idea, one story, one step at a time. Any form of participation in Mein makes you a Mein Mover.
            </p>
            <p className="mt-3 text-white/70 text-lg font-sora">
              You do not have to be famous, perfect, confident, or already successful. You just have to be willing to make a move.
            </p>
          </FadeUp>
          <FadeUp delay={250}>
            <Link to="/make-your-move" className="mt-9 btn-gold inline-flex text-base py-4 px-9">
              Make Your Move
              <ArrowRight size={16} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ─── WHO CAN JOIN ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-12">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                This is for you if...
              </h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whoCards.map((card, i) => (
              <FadeUp key={card.text} delay={i * 70}>
                <div className="flex items-start gap-4 bg-gray-support/40 rounded-2xl p-5 hover:bg-blue-pale transition-colors duration-200 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-pale group-hover:bg-blue-mein/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-mein" />
                  </div>
                  <p className="font-sora font-semibold text-charcoal mt-2">{card.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WAYS TO PARTICIPATE ─── */}
      <section className="py-20 md:py-28 bg-gray-support/30">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-12">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">
                Choose your way in
              </h2>
              <p className="mt-3 text-gray-dark font-sora max-w-lg mx-auto">
                Every path leads to the same place: moving forward.
              </p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {participationOptions.map((opt, i) => (
              <FadeUp key={opt.label} delay={i * 60}>
                <Link
                  to={opt.href}
                  className="move-card flex flex-col group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-pale flex items-center justify-center mb-4 group-hover:bg-blue-mein group-hover:text-white transition-colors">
                    <opt.icon size={18} className="text-blue-mein group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-sora font-bold text-charcoal text-sm">{opt.label}</p>
                  <p className="mt-1 text-xs text-gray-mid font-sora">{opt.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-mein">
                    Start here <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY PLEDGE ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-wide section-padding max-w-3xl mx-auto text-center">
          <FadeUp>
            <HandwrittenAccent text="When you join, you join a movement." className="text-2xl md:text-3xl block mb-5" />
            <p className="text-gray-dark font-sora leading-relaxed">
              Mein Movers create, speak, build, and represent. They show up for themselves and for each other. They read the community rules and they take them seriously, because this movement is built on respect.
            </p>
            <div className="mt-7 flex flex-wrap gap-4 justify-center">
              <Link to="/make-your-move" className="btn-primary">
                Join the Movement
                <ArrowRight size={16} />
              </Link>
              <Link to="/community-rules" className="btn-secondary">
                Read Community Rules
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
