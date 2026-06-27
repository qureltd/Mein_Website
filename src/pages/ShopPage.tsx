import { useState } from 'react'
import { ArrowRight, X, Check, Bell } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider, StickerNote, StarAccent } from '../components/BrandElements'
import { supabase } from '../lib/supabase'

// ─── Drop data ────────────────────────────────────────────────────────────────

const products = [
  {
    name: 'MEIN Core Tee',
    sub: 'Electric blue Open M on white. The essential.',
    category: 'T-Shirt',
    label: 'First run',
    bg: 'bg-white',
    tileAccent: 'blue' as const,
    featured: true,
  },
  {
    name: 'Open M Hoodie',
    sub: "Oversized Open M across the back. Wear what you're building.",
    category: 'Hoodie',
    label: 'Drop preview',
    bg: 'bg-charcoal',
    tileAccent: 'dark' as const,
    featured: false,
  },
  {
    name: 'Live Your Future Today Tee',
    sub: 'The mission. On your chest.',
    category: 'T-Shirt',
    label: 'Coming soon',
    bg: 'bg-[#F5F0E8]',
    tileAccent: 'gold' as const,
    featured: false,
  },
  {
    name: 'Future Me Crewneck',
    sub: 'Heavy fleece. "Future Me" arch on front.',
    category: 'Crewneck',
    label: 'Early access',
    bg: 'bg-blue-pale',
    tileAccent: 'blue' as const,
    featured: false,
  },
  {
    name: "It's All Mein Tee",
    sub: 'Statement print. Limited colourway.',
    category: 'T-Shirt',
    label: 'Limited run',
    bg: 'bg-[#111111]',
    tileAccent: 'dark' as const,
    featured: false,
  },
  {
    name: 'Mein Mover Cap',
    sub: 'Structured fit. Open M patch. Built for Movers.',
    category: 'Cap',
    label: 'Drop preview',
    bg: 'bg-[#F5F0E8]',
    tileAccent: 'gold' as const,
    featured: false,
  },
]

const tileLabelColors: Record<string, string> = {
  'First run':    'bg-blue-mein text-white',
  'Drop preview': 'bg-gold-mein text-charcoal',
  'Coming soon':  'bg-charcoal/80 text-white',
  'Early access': 'bg-blue-pale text-blue-mein border border-blue-mein/30',
  'Limited run':  'bg-white text-charcoal border border-white/20',
}

