import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Search, X, Download, Bell, ShieldCheck, ShieldOff } from 'lucide-react'
import { supabase, type JoinInterest, type JoinInterestStatus, type Priority } from '../../lib/supabase'
import { AdminPageHeader } from '../../components/AdminLayout'

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: JoinInterestStatus[] = ['new', 'reviewed', 'contacted', 'invited', 'active', 'followed_up', 'archived']

const STATUS_COLORS: Record<JoinInterestStatus, string> = {
  new:         'bg-blue-pale text-blue-mein',
  reviewed:    'bg-gray-100 text-gray-600',
  contacted:   'bg-yellow-50 text-yellow-700',
  invited:     'bg-purple-50 text-purple-700',
  active:      'bg-green-50 text-green-700',
  followed_up: 'bg-teal-50 text-teal-700',
  archived:    'bg-gray-100 text-gray-400',
}

const STATUS_LABELS: Record<JoinInterestStatus, string> = {
  new: 'New', reviewed: 'Reviewed', contacted: 'Contacted',
  invited: 'Invited', active: 'Active', followed_up: 'Followed up', archived: 'Archived',
}

const PRIORITY_OPTIONS: Priority[] = ['low', 'normal', 'high', 'urgent']

const PRIORITY_COLORS: Record<Priority, string> = {
  low:    'bg-gray-100 text-gray-500',
  normal: 'bg-gray-100 text-gray-600',
  high:   'bg-orange-50 text-orange-700',
  urgent: 'bg-red-50 text-red-700',
}

const PATH_LABELS: Record<string, string> = {
  young_person: 'Young person', parent_guardian: 'Parent / guardian',
  creator: 'Creator', school_partner: 'School / educator / partner',
  supporter: 'Supporter', partner: 'Partner',
  shop_early_access: 'Shop / early access',
}

