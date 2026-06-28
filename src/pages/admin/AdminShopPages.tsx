import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Package } from 'lucide-react'
import { supabase, type ShopProduct, type ShopDrop } from '../../lib/supabase'
import { AdminPageHeader, AdminTable, PlaceholderSection } from '../../components/AdminLayout'

// ── Shop Overview ─────────────────────────────────────────────────────────────

export function AdminShopPage() {
  const [productCount, setProductCount] = useState<number | null>(null)
  const [dropCount, setDropCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ count: pc }, { count: dc }] = await Promise.all([
        supabase.from('shop_products').select('*', { count: 'exact', head: true }),
        supabase.from('shop_drops').select('*', { count: 'exact', head: true }),
      ])
      setProductCount(pc ?? 0)
      setDropCount(dc ?? 0)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <AdminPageHeader title="Shop" description="Overview of Mein shop drops and products." />

      <div className="mb-6 bg-blue-pale border border-blue-mein/20 rounded-xl px-4 py-3 text-sm font-sora text-blue-mein">
        Shop product management and Shopify / Gelato / Printful links will be built in Phase 7. This section is read-only.
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="font-sora font-bold text-3xl text-charcoal">{loading ? '—' : productCount}</p>
          <p className="text-sm text-gray-mid font-sora mt-1">Products</p>
          <Link to="/admin/shop/products" className="mt-3 inline-block text-xs text-blue-mein hover:underline font-sora">View all →</Link>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="font-sora font-bold text-3xl text-charcoal">{loading ? '—' : dropCount}</p>
          <p className="text-sm text-gray-mid font-sora mt-1">Drops</p>
          <Link to="/admin/shop/drops" className="mt-3 inline-block text-xs text-blue-mein hover:underline font-sora">View all →</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'Manage Products', href: '/admin/shop/products', icon: Package },
          { label: 'Manage Drops', href: '/admin/shop/drops', icon: ShoppingBag },
        ].map((l) => (
          <Link
            key={l.href}
            to={l.href}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 font-sora font-semibold text-sm text-charcoal hover:border-blue-mein/50 hover:text-blue-mein transition-colors"
          >
            <l.icon size={16} className="text-gray-mid" />
            {l.label}
          </Link>
        ))}
      </div>
    </>
  )
}

// ── Shop Products ─────────────────────────────────────────────────────────────

export function AdminShopProductsPage() {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('shop_products').select('id, drop_id, name, slug, product_type, status, price_display, featured, visible, sort_order, created_at').order('sort_order')
      setProducts((data as ShopProduct[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <AdminPageHeader title="Shop Products" description="All configured shop products." />
      <div className="mb-4 bg-blue-pale border border-blue-mein/20 rounded-xl px-4 py-3 text-sm font-sora text-blue-mein">
        Product creation and editing will be built in Phase 7.
      </div>

      {products.length === 0 && !loading ? (
        <PlaceholderSection
          icon={Package}
          title="No products yet."
          note="Products will be added in Phase 7. They will be linked to shop drops and external fulfilment platforms."
        />
      ) : (
        <AdminTable heads={['Name', 'Type', 'Status', 'Price', 'Visible', 'Featured', 'Sort']} loading={loading}>
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-blue-pale/20 transition-colors">
              <td className="px-4 py-3.5">
                <p className="font-sora font-medium text-charcoal text-sm">{p.name}</p>
                <p className="text-xs text-gray-mid font-sora font-mono">{p.slug}</p>
              </td>
              <td className="px-4 py-3.5 text-sm text-charcoal font-sora">{p.product_type || '—'}</td>
              <td className="px-4 py-3.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora ${
                  p.status === 'live' ? 'bg-green-50 text-green-700' :
                  p.status === 'sold_out' ? 'bg-red-50 text-red-700' :
                  p.status === 'coming_soon' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{p.status.replace('_', ' ')}</span>
              </td>
              <td className="px-4 py-3.5 text-sm text-charcoal font-sora">{p.price_display || '—'}</td>
              <td className="px-4 py-3.5 text-sm font-sora">{p.visible ? <span className="text-green-600">Yes</span> : <span className="text-gray-mid">No</span>}</td>
              <td className="px-4 py-3.5 text-sm font-sora">{p.featured ? <span className="text-gold-dark">Yes</span> : <span className="text-gray-mid">No</span>}</td>
              <td className="px-4 py-3.5 text-sm text-charcoal font-sora">{p.sort_order}</td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  )
}

// ── Shop Drops ────────────────────────────────────────────────────────────────

export function AdminShopDropsPage() {
  const [drops, setDrops] = useState<ShopDrop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('shop_drops').select('id, name, slug, description, status, launch_date, featured, visible, sort_order, created_at').order('sort_order')
      setDrops((data as ShopDrop[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <AdminPageHeader title="Shop Drops" description="Configured drop campaigns." />
      <div className="mb-4 bg-blue-pale border border-blue-mein/20 rounded-xl px-4 py-3 text-sm font-sora text-blue-mein">
        Drop creation and launch management will be built in Phase 7.
      </div>

      {drops.length === 0 && !loading ? (
        <PlaceholderSection
          icon={ShoppingBag}
          title="No drops yet."
          note="Shop drops will be configured and managed in Phase 7."
        />
      ) : (
        <AdminTable heads={['Name', 'Status', 'Launch date', 'Visible', 'Featured', 'Sort']} loading={loading}>
          {drops.map((d) => (
            <tr key={d.id} className="hover:bg-blue-pale/20 transition-colors">
              <td className="px-4 py-3.5">
                <p className="font-sora font-medium text-charcoal text-sm">{d.name}</p>
                <p className="text-xs text-gray-mid font-sora font-mono">{d.slug}</p>
              </td>
              <td className="px-4 py-3.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora ${
                  d.status === 'active' ? 'bg-green-50 text-green-700' :
                  d.status === 'preview' ? 'bg-yellow-50 text-yellow-700' :
                  d.status === 'closed' ? 'bg-red-50 text-red-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{d.status}</span>
              </td>
              <td className="px-4 py-3.5 text-sm text-charcoal font-sora">
                {d.launch_date ? new Date(d.launch_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </td>
              <td className="px-4 py-3.5 text-sm font-sora">{d.visible ? <span className="text-green-600">Yes</span> : <span className="text-gray-mid">No</span>}</td>
              <td className="px-4 py-3.5 text-sm font-sora">{d.featured ? <span className="text-gold-dark">Yes</span> : <span className="text-gray-mid">No</span>}</td>
              <td className="px-4 py-3.5 text-sm text-charcoal font-sora">{d.sort_order}</td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  )
}
