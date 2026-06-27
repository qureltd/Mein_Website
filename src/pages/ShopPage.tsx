import { useState } from 'react'
import { ArrowRight, X, Check, Bell } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider, StickerNote } from '../components/BrandElements'
import { supabase } from '../lib/supabase'

import hoodieImg       from '../assets/shop/Hoodie_Art.png'
import liveFutureImg   from '../assets/shop/Live_your_future_T.png'
import itsAllMeinImg   from '../assets/shop/it_all_mein_black_tee.png'
import coreTeeImg      from '../assets/shop/Mein_WorkMark_T.png'
import chestLogoImg    from '../assets/shop/Basic_T_with_M_left_pocket.png'
import capImg          from '../assets/shop/Mein_Black_Cap.png'

// Product images are treated as finished mockup compositions.
// Default behavior must show the full uploaded image using object-contain.
// Do not switch to object-cover unless an admin-controlled crop mode is added.

type ShopProduct = {
  name: string;
  sub: string;
  note: string;
  category: string;
  label: string;
  img: string;
  imgBg: string;
  darkText: boolean;
  imageFit?: 'contain' | 'cover';
}

// ─── Product data — displayed in this exact order ─────────────────────────────

const products: ShopProduct[] = [
  {
    name: 'Open M Hoodie',
    sub: 'Big back graphic. Full movement energy.',
    note: 'Built to stand out from behind.',
    category: 'Hoodie',
    label: 'Drop preview',
    img: hoodieImg,
    imgBg: '#EBEBEB',
    darkText: false,
  },
  {
    name: 'Live Your Future Today Tee',
    sub: 'Future energy in full colour.',
    note: 'A reminder you can wear now.',
    category: 'T-Shirt',
    label: 'Coming soon',
    img: liveFutureImg,
    imgBg: '#111111',
    darkText: false,
  },
  {
    name: "It's All Mein Tee",
    sub: 'Loud, direct, confident.',
    note: 'For when the tee does the talking.',
    category: 'T-Shirt',
    label: 'Limited run',
    img: itsAllMeinImg,
    imgBg: '#111111',
    darkText: false,
  },
  {
    name: 'MEIN Core Tee',
    sub: 'The core statement piece.',
    note: 'Clean. Bold. Everyday essential.',
    category: 'T-Shirt',
    label: 'First run',
    img: coreTeeImg,
    imgBg: '#F0EFED',
    darkText: true,
  },
  {
    name: 'MEIN Chest Logo Tee',
    sub: 'Minimal front mark.',
    note: 'A quiet essential for the movement.',
    category: 'T-Shirt',
    label: 'Early access',
    img: chestLogoImg,
    imgBg: '#1A1A1A',
    darkText: false,
  },
  {
    name: 'Mein Mover Cap',
    sub: 'Small mark. Big movement.',
    note: 'Low-key but part of the set.',
    category: 'Cap',
    label: 'Drop preview',
    img: capImg,
    imgBg: '#0D0D0D',
    darkText: false,
  },
]

