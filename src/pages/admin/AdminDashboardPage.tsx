import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { AdminPageHeader, StatCard } from '../../components/AdminLayout'

interface DashCounts {
  submissions_new: number
  submissions_under_review: number
  submissions_needs_consent: number
  submissions_published: number
  contact_new: number
  join_new: number
  shop_visible: number
  email_failed: number
}

interface RecentSubmission {
  id: string
  name: string
  type: string
  status: string
  created_at: string
}

interface RecentContact {
  id: string
  name: string | null
  email: string
  contact_type: string
  subject: string | null
  created_at: string
}

interface RecentJoin {
  id: string
  name: string | null
  email: string
  path: string
  created_at: string
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<DashCounts | null>(null)
  const [recentSubs, setRecentSubs] = useState<RecentSubmission[]>([])
  const [recentContact, setRecentContact] = useState<RecentContact[]>([])
  const [recentJoin, setRecentJoin] = useState<RecentJoin[]>([])
  const [loading, setLoading] = useState(true)

  async function loadDashboard() {
    setLoading(true)
    const [
      { count: subsNew },
      { count: subsReview },
      { count: subsConsent },
      { count: subsPub },
      { count: contactNew },
      { count: joinNew },
      { count: shopVisible },
      { count: emailFailed },
      { data: latestSubs },
      { data: latestContact },
      { data: latestJoin },
    ] = await Promise.all([
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'received'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'under_review'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'needs_consent'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('join_interests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('shop_products').select('*', { count: 'exact', head: true }).eq('visible', true),
      supabase.from('email_events').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
      supabase.from('submissions').select('id, name, type, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('contact_messages').select('id, name, email, contact_type, subject, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('join_interests').select('id, name, email, path, created_at').order('created_at', { ascending: false }).limit(5),
    ])

    setCounts({
      submissions_new: subsNew ?? 0,
      submissions_under_review: subsReview ?? 0,
      submissions_needs_consent: subsConsent ?? 0,
      submissions_published: subsPub ?? 0,
      contact_new: contactNew ?? 0,
      join_new: joinNew ?? 0,
      shop_visible: shopVisible ?? 0,
      email_failed: emailFailed ?? 0,
    })
    setRecentSubs((latestSubs ?? []) as RecentSubmission[])
    setRecentContact((latestContact ?? []) as RecentContact[])
    setRecentJoin((latestJoin ?? []) as RecentJoin[])
    setLoading(false)
  }

  useEffect(() => { loadDashboard() }, [])

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of Mein activity."
        actions={
          <button
            onClick={loadDashboard}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-mid hover:text-blue-mein transition-colors font-sora"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="New submissions" value={counts?.submissions_new ?? '—'} color="blue" />
        <StatCard label="Under review" value={counts?.submissions_under_review ?? '—'} color="gold" />
        <StatCard label="Needs consent" value={counts?.submissions_needs_consent ?? '—'} color="orange" />
        <StatCard label="Published" value={counts?.submissions_published ?? '—'} color="green" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <StatCard label="New contacts" value={counts?.contact_new ?? '—'} color="blue" />
        <StatCard label="Join interests" value={counts?.join_new ?? '—'} color="gold" />
        <StatCard label="Shop products live" value={counts?.shop_visible ?? '—'} color="gray" />
        <StatCard label="Email failures" value={counts?.email_failed ?? '—'} color={counts?.email_failed ? 'red' : 'gray'} />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-10">
        {[
          { label: 'Submissions', href: '/admin/submissions' },
          { label: 'Contact', href: '/admin/contact' },
          { label: 'Members', href: '/admin/members' },
          { label: 'Email Events', href: '/admin/email-events' },
        ].map((l) => (
          <Link
            key={l.href}
            to={l.href}
            className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-sora font-semibold text-charcoal hover:border-blue-mein/50 hover:text-blue-mein transition-colors group"
          >
            {l.label}
            <ArrowRight size={13} className="text-gray-mid group-hover:text-blue-mein group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent submissions */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-sora font-semibold text-sm text-charcoal">Recent Submissions</p>
            <Link to="/admin/submissions" className="text-xs text-blue-mein hover:underline font-sora">View all</Link>
          </div>
          {recentSubs.length === 0 ? (
            <p className="text-center text-gray-mid text-xs py-8 font-sora">No submissions yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentSubs.map((s) => (
                <li key={s.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                  <Link to={`/admin/submissions/${s.id}`} className="block">
                    <p className="text-sm font-sora font-medium text-charcoal truncate">{s.name}</p>
                    <p className="text-xs text-gray-mid font-sora mt-0.5">{s.type} · {fmt(s.created_at)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent contacts */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-sora font-semibold text-sm text-charcoal">Recent Contact</p>
            <Link to="/admin/contact" className="text-xs text-blue-mein hover:underline font-sora">View all</Link>
          </div>
          {recentContact.length === 0 ? (
            <p className="text-center text-gray-mid text-xs py-8 font-sora">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentContact.map((c) => (
                <li key={c.id} className="px-4 py-3">
                  <p className="text-sm font-sora font-medium text-charcoal truncate">{c.name || c.email}</p>
                  <p className="text-xs text-gray-mid font-sora mt-0.5 truncate">{c.subject || c.contact_type} · {fmt(c.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent joins */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-sora font-semibold text-sm text-charcoal">Recent Join Interests</p>
            <Link to="/admin/members" className="text-xs text-blue-mein hover:underline font-sora">View all</Link>
          </div>
          {recentJoin.length === 0 ? (
            <p className="text-center text-gray-mid text-xs py-8 font-sora">No interests yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentJoin.map((j) => (
                <li key={j.id} className="px-4 py-3">
                  <p className="text-sm font-sora font-medium text-charcoal truncate">{j.name || j.email}</p>
                  <p className="text-xs text-gray-mid font-sora mt-0.5">{j.path.replace('_', ' ')} · {fmt(j.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
