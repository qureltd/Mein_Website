import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, MessageSquare, Users, ShieldCheck,
  Layers, ShoppingBag, Mail, Settings, LogOut, Menu, X, ExternalLink,
  ChevronRight, Package,
} from 'lucide-react'
import { type AdminUser } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { useAdminUser } from './AdminRouteGuard'
import { OpenMIcon } from './BrandElements'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles?: AdminUser['role'][]
  children?: { label: string; href: string }[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',     href: '/admin',              icon: LayoutDashboard },
  { label: 'Submissions',   href: '/admin/submissions',  icon: FileText,        roles: ['super_admin', 'content_reviewer', 'consent_manager'] },
  { label: 'Contact',       href: '/admin/contact',      icon: MessageSquare,   roles: ['super_admin', 'content_reviewer'] },
  { label: 'Members',       href: '/admin/members',      icon: Users,           roles: ['super_admin', 'content_reviewer'] },
  { label: 'Consent',       href: '/admin/consent',      icon: ShieldCheck,     roles: ['super_admin', 'consent_manager'] },
  { label: 'The Wall',      href: '/admin/wall',         icon: Layers,          roles: ['super_admin', 'content_reviewer'] },
  {
    label: 'Shop', href: '/admin/shop', icon: ShoppingBag, roles: ['super_admin', 'shop_manager'],
    children: [
      { label: 'Overview', href: '/admin/shop' },
      { label: 'Products',  href: '/admin/shop/products' },
      { label: 'Drops',     href: '/admin/shop/drops' },
    ],
  },
  { label: 'Email Events',  href: '/admin/email-events', icon: Mail,            roles: ['super_admin'] },
  { label: 'Settings',      href: '/admin/settings',     icon: Settings,        roles: ['super_admin'] },
]

function isVisible(item: NavItem, role: AdminUser['role'] | null): boolean {
  if (!item.roles) return true
  if (!role) return true // show all if role not yet loaded
  return item.roles.includes(role)
}

function NavLink({
  item,
  location,
  onClick,
}: {
  item: NavItem
  location: ReturnType<typeof useLocation>
  onClick?: () => void
}) {
  const isActive = location.pathname === item.href ||
    (item.href !== '/admin' && location.pathname.startsWith(item.href))
  const isShop = item.children && item.href === '/admin/shop'
  const shopExpanded = isShop && location.pathname.startsWith('/admin/shop')

  return (
    <div>
      <Link
        to={item.href}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sora font-medium transition-colors group ${
          isActive
            ? 'bg-blue-mein text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        <item.icon size={16} className="flex-shrink-0" />
        <span className="flex-1">{item.label}</span>
        {item.children && (
          <ChevronRight
            size={13}
            className={`flex-shrink-0 transition-transform ${shopExpanded ? 'rotate-90' : ''}`}
          />
        )}
      </Link>
      {item.children && shopExpanded && (
        <div className="ml-8 mt-0.5 flex flex-col gap-0.5">
          {item.children.map((child) => {
            const childActive = location.pathname === child.href
            return (
              <Link
                key={child.href}
                to={child.href}
                onClick={onClick}
                className={`px-3 py-2 rounded-lg text-xs font-sora font-medium transition-colors ${
                  childActive ? 'bg-white/20 text-white' : 'text-white/55 hover:bg-white/10 hover:text-white'
                }`}
              >
                {child.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { adminUser } = useAdminUser()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const visibleItems = NAV_ITEMS.filter((item) => isVisible(item, adminUser?.role ?? null))

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/10">
        <OpenMIcon size={28} />
        <div>
          <span className="font-sora font-bold text-white text-sm leading-none">Mein Admin</span>
          {adminUser?.role && (
            <p className="text-white/40 text-[10px] font-sora mt-0.5 uppercase tracking-widest">
              {adminUser.role.replace('_', ' ')}
            </p>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {visibleItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            location={location}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-1">
        <div className="px-3 py-2">
          <p className="text-white/50 text-xs font-sora truncate">
            {adminUser?.full_name || adminUser?.email || ''}
          </p>
        </div>
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-sora font-medium text-white/55 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ExternalLink size={15} />
          View site
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-sora font-medium text-white/55 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-charcoal flex-shrink-0 fixed inset-y-0 left-0 z-30">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-charcoal flex flex-col transform transition-transform duration-200 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 text-white/60 hover:text-white"
        >
          <X size={18} />
        </button>
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-20 bg-charcoal text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-1">
            <Menu size={20} />
          </button>
          <OpenMIcon size={24} />
          <span className="font-sora font-bold text-sm">Mein Admin</span>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

// Reusable admin UI primitives used across admin pages

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-sora font-extrabold text-xl md:text-2xl text-charcoal">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-mid font-sora">{description}</p>}
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  color = 'blue',
}: {
  label: string
  value: number | string
  color?: 'blue' | 'gold' | 'green' | 'red' | 'orange' | 'gray'
}) {
  const colors = {
    blue:   'bg-blue-pale text-blue-mein border-blue-mein/20',
    gold:   'bg-gold-pale text-gold-dark border-yellow-300/40',
    green:  'bg-green-50 text-green-700 border-green-200',
    red:    'bg-red-50 text-red-700 border-red-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    gray:   'bg-gray-100 text-gray-600 border-gray-200',
  }
  return (
    <div className={`rounded-xl border px-4 py-4 ${colors[color]}`}>
      <p className="font-sora font-bold text-2xl">{value}</p>
      <p className="text-xs font-sora font-medium mt-0.5 opacity-70">{label}</p>
    </div>
  )
}

export function AdminTable({
  heads,
  children,
  loading,
  empty,
}: {
  heads: string[]
  children: React.ReactNode
  loading?: boolean
  empty?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {loading ? (
        <div className="p-10 flex justify-center">
          <div className="w-7 h-7 rounded-full border-2 border-blue-mein border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sora">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {heads.map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-mid uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">{children}</tbody>
          </table>
          {!children || (Array.isArray(children) && children.length === 0) ? (
            <p className="text-center text-gray-mid text-sm py-10 font-sora">{empty ?? 'No records found.'}</p>
          ) : null}
        </div>
      )}
    </div>
  )
}

export function PlaceholderSection({
  icon: Icon,
  title,
  note,
}: {
  icon: React.ElementType
  title: string
  note: string
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white px-8 py-14 text-center">
      <Icon size={36} className="mx-auto text-gray-200 mb-4" />
      <p className="font-sora font-bold text-base text-charcoal">{title}</p>
      <p className="mt-2 text-sm text-gray-mid font-sora max-w-md mx-auto">{note}</p>
    </div>
  )
}

export { Package }
