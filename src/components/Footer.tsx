import { Link } from 'react-router-dom'
import { ArrowRight, Instagram, Twitter, Youtube } from 'lucide-react'

const youthLinks = [
  { label: 'Start Here', href: '/' },
  { label: "What's Mein?", href: '/about' },
  { label: 'Join Mein', href: '/join' },
  { label: 'Make Your Move', href: '/make-your-move' },
  { label: 'The Wall', href: '/wall' },
  { label: 'Future Me', href: '/future-me' },
  { label: 'Shop', href: '/shop' },
]

const adultLinks = [
  { label: 'Why This Matters', href: '/why-this-matters' },
  { label: 'Parents & Consent', href: '/parents' },
  { label: 'Schools & Partners', href: '/schools' },
  { label: 'Community Rules', href: '/community-rules' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* CTA strip */}
      <div className="bg-blue-mein">
        <div className="container-wide section-padding py-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-sora font-bold text-xl md:text-2xl text-white">Ready to make your move?</p>
            <p className="text-white/80 text-sm mt-1 font-sora">One move can start a future.</p>
          </div>
          <Link to="/make-your-move" className="btn-gold flex-shrink-0">
            Make Your Move
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-wide section-padding py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand col */}
          <div className="md:col-span-4">
            <Link to="/">
              <img
                src="/assets/logos/02_primary_lockup_no_tagline.svg"
                alt="Mein"
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-white/60 text-sm leading-relaxed font-sora max-w-xs">
              A youth movement for young people ready to build who they are becoming — one move, one idea, one story, one step at a time.
            </p>
            <p className="mt-3 font-caveat text-gold-mein text-xl">Live your future today.</p>

            {/* Social */}
            <div className="mt-5 flex items-center gap-3">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-blue-mein hover:bg-blue-mein transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Youth links */}
          <div className="md:col-span-4">
            <p className="text-white/40 text-xs font-sora font-semibold uppercase tracking-widest mb-4">Movement</p>
            <ul className="space-y-2.5">
              {youthLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 text-sm font-sora hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Adult links */}
          <div className="md:col-span-4">
            <p className="text-white/40 text-xs font-sora font-semibold uppercase tracking-widest mb-4">Parents & Partners</p>
            <ul className="space-y-2.5">
              {adultLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 text-sm font-sora hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-center md:text-left">
            <p className="text-white/40 text-xs font-sora">
              &copy; {new Date().getFullYear()} Mein Today LLC. All rights reserved.
            </p>
            <p className="text-white/25 text-xs font-sora mt-1">
              1021 E Lincolnway, 10493, Cheyenne, WY 82001, Laramie, US &middot; www.meintoday.com
            </p>
          </div>
          <p className="font-caveat text-white/30 text-base">
            Mein is for the person you're becoming.
          </p>
        </div>
      </div>
    </footer>
  )
}
