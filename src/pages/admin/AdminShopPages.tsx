import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Package, Plus, Pencil, Eye, EyeOff, Star, StarOff, ExternalLink, X, AlertTriangle, Send, CheckCircle, Loader2, Mail } from 'lucide-react'
import { supabase, type ShopProduct, type ShopDrop, type ShopProductStatus, type ShopProductPlatform, type ShopDropStatus } from '../../lib/supabase'
import { AdminPageHeader, StatCard, AdminTable, PlaceholderSection } from '../../components/AdminLayout'

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function auditLog(action: string, entity_type: string, entity_id: string, notes?: string) {
  return supabase.auth.getUser().then(({ data }) =>
    supabase.from('audit_logs').insert({
      admin_id: data.user?.id ?? null,
      action,
      entity_type,
      entity_id,
      previous_status: null,
      new_status: null,
      notes: notes ?? null,
    })
  )
}

const PRODUCT_STATUSES: ShopProductStatus[] = ['coming_soon', 'live', 'sold_out', 'hidden', 'archived']
const PLATFORMS: ShopProductPlatform[] = ['shopify', 'gelato', 'printful', 'external', 'coming_soon']
const DROP_STATUSES: ShopDropStatus[] = ['draft', 'preview', 'active', 'closed', 'archived']
const PRODUCT_TYPES = ['hoodie', 't-shirt', 'cap', 'jacket', 'bag', 'accessories', 'other']

const STATUS_COLORS: Record<ShopProductStatus, string> = {
  coming_soon: 'bg-yellow-50 text-yellow-700',
  live:        'bg-green-50 text-green-700',
  sold_out:    'bg-red-50 text-red-700',
  hidden:      'bg-gray-100 text-gray-600',
  archived:    'bg-gray-100 text-gray-400',
}

const DROP_STATUS_COLORS: Record<ShopDropStatus, string> = {
  draft:    'bg-gray-100 text-gray-600',
  preview:  'bg-yellow-50 text-yellow-700',
  active:   'bg-green-50 text-green-700',
  closed:   'bg-red-50 text-red-700',
  archived: 'bg-gray-100 text-gray-400',
}

// ── Product form defaults ─────────────────────────────────────────────────────

type ProductForm = {
  name: string
  slug: string
  short_description: string
  product_type: string
  status: ShopProductStatus
  price_display: string
  image_url: string
  image_alt: string
  image_fit: 'contain' | 'cover'
  image_bg: string
  external_url: string
  external_platform: ShopProductPlatform
  drop_id: string
  featured: boolean
  visible: boolean
  sort_order: number
}

const EMPTY_PRODUCT: ProductForm = {
  name: '', slug: '', short_description: '', product_type: 't-shirt',
  status: 'coming_soon', price_display: '', image_url: '', image_alt: '',
  image_fit: 'contain', image_bg: '#F5F5F5', external_url: '',
  external_platform: 'shopify', drop_id: '', featured: false,
  visible: false, sort_order: 0,
}

// ── Drop form defaults ────────────────────────────────────────────────────────

type DropForm = {
  name: string
  slug: string
  description: string
  status: ShopDropStatus
  launch_date: string
  featured: boolean
  visible: boolean
  sort_order: number
}

const EMPTY_DROP: DropForm = {
  name: '', slug: '', description: '', status: 'draft',
  launch_date: '', featured: false, visible: false, sort_order: 0,
}

// ── ProductModal ──────────────────────────────────────────────────────────────

