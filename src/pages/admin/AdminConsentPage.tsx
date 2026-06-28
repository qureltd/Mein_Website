import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Filter, RefreshCw } from 'lucide-react'
import { supabase, type ConsentRequest } from '../../lib/supabase'
import { AdminPageHeader, AdminTable, PlaceholderSection } from '../../components/AdminLayout'

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-gray-100 text-gray-600',
  sent:      'bg-yellow-50 text-yellow-700',
  approved:  'bg-green-50 text-green-700',
  declined:  'bg-red-50 text-red-700',
  withdrawn: 'bg-orange-50 text-orange-700',
}

const STATUS_OPTIONS = ['all', 'pending', 'sent', 'approved', 'declined', 'withdrawn']

export default function AdminConsentPage() {
  const [records, setRecords] = useState<ConsentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  async function fetchRecords() {
    setLoading(true)
    let q = supabase
      .from('consent_requests')
      .select('*')
      .order('created_at', { ascending: false })
    if (statusFilter !== 'all') q = q.eq('status', statusFilter)
    const { data } = await q
    setRecords((data as ConsentRequest[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchRecords() }, [statusFilter])

  return (
    <>
      <AdminPageHeader
        title="Consent"
        description="Guardian consent requests linked to under-18 submissions."
      />

      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex flex-wrap gap-3 items-center">
        <Filter size={14} className="text-gray-mid" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-sora text-charcoal bg-white"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <button
          onClick={fetchRecords}
          className="ml-auto flex items-center gap-1.5 text-xs text-gray-mid hover:text-blue-mein font-sora transition-colors"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {records.length === 0 && !loading ? (
        <PlaceholderSection
          icon={ShieldCheck}
          title="No consent requests found."
          note="When a submission is flagged as requiring guardian consent and a request is sent, it will appear here."
        />
      ) : (
        <AdminTable
          heads={['Submission', 'Guardian email', 'Status', 'Consent type', 'Created', 'Responded']}
          loading={loading}
          empty="No consent requests found."
        >
          {records.map((r) => (
            <tr key={r.id} className="hover:bg-blue-pale/20 transition-colors">
              <td className="px-4 py-3.5">
                <Link
                  to={`/admin/submissions/${r.submission_id}`}
                  className="font-sora text-xs text-blue-mein hover:underline font-mono"
                >
                  {r.submission_id.slice(0, 8)}…
                </Link>
              </td>
              <td className="px-4 py-3.5 font-sora text-sm text-charcoal">{r.guardian_email}</td>
              <td className="px-4 py-3.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora ${STATUS_COLORS[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {r.status}
                </span>
              </td>
              <td className="px-4 py-3.5 text-xs text-gray-mid font-sora">
                {r.consent_type && r.consent_type.length > 0
                  ? r.consent_type.map((t) => t.replace(/_/g, ' ')).join(', ')
                  : '—'}
              </td>
              <td className="px-4 py-3.5 text-xs text-gray-mid font-sora whitespace-nowrap">
                {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-4 py-3.5 text-xs font-sora whitespace-nowrap">
                {r.responded_at ? (
                  <span className={r.status === 'approved' ? 'text-green-700' : 'text-red-600'}>
                    {new Date(r.responded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                ) : (
                  <span className="text-gray-mid">—</span>
                )}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  )
}
