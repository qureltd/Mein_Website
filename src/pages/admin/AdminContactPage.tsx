import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Search, X, Download, Bell, Mail } from 'lucide-react'
import { supabase, type ContactMessage, type ContactMessageStatus, type Priority } from '../../lib/supabase'
import { AdminPageHeader } from '../../components/AdminLayout'

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: ContactMessageStatus[] = ['new', 'read', 'in_progress', 'waiting', 'resolved', 'archived']

const STATUS_COLORS: Record<ContactMessageStatus, string> = {
  new:         'bg-blue-pale text-blue-mein',
  read:        'bg-gray-100 text-gray-600',
  in_progress: 'bg-yellow-50 text-yellow-700',
  waiting:     'bg-orange-50 text-orange-700',
  resolved:    'bg-green-50 text-green-700',
  archived:    'bg-gray-100 text-gray-400',
}

const STATUS_LABELS: Record<ContactMessageStatus, string> = {
  new: 'New', read: 'Read', in_progress: 'In progress', waiting: 'Waiting',
  resolved: 'Resolved', archived: 'Archived',
}

const PRIORITY_OPTIONS: Priority[] = ['low', 'normal', 'high', 'urgent']

const PRIORITY_COLORS: Record<Priority, string> = {
  low:    'bg-gray-100 text-gray-500',
  normal: 'bg-gray-100 text-gray-600',
  high:   'bg-orange-50 text-orange-700',
  urgent: 'bg-red-50 text-red-700',
}

const TYPE_LABELS: Record<string, string> = {
  young_person: 'Young person', parent: 'Parent', school: 'School',
  organisation: 'Organisation', creator: 'Creator', shop: 'Shop', general: 'General',
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
    action, entity_type: 'contact_messages', entity_id,
    previous_status: prev, new_status: next, notes: notes ?? null,
  })
}

// ── CSV export ────────────────────────────────────────────────────────────────

