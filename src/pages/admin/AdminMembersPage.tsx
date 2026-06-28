import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { supabase, type JoinInterest, type JoinInterestStatus } from '../../lib/supabase'
import { AdminPageHeader, AdminTable } from '../../components/AdminLayout'

const STATUS_COLORS: Record<JoinInterestStatus, string> = {
  new:          'bg-blue-pale text-blue-mein',
  reviewed:     'bg-gray-100 text-gray-600',
  contacted:    'bg-yellow-50 text-yellow-700',
  followed_up:  'bg-green-50 text-green-700',
  archived:     'bg-gray-100 text-gray-500',
}

const STATUS_LABELS: Record<JoinInterestStatus, string> = {
  new: 'New', reviewed: 'Reviewed', contacted: 'Contacted', followed_up: 'Followed Up', archived: 'Archived',
}

const PATH_LABELS: Record<string, string> = {
  young_person: 'Young person', parent_guardian: 'Parent / guardian',
  creator: 'Creator', school_partner: 'School / partner', supporter: 'Supporter',
}

export default function AdminMembersPage() {
  const [records, setRecords] = useState<JoinInterest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [pathFilter, setPathFilter] = useState('all')
  const [selected, setSelected] = useState<JoinInterest | null>(null)
  const [updating, setUpdating] = useState(false)

  async function fetchRecords() {
    setLoading(true)
    let q = supabase.from('join_interests').select('*').order('created_at', { ascending: false })
    if (statusFilter !== 'all') q = q.eq('status', statusFilter)
    if (pathFilter !== 'all') q = q.eq('path', pathFilter)
    const { data } = await q
    setRecords((data as JoinInterest[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchRecords() }, [statusFilter, pathFilter])

  async function updateStatus(id: string, status: JoinInterestStatus) {
    setUpdating(true)
    await supabase.from('join_interests').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    setUpdating(false)
    await fetchRecords()
    if (selected?.id === id) setSelected((r) => r ? { ...r, status } : null)
  }

  return (
    <>
      <AdminPageHeader title="Join Interests (Members)" description="People who expressed interest in joining Mein." />

      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex flex-wrap gap-3 items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-sora text-charcoal bg-white"
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select
          value={pathFilter}
          onChange={(e) => setPathFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-sora text-charcoal bg-white"
        >
          <option value="all">All Paths</option>
          {Object.entries(PATH_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button onClick={fetchRecords} className="ml-auto flex items-center gap-1.5 text-xs text-gray-mid hover:text-blue-mein font-sora transition-colors">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <AdminTable heads={['Name', 'Path', 'Age range', 'Consent', 'Status', 'Date', '']} loading={loading} empty="No join interests yet.">
        {records.map((r) => (
          <tr key={r.id} className="hover:bg-blue-pale/20 transition-colors">
            <td className="px-4 py-3.5">
              <p className="font-sora font-medium text-charcoal text-sm">{r.name || '—'}</p>
              <p className="text-xs text-gray-mid font-sora">{r.email}</p>
            </td>
            <td className="px-4 py-3.5">
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-sora font-medium">
                {PATH_LABELS[r.path] ?? r.path}
              </span>
            </td>
            <td className="px-4 py-3.5 text-sm text-charcoal font-sora">{r.age_range || '—'}</td>
            <td className="px-4 py-3.5">
              {r.consent_required ? (
                <span className={`px-2 py-0.5 rounded-full text-xs font-sora font-semibold ${
                  r.consent_status === 'received' ? 'bg-green-50 text-green-700' :
                  r.consent_status === 'pending'  ? 'bg-yellow-50 text-yellow-700' :
                  r.consent_status === 'declined' ? 'bg-red-50 text-red-700' :
                  'bg-orange-50 text-orange-700'
                }`}>{r.consent_status.replace('_', ' ')}</span>
              ) : (
                <span className="text-xs text-gray-mid font-sora">Not required</span>
              )}
            </td>
            <td className="px-4 py-3.5">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora ${STATUS_COLORS[r.status]}`}>
                {STATUS_LABELS[r.status]}
              </span>
            </td>
            <td className="px-4 py-3.5 text-xs text-gray-mid font-sora whitespace-nowrap">
              {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </td>
            <td className="px-4 py-3.5">
              <button onClick={() => setSelected(r)} className="text-xs text-blue-mein hover:underline font-sora">View</button>
            </td>
          </tr>
        ))}
      </AdminTable>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl z-10">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
              <p className="font-sora font-bold text-charcoal text-sm">{selected.name || selected.email}</p>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-mid">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Email', selected.email],
                  ['Path', PATH_LABELS[selected.path] ?? selected.path],
                  ['Age range', selected.age_range || '—'],
                  ['Location', selected.location || '—'],
                  ['Consent required', selected.consent_required ? 'Yes' : 'No'],
                  ['Consent status', selected.consent_status.replace('_', ' ')],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">{l}</p>
                    <p className="font-sora text-charcoal text-sm">{v}</p>
                  </div>
                ))}
              </div>
              {selected.interests && selected.interests.length > 0 && (
                <div>
                  <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-2">Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.interests.map((i) => (
                      <span key={i} className="bg-blue-pale text-blue-mein px-2 py-0.5 rounded-full text-xs font-sora font-medium">{i}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-2">Update status</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS_LABELS) as JoinInterestStatus[]).map((s) => (
                    <button
                      key={s}
                      disabled={updating || selected.status === s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sora font-semibold border transition-colors ${
                        selected.status === s
                          ? 'border-blue-mein bg-blue-mein text-white'
                          : 'border-gray-200 bg-white text-charcoal hover:border-blue-mein hover:text-blue-mein'
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