const CONSENT_STATUS_COLORS: Record<string, string> = {
  not_required: 'text-gray-400',
  required:     'bg-orange-50 text-orange-700',
  pending:      'bg-yellow-50 text-yellow-700',
  received:     'bg-green-50 text-green-700',
  declined:     'bg-red-50 text-red-700',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtFull(d: string) {
  return new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function auditLog(action: string, entity_id: string, prev: string | null, next: string | null, notes?: string) {
  const { data } = await supabase.auth.getUser()
  await supabase.from('audit_logs').insert({
    admin_id: data.user?.id ?? null,
    action, entity_type: 'join_interests', entity_id,
    previous_status: prev, new_status: next, notes: notes ?? null,
  })
}

// ── CSV export ────────────────────────────────────────────────────────────────

function exportCSV(records: JoinInterest[]) {
  const headers = ['id', 'name', 'email', 'path', 'age_range', 'location', 'interests', 'consent_required', 'consent_status', 'status', 'priority', 'follow_up_required', 'follow_up_date', 'created_at', 'updated_at']
  const rows = records.map((r) => headers.map((h) => {
    const val = (r as unknown as Record<string, unknown>)[h]
    if (val === null || val === undefined) return ''
    const s = Array.isArray(val) ? val.join('; ') : String(val)
    return `"${s.replace(/"/g, '""')}"`
  }).join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `join_interests_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Detail modal ──────────────────────────────────────────────────────────────

function MemberDetailModal({
  record,
  onClose,
  onUpdated,
}: {
  record: JoinInterest
  onClose: () => void
  onUpdated: (updated: JoinInterest) => void
}) {
  const [form, setForm] = useState({
    status:             record.status,
    priority:           record.priority,
    follow_up_required: record.follow_up_required,
    follow_up_date:     record.follow_up_date ? record.follow_up_date.slice(0, 10) : '',
    admin_notes:        record.admin_notes ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    setSaving(true)
    setError(null)
    setSaved(false)

    const reviewedAt = form.status === 'reviewed' && record.status === 'new'
      ? new Date().toISOString()
      : record.reviewed_at

    const payload: Partial<JoinInterest> = {
      status:             form.status,
      priority:           form.priority,
      follow_up_required: form.follow_up_required,
      follow_up_date:     form.follow_up_date || null,
      admin_notes:        form.admin_notes.trim() || null,
      reviewed_at:        reviewedAt,
      updated_at:         new Date().toISOString(),
    }

    const { error: err } = await supabase
      .from('join_interests')
      .update(payload)
      .eq('id', record.id)

    if (err) { setError(err.message); setSaving(false); return }

    const actions: Promise<void>[] = []
    if (form.status !== record.status)
      actions.push(auditLog('join_status_updated', record.id, record.status, form.status))
    if (form.priority !== record.priority)
      actions.push(auditLog('join_priority_updated', record.id, record.priority, form.priority))
    if (form.admin_notes.trim() !== (record.admin_notes ?? ''))
      actions.push(auditLog('join_notes_updated', record.id, null, null, 'Notes updated'))
    if (form.follow_up_required !== record.follow_up_required || form.follow_up_date !== (record.follow_up_date?.slice(0, 10) ?? ''))
      actions.push(auditLog('join_followup_updated', record.id, null, null, `follow_up_required=${form.follow_up_required}`))
    await Promise.all(actions)

    const updated: JoinInterest = { ...record, ...payload } as JoinInterest
    onUpdated(updated)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl z-10">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-sora ${STATUS_COLORS[form.status]}`}>
              {STATUS_LABELS[form.status]}
            </span>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-sora font-medium">
              {PATH_LABELS[record.path] ?? record.path}
            </span>
            {form.priority !== 'normal' && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-sora font-semibold capitalize ${PRIORITY_COLORS[form.priority]}`}>
                {form.priority}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-mid transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Identity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">Name</p>
              <p className="font-sora font-medium text-charcoal text-sm">{record.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">Email</p>
              <a href={`mailto:${record.email}`} className="text-sm text-blue-mein hover:underline font-sora break-all">{record.email}</a>
            </div>
            <div>
              <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">Age range</p>
              <p className="font-sora text-charcoal text-sm">{record.age_range || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">Location</p>
              <p className="font-sora text-charcoal text-sm">{record.location || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">Submitted</p>
              <p className="font-sora text-charcoal text-xs">{fmtFull(record.created_at)}</p>
            </div>
            {record.reviewed_at && (
              <div>
                <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">Reviewed at</p>
                <p className="font-sora text-charcoal text-xs">{fmtFull(record.reviewed_at)}</p>
              </div>
            )}
          </div>

          {record.interests && record.interests.length > 0 && (
            <div>
              <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-2">Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {record.interests.map((i) => (
                  <span key={i} className="bg-blue-pale text-blue-mein px-2 py-0.5 rounded-full text-xs font-sora font-medium">{i}</span>
                ))}
              </div>
            </div>
          )}

          {/* Consent */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            {record.consent_required
              ? <ShieldCheck size={16} className="text-orange-500 shrink-0" />
              : <ShieldOff size={16} className="text-gray-400 shrink-0" />
            }
            <div className="text-sm font-sora">
              <span className="text-charcoal font-medium">
                {record.consent_required ? 'Consent required' : 'No consent required'}
              </span>
              {record.consent_required && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${CONSENT_STATUS_COLORS[record.consent_status] ?? 'text-gray-mid'}`}>
                  {record.consent_status.replace('_', ' ')}
                </span>
              )}
              {record.parent_guardian_email && (
                <p className="text-xs text-gray-mid mt-0.5">Guardian: {record.parent_guardian_email}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-2">Status</p>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sora font-semibold border transition-colors ${
                    form.status === s
                      ? 'border-blue-mein bg-blue-mein text-white'
                      : 'border-gray-200 bg-white text-charcoal hover:border-blue-mein hover:text-blue-mein'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-2">Priority</p>
            <div className="flex flex-wrap gap-1.5">
              {PRIORITY_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => setForm((f) => ({ ...f, priority: p }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sora font-semibold border capitalize transition-colors ${
                    form.priority === p
                      ? 'border-blue-mein bg-blue-mein text-white'
                      : 'border-gray-200 bg-white text-charcoal hover:border-blue-mein hover:text-blue-mein'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Follow-up */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.follow_up_required}
                  onChange={(e) => setForm((f) => ({ ...f, follow_up_required: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-mein"
                />
                <span className="text-sm font-sora text-charcoal font-medium">Follow-up required</span>
              </label>
            </div>
            <div>
              <label className="block text-xs font-sora font-semibold text-gray-mid mb-1">Follow-up date</label>
              <input
                type="date"
                value={form.follow_up_date}
                onChange={(e) => setForm((f) => ({ ...f, follow_up_date: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
              />
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <label className="block text-xs font-sora font-semibold text-gray-mid uppercase tracking-wide mb-1.5">
              Admin notes (private)
            </label>
            <textarea
              value={form.admin_notes}
              onChange={(e) => setForm((f) => ({ ...f, admin_notes: e.target.value }))}
              rows={4}
              placeholder="Internal notes — never shown publicly."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30 resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-sora">{error}</p>}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex items-center justify-between">
          <button onClick={onClose} className="text-sm font-sora font-semibold text-gray-mid hover:text-charcoal transition-colors">
            Close
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-mein text-white rounded-xl text-sm font-sora font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminMembersPage() {
  const [records, setRecords]           = useState<JoinInterest[]>([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pathFilter, setPathFilter]     = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [consentFilter, setConsentFilter]   = useState('all')
  const [followUpFilter, setFollowUpFilter] = useState(false)
  const [selected, setSelected]         = useState<JoinInterest | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    let q = supabase
      .from('join_interests')
      .select('id, name, email, path, age_range, location, interests, parent_guardian_email, consent_required, consent_status, status, admin_notes, priority, follow_up_required, follow_up_date, reviewed_at, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (statusFilter !== 'all') q = q.eq('status', statusFilter)
    if (pathFilter !== 'all') q = q.eq('path', pathFilter)
    if (priorityFilter !== 'all') q = q.eq('priority', priorityFilter)
    if (consentFilter === 'required') q = q.eq('consent_required', true)
    if (followUpFilter) q = q.eq('follow_up_required', true)

    const { data } = await q
    setRecords((data as JoinInterest[]) ?? [])
    setLoading(false)
  }, [statusFilter, pathFilter, priorityFilter, consentFilter, followUpFilter])

  useEffect(() => { fetch() }, [fetch])

  const filtered = search.trim()
    ? records.filter((r) => {
        const s = search.toLowerCase()
        return (
          (r.name?.toLowerCase().includes(s)) ||
          r.email.toLowerCase().includes(s) ||
          (r.location?.toLowerCase().includes(s)) ||
          (r.interests?.some((i) => i.toLowerCase().includes(s)))
        )
      })
    : records

  function handleUpdated(updated: JoinInterest) {
    setRecords((prev) => prev.map((r) => r.id === updated.id ? updated : r))
    setSelected(updated)
  }

  const followUpCount = records.filter((r) => r.follow_up_required && r.status !== 'archived').length

  return (
    <>
      <AdminPageHeader
        title="Join Interests"
        description="People who expressed interest in joining Mein."
        actions={
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 text-xs font-sora font-semibold text-gray-mid hover:text-charcoal transition-colors border border-gray-200 rounded-lg px-3 py-1.5"
          >
            <Download size={12} />
            Export CSV
          </button>
        }
      />

      {followUpCount > 0 && (
        <div className="mb-4 flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 text-sm font-sora text-orange-700">
          <Bell size={14} className="shrink-0" />
          {followUpCount} interest{followUpCount !== 1 ? 's' : ''} need{followUpCount === 1 ? 's' : ''} follow-up
          <button
            onClick={() => setFollowUpFilter(true)}
            className="ml-auto text-xs font-semibold underline hover:no-underline"
          >
            Filter
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[160px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-mid" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, location…"
            className="w-full pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs font-sora text-charcoal focus:outline-none focus:ring-2 focus:ring-blue-mein/30"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2">
              <X size={11} className="text-gray-mid" />
            </button>
          )}
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-sora text-charcoal bg-white">
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>

        <select value={pathFilter} onChange={(e) => setPathFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-sora text-charcoal bg-white">
          <option value="all">All paths</option>
          {Object.entries(PATH_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-sora text-charcoal bg-white">
          <option value="all">All priorities</option>
          {PRIORITY_OPTIONS.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
        </select>

        <select value={consentFilter} onChange={(e) => setConsentFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-sora text-charcoal bg-white">
          <option value="all">All consent</option>
          <option value="required">Consent required</option>
        </select>

        <label className="flex items-center gap-1.5 text-xs font-sora text-charcoal cursor-pointer">
          <input
            type="checkbox"
            checked={followUpFilter}
            onChange={(e) => setFollowUpFilter(e.target.checked)}
            className="rounded border-gray-300 text-blue-mein"
          />
          Follow-up only
        </label>

        <button
          onClick={fetch}
          className="ml-auto flex items-center gap-1.5 text-xs text-gray-mid hover:text-blue-mein font-sora transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Summary line */}
      <p className="text-xs text-gray-mid font-sora mb-3">
        {loading ? 'Loading…' : `${filtered.length} record${filtered.length !== 1 ? 's' : ''}${search ? ' matching search' : ''}`}
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 border-blue-mein border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-mid text-sm py-12 font-sora">No join interests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sora">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Name', 'Path', 'Age', 'Consent', 'Status', 'Priority', 'Follow-up', 'Date', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-mid uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`hover:bg-blue-pale/20 transition-colors cursor-pointer ${r.status === 'archived' ? 'opacity-50' : ''}`}
                  >
                    <td className="px-4 py-3.5 min-w-[130px]">
                      <p className="font-sora font-medium text-charcoal text-sm truncate max-w-[130px]">{r.name || '—'}</p>
                      <p className="text-xs text-gray-mid font-sora truncate max-w-[130px]">{r.email}</p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-sora font-medium">
                        {PATH_LABELS[r.path] ?? r.path}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-charcoal font-sora whitespace-nowrap">{r.age_range || '—'}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {r.consent_required ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-sora font-semibold ${CONSENT_STATUS_COLORS[r.consent_status] ?? 'text-gray-mid'}`}>
                          {r.consent_status.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-sora">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-sora ${STATUS_COLORS[r.status]}`}>
                        {STATUS_LABELS[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {r.priority !== 'normal' ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-sora font-semibold capitalize ${PRIORITY_COLORS[r.priority]}`}>
                          {r.priority}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-sora">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {r.follow_up_required && (
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-orange-100">
                          <Bell size={9} className="text-orange-600" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-mid font-sora whitespace-nowrap">{fmt(r.created_at)}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-blue-mein font-sora">View</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <MemberDetailModal
          record={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}
    </>
  )
}
