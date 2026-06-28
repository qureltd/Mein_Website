import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'

const navLinks = [
  { label: 'Start Here', href: '/' },
  { label: 'Make Your Move', href: '/make-your-move' },
  { label: 'Future Me', href: '/future-me' },
  { label: 'The Wall', href: '/wall' },
  { label: 'Join Mein', href: '/join' },
  { label: 'Shop', href: '/shop' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Dark hero pages need white nav text before scroll
  const isDarkHero =
    location.pathname === '/wall' ||
    location.pathname.startsWith('/stories/') ||
    location.pathname === '/join' ||
    location.pathname === '/shop'
  const useLightNav = isDarkHero && !scrolled && !menuOpen

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-support'
            : 'bg-transparent'
        }`}
      >
        <div className="container-wide section-padding flex items-center justify-between h-16 md:h-18">
          {/* Logo — inverted on dark hero before scroll */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src={
                useLightNav
                  ? '/assets/logos/mein_wordmark_inverted_for_black_bg.svg'
                  : '/assets/logos/02_primary_lockup_no_tagline.svg'
              }
              alt="Mein"
              className="h-8 w-auto transition-opacity duration-300"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium font-sora transition-colors duration-200 ${
                  location.pathname === link.href
                    ? useLightNav
                      ? 'text-white bg-white/15'
                      : 'text-blue-mein bg-blue-pale'
                    : useLightNav
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-charcoal hover:text-blue-mein hover:bg-blue-pale/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/make-your-move" className="btn-primary text-sm py-2.5">
              Make Your Move
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              useLightNav ? 'text-white hover:bg-white/10' : 'hover:bg-gray-support'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col pt-16">
          <div className="flex-1 overflow-y-auto px-5 py-8">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center justify-between px-4 py-4 rounded-xl text-lg font-semibold font-sora transition-colors ${
                    location.pathname === link.href
                      ? 'text-blue-mein bg-blue-pale'
                      : 'text-charcoal hover:bg-gray-support'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {link.label}
                  <ArrowRight size={18} className="opacity-40" />
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-support">
              <Link
                to="/make-your-move"
                className="btn-primary w-full justify-center text-base py-4"
              >
                Make Your Move
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
              {[
                { label: "What's Mein?", href: '/about' },
                { label: 'Why This Matters', href: '/why-this-matters' },
                { label: 'Parents & Consent', href: '/parents' },
                { label: 'Schools & Partners', href: '/schools' },
                { label: 'Community Rules', href: '/community-rules' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-gray-mid text-sm hover:text-blue-mein transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
