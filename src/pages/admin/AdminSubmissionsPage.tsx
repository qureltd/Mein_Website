import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Check, X, Archive, Clock, Filter, RefreshCw } from 'lucide-react'
import { supabase, type Submission, type SubmissionStatus } from '../../lib/supabase'
import { AdminPageHeader, AdminTable } from '../../components/AdminLayout'

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  received:         'bg-blue-pale text-blue-mein',
  under_review:     'bg-yellow-50 text-yellow-700',
  needs_consent:    'bg-orange-50 text-orange-700',
  consent_sent:     'bg-blue-50 text-blue-700',
  consent_received: 'bg-teal-50 text-teal-700',
  approved:         'bg-green-50 text-green-700',
  not_approved:     'bg-red-50 text-red-700',
  published:        'bg-green-100 text-green-800',
  archived:         'bg-gray-100 text-gray-600',
}

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  received:         'Received',
  under_review:     'Under Review',
  needs_consent:    'Needs Consent',
  consent_sent:     'Consent Sent',
  consent_received: 'Consent Received',
  approved:         'Approved',
  not_approved:     'Not Approved',
  published:        'Published',
  archived:         'Archived',
}

const TYPE_LABELS: Record<string, string> = {
  create: 'Create', speak: 'Speak', build: 'Build',
  represent: 'Represent', feature: 'Feature', future_me: 'Future Me',
  school: 'School', partner: 'Partner', contact: 'Contact',
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')

  async function fetchSubmissions() {
    setLoading(true)
    let q = supabase.from('submissions').select('id, name, display_name, email, age, type, title, content, media_url, status, is_under_18, guardian_email, guardian_name, admin_notes, rejection_reason, reviewed_at, published_at, consent_scope, consent_required, public_display_name, created_at, updated_at').order('created_at', { ascending: false })
    if (statusFilter !== 'all') q = q.eq('status', statusFilter)
    if (typeFilter !== 'all') q = q.eq('type', typeFilter)
    const { data } = await q
    setSubmissions((data as Submission[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchSubmissions() }, [statusFilter, typeFilter])

  const filtered = search
    ? submissions.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
      )
    : submissions

  return (
    <>
      <AdminPageHeader title="Submissions" description="All public form submissions." />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex flex-wrap gap-3 items-center">
        <Filter size={14} className="text-gray-mid" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-sora text-charcoal bg-white"
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-sora text-charcoal bg-white"
        >
          <option value="all">All Types</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <input
          type="search"
          placeholder="Search name / email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-sora text-charcoal bg-white min-w-[160px]"
        />
        <button
          onClick={fetchSubmissions}
          className="ml-auto flex items-center gap-1.5 text-xs text-gray-mid hover:text-blue-mein transition-colors font-sora"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <AdminTable
        heads={['Name', 'Type', 'Status', 'Age', 'Date', '']}
        loading={loading}
        empty="No submissions found."
      >
        {filtered.map((sub) => (
          <tr key={sub.id} className="hover:bg-blue-pale/20 transition-colors">
            <td className="px-4 py-3.5">
              <p className="font-sora font-medium text-charcoal text-sm">{sub.name}</p>
              {sub.display_name && <p className="text-xs text-gray-mid">{sub.display_name}</p>}
              <p className="text-xs text-gray-mid truncate max-w-[160px]">{sub.email}</p>
            </td>
            <td className="px-4 py-3.5">
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-sora font-medium">
                {TYPE_LABELS[sub.type] ?? sub.type}
              </span>
              {sub.title && <p className="text-xs text-gray-mid mt-1 truncate max-w-[120px]">{sub.title}</p>}
            </td>
            <td className="px-4 py-3.5">
              <StatusBadge status={sub.status} />
              {sub.is_under_18 && (
                <span className="ml-1.5 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-xs font-semibold font-sora">U18</span>
              )}
            </td>
            <td className="px-4 py-3.5 text-sm text-charcoal font-sora">{sub.age ?? '—'}</td>
            <td className="px-4 py-3.5 text-xs text-gray-mid font-sora whitespace-nowrap">
              {new Date(sub.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </td>
            <td className="px-4 py-3.5">
              <Link to={`/admin/submissions/${sub.id}`} className="text-blue-mein hover:text-blue-700 transition-colors" title="View">
                <Eye size={16} />
              </Link>
            </td>
          </tr>
        ))}
      </AdminTable>
    </>
  )
}
