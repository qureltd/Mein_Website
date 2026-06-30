import { useState, useEffect } from 'react'
import { ArrowRight, X, Check, Bell, ExternalLink } from 'lucide-react'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider, StickerNote } from '../components/BrandElements'
import { supabase } from '../lib/supabase'
import type { ShopProduct as DbShopProduct, ShopDrop } from '../lib/supabase'

const SUBMIT_CONTACT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-contact`
const SUBMIT_SHOP_EARLY_ACCESS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-shop-early-access`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

import hoodieImg       from '../assets/shop/Hoodie_Art.png'
import liveFutureImg   from '../assets/shop/Live_your_future_T.png'
import itsAllMeinImg   from '../assets/shop/it_all_mein_black_tee.png'
import coreTeeImg      from '../assets/shop/Mein_WorkMark_T.png'
import chestLogoImg    from '../assets/shop/Basic_T_with_M_left_pocket.png'
import capImg          from '../assets/shop/Mein_Black_Cap.png'

// Product images are treated as finished mockup compositions.
// Default behavior must show the full uploaded image using object-contain.
// Do not switch to object-cover unless an admin-controlled crop mode is added.

type DisplayProduct = {
  id: string
  name: string
  note: string
  category: string
  label: string
  img: string
  imgBg: string
  imageFit: 'contain' | 'cover'
  darkText: boolean
  external_url: string | null
  external_platform: string
  alt: string
}

// ─── Hardcoded fallback products ─────────────────────────────────────────────
// Used when Supabase returns no visible products.

const FALLBACK_PRODUCTS: DisplayProduct[] = [
  {
    id: 'fallback-1',
    name: 'Open M Hoodie',
    note: 'Built to stand out from behind.',
    category: 'Hoodie',
    label: 'Drop preview',
    img: hoodieImg,
    imgBg: '#EBEBEB',
    imageFit: 'contain',
    darkText: false,
    external_url: null,
    external_platform: 'coming_soon',
    alt: 'Open M Hoodie',
  },
  {
    id: 'fallback-2',
    name: 'Live Your Future Today Tee',
    note: 'A reminder you can wear now.',
    category: 'T-Shirt',
    label: 'Coming soon',
    img: liveFutureImg,
    imgBg: '#111111',
    imageFit: 'contain',
    darkText: false,
    external_url: null,
    external_platform: 'coming_soon',
    alt: 'Live Your Future Today Tee',
  },
  {
    id: 'fallback-3',
    name: "It's All Mein Tee",
    note: 'For when the tee does the talking.',
    category: 'T-Shirt',
    label: 'Limited run',
    img: itsAllMeinImg,
    imgBg: '#111111',
    imageFit: 'contain',
    darkText: false,
    external_url: null,
    external_platform: 'coming_soon',
    alt: "It's All Mein Tee",
  },
  {
    id: 'fallback-4',
    name: 'MEIN Core Tee',
    note: 'Clean. Bold. Everyday essential.',
    category: 'T-Shirt',
    label: 'First run',
    img: coreTeeImg,
    imgBg: '#F0EFED',
    imageFit: 'contain',
    darkText: true,
    external_url: null,
    external_platform: 'coming_soon',
    alt: 'MEIN Core Tee',
  },
  {
    id: 'fallback-5',
    name: 'MEIN Chest Logo Tee',
    note: 'A quiet essential for the movement.',
    category: 'T-Shirt',
    label: 'Early access',
    img: chestLogoImg,
    imgBg: '#1A1A1A',
    imageFit: 'contain',
    darkText: false,
    external_url: null,
    external_platform: 'coming_soon',
    alt: 'MEIN Chest Logo Tee',
  },
  {
    id: 'fallback-6',
    name: 'Mein Mover Cap',
    note: 'Low-key but part of the set.',
    category: 'Cap',
    label: 'Drop preview',
    img: capImg,
    imgBg: '#0D0D0D',
    imageFit: 'contain',
    darkText: false,
    external_url: null,
    external_platform: 'coming_soon',
    alt: 'Mein Mover Cap',
  },
]

const FALLBACK_HERO_IMG = hoodieImg

function dbProductToDisplay(p: DbShopProduct): DisplayProduct {
  const label = p.price_display ?? (p.status === 'live' ? 'Shop now' : p.status === 'coming_soon' ? 'Coming soon' : 'Drop preview')
  const darkText = p.image_bg ? isLightColor(p.image_bg) : false
  return {
    id: p.id,
    name: p.name,
    note: p.short_description ?? '',
    category: p.product_type ?? '',
    label,
    img: p.image_url ?? '',
    imgBg: p.image_bg ?? '#111111',
    imageFit: p.image_fit ?? 'contain',
    darkText,
    external_url: p.external_url ?? null,
    external_platform: p.external_platform ?? 'coming_soon',
    alt: p.image_alt ?? p.name,
  }
}

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '')
  if (c.length !== 6) return false
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

