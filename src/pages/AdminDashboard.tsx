import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Eye, Check, X, Archive, Clock, ChevronDown, Filter, RefreshCw } from 'lucide-react'
import { supabase, type Submission, type SubmissionStatus } from '../lib/supabase'
import { OpenMIcon } from '../components/BrandElements'

const statusColors: Record<SubmissionStatus, string> = {
  received: 'bg-blue-pale text-blue-mein',
  under_review: 'bg-yellow-50 text-yellow-700',
  needs_consent: 'bg-orange-50 text-orange-700',
  approved: 'bg-green-50 text-green-700',
  not_approved: 'bg-red-50 text-red-700',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-600',
}

const statusLabels: Record<SubmissionStatus, string> = {
  received: 'Received',
  under_review: 'Under Review',
  needs_consent: 'Needs Consent',
  approved: 'Approved',
  not_approved: 'Not Approved',
  published: 'Published',
  archived: 'Archived',
}

const typeLabels: Record<string, string> = {
  create: 'Create',
  speak: 'Speak',
  build: 'Build',
  represent: 'Represent',
  feature: 'Feature',
  future_me: 'Future Me',
  school: 'School',
  partner: 'Partner',
  contact: 'Contact',
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Submission | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const counts = submissions.reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1
    return acc
  }, {})

  async function fetchSubmissions() {
    setLoading(true)
    let query = supabase.from('submissions').select('*').order('created_at', { ascending: false })
    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    if (typeFilter !== 'all') query = query.eq('type', typeFilter)
    const { data } = await query
    setSubmissions((data as Submission[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchSubmissions() }, [statusFilter, typeFilter])

  async function updateStatus(id: string, status: SubmissionStatus) {
    setActionLoading(true)
    await supabase.from('submissions').update({ status }).eq('id', id)
    await fetchSubmissions()
    setSelected(null)
    setActionLoading(false)
  }

  async function publishAsStory(sub: Submission) {
    setActionLoading(true)
    const categoryMap: Record<string, string> = {
      create: 'creative_submissions', speak: 'mein_mover_videos',
      build: 'youth_stories', represent: 'youth_stories',
      feature: 'youth_stories', future_me: 'future_self_letters',
    }
    await supabase.from('stories').insert({
      submission_id: sub.id,
      title: sub.title || `Submission by ${sub.display_name || sub.name}`,
      excerpt: sub.content.slice(0, 200),
      category: categoryMap[sub.type] || 'youth_stories',
      author_display_name: sub.display_name || sub.name,
    })
    await updateStatus(sub.id, 'published')
  }

  const statBoxes = [
    { label: 'Total', value: submissions.length, color: 'bg-blue-pale text-blue-mein' },
    { label: 'New', value: counts['received'] || 0, color: 'bg-blue-pale text-blue-mein' },
    { label: 'Under Review', value: counts['under_review'] || 0, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Needs Consent', value: counts['needs_consent'] || 0, color: 'bg-orange-50 text-orange-700' },
    { label: 'Published', value: counts['published'] || 0, color: 'bg-green-100 text-green-800' },
  ]

  return (
    <div className="min-h-screen bg-gray-support/20">
      {/* Admin nav */}
      <nav className="bg-charcoal text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <OpenMIcon size={32} />
          <span className="font-sora font-bold text-lg">Mein Admin</span>
        </div>
        <Link to="/" className="text-white/60 text-sm hover:text-white transition-colors font-sora flex items-center gap-1.5">
          View site <ArrowRight size={13} />
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        {/* Stat boxes */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {statBoxes.map((s) => (
            <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
              <p className="font-sora font-bold text-2xl">{s.value}</p>
              <p className="text-xs font-sora mt-0.5 opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-support p-4 mb-4 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-mid" />
            <span className="text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide">Filters</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-field text-xs py-2 w-40"
          >
            <option value="all">All Statuses</option>
            {Object.entries(statusLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="select-field text-xs py-2 w-36"
          >
            <option value="all">All Types</option>
            {Object.entries(typeLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <button
            onClick={fetchSubmissions}
            className="ml-auto flex items-center gap-1.5 text-xs text-gray-mid hover:text-blue-mein transition-colors font-sora"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-support overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-blue-mein border-t-transparent animate-spin mx-auto" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-10 text-center text-gray-mid font-sora">
              No submissions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sora">
                <thead className="bg-gray-support/30 border-b border-gray-support">
                  <tr>
                    {['Name', 'Type', 'Status', 'Age', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-mid uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-support/50">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-blue-pale/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-charcoal">{sub.name}</p>
                        {sub.display_name && <p className="text-xs text-gray-mid">{sub.display_name}</p>}
                        <p className="text-xs text-gray-mid truncate max-w-[160px]">{sub.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="tag-badge text-xs">{typeLabels[sub.type]}</span>
                        {sub.title && <p className="text-xs text-gray-mid mt-1 truncate max-w-[120px]">{sub.title}</p>}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[sub.status]}`}>
                          {statusLabels[sub.status]}
                        </span>
                        {sub.is_under_18 && (
                          <span className="ml-1.5 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                            U18
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-charcoal">{sub.age ?? '—'}</td>
                      <td className="px-4 py-3.5 text-gray-mid text-xs">
                        {new Date(sub.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setSelected(sub)}
                          className="text-blue-mein hover:text-blue-dark transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl z-10">
            <div className="sticky top-0 bg-white border-b border-gray-support px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[selected.status]}`}>
                  {statusLabels[selected.status]}
                </span>
                <span className="tag-badge text-xs">{typeLabels[selected.type]}</span>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-support rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-mid text-xs font-semibold uppercase tracking-wide mb-1">Name</p>
                  <p className="font-sora font-medium text-charcoal">{selected.name}</p>
                  {selected.display_name && <p className="text-gray-mid text-xs">{selected.display_name}</p>}
                </div>
                <div>
                  <p className="text-gray-mid text-xs font-semibold uppercase tracking-wide mb-1">Email</p>
                  <p className="font-sora text-charcoal">{selected.email}</p>
                </div>
                <div>
                  <p className="text-gray-mid text-xs font-semibold uppercase tracking-wide mb-1">Age</p>
                  <p className="font-sora text-charcoal">{selected.age ?? 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-mid text-xs font-semibold uppercase tracking-wide mb-1">Submitted</p>
                  <p className="font-sora text-charcoal">{new Date(selected.created_at).toLocaleString('en-GB')}</p>
                </div>
                {selected.is_under_18 && (
                  <>
                    <div>
                      <p className="text-gray-mid text-xs font-semibold uppercase tracking-wide mb-1">Guardian Name</p>
                      <p className="font-sora text-charcoal">{selected.guardian_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-mid text-xs font-semibold uppercase tracking-wide mb-1">Guardian Email</p>
                      <p className="font-sora text-charcoal">{selected.guardian_email || 'Not provided'}</p>
                    </div>
                  </>
                )}
              </div>
              {selected.title && (
                <div>
                  <p className="text-gray-mid text-xs font-semibold uppercase tracking-wide mb-1">Title</p>
                  <p className="font-sora font-medium text-charcoal">{selected.title}</p>
                </div>
              )}
              <div>
                <p className="text-gray-mid text-xs font-semibold uppercase tracking-wide mb-2">Submission Content</p>
                <div className="bg-gray-support/30 rounded-xl p-4 text-sm font-sora text-charcoal leading-relaxed whitespace-pre-wrap">
                  {selected.content}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-support">
                {selected.status === 'received' && (
                  <button
                    onClick={() => updateStatus(selected.id, 'under_review')}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-yellow-100 transition-colors"
                  >
                    <Clock size={13} /> Mark Under Review
                  </button>
                )}
                {selected.is_under_18 && selected.status !== 'needs_consent' && (
                  <button
                    onClick={() => updateStatus(selected.id, 'needs_consent')}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-orange-100 transition-colors"
                  >
                    Request Consent
                  </button>
                )}
                {['under_review', 'needs_consent'].includes(selected.status) && (
                  <button
                    onClick={() => updateStatus(selected.id, 'approved')}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors"
                  >
                    <Check size={13} /> Approve
                  </button>
                )}
                {selected.status === 'approved' && ['create', 'speak', 'build', 'represent', 'feature'].includes(selected.type) && (
                  <button
                    onClick={() => publishAsStory(selected)}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 bg-blue-mein text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-dark transition-colors"
                  >
                    <ArrowRight size={13} /> Publish to The Wall
                  </button>
                )}
                {selected.status !== 'not_approved' && (
                  <button
                    onClick={() => updateStatus(selected.id, 'not_approved')}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                  >
                    <X size={13} /> Not Approved
                  </button>
                )}
                <button
                  onClick={() => updateStatus(selected.id, 'archived')}
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 bg-gray-100 text-gray-600 border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors ml-auto"
                >
                  <Archive size={13} /> Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