const labelStyle: Record<string, string> = {
  'Drop preview': 'bg-gold-mein text-charcoal',
  'Coming soon':  'bg-white/10 text-white border border-white/20 backdrop-blur-sm',
  'Limited run':  'bg-white text-charcoal',
  'First run':    'bg-blue-mein text-white',
  'Early access': 'bg-white/10 text-white border border-white/20 backdrop-blur-sm',
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
// Image tile owns its own aspect ratio. Text is a sibling below the tile.
// This ensures the full mockup image is always visible regardless of text length.

function ProductCard({
  product,
  onNotify,
}: {
  product: ShopProduct
  onNotify: (name: string) => void
}) {
  return (
    <article className="group">
      {/* Image tile — self-contained, aspect ratio lives here not on outer card */}
      <div
        className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-3xl shadow-md"
        style={{ backgroundColor: product.imgBg }}
      >
        <img
          src={product.img}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />

        {/* Status label */}
        <div className="absolute left-3 top-3 z-10">
          <span className={`inline-flex items-center text-[10px] font-sora font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.15em] ${labelStyle[product.label] ?? 'bg-white/10 text-white'}`}>
            {product.label}
          </span>
        </div>

        {/* Category — top right */}
        <div className="absolute right-3 top-3 z-10">
          <span className={`font-sora text-[10px] font-semibold uppercase tracking-widest ${product.darkText ? 'text-gray-mid' : 'text-white/30'}`}>
            {product.category}
          </span>
        </div>

        {/* Hover shimmer */}
        <div className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/5" />
      </div>

      {/* Text — below the image tile, never inside it */}
      <div className="mt-3 px-1">
        <h3 className={`font-caveat text-xl md:text-2xl leading-snug ${product.darkText ? 'text-charcoal' : 'text-white'}`}>
          {product.name}
        </h3>
        <p className={`mt-0.5 font-sora text-xs leading-snug hidden sm:block ${product.darkText ? 'text-gray-dark' : 'text-white/60'}`}>
          {product.note}
        </p>
        <button
          onClick={() => onNotify(product.name)}
          className={`mt-2 inline-flex items-center gap-1.5 text-xs font-sora font-semibold transition-all duration-200 ${
            product.darkText ? 'text-blue-mein hover:text-blue-dark' : 'text-gold-mein hover:text-gold-light'
          }`}
        >
          <Bell size={11} />
          Notify me
          <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [notifyProduct, setNotifyProduct] = useState<string | null>(null)
  const [notifyForm, setNotifyForm]       = useState({ name: '', email: '' })
  const [notifyDone, setNotifyDone]       = useState(false)
  const [notifyLoading, setNotifyLoading] = useState(false)

  const [accessForm, setAccessForm]       = useState({ name: '', email: '' })
  const [accessDone, setAccessDone]       = useState(false)
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
      content: 'Early access signup for Drop 001.',
      status: 'received',
      is_under_18: false,
    })
    setAccessLoading(false)
    setAccessDone(true)
  }

  return (
    <div className="with-mobile-cta">

      {/* ─── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 bg-charcoal overflow-hidden">
        {/* Faint "001" watermark */}
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

        <div className="absolute top-0 left-0 right-0 h-px bg-gold-mein/40" />

        <div className="container-wide section-padding relative z-10">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* Left — copy */}
            <div>
              <FadeUp>
                <div className="inline-flex items-center gap-2.5 mb-6">
                  <span className="w-2 h-2 rounded-full bg-gold-mein flex-shrink-0" />
                  <span className="font-sora text-xs font-bold text-white/60 uppercase tracking-[0.22em]">
                    Drop 001
                  </span>
                </div>

                <h1 className="font-sora font-extrabold text-5xl md:text-6xl lg:text-7xl text-white leading-[1.0] tracking-tight">
                  Wear the{' '}
                  <span className="font-caveat text-gold-mein">reminder.</span>
                </h1>

                <p className="mt-5 font-sora font-semibold text-xl text-white/80">
                  Built for Mein Movers.
                </p>

                <p className="mt-2 font-sora text-base text-white/50 leading-relaxed max-w-sm">
                  This is not just merch. It is a reminder of who you're becoming.
                </p>
              </FadeUp>

              <FadeUp delay={160}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <StickerNote
                    text="Limited run. First drop."
                    rotate={-2}
                    color="gold"
                    className="text-base px-5 py-2.5 font-semibold"
                  />
                  <button
                    onClick={() =>
                      document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                    className="inline-flex items-center gap-2 bg-gold-mein text-charcoal font-sora font-bold text-sm rounded-full px-6 py-3 hover:bg-gold-light transition-colors"
                  >
                    Get early access
                    <ArrowRight size={14} />
                  </button>
                </div>
              </FadeUp>
            </div>

            {/* Right — hoodie hero image */}
            <FadeUp delay={220}>
              <div
                className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl"
                style={{ backgroundColor: '#EBEBEB' }}
              >
                <img
                  src={hoodieImg}
                  alt="Open M Hoodie — Drop 001"
                  className="max-h-full max-w-full object-contain"
                />
                {/* Drop label */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 bg-gold-mein text-charcoal text-[10px] font-sora font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.15em]">
                    Drop 001 — Hero piece
                  </span>
                </div>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ─── DROP INTRO ──────────────────────────────────────────────────────── */}
      <section className="py-9 md:py-12 bg-[#0D0D0D] border-b border-white/5">
        <div className="container-wide section-padding">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-sora text-xs font-bold text-white/40 uppercase tracking-[0.22em] mb-1.5">
                Drop 001 — Coming soon.
              </p>
              <HandwrittenAccent
                text="I'm building it. This is just the proof."
                className="text-2xl md:text-3xl text-white"
              />
            </div>
            <div className="flex-shrink-0 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-gold-mein animate-pulse" />
              <span className="font-sora text-sm text-white/50">Limited first run</span>
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
            {products.map((product, i) => (
              <FadeUp key={product.name} delay={i * 60}>
                <ProductCard product={product} onNotify={openNotify} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BRAND PROMISE ───────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-charcoal relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-[0.05] pointer-events-none select-none">
          <OpenMIcon size={480} />
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

      {/* ─── EARLY ACCESS ────────────────────────────────────────────────────── */}
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
                  Be first to know when Drop 001 goes live.
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
                        className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/30 font-sora focus:outline-none focus:ring-2 focus:ring-gold-mein/50 focus:border-gold-mein/50 transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={accessLoading}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gold-mein text-charcoal font-sora font-bold text-sm rounded-xl px-6 py-4 hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {accessLoading ? 'Saving your spot...' : 'Notify me'}
                      {!accessLoading && <Bell size={14} />}
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