const tileMarkColor: Record<string, string> = {
  'bg-white':       'text-blue-mein',
  'bg-charcoal':    'text-white',
  'bg-[#F5F0E8]':   'text-gold-dark',
  'bg-blue-pale':   'text-blue-mein',
  'bg-[#111111]':   'text-white',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  // Per-product notify modal
  const [notifyProduct, setNotifyProduct] = useState<string | null>(null)
  const [notifyForm, setNotifyForm] = useState({ name: '', email: '' })
  const [notifyDone, setNotifyDone] = useState(false)
  const [notifyLoading, setNotifyLoading] = useState(false)

  // Page-level early access capture
  const [accessForm, setAccessForm] = useState({ name: '', email: '' })
  const [accessDone, setAccessDone] = useState(false)
  const [accessLoading, setAccessLoading] = useState(false)

  function openNotify(productName: string) {
    setNotifyProduct(productName)
    setNotifyForm({ name: '', email: '' })
    setNotifyDone(false)
  }

  function closeNotify() {
    setNotifyProduct(null)
    setNotifyDone(false)
  }

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault()
    setNotifyLoading(true)
    await supabase.from('submissions').insert({
      name: notifyForm.name,
      email: notifyForm.email,
      type: 'contact',
      title: `Drop notification: ${notifyProduct}`,
      content: `User wants to be notified when "${notifyProduct}" drops.`,
      status: 'received',
      is_under_18: false,
    })
    setNotifyLoading(false)
    setNotifyDone(true)
  }

  async function handleAccessSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAccessLoading(true)
    await supabase.from('submissions').insert({
      name: accessForm.name,
      email: accessForm.email,
      type: 'contact',
      title: 'Drop 001 — early access request',
      content: `Early access signup for Drop 001.`,
      status: 'received',
      is_under_18: false,
    })
    setAccessLoading(false)
    setAccessDone(true)
  }

  return (
    <div className="with-mobile-cta">

      {/* ─── HERO — Drop 001 ─────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-charcoal overflow-hidden">
        {/* Large "001" watermark */}
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="font-sora font-black text-white leading-none"
            style={{ fontSize: 'clamp(10rem, 30vw, 22rem)', opacity: 0.04, letterSpacing: '-0.04em' }}
          >
            001
          </span>
        </div>

        {/* Open M — subtle right anchor */}
        <div className="absolute right-10 md:right-20 top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none select-none">
          <OpenMIcon size={340} />
        </div>

        {/* Gold top strip */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gold-mein/40" />

        <div className="container-wide section-padding relative z-10 max-w-4xl">
          <FadeUp>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-mein flex-shrink-0" />
              <span className="font-sora text-xs font-bold text-white/60 uppercase tracking-[0.22em]">
                Drop 001
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl lg:text-7xl text-white leading-[1.0] tracking-tight max-w-2xl">
              Wear the{' '}
              <span className="font-caveat text-gold-mein">reminder.</span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 font-sora font-semibold text-xl md:text-2xl text-white/80 max-w-xl">
              Built for Mein Movers.
            </p>

            {/* Supporting copy */}
            <p className="mt-3 font-sora text-base text-white/50 max-w-lg leading-relaxed">
              This is not just merch. It is a reminder of who you're becoming.
            </p>
          </FadeUp>

          <FadeUp delay={160}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* Sticker note */}
              <StickerNote
                text="Limited run. First drop."
                rotate={-2}
                color="gold"
                className="text-base px-5 py-2.5 font-semibold"
              />

              <button
                onClick={() => {
                  document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="inline-flex items-center gap-2 bg-gold-mein text-charcoal font-sora font-bold text-sm rounded-full px-6 py-3 hover:bg-gold-light transition-colors"
              >
                Get early access
                <ArrowRight size={14} />
              </button>
            </div>
          </FadeUp>

          {/* Editorial tile — drop hero visual */}
          <FadeUp delay={260}>
            <div className="mt-10 relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 h-56 md:h-72 flex items-center justify-center">
              {/* Faint texture */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle at 30% 60%, #F4B400 0%, transparent 50%), radial-gradient(circle at 80% 30%, #2F6BFF 0%, transparent 50%)' }}
              />
              {/* Open M large centred */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
                <OpenMIcon size={200} />
              </div>
              {/* Text layer */}
              <div className="relative z-10 text-center px-8">
                <p className="font-caveat text-4xl md:text-5xl text-white/70 leading-tight">
                  Drop 001 — loading.
                </p>
                <p className="mt-2 font-sora text-xs text-white/30 uppercase tracking-[0.2em]">
                  Preview coming soon
                </p>
              </div>
              {/* Star accent */}
              <div className="absolute top-5 right-6 opacity-60">
                <StarAccent />
              </div>
              <div className="absolute bottom-5 left-6 opacity-40">
                <StarAccent />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── DROP INTRO ──────────────────────────────────────────────────────── */}
      <section className="py-10 md:py-14 bg-[#0D0D0D] border-b border-white/5">
        <div className="container-wide section-padding">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="font-sora text-xs font-bold text-white/40 uppercase tracking-[0.22em] mb-2">
                Drop 001 — Coming soon.
              </p>
              <HandwrittenAccent
                text="I'm building it. This is just the proof."
                className="text-2xl md:text-3xl text-white"
              />
            </div>
            <div className="flex-shrink-0 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-mein animate-pulse" />
              <span className="font-sora text-sm text-white/50">
                Limited first run
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT GRID ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#111111]">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="mb-10 md:mb-14">
              <SectionDivider className="bg-gold-mein mb-4" />
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-white">
                Drop 001 — Preview.
              </h2>
              <p className="mt-2 font-sora text-white/50 text-base">
                Wear what reminds you who you're becoming.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {products.map((product, i) => {
              const markColorClass = tileMarkColor[product.bg] ?? 'text-white'
              const isLightTile = product.bg === 'bg-white' || product.bg === 'bg-blue-pale' || product.bg === 'bg-[#F5F0E8]'
              const titleColor = isLightTile ? 'text-charcoal' : 'text-white'
              const subColor   = isLightTile ? 'text-gray-dark' : 'text-white/50'

              return (
                <FadeUp key={product.name} delay={i * 60}>
                  <div className={`group relative ${product.bg} rounded-3xl overflow-hidden flex flex-col`} style={{ aspectRatio: '3/4' }}>

                    {/* Status label */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`inline-flex items-center text-[10px] font-sora font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.15em] ${tileLabelColors[product.label] ?? 'bg-white/10 text-white'}`}>
                        {product.label}
                      </span>
                    </div>

                    {/* Open M watermark */}
                    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.10] ${markColorClass}`}>
                      <OpenMIcon size={110} />
                    </div>

                    {/* Category stamp — top right */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`font-sora text-[10px] font-semibold uppercase tracking-widest ${isLightTile ? 'text-gray-mid' : 'text-white/30'}`}>
                        {product.category}
                      </span>
                    </div>

                    {/* Content — bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10">
                      <h3 className={`font-caveat text-xl md:text-2xl leading-snug ${titleColor}`}>
                        {product.name}
                      </h3>
                      <p className={`mt-1 font-sora text-xs leading-snug hidden sm:block ${subColor}`}>
                        {product.sub}
                      </p>
                      <button
                        onClick={() => openNotify(product.name)}
                        className={`mt-3 inline-flex items-center gap-1.5 text-xs font-sora font-semibold transition-all duration-200 ${
                          isLightTile
                            ? 'text-blue-mein hover:text-blue-dark'
                            : 'text-gold-mein hover:text-gold-light'
                        }`}
                      >
                        <Bell size={11} />
                        Notify me
                        <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-3xl" />
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── BRAND PROMISE ───────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.05]">
          <OpenMIcon size={480} className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="container-wide section-padding relative z-10 max-w-3xl mx-auto text-center">
          <FadeUp>
            <SectionDivider className="mx-auto bg-gold-mein mb-6" />
            <p className="font-sora text-xs font-bold text-white/40 uppercase tracking-[0.22em] mb-4">
              The promise
            </p>
            <h2 className="font-sora font-extrabold text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              This is not just merch.
            </h2>
            <p className="mt-4 font-caveat text-2xl md:text-3xl text-gold-mein">
              It's a reminder you chose to become something.
            </p>
            <p className="mt-5 font-sora text-base text-white/50 max-w-md mx-auto leading-relaxed">
              Every piece in Drop 001 carries the same energy as the movement — built for people who are already in motion.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── EARLY ACCESS CAPTURE ────────────────────────────────────────────── */}
      <section id="early-access" className="py-16 md:py-24 bg-[#0D0D0D] scroll-mt-20">
        <div className="container-wide section-padding">
          <div className="max-w-xl mx-auto">
            <FadeUp>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gold-mein/10 border border-gold-mein/20 rounded-full px-4 py-1.5 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-mein" />
                  <span className="font-sora text-xs font-bold text-gold-mein uppercase tracking-[0.2em]">
                    Drop 001
                  </span>
                </div>
                <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-white leading-tight">
                  Get early access.
                </h2>
                <p className="mt-3 font-sora text-base text-white/50">
                  Be first to know when Drop 001 lands.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={100}>
              {accessDone ? (
                <div className="text-center py-10 bg-white/5 border border-white/10 rounded-3xl px-6">
                  <div className="w-14 h-14 rounded-full bg-gold-mein flex items-center justify-center mx-auto mb-5">
                    <Check size={24} className="text-charcoal" strokeWidth={3} />
                  </div>
                  <h3 className="font-sora font-bold text-xl text-white">You're on the list.</h3>
                  <HandwrittenAccent text="We'll let you know first." className="text-lg block mt-2 text-gold-mein" />
                  <p className="mt-3 text-sm text-white/50 font-sora max-w-xs mx-auto">
                    When Drop 001 is ready, you'll hear about it before anyone else.
                  </p>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-7 md:p-9">
                  <form onSubmit={handleAccessSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-sora font-semibold text-white/70 mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={accessForm.name}
                          onChange={(e) => setAccessForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="Your name"
                          className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 font-sora focus:outline-none focus:ring-2 focus:ring-gold-mein/50 focus:border-gold-mein/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-sora font-semibold text-white/70 mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={accessForm.email}
                          onChange={(e) => setAccessForm((f) => ({ ...f, email: e.target.value }))}
                          placeholder="your@email.com"
                          className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 font-sora focus:outline-none focus:ring-2 focus:ring-gold-mein/50 focus:border-gold-mein/50 transition-colors"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={accessLoading}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gold-mein text-charcoal font-sora font-bold text-sm rounded-xl px-6 py-4 hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {accessLoading ? 'Saving your spot...' : 'Get early access'}
                      {!accessLoading && <ArrowRight size={14} />}
                    </button>
                  </form>
                  <p className="mt-4 text-center font-sora text-xs text-white/30">
                    No spam. Just the drop.
                  </p>
                </div>
              )}
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── NOTIFY MODAL ────────────────────────────────────────────────────── */}
      {notifyProduct && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeNotify} />
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-md shadow-2xl z-10 p-7 md:p-8">
            <button
              onClick={closeNotify}
              className="absolute top-4 right-4 p-2 hover:bg-gray-support rounded-xl transition-colors"
            >
              <X size={18} className="text-gray-mid" />
            </button>

            {notifyDone ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-blue-mein flex items-center justify-center mx-auto mb-5">
                  <Check size={26} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-sora font-bold text-xl text-charcoal">You're on the list.</h3>
                <HandwrittenAccent text="We'll let you know first." className="text-lg block mt-2" />
                <p className="mt-3 text-sm text-gray-dark font-sora">
                  We'll email you when{' '}
                  <span className="font-semibold text-charcoal">{notifyProduct}</span> drops.
                </p>
                <button onClick={closeNotify} className="mt-6 btn-primary w-full justify-center">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-pale flex items-center justify-center mb-4">
                    <Bell size={18} className="text-blue-mein" />
                  </div>
                  <h3 className="font-sora font-bold text-xl text-charcoal">
                    Notify me when this drops
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-dark font-sora">
                    <span className="font-semibold text-charcoal">{notifyProduct}</span> — we'll email you the moment it's available.
                  </p>
                </div>
                <form onSubmit={handleNotify} className="space-y-4">
                  <div>
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={notifyForm.name}
                      onChange={(e) => setNotifyForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={notifyForm.email}
                      onChange={(e) => setNotifyForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="input-field"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={notifyLoading}
                    className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {notifyLoading ? 'Saving...' : 'Notify Me'}
                    {!notifyLoading && <Bell size={14} />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