function ProductModal({
  product,
  drops,
  onClose,
  onSaved,
}: {
  product: ShopProduct | null
  drops: ShopDrop[]
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!product
  const [form, setForm] = useState<ProductForm>(() => {
    if (!product) return EMPTY_PRODUCT
    return {
      name:              product.name,
      slug:              product.slug,
      short_description: product.short_description ?? '',
      product_type:      product.product_type ?? 't-shirt',
      status:            product.status,
      price_display:     product.price_display ?? '',
      image_url:         product.image_url ?? '',
      image_alt:         product.image_alt ?? '',
      image_fit:         product.image_fit ?? 'contain',
      image_bg:          product.image_bg ?? '#F5F5F5',
      external_url:      product.external_url ?? '',
      external_platform: product.external_platform ?? 'shopify',
      drop_id:           product.drop_id ?? '',
      featured:          product.featured,
      visible:           product.visible,
      sort_order:        product.sort_order,
    }
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function field(key: keyof ProductForm, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }))
    if (key === 'name' && !isEdit) {
      setForm((f) => ({ ...f, name: value as string, slug: slugify(value as string) }))
    }
  }

  async function save() {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and slug are required.')
      return
    }
    setSaving(true)
    setError(null)

    const payload = {
      name:              form.name.trim(),
      slug:              form.slug.trim(),
      short_description: form.short_description.trim() || null,
      product_type:      form.product_type || null,
      status:            form.status,
      price_display:     form.price_display.trim() || null,
      image_url:         form.image_url.trim() || null,
      image_alt:         form.image_alt.trim() || null,
      image_fit:         form.image_fit,
      image_bg:          form.image_bg.trim() || null,
      external_url:      form.external_url.trim() || null,
      external_platform: form.external_platform,
      drop_id:           form.drop_id || null,
      featured:          form.featured,
      visible:           form.visible,
      sort_order:        Number(form.sort_order),
      updated_at:        new Date().toISOString(),
    }

    if (isEdit) {
      const { error: err } = await supabase.from('shop_products').update(payload).eq('id', product!.id)
      if (err) { setError(err.message); setSaving(false); return }
      await auditLog('shop_product_updated', 'shop_products', product!.id, `Updated: ${form.name}`)
    } else {
      const { data, error: err } = await supabase.from('shop_products').insert(payload).select('id').single()
      if (err) { setError(err.message); setSaving(false); return }
      await auditLog('shop_product_created', 'shop_products', data.id, `Created: ${form.name}`)
    }

    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl z-10">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-sora font-bold text-charcoal">{isEdit ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={16} className="text-gray-mid" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-sora text-red-700">
              <AlertTriangle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => field('name', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
                placeholder="Open M Hoodie"
              />
            </div>

            <div>
              <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Slug *</label>
              <input
                value={form.slug}
                onChange={(e) => field('slug', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal font-mono focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
                placeholder="open-m-hoodie"
              />
            </div>

            <div>
              <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Product type</label>
              <select
                value={form.product_type}
                onChange={(e) => field('product_type', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
              >
                {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Short description</label>
              <textarea
                value={form.short_description}
                onChange={(e) => field('short_description', e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30 resize-none"
                placeholder="Built for Mein Movers."
              />
            </div>

            <div>
              <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => field('status', e.target.value as ShopProductStatus)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
              >
                {PRODUCT_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Price label</label>
              <input
                value={form.price_display}
                onChange={(e) => field('price_display', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
                placeholder="£39"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-4">
            <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide">Image</p>
            <div>
              <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Image URL</label>
              <input
                value={form.image_url}
                onChange={(e) => field('image_url', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal font-mono focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
                placeholder="/assets/shop/Hoodie_Art.png"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Alt text</label>
                <input
                  value={form.image_alt}
                  onChange={(e) => field('image_alt', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
                  placeholder="Open M Hoodie — Drop 001"
                />
              </div>
              <div>
                <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Card background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.image_bg || '#F5F5F5'}
                    onChange={(e) => field('image_bg', e.target.value)}
                    className="w-10 h-9 rounded border border-gray-200 cursor-pointer p-0.5"
                  />
                  <input
                    value={form.image_bg}
                    onChange={(e) => field('image_bg', e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal font-mono focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
                    placeholder="#EBEBEB"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Image fit</label>
              <div className="flex gap-3">
                {(['contain', 'cover'] as const).map((fit) => (
                  <label key={fit} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={form.image_fit === fit}
                      onChange={() => field('image_fit', fit)}
                      className="text-blue-mein"
                    />
                    <span className="text-sm font-sora text-charcoal">{fit}</span>
                  </label>
                ))}
              </div>
            </div>
            {form.image_url && (
              <div className="rounded-xl overflow-hidden border border-gray-100" style={{ backgroundColor: form.image_bg || '#F5F5F5', height: 120 }}>
                <img
                  src={form.image_url}
                  alt="Preview"
                  className={`w-full h-full object-${form.image_fit}`}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-4">
            <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide">External Link</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Platform</label>
                <select
                  value={form.external_platform}
                  onChange={(e) => field('external_platform', e.target.value as ShopProductPlatform)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
                >
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Drop</label>
                <select
                  value={form.drop_id}
                  onChange={(e) => field('drop_id', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
                >
                  <option value="">No drop</option>
                  {drops.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">External URL</label>
              <input
                value={form.external_url}
                onChange={(e) => field('external_url', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal font-mono focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
                placeholder="https://mein.myshopify.com/products/open-m-hoodie"
              />
              <p className="text-[10px] text-gray-mid font-sora mt-1">Leave blank to show "Coming soon" button.</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Sort order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => field('sort_order', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
                />
              </div>
              <label className="flex flex-col gap-1 cursor-pointer pt-1">
                <span className="text-xs font-sora font-semibold text-gray-mid">Visible</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={form.visible}
                    onChange={(e) => field('visible', e.target.checked)}
                    className="rounded border-gray-300 text-blue-mein"
                  />
                  <span className="text-sm font-sora text-charcoal">Show publicly</span>
                </div>
              </label>
              <label className="flex flex-col gap-1 cursor-pointer pt-1">
                <span className="text-xs font-sora font-semibold text-gray-mid">Featured</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => field('featured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-mein"
                  />
                  <span className="text-sm font-sora text-charcoal">Feature first</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-sora font-semibold text-gray-mid hover:text-charcoal transition-colors">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 bg-blue-mein text-white rounded-xl text-sm font-sora font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── DropModal ─────────────────────────────────────────────────────────────────

function DropModal({
  drop,
  onClose,
  onSaved,
}: {
  drop: ShopDrop | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!drop
  const [form, setForm] = useState<DropForm>(() => {
    if (!drop) return EMPTY_DROP
    return {
      name:        drop.name,
      slug:        drop.slug,
      description: drop.description ?? '',
      status:      drop.status,
      launch_date: drop.launch_date ? drop.launch_date.slice(0, 10) : '',
      featured:    drop.featured,
      visible:     drop.visible,
      sort_order:  drop.sort_order,
    }
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function field(key: keyof DropForm, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }))
    if (key === 'name' && !isEdit) {
      setForm((f) => ({ ...f, name: value as string, slug: slugify(value as string) }))
    }
  }

  async function save() {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and slug are required.')
      return
    }
    setSaving(true)
    setError(null)

    const payload = {
      name:        form.name.trim(),
      slug:        form.slug.trim(),
      description: form.description.trim() || null,
      status:      form.status,
      launch_date: form.launch_date || null,
      featured:    form.featured,
      visible:     form.visible,
      sort_order:  Number(form.sort_order),
      updated_at:  new Date().toISOString(),
    }

    if (isEdit) {
      const { error: err } = await supabase.from('shop_drops').update(payload).eq('id', drop!.id)
      if (err) { setError(err.message); setSaving(false); return }
      await auditLog('shop_drop_updated', 'shop_drops', drop!.id, `Updated: ${form.name}`)
    } else {
      const { data, error: err } = await supabase.from('shop_drops').insert(payload).select('id').single()
      if (err) { setError(err.message); setSaving(false); return }
      await auditLog('shop_drop_created', 'shop_drops', data.id, `Created: ${form.name}`)
    }

    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-md shadow-2xl z-10">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-sora font-bold text-charcoal">{isEdit ? 'Edit Drop' : 'New Drop'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={16} className="text-gray-mid" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-sora text-red-700">
              <AlertTriangle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Name *</label>
            <input
              value={form.name}
              onChange={(e) => field('name', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
              placeholder="Drop 001"
            />
          </div>

          <div>
            <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Slug *</label>
            <input
              value={form.slug}
              onChange={(e) => field('slug', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal font-mono focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
              placeholder="drop-001"
            />
          </div>

          <div>
            <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => field('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30 resize-none"
              placeholder="First run. Limited. Built for Mein Movers."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => field('status', e.target.value as ShopDropStatus)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
              >
                {DROP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Launch date</label>
              <input
                type="date"
                value={form.launch_date}
                onChange={(e) => field('launch_date', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Sort order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => field('sort_order', parseInt(e.target.value) || 0)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) => field('visible', e.target.checked)}
                className="rounded border-gray-300 text-blue-mein"
              />
              <span className="text-sm font-sora text-charcoal">Visible</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => field('featured', e.target.checked)}
                className="rounded border-gray-300 text-blue-mein"
              />
              <span className="text-sm font-sora text-charcoal">Featured</span>
            </label>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-sora font-semibold text-gray-mid hover:text-charcoal transition-colors">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 bg-blue-mein text-white rounded-xl text-sm font-sora font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create drop'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── DropLaunchModal ───────────────────────────────────────────────────────────

type LaunchMode = 'preview' | 'dry_run' | 'send'

interface LaunchPreview {
  recipient_count: number
  already_sent: boolean
  sent_at: string | null
}

interface LaunchResult {
  sent: number
  failed: number
  skipped: number
  total_eligible: number
}

function DropLaunchModal({ drop, onClose }: { drop: ShopDrop; onClose: () => void }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
  const [preview, setPreview] = useState<LaunchPreview | null>(null)
  const [previewLoading, setPreviewLoading] = useState(true)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [testSending, setTestSending] = useState(false)
  const [testSent, setTestSent] = useState(false)
  const [testError, setTestError] = useState<string | null>(null)
  const [confirmSend, setConfirmSend] = useState(false)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<LaunchResult | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)

  async function callLaunch(mode: LaunchMode) {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) throw new Error('No active session.')

    const res = await fetch(`${supabaseUrl}/functions/v1/send-drop-launch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        drop_id: drop.id,
        mode,
        confirm: mode === 'send' ? true : undefined,
      }),
    })
    const data = await res.json() as Record<string, unknown>
    if (!data.success) throw new Error((data.error as string) ?? 'Request failed.')
    return data
  }

  useEffect(() => {
    setPreviewLoading(true)
    callLaunch('preview')
      .then((data) => setPreview({
        recipient_count: data.recipient_count as number,
        already_sent: data.already_sent as boolean,
        sent_at: data.sent_at as string | null,
      }))
      .catch((e) => setPreviewError(e.message))
      .finally(() => setPreviewLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleTest() {
    setTestSending(true)
    setTestError(null)
    try {
      await callLaunch('dry_run')
      setTestSent(true)
    } catch (e) {
      setTestError(e instanceof Error ? e.message : 'Test failed.')
    } finally {
      setTestSending(false)
    }
  }

  async function handleSend() {
    setSending(true)
    setSendError(null)
    try {
      const data = await callLaunch('send')
      setResult({
        sent: data.sent as number,
        failed: data.failed as number,
        skipped: data.skipped as number,
        total_eligible: data.total_eligible as number,
      })
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Send failed.')
    } finally {
      setSending(false)
      setConfirmSend(false)
    }
  }

  const fmtDate = (d: string) => new Date(d).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-md shadow-2xl z-10">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mail size={16} className="text-blue-mein" />
            <div>
              <h2 className="font-sora font-bold text-sm text-charcoal">Launch Notification</h2>
              <p className="text-[11px] text-gray-mid font-sora truncate max-w-[220px]">{drop.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={16} className="text-gray-mid" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Result state */}
          {result ? (
            <div className="text-center py-4">
              <CheckCircle size={36} className="text-green-500 mx-auto mb-3" />
              <h3 className="font-sora font-bold text-lg text-charcoal">Notification sent.</h3>
              <div className="mt-4 bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 text-left space-y-1">
                <p className="text-xs font-sora text-gray-dark"><span className="font-semibold text-green-700">Sent:</span> {result.sent}</p>
                {result.failed > 0 && <p className="text-xs font-sora text-red-600"><span className="font-semibold">Failed:</span> {result.failed}</p>}
                {result.skipped > 0 && <p className="text-xs font-sora text-gray-mid"><span className="font-semibold">Skipped (already sent):</span> {result.skipped}</p>}
              </div>
              <button onClick={onClose} className="mt-5 px-5 py-2 bg-blue-mein text-white rounded-xl text-sm font-sora font-semibold hover:bg-blue-700 transition-colors">
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Preview panel */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4">
                <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide mb-2">Recipients</p>
                {previewLoading ? (
                  <div className="flex items-center gap-2 text-gray-mid">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-sm font-sora">Loading…</span>
                  </div>
                ) : previewError ? (
                  <p className="text-sm font-sora text-red-600">{previewError}</p>
                ) : preview ? (
                  <div className="space-y-1.5">
                    <p className="font-sora font-bold text-2xl text-charcoal">{preview.recipient_count.toLocaleString()}</p>
                    <p className="text-xs text-gray-mid font-sora">
                      People who opted into drop updates (deduplicated by email)
                    </p>
                    {preview.already_sent && preview.sent_at && (
                      <div className="flex items-center gap-1.5 mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        <AlertTriangle size={12} className="text-amber-600 shrink-0" />
                        <p className="text-xs font-sora text-amber-700">
                          Already sent on {fmtDate(preview.sent_at)}
                        </p>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Test send */}
              <div>
                <p className="text-xs font-sora font-semibold text-gray-mid mb-2">Step 1 — Test</p>
                {testSent ? (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                    <CheckCircle size={14} />
                    <span className="text-sm font-sora font-semibold">Test email sent to your address.</span>
                  </div>
                ) : (
                  <button
                    onClick={handleTest}
                    disabled={testSending || previewLoading}
                    className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl px-4 py-2.5 text-sm font-sora font-semibold text-charcoal transition-colors disabled:opacity-50"
                  >
                    {testSending ? <><Loader2 size={14} className="animate-spin" /> Sending test…</> : <><Mail size={14} /> Send test email to me</>}
                  </button>
                )}
                {testError && <p className="mt-1.5 text-xs font-sora text-red-600">{testError}</p>}
              </div>

              {/* Real send */}
              <div>
                <p className="text-xs font-sora font-semibold text-gray-mid mb-2">Step 2 — Send to all recipients</p>
                {preview?.already_sent && (
                  <div className="flex items-center gap-1.5 mb-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    <AlertTriangle size={12} className="text-amber-600 shrink-0" />
                    <p className="text-xs font-sora text-amber-700">This drop notification was already sent. Sending again will be blocked.</p>
                  </div>
                )}
                {!confirmSend ? (
                  <button
                    onClick={() => setConfirmSend(true)}
                    disabled={previewLoading || !preview || preview.already_sent || preview.recipient_count === 0}
                    className="w-full flex items-center justify-center gap-2 bg-blue-mein text-white rounded-xl px-4 py-2.5 text-sm font-sora font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send size={14} />
                    Send to {preview?.recipient_count ?? '…'} recipients
                  </button>
                ) : (
                  <div className="border border-red-200 bg-red-50 rounded-xl px-4 py-3 space-y-3">
                    <p className="text-sm font-sora font-semibold text-red-700">
                      Send launch notification to {preview?.recipient_count} people?
                    </p>
                    <p className="text-xs font-sora text-red-600">This cannot be undone. Each recipient receives one email.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSend}
                        disabled={sending}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-sora font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {sending ? <><Loader2 size={13} className="animate-spin" /> Sending…</> : 'Confirm send'}
                      </button>
                      <button
                        onClick={() => setConfirmSend(false)}
                        disabled={sending}
                        className="px-4 py-2 text-sm font-sora font-semibold text-gray-mid hover:text-charcoal transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {sendError && <p className="mt-1.5 text-xs font-sora text-red-600">{sendError}</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Shop Overview ─────────────────────────────────────────────────────────────

export function AdminShopPage() {
  const [stats, setStats] = useState({ total: 0, visible: 0, featured: 0, draft: 0, drops: 0, visibleDrops: 0 })
  const [recentProducts, setRecentProducts] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: products }, { data: drops }] = await Promise.all([
        supabase.from('shop_products').select('id, name, visible, featured, status, updated_at').order('updated_at', { ascending: false }),
        supabase.from('shop_drops').select('id, visible'),
      ])
      const ps = (products ?? []) as Pick<ShopProduct, 'id' | 'name' | 'visible' | 'featured' | 'status' | 'updated_at'>[]
      const ds = (drops ?? []) as Pick<ShopDrop, 'id' | 'visible'>[]
      setStats({
        total:        ps.length,
        visible:      ps.filter((p) => p.visible).length,
        featured:     ps.filter((p) => p.featured).length,
        draft:        ps.filter((p) => !p.visible).length,
        drops:        ds.length,
        visibleDrops: ds.filter((d) => d.visible).length,
      })
      setRecentProducts(ps.slice(0, 5) as ShopProduct[])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <AdminPageHeader
        title="Shop"
        description="Overview of Mein shop drops and products."
        actions={
          <Link
            to="/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-sora font-semibold text-blue-mein hover:underline"
          >
            <ExternalLink size={12} />
            View public shop
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total products" value={loading ? '—' : stats.total} color="blue" />
        <StatCard label="Visible" value={loading ? '—' : stats.visible} color="green" />
        <StatCard label="Featured" value={loading ? '—' : stats.featured} color="gold" />
        <StatCard label="Hidden/draft" value={loading ? '—' : stats.draft} color="gray" />
        <StatCard label="Total drops" value={loading ? '—' : stats.drops} color="blue" />
        <StatCard label="Visible drops" value={loading ? '—' : stats.visibleDrops} color="green" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Manage Products', href: '/admin/shop/products', icon: Package },
          { label: 'Manage Drops', href: '/admin/shop/drops', icon: ShoppingBag },
          { label: 'Public Shop', href: '/shop', icon: ExternalLink, external: true },
        ].map((l) => (
          <Link
            key={l.href}
            to={l.href}
            target={l.external ? '_blank' : undefined}
            rel={l.external ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 font-sora font-semibold text-sm text-charcoal hover:border-blue-mein/50 hover:text-blue-mein transition-colors"
          >
            <l.icon size={16} className="text-gray-mid" />
            {l.label}
          </Link>
        ))}
      </div>

      {recentProducts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide">Recently Updated Products</p>
          </div>
          {recentProducts.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
              <p className="font-sora text-sm text-charcoal font-medium">{p.name}</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-sora ${STATUS_COLORS[p.status]}`}>
                  {p.status.replace('_', ' ')}
                </span>
                {p.visible ? (
                  <span className="text-[10px] font-sora text-green-600 font-semibold">Live</span>
                ) : (
                  <span className="text-[10px] font-sora text-gray-mid">Hidden</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// ── Shop Products ─────────────────────────────────────────────────────────────

export function AdminShopProductsPage() {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [drops, setDrops] = useState<ShopDrop[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | ShopProduct | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [{ data: ps }, { data: ds }] = await Promise.all([
      supabase.from('shop_products')
        .select('id, drop_id, name, slug, short_description, full_description, product_type, status, price_display, shopify_url, gelato_url, printful_url, external_product_url, external_url, external_platform, image_url, image_alt, image_fit, image_bg, image_scale, featured, sort_order, visible, created_at, updated_at')
        .order('sort_order')
        .order('created_at', { ascending: false }),
      supabase.from('shop_drops').select('id, name, slug, description, status, launch_date, featured, hero_product_id, visible, sort_order, created_at, updated_at').order('sort_order'),
    ])
    setProducts((ps as ShopProduct[]) ?? [])
    setDrops((ds as ShopDrop[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleField(product: ShopProduct, field: 'visible' | 'featured') {
    setActionId(product.id)
    setError(null)
    const newVal = !product[field]
    const { error: err } = await supabase
      .from('shop_products')
      .update({ [field]: newVal, updated_at: new Date().toISOString() })
      .eq('id', product.id)
    if (err) { setError(err.message); setActionId(null); return }
    await auditLog(
      `shop_product_${field}_changed`,
      'shop_products',
      product.id,
      `${field} set to ${newVal}`
    )
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, [field]: newVal } : p))
    setActionId(null)
  }

  const dropMap = Object.fromEntries(drops.map((d) => [d.id, d.name]))

  return (
    <>
      <AdminPageHeader
        title="Shop Products"
        description="Manage visible products, external links, and card display."
        actions={
          <button
            onClick={() => setModal('create')}
            className="flex items-center gap-1.5 bg-blue-mein text-white px-4 py-2 rounded-xl text-sm font-sora font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} />
            New product
          </button>
        }
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-sora text-red-700">
          <AlertTriangle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      {products.length === 0 && !loading ? (
        <PlaceholderSection
          icon={Package}
          title="No products yet."
          note="Create your first product using the button above."
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Product', 'Type', 'Status', 'Price', 'Drop', 'Visible', 'Featured', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? [1, 2, 3].map((n) => (
                    <tr key={n}>
                      {Array(8).fill(0).map((_, i) => (
                        <td key={i} className="px-4 py-3.5"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                : products.map((p) => (
                    <tr key={p.id} className={`border-b border-gray-50 last:border-0 hover:bg-blue-pale/20 transition-colors ${!p.visible ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3.5 max-w-[180px]">
                        <div className="flex items-center gap-2.5">
                          {p.image_url ? (
                            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-gray-100" style={{ backgroundColor: p.image_bg ?? '#F5F5F5' }}>
                              <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
                              <Package size={14} className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-sora font-semibold text-charcoal text-sm truncate max-w-[130px]">{p.name}</p>
                            <p className="text-[10px] text-gray-mid font-sora font-mono truncate max-w-[130px]">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-dark font-sora">{p.product_type ?? '—'}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-sora whitespace-nowrap ${STATUS_COLORS[p.status]}`}>
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-charcoal font-sora whitespace-nowrap">{p.price_display ?? '—'}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-dark font-sora">{p.drop_id ? dropMap[p.drop_id] ?? '—' : '—'}</td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => toggleField(p, 'visible')}
                          disabled={actionId === p.id}
                          title={p.visible ? 'Hide' : 'Make visible'}
                          className="p-1.5 rounded-lg text-gray-mid hover:text-blue-mein hover:bg-blue-pale transition-colors disabled:opacity-40"
                        >
                          {p.visible ? <Eye size={13} className="text-green-600" /> : <EyeOff size={13} />}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => toggleField(p, 'featured')}
                          disabled={actionId === p.id}
                          title={p.featured ? 'Remove featured' : 'Set featured'}
                          className="p-1.5 rounded-lg text-gray-mid hover:text-gold-dark hover:bg-yellow-50 transition-colors disabled:opacity-40"
                        >
                          {p.featured ? <Star size={13} className="text-gold-dark" /> : <StarOff size={13} />}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          {p.external_url && (
                            <a
                              href={p.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open external link"
                              className="p-1.5 rounded-lg text-gray-mid hover:text-blue-mein hover:bg-blue-pale transition-colors"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                          <button
                            onClick={() => setModal(p)}
                            className="p-1.5 rounded-lg text-gray-mid hover:text-charcoal hover:bg-gray-100 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ProductModal
          product={modal === 'create' ? null : modal}
          drops={drops}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </>
  )
}

// ── Shop Drops ────────────────────────────────────────────────────────────────

export function AdminShopDropsPage() {
  const [drops, setDrops] = useState<ShopDrop[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | ShopDrop | null>(null)
  const [launchModal, setLaunchModal] = useState<ShopDrop | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('shop_drops')
      .select('id, name, slug, description, status, launch_date, featured, hero_product_id, visible, sort_order, launch_email_sent_at, launch_email_sent_by, created_at, updated_at')
      .order('sort_order')
      .order('created_at', { ascending: false })
    setDrops((data as ShopDrop[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleField(drop: ShopDrop, field: 'visible' | 'featured') {
    setActionId(drop.id)
    setError(null)
    const newVal = !drop[field]
    const { error: err } = await supabase
      .from('shop_drops')
      .update({ [field]: newVal, updated_at: new Date().toISOString() })
      .eq('id', drop.id)
    if (err) { setError(err.message); setActionId(null); return }
    await auditLog(`shop_drop_${field}_changed`, 'shop_drops', drop.id, `${field} set to ${newVal}`)
    setDrops((prev) => prev.map((d) => d.id === drop.id ? { ...d, [field]: newVal } : d))
    setActionId(null)
  }

  return (
    <>
      <AdminPageHeader
        title="Shop Drops"
        description="Manage drop campaigns and their launch status."
        actions={
          <button
            onClick={() => setModal('create')}
            className="flex items-center gap-1.5 bg-blue-mein text-white px-4 py-2 rounded-xl text-sm font-sora font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} />
            New drop
          </button>
        }
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-sora text-red-700">
          <AlertTriangle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      {drops.length === 0 && !loading ? (
        <PlaceholderSection
          icon={ShoppingBag}
          title="No drops yet."
          note="Create your first drop campaign using the button above."
        />
      ) : (
        <AdminTable
          heads={['Name', 'Status', 'Launch date', 'Visible', 'Featured', 'Notify', '']}
          loading={loading}
        >
          {drops.map((d) => (
            <tr key={d.id} className={`hover:bg-blue-pale/20 transition-colors ${!d.visible ? 'opacity-60' : ''}`}>
              <td className="px-4 py-3.5">
                <p className="font-sora font-semibold text-charcoal text-sm">{d.name}</p>
                <p className="text-[10px] text-gray-mid font-sora font-mono">{d.slug}</p>
              </td>
              <td className="px-4 py-3.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora ${DROP_STATUS_COLORS[d.status]}`}>
                  {d.status}
                </span>
              </td>
              <td className="px-4 py-3.5 text-sm text-charcoal font-sora whitespace-nowrap">
                {d.launch_date ? new Date(d.launch_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </td>
              <td className="px-4 py-3.5">
                <button
                  onClick={() => toggleField(d, 'visible')}
                  disabled={actionId === d.id}
                  className="p-1.5 rounded-lg text-gray-mid hover:text-blue-mein hover:bg-blue-pale transition-colors disabled:opacity-40"
                >
                  {d.visible ? <Eye size={13} className="text-green-600" /> : <EyeOff size={13} />}
                </button>
              </td>
              <td className="px-4 py-3.5">
                <button
                  onClick={() => toggleField(d, 'featured')}
                  disabled={actionId === d.id}
                  className="p-1.5 rounded-lg text-gray-mid hover:text-gold-dark hover:bg-yellow-50 transition-colors disabled:opacity-40"
                >
                  {d.featured ? <Star size={13} className="text-gold-dark" /> : <StarOff size={13} />}
                </button>
              </td>
              <td className="px-4 py-3.5">
                <button
                  onClick={() => setLaunchModal(d)}
                  title={d.launch_email_sent_at ? `Sent ${new Date(d.launch_email_sent_at).toLocaleDateString('en-GB')}` : 'Send launch notification'}
                  className={`p-1.5 rounded-lg transition-colors ${
                    d.launch_email_sent_at
                      ? 'text-green-600 bg-green-50 cursor-default'
                      : 'text-gray-mid hover:text-blue-mein hover:bg-blue-pale'
                  }`}
                >
                  {d.launch_email_sent_at ? <CheckCircle size={13} /> : <Send size={13} />}
                </button>
              </td>
              <td className="px-4 py-3.5">
                <button
                  onClick={() => setModal(d)}
                  className="p-1.5 rounded-lg text-gray-mid hover:text-charcoal hover:bg-gray-100 transition-colors"
                  title="Edit"
                >
                  <Pencil size={13} />
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      {modal && (
        <DropModal
          drop={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}

      {launchModal && (
        <DropLaunchModal
          drop={launchModal}
          onClose={() => { setLaunchModal(null); load() }}
        />
      )}
    </>
  )
}