function exportCSV(messages: ContactMessage[]) {
  const headers = ['id', 'contact_type', 'name', 'email', 'subject', 'message', 'status', 'priority', 'follow_up_required', 'follow_up_date', 'created_at', 'updated_at']
  const rows = messages.map((m) => headers.map((h) => {
    const val = (m as unknown as Record<string, unknown>)[h]
    if (val === null || val === undefined) return ''
    const s = String(val).replace(/"/g, '""')
    return `"${s}"`
  }).join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `contact_messages_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Detail modal ──────────────────────────────────────────────────────────────

function ContactDetailModal({
  msg,
  onClose,
  onUpdated,
}: {
  msg: ContactMessage
  onClose: () => void
  onUpdated: (updated: ContactMessage) => void
}) {
  const [form, setForm] = useState({
    status:           msg.status,
    priority:         msg.priority,
    follow_up_required: msg.follow_up_required,
    follow_up_date:   msg.follow_up_date ? msg.follow_up_date.slice(0, 10) : '',
    admin_notes:      msg.admin_notes ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    setSaving(true)
    setError(null)
    setSaved(false)

    const resolvedAt = form.status === 'resolved' && msg.status !== 'resolved'
      ? new Date().toISOString()
      : msg.resolved_at

    const payload: Partial<ContactMessage> = {
      status:             form.status,
      priority:           form.priority,
      follow_up_required: form.follow_up_required,
      follow_up_date:     form.follow_up_date || null,
      admin_notes:        form.admin_notes.trim() || null,
      resolved_at:        resolvedAt,
      updated_at:         new Date().toISOString(),
    }

    const { error: err } = await supabase
      .from('contact_messages')
      .update(payload)
      .eq('id', msg.id)

    if (err) { setError(err.message); setSaving(false); return }

    const actions: Promise<void>[] = []
    if (form.status !== msg.status)
      actions.push(auditLog('contact_status_updated', msg.id, msg.status, form.status))
    if (form.priority !== msg.priority)
      actions.push(auditLog('contact_priority_updated', msg.id, msg.priority, form.priority))
    if (form.admin_notes.trim() !== (msg.admin_notes ?? ''))
      actions.push(auditLog('contact_notes_updated', msg.id, null, null, 'Notes updated'))
    if (form.follow_up_required !== msg.follow_up_required || form.follow_up_date !== (msg.follow_up_date?.slice(0, 10) ?? ''))
      actions.push(auditLog('contact_followup_updated', msg.id, null, null, `follow_up_required=${form.follow_up_required}`))
    await Promise.all(actions)

    const updated: ContactMessage = { ...msg, ...payload } as ContactMessage
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
              {TYPE_LABELS[msg.contact_type] ?? msg.contact_type}
            </span>
            {form.priority !== 'normal' && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-sora font-semibold ${PRIORITY_COLORS[form.priority]}`}>
                {form.priority}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-mid transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Contact details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">From</p>
              <p className="font-sora font-medium text-charcoal">{msg.name || '—'}</p>
              <a href={`mailto:${msg.email}`} className="text-xs text-blue-mein hover:underline font-sora">{msg.email}</a>
            </div>
            <div>
              <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">Received</p>
              <p className="font-sora text-charcoal text-xs">{fmtFull(msg.created_at)}</p>
              {msg.updated_at !== msg.created_at && (
                <p className="text-[10px] text-gray-mid font-sora mt-0.5">Updated {fmtFull(msg.updated_at)}</p>
              )}
            </div>
          </div>

          {msg.subject && (
            <div>
              <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">Subject</p>
              <p className="font-sora text-sm text-charcoal">{msg.subject}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-mid font-semibold font-sora uppercase tracking-wide mb-1">Message</p>
            <div className="bg-gray-50 rounded-xl p-4 text-sm font-sora text-charcoal leading-relaxed whitespace-pre-wrap border border-gray-100">
              {msg.message}
            </div>
          </div>

          {/* Quick reply via mailto */}
          <a
            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject ?? 'Your message to Mein')}`}
            className="inline-flex items-center gap-1.5 text-xs font-sora font-semibold text-blue-mein hover:underline"
          >
            <Mail size={12} />
            Reply via email client
          </a>

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

          {error && (
            <p className="text-xs text-red-600 font-sora">{error}</p>
          )}
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

export default function AdminContactPage() {
  const [messages, setMessages]       = useState<ContactMessage[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter]   = useState('all')
  const [typeFilter, setTypeFilter]       = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [followUpFilter, setFollowUpFilter] = useState(false)
  const [selected, setSelected]       = useState<ContactMessage | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    let q = supabase
      .from('contact_messages')
      .select('id, contact_type, name, email, subject, message, status, admin_notes, priority, follow_up_required, follow_up_date, resolved_at, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (statusFilter !== 'all') q = q.eq('status', statusFilter)
    if (typeFilter !== 'all') q = q.eq('contact_type', typeFilter)
    if (priorityFilter !== 'all') q = q.eq('priority', priorityFilter)
    if (followUpFilter) q = q.eq('follow_up_required', true)

    const { data } = await q
    setMessages((data as ContactMessage[]) ?? [])
    setLoading(false)
  }, [statusFilter, typeFilter, priorityFilter, followUpFilter])

  useEffect(() => { fetch() }, [fetch])

  const filtered = search.trim()
    ? messages.filter((m) => {
        const s = search.toLowerCase()
        return (
          (m.name?.toLowerCase().includes(s)) ||
          m.email.toLowerCase().includes(s) ||
          (m.subject?.toLowerCase().includes(s)) ||
          m.message.toLowerCase().includes(s)
        )
      })
    : messages

  function handleUpdated(updated: ContactMessage) {
    setMessages((prev) => prev.map((m) => m.id === updated.id ? updated : m))
    setSelected(updated)
  }

  const followUpCount = messages.filter((m) => m.follow_up_required && m.status !== 'resolved' && m.status !== 'archived').length

  return (
    <>
      <AdminPageHeader
        title="Contact Messages"
        description="Messages submitted via Contact, Schools, Shop and other forms."
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
          {followUpCount} message{followUpCount !== 1 ? 's' : ''} need{followUpCount === 1 ? 's' : ''} follow-up
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
            placeholder="Search name, email, subject…"
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

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-sora text-charcoal bg-white">
          <option value="all">All types</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-sora text-charcoal bg-white">
          <option value="all">All priorities</option>
          {PRIORITY_OPTIONS.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
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
        {loading ? 'Loading…' : `${filtered.length} message${filtered.length !== 1 ? 's' : ''}${search ? ' matching search' : ''}`}
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 border-blue-mein border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-mid text-sm py-12 font-sora">No messages found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sora">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['From', 'Type', 'Subject', 'Status', 'Priority', 'Follow-up', 'Date', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-mid uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => setSelected(msg)}
                    className={`hover:bg-blue-pale/20 transition-colors cursor-pointer ${msg.status === 'archived' ? 'opacity-50' : ''}`}
                  >
                    <td className="px-4 py-3.5 min-w-[140px]">
                      <p className="font-sora font-medium text-charcoal text-sm truncate max-w-[140px]">{msg.name || '—'}</p>
                      <p className="text-xs text-gray-mid font-sora truncate max-w-[140px]">{msg.email}</p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-sora font-medium">
                        {TYPE_LABELS[msg.contact_type] ?? msg.contact_type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 max-w-[180px]">
                      <p className="text-sm font-sora text-charcoal truncate">{msg.subject || '—'}</p>
                      <p className="text-[11px] text-gray-mid font-sora truncate mt-0.5">{msg.message.slice(0, 55)}…</p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-sora ${STATUS_COLORS[msg.status]}`}>
                        {STATUS_LABELS[msg.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {msg.priority !== 'normal' ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-sora font-semibold capitalize ${PRIORITY_COLORS[msg.priority]}`}>
                          {msg.priority}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-sora">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {msg.follow_up_required && (
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-orange-100">
                          <Bell size={9} className="text-orange-600" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-mid font-sora whitespace-nowrap">
                      {fmt(msg.created_at)}
                    </td>
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
        <ContactDetailModal
          msg={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}
    </>
  )
}
