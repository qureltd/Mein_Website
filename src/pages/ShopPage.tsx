import { useState } from 'react'
import { ArrowRight, ShoppingBag, X, Check, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FadeUp } from '../hooks/useInView'
import { OpenMIcon, HandwrittenAccent, SectionDivider } from '../components/BrandElements'
import { supabase } from '../lib/supabase'

const products = [
  { name: 'Open M Icon Tee', description: "Essential electric blue on white", price: 'Coming soon', category: 'T-Shirt' },
  { name: 'Mein Mover Hoodie', description: "Open M large on back — wear what you're building", price: 'Coming soon', category: 'Hoodie' },
  { name: 'Future Me Cap', description: 'Open M icon patch, structured fit', price: 'Coming soon', category: 'Cap' },
  { name: 'Mein Sticker Pack', description: 'Die-cut icon + full lockup + doodles', price: 'Coming soon', category: 'Stickers' },
  { name: 'Mein Mover Journal', description: 'For writing your moves, goals, and future-self messages', price: 'Coming soon', category: 'Journal' },
  { name: 'Build It Tote', description: 'Full lockup on heavy canvas', price: 'Coming soon', category: 'Tote' },
]

export default function ShopPage() {
  const [notifyProduct, setNotifyProduct] = useState<string | null>(null)
  const [notifyForm, setNotifyForm] = useState({ name: '', email: '' })
  const [notifyDone, setNotifyDone] = useState(false)
  const [notifyLoading, setNotifyLoading] = useState(false)

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

  return (
    <div className="with-mobile-cta">
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-white overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/3 opacity-[0.04] pointer-events-none">
          <OpenMIcon size={600} />
        </div>
        <div className="container-wide section-padding relative z-10 max-w-3xl">
          <FadeUp>
            <h1 className="font-sora font-extrabold text-5xl md:text-6xl text-charcoal leading-tight">
              Wear what{' '}
              <HandwrittenAccent text="you're building." className="text-5xl md:text-6xl" />
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="mt-6 text-xl text-gray-dark font-sora leading-relaxed max-w-xl">
              Mein merch is more than clothing. It is a reminder that your future is already in motion.
            </p>
            <div className="mt-4 bg-blue-pale rounded-xl px-5 py-4 inline-block">
              <HandwrittenAccent
                text={'"This is not just merch. It is a reminder: I\'m building it."'}
                className="text-xl"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── DROP NOTICE ──────────────────────────────────────────────── */}
      <section className="py-8 bg-blue-mein">
        <div className="container-wide section-padding flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-sora font-bold text-white text-lg">First drop coming soon.</p>
            <p className="text-white/70 text-sm font-sora mt-0.5">Join the movement to be first to know when it drops.</p>
          </div>
          <Link to="/join" className="btn-gold flex-shrink-0">
            Join the Movement
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── PRODUCTS ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-wide section-padding">
          <FadeUp>
            <div className="text-center mb-12">
              <SectionDivider />
              <h2 className="mt-5 font-sora font-extrabold text-3xl md:text-4xl text-charcoal">The Drop</h2>
              <p className="mt-3 text-gray-dark font-sora">Everything you need to wear your movement.</p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product, i) => (
              <FadeUp key={product.name} delay={i * 70}>
                <div className="move-card flex flex-col group">
                  <div className="w-full h-52 rounded-xl bg-gray-support/40 flex items-center justify-center mb-5 overflow-hidden group-hover:bg-blue-pale transition-colors duration-300">
                    <OpenMIcon size={80} className="opacity-20 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <span className="tag-badge mb-3 self-start">{product.category}</span>
                  <h3 className="font-sora font-bold text-charcoal text-lg">{product.name}</h3>
                  <p className="mt-1.5 text-sm text-gray-dark font-sora flex-1">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-sora font-semibold text-gray-mid text-sm">{product.price}</span>
                    <button
                      onClick={() => openNotify(product.name)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-blue-mein font-sora hover:text-blue-dark transition-colors"
                    >
                      <Bell size={12} />
                      Notify me
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BRAND PROMISE ────────────────────────────────────────────── */}
      <section className="py-20 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <OpenMIcon size={500} className="absolute right-0 bottom-0" />
        </div>
        <div className="container-wide section-padding relative z-10 max-w-2xl mx-auto text-center">
          <FadeUp>
            <ShoppingBag size={40} className="text-blue-mein mx-auto mb-5" />
            <h2 className="font-sora font-extrabold text-3xl text-white">Built for Mein Movers</h2>
            <p className="mt-4 text-white/60 font-sora leading-relaxed">
              Every piece is designed with the same boldness, purpose, and creative energy as the movement itself. Wear it. Live it. Build it.
            </p>
            <HandwrittenAccent text="Small steps today. Big future tomorrow." className="block text-xl mt-5" />
          </FadeUp>
        </div>
      </section>

      {/* ─── NOTIFY ME MODAL ──────────────────────────────────────────── */}
      {notifyProduct && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeNotify} />
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
                  <h3 className="font-sora font-bold text-xl text-charcoal">Notify me when this drops</h3>
                  <p className="mt-1.5 text-sm text-gray-dark font-sora">
                    <span className="font-semibold text-charcoal">{notifyProduct}</span> — we'll email you the moment it's available.
                  </p>
                </div>
                <form onSubmit={handleNotify} className="space-y-4">
                  <div>
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Your Name *</label>
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
                    <label className="block text-sm font-sora font-semibold text-charcoal mb-1.5">Email *</label>
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