const LABEL_STYLE: Record<string, string> = {
  'Drop preview': 'bg-gold-mein text-charcoal',
  'Coming soon':  'bg-white/10 text-white border border-white/20 backdrop-blur-sm',
  'Limited run':  'bg-white text-charcoal',
  'First run':    'bg-blue-mein text-white',
  'Early access': 'bg-white/10 text-white border border-white/20 backdrop-blur-sm',
  'Shop now':     'bg-green-500 text-white',
  'Sold out':     'bg-white/10 text-white/50 border border-white/10',
}

function dropStatusText(drop: ShopDrop | null): string {
  if (!drop) return 'Coming soon.'
  if (drop.status === 'active') return 'Live now.'
  if (drop.status === 'preview') return 'Coming soon.'
  if (drop.status === 'closed') return 'Drop closed.'
  return 'Coming soon.'
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onNotify,
}: {
  product: DisplayProduct
  onNotify: (name: string) => void
}) {
  const hasLink = !!product.external_url
  const isLive = hasLink

  return (
    <article className="group">
      {/* Image tile */}
      <div
        className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-3xl shadow-md"
        style={{ backgroundColor: product.imgBg }}
      >
        {product.img ? (
          <img
            src={product.img}
            alt={product.alt}
            className={`h-full w-full ${product.imageFit === 'cover' ? 'object-cover' : 'object-contain'}`}
            loading="lazy"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/10" />
        )}

        {/* Status label */}
        <div className="absolute left-3 top-3 z-10">
          <span className={`inline-flex items-center text-[10px] font-sora font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.15em] ${LABEL_STYLE[product.label] ?? 'bg-white/10 text-white'}`}>
            {product.label}
          </span>
        </div>

        {/* Category — top right */}
        {product.category && (
          <div className="absolute right-3 top-3 z-10">
            <span className={`font-sora text-[10px] font-semibold uppercase tracking-widest ${product.darkText ? 'text-gray-mid' : 'text-white/30'}`}>
              {product.category}
            </span>
          </div>
        )}

        {/* Hover shimmer */}
        <div className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/5" />
      </div>

      {/* Text */}
      <div className="mt-3 px-1">
        <h3 className={`font-caveat text-xl md:text-2xl leading-snug ${product.darkText ? 'text-charcoal' : 'text-white'}`}>
          {product.name}
        </h3>
        {product.note && (
          <p className={`mt-0.5 font-sora text-xs leading-snug hidden sm:block ${product.darkText ? 'text-gray-dark' : 'text-white/60'}`}>
            {product.note}
          </p>
        )}

        {isLive ? (
          <a
            href={product.external_url!}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 inline-flex items-center gap-1.5 text-xs font-sora font-semibold transition-all duration-200 ${
              product.darkText ? 'text-blue-mein hover:text-blue-dark' : 'text-gold-mein hover:text-gold-light'
            }`}
          >
            <ExternalLink size={11} />
            Shop now
            <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        ) : (
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
        )}
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [products, setProducts]           = useState<DisplayProduct[]>([])
  const [activeDrop, setActiveDrop]       = useState<ShopDrop | null>(null)
  const [heroImg, setHeroImg]             = useState<string>(FALLBACK_HERO_IMG)
  const [productsLoading, setProductsLoading] = useState(true)

  const [notifyProduct, setNotifyProduct] = useState<string | null>(null)
  const [notifyForm, setNotifyForm]       = useState({ name: '', email: '' })
  const [notifyDone, setNotifyDone]       = useState(false)
  const [notifyLoading, setNotifyLoading] = useState(false)

  const [accessForm, setAccessForm]       = useState({ email: '' })
  const [accessDone, setAccessDone]       = useState(false)
  const [accessDuplicate, setAccessDuplicate] = useState(false)
  const [accessLoading, setAccessLoading] = useState(false)
  const [accessError, setAccessError]     = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const [{ data: productData }, { data: dropData }] = await Promise.all([
        supabase
          .from('shop_products')
          .select('id, drop_id, name, slug, short_description, product_type, status, price_display, image_url, image_alt, image_fit, image_bg, featured, sort_order, visible, external_url, external_platform, created_at')
          .eq('visible', true)
          .order('featured', { ascending: false })
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase
          .from('shop_drops')
          .select('id, name, slug, description, status, launch_date, featured, hero_product_id, image_url, visible, sort_order, launch_email_sent_at, launch_email_sent_by, created_at, updated_at')
          .eq('visible', true)
          .order('sort_order', { ascending: true })
          .limit(1),
      ])

      const drop = dropData?.[0] as ShopDrop | undefined
      setActiveDrop(drop ?? null)

      if (!productData || productData.length === 0) {
        setProducts(FALLBACK_PRODUCTS)
        setHeroImg(drop?.image_url ?? FALLBACK_HERO_IMG)
      } else {
        const displayProducts = (productData as DbShopProduct[]).map(dbProductToDisplay)
        setProducts(displayProducts)
        const firstWithImg = displayProducts.find((p) => p.img)
        setHeroImg(drop?.image_url ?? firstWithImg?.img ?? FALLBACK_HERO_IMG)
      }
      setProductsLoading(false)
    }
    load()
  }, [])

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
    try {
      await fetch(SUBMIT_CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY },
        body: JSON.stringify({
          contact_type: 'shop',
          name:    notifyForm.name || undefined,
          email:   notifyForm.email,
          subject: `Drop notification: ${notifyProduct}`,
          message: `User wants to be notified when "${notifyProduct}" drops.`,
        }),
      })
    } catch {
      // Non-fatal — show done state regardless
    } finally {
      setNotifyLoading(false)
      setNotifyDone(true)
    }
  }

  async function handleAccessSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAccessLoading(true)
    setAccessError(null)
    try {
      const res = await fetch(SUBMIT_SHOP_EARLY_ACCESS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY },
        body: JSON.stringify({ email: accessForm.email }),
      })
      const data = await res.json() as { success: boolean; duplicate?: boolean; error?: string }
      if (!data.success) {
        setAccessError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setAccessDuplicate(!!data.duplicate)
      setAccessDone(true)
    } catch {
      setAccessError('Network error. Please try again.')
    } finally {
      setAccessLoading(false)
    }
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
                    {activeDrop?.name ?? 'Drop 001'}
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

            {/* Right — hero image */}
            <FadeUp delay={220}>
              <div
                className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl"
                style={{ backgroundColor: products[0]?.imgBg ?? '#EBEBEB' }}
              >
                <img
                  src={heroImg}
                  alt={`${activeDrop?.name ?? 'Drop 001'} hero piece`}
                  className="h-full w-full object-contain"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 bg-gold-mein text-charcoal text-[10px] font-sora font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.15em]">
                    {activeDrop?.name ?? 'Drop 001'} — Hero piece
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
                {activeDrop?.name ?? 'Drop 001'} — {dropStatusText(activeDrop)}
              </p>
              <HandwrittenAccent
                text={activeDrop?.description ?? "I'm building it. This is just the proof."}
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
                {activeDrop?.name ?? 'Drop 001'} — Preview.
              </h2>
              <p className="mt-2 font-sora text-white/50 text-base">
                Wear what reminds you who you're becoming.
              </p>
            </div>
          </FadeUp>

          {productsLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-gold-mein border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
              {products.map((product, i) => (
                <FadeUp key={product.id} delay={i * 60}>
                  <ProductCard product={product} onNotify={openNotify} />
                </FadeUp>
              ))}
            </div>
          )}
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
              Every piece in {activeDrop?.name ?? 'Drop 001'} carries the same energy as the movement — built for people who are already in motion.
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
                    {activeDrop?.name ?? 'Drop 001'}
                  </span>
                </div>
                <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-white leading-tight">
                  Get early access.
                </h2>
                <p className="mt-3 font-sora text-base text-white/50">
                  Be first to know when {activeDrop?.name ?? 'Drop 001'} goes live.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={100}>
              {accessDone ? (
                <div className="text-center py-10 bg-white/5 border border-white/10 rounded-3xl px-6">
                  <div className="w-14 h-14 rounded-full bg-gold-mein flex items-center justify-center mx-auto mb-5">
                    <Check size={24} className="text-charcoal" strokeWidth={3} />
                  </div>
                  <h3 className="font-sora font-bold text-xl text-white">
                    {accessDuplicate ? "You're already on the list." : "You're on the list."}
                  </h3>
                  <HandwrittenAccent text="We'll let you know first." className="text-lg block mt-2 text-gold-mein" />
                  <p className="mt-3 text-sm text-white/50 font-sora max-w-xs mx-auto">
                    {accessDuplicate
                      ? "We already have your email for drop updates."
                      : `When ${activeDrop?.name ?? 'Drop 001'} is ready, you'll hear about it before anyone else.`}
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
                        onChange={(e) => setAccessForm({ email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/30 font-sora focus:outline-none focus:ring-2 focus:ring-gold-mein/50 focus:border-gold-mein/50 transition-colors"
                      />
                    </div>
                    {accessError && (
                      <p className="text-sm text-red-400 font-sora">{accessError}</p>
                    )}
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
                    Enter your email to get early access and MEIN drop updates.
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
